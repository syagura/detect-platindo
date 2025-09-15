from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models.yolo_model import detect_plat
from services.recognize import recognize_text
from services.preprocess import encode_image_to_bytes
import shutil
import uuid
import os

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
os.makedirs(UPLOAD_DIR, exist_ok=True)

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)