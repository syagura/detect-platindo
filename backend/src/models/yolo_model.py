from ultralytics import YOLO
import cv2 as cv

MODEL_PATH = "weights/last.pt"
model = YOLO(MODEL_PATH)

def detect_plat(image_path):
    results = model(image_path, conf=0.25)

    if len(results[0].boxes) == 0:
        return None

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
    results = model(frame, conf=0.25)
    detections = []

    for box in results[0].boxes:
        class_id = int(box.cls[0])
        class_name = model.names[class_id]

        x1, y1, x2, y2 = map(int, box.xyxy[0])
        confidence = float(box.conf[0]) * 100

        cropped = frame[y1:y2, x1:x2]

        detections.append({
            "cropped_image": cropped,
            "bounding_box": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
            "confidence": confidence,
            # "plate_type": class_name
        })

    return detections
