from fastapi import FastAPI, UploadFile, File
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

    # deteksi plat 
    croped = detect_plat(file_path)

    # baca plat nomor 
    plat_number = recognize_text(croped)

    # encode image
    image_bytes = encode_image_to_bytes(croped)

    return {
        "plat_number": plat_number,
        "cropped_plat": image_bytes.hex()
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)