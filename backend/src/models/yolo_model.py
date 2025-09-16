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

            # crop plat
            crop_plat = img[int(y1):int(y2), int(x1):int(x2)]
            crop_plat_rbg = cv.cvtColor(crop_plat, cv.COLOR_BGR2RGB)

            # return crop iamge + detection info
            return {
                "cropped_image": crop_plat_rbg,
                "bounding_box": {
                    "x1": int(x1),
                    "y1": int(y1),
                    "x2": int(x2),
                    "y2": int(y2),
                    "width": int(x2 - x1),
                    "height": int(y2 - y1)
                },
                "confidence": round(score * 100, 2)
            }
    # Return None or dafault values, if not detection
    return None

def detect_plat_from_frame(frame):
    results = model(frame)
    detections = []

    for plat in results:
        for r in plat.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = r

            # crop plat 
            crop_plat = frame[int(y1):int(y2), int(x1):int(x2)]

            detection = {
                "class_id": class_id,
                "cropped_image": crop_plat,
                "bounding_box": {
                    "x1": int(x1),
                    "y1": int(y1),
                    "x2": int(x2),
                    "y2": int(y2),
                    "width": int(x2 - x1),
                    "height": int(y2 - y1),
                },
                "confidence": round(score * 100, 2)
            }
            detections.append(detection)

    return detections