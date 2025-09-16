from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models.yolo_model import detect_plat, detect_plat_from_frame
from services.recognize import recognize_text
from services.preprocess import encode_image_to_bytes, process_video_with_tracking
import shutil
import uuid
import os
import io
import cv2 as cv

app =  FastAPI()

origins = [
    "http://localhost:5173"
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
                "bounding_box": None
            }
        
        cropped_image = detection_result["cropped_image"]
        bounding_box = detection_result["bounding_box"]
        confidence = detection_result["confidence"]

        # baca plat nomor 
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)