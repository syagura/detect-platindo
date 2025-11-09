from fastapi import FastAPI, UploadFile, File, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# import httpx
# import asyncio
import uvicorn
from models.yolo_model import detect_plat, detect_plat_from_frame
from services.recognize import recognize_text
from services.preprocess import encode_image_to_bytes, process_video_with_tracking
from models.yolo_model import model
import shutil
import uuid
import base64
import numpy as np
from typing import List
import json
import os
from pathlib import Path
import time
import cv2 as cv

app =  FastAPI()

origins = [
    "http://localhost:5173",
    "http://192.168.1.42:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                self.active_connections.remove(connection)

manager = ConnectionManager()

# Global camera state
camera = None
detection_active = False

@app.get("/health")
async def health_check():
    """Check if model are loaded"""
    return {
        "status": "healthy",
        "yolo_model": "loaded" if model else "not loaded",
        "timestamp": time.time()
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # simpan file 
    filename = f"{uuid.uuid4()}.jpg"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # deteksi plat 
        detection_result = detect_plat(file_path)

        if detection_result is None:
            return {
                "plat_number": "No license plat detected",
                "cropped_plat": None,
                "confidence": 0,
                "bounding_box": None,
                # "plate_type": None
            }
        
        cropped_image = detection_result["cropped_image"]
        bounding_box = detection_result["bounding_box"]
        confidence = detection_result["confidence"]
        # plate_type = detection_result["plate_type"]

        # ocr_plate_type = 'black' if 'hitam' in plate_type.lower() else 'white'

        # baca plat nomor 
        # plat_number = "TESTEMODE"
        plat_number = recognize_text(cropped_image)

        # encode image
        image_bytes = encode_image_to_bytes(cropped_image)

        return {
            "plat_number": plat_number,
            "cropped_plat": image_bytes.hex(),
            "confidence": confidence,
            "bounding_box": bounding_box
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )
    finally:
        # clean up upload file 
        if os.path.exists(file_path):
            os.remove(file_path)

# predict video 
@app.post("/predict_video")
async def predict_video(file: UploadFile = File(...)):
    # Generate unique filenames
    video_id = str(uuid.uuid4())
    input_filename = f"{video_id}_input.mp4"
    output_filename = f"{video_id}_output.mp4"

    input_path = os.path.join(UPLOAD_DIR, input_filename)
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    try:
        # Save upload video 
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process video with tracking
        detected_plates = process_video_with_tracking(input_path, output_path)

        return {
            "message": "Video processed successfully",
            "video_id": video_id,
            "output_filename": output_filename,
            "detected_plates": detected_plates,
            "download_url": f"/download_video/{video_id}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")
    finally:
        # clean up input file 
        if os.path.exists(input_path):
            os.remove(input_path)

@app.get("/stream_video/{video_id}")
async def stream_video(video_id: str):
    """Stream processed video (playable in browser)"""
    output_filename = f"{video_id}_output.mp4"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Video not found")
    
    return FileResponse(
        path=output_path,
        media_type='video/mp4',
        headers={
            "Accept-Ranges": "bytes",
            # "Content-Disposition": "inline"
        }
    )
    # def iterfile():
    #     with open(output_path, mode="rb") as file:
    #         yield from file

    # return StreamingResponse(
    #     iterfile(),
    #     media_type="video/mp4",
    #     headers={"Accept-Ranges": "bytes"}
    # )

    
@app.get("/download_video/{video_id}")
async def download_video(video_id: str):
    output_filename = f"{video_id}_output.mp4"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    
    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Video not found")
    
    return FileResponse(
        path=output_path,
        media_type='video/mp4',
        filename=f"processed_{video_id}.mp4"
    )

@app.websocket("/ws/camera")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    print("Client connected for realtime detection")
    frame_count = 0

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)


            if message.get("type") == "frame":
                frame_count += 1
                if frame_count % 2 != 0:
                    await websocket.send_text(json.dumps({
                        "type": "frame",
                        "image": message.get("image"),
                        "detections": [],
                        "timestamp": time.time()
                    }))
                    continue
                frame_data = message.get("image", "")

                if "base64," in frame_data:
                    frame_data = frame_data.split("base64,")[1]
                
                try:
                    img_bytes = base64.b64decode(frame_data)
                    nparr = np.frombuffer(img_bytes, np.uint8)
                    frame = cv.imdecode(nparr, cv.IMREAD_COLOR)

                    if frame is None:
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "message": "Failed to decode frame"
                        }))
                        continue
                    
                    detections = detect_plat_from_frame(frame)

                    processed_frame = frame.copy()
                    serializable_detection = []

                    if detections:
                        for detection in detections:
                            bbox = detection.get("bounding_box", {})
                            confidence = detection.get("confidence", 0)

                            if bbox:
                                cv.rectangle(
                                    processed_frame,
                                    (bbox["x1"], bbox["y1"]),
                                    (bbox["x2"], bbox["y2"]),
                                    (0, 255, 0), 2
                                )

                                label = f"{confidence:.1f}%"
                                cv.putText(
                                    processed_frame, label,
                                    (bbox["x1"], bbox["y1"] - 1),
                                    cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2
                                )

                                serializable_detection.append({
                                    "bounding_box": {
                                        "x1": int(bbox.get("x1", 0)),
                                        "y1": int(bbox.get("y1", 0)),
                                        "x2": int(bbox.get("x2", 0)),
                                        "y2": int(bbox.get("y2", 0))
                                    },
                                    "confidence": float(confidence)
                                })

                    _, buffer = cv.imencode('.jpg', processed_frame,
                                            [cv.IMWRITE_JPEG_QUALITY, 70])
                    frame_base64 = base64.b64encode(buffer).decode('utf-8')

                    response = {
                        "type": "frame",
                        "image": f"data:image/jpeg;base64,{frame_base64}",
                        "detections": serializable_detection,
                        "timestamp": time.time()
                    }

                    await websocket.send_text(json.dumps(response))
                
                except Exception as e:
                    print(f"Error processing frame: {e}")
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": f"Preprocessing error: {str(e)}"
                    }))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Client disconected from realtime detection")

    except Exception as e:
        print(f"Websocket error: {e}")
        manager.disconnect(websocket)

@app.get("/camera/status")
async def camera_status():
    return {
        "status": "online",
        "active_connections": len(manager.active_connections)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)