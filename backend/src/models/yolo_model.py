from ultralytics import YOLO
import cv2 as cv
import os

MODEL_PATH = "weights/best_openvino_model"

print(f"Loading YOLO model from {MODEL_PATH}...")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model Not Found: {MODEL_PATH}")

model = YOLO(MODEL_PATH)
print("YOLO Model loaded successfully...")

def detect_plat(image_path):
    results = model(image_path, conf=0.25, imgsz=320)

    if len(results[0].boxes) == 0:
        return None

    box = results[0].boxes[0]
    x1, y1, x2, y2 = map(int, box.xyxy[0])
    confidence = float(box.conf[0]) * 100

    img = cv.imread(image_path)
    crop_plat = img[y1:y2, x1:x2]

    return {
        "cropped_image": crop_plat, 
        "bounding_box": {
            "x1": x1,
            "y1": y1,
            "x2": x2,
            "y2": y2,
            "width": x2 - x1,
            "height": y2 - y1
        },
        "confidence": round(confidence, 2)
    }

def detect_plat_from_frame(frame):
    results = model(frame, conf=0.25, imgsz=320)
    detections = []

    for box in results[0].boxes:

        x1, y1, x2, y2 = map(int, box.xyxy[0])
        confidence = float(box.conf[0]) * 100

        cropped = frame[y1:y2, x1:x2]

        detections.append({
            "cropped_image": cropped,
            "bounding_box": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
            "confidence": confidence,
        })

    return detections
