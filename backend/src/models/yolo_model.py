from ultralytics import YOLO
import cv2 as cv

MODEL_PATH = "weights/last.pt"
model = YOLO(MODEL_PATH)

def detect_plat(image_path: str):
    img = cv.imread(image_path)
    results = model(img)

    for plat in results:
        for r in plat.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = r
            crop_plat = img[int(y1):int(y2), int(x1):int(x2)]
            crop_plat_rbg = cv.cvtColor(crop_plat, cv.COLOR_BGR2RGB)
            return crop_plat_rbg