import cv2 as cv
from models.yolo_model import detect_plat_from_frame
from services.recognize import recognize_text

def encode_image_to_bytes(img):
    img = cv.resize(img, (img.shape[1], img.shape[0]), fx=0.2, fy=0.2)
    _, buffer = cv.imencode('.png', img)
    return buffer.tobytes()

def process_video_with_tracking(video_path: str, output_path: str):
    cap = cv.VideoCapture(video_path)

    # Get video propreties
    fps = int(cap.get(cv.CAP_PROP_FPS))
    width = int(cap.get(cv.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv.CAP_PROP_FRAME_HEIGHT))

    # Setup Video writer 
    fourcc = cv.VideoWriter_fourcc(*'mp4v')
    out = cv.VideoWriter(output_path, fourcc, fps, (width, height))

    frame_count = 0
    detected_plates = {}

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        # Detect license plates in current frame 
        detections = detect_plat_from_frame(frame)

        # Draw bounding boxs and labels
        for detection in detections:
            bbox = detection["bounding_box"]
            confidence = detection["confidence"]

            # Draw bounding box
            cv.rectangle(frame,
                         (bbox["x1"], bbox["y1"]),
                         (bbox["x2"], bbox["y2"]),
                         (0, 255, 0), 2)
            
            # Get plate text (only process every 5 frames for performance)
            if frame_count % 5 == 0:
                plate_text = recognize_text(detection["cropped_image"])
                detected_plates[frame_count] = {
                    "text": plate_text,
                    "confidence": confidence,
                    "bbox": bbox
                }
            else:
                # Use last detected text 
                last_detection = max([k for k in detected_plates.keys() if k <= frame_count], default=0)
                plate_text = detected_plates.get(last_detection, {}).get("text", "")

            # Draw labels
            label = f"{plate_text} ({confidence:.1f}%)"
            cv.putText(frame, label,
                       (bbox["x1"], bbox["y1"] -10),
                       cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
        # Write framr to ouput video 
        out.write(frame)
    
    cap.release()
    out.release()

    return detected_plates