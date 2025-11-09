import cv2 as cv
import subprocess
import os
from models.yolo_model import detect_plat_from_frame
from services.recognize import recognize_text

def encode_image_to_bytes(img):
    img = cv.resize(img, (img.shape[1], img.shape[0]), fx=0.2, fy=0.2)
    _, buffer = cv.imencode('.png', img)
    return buffer.tobytes()

def process_video_with_tracking(video_path: str, output_path: str):
    """Process video with FFmpeg post-processing + OCR"""

    cap = cv.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError("Cannot open video file")

    # Get video propreties
    fps = int(cap.get(cv.CAP_PROP_FPS))
    width = int(cap.get(cv.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv.CAP_PROP_FRAME_COUNT))

    print(f"Processing video: {width}*{height} @ {fps}fps, {total_frames} frames")

    fourcc = cv.VideoWriter_fourcc(*'mp4v')
    temp_output = output_path.replace('.mp4', '_temp.mp4')
    out = cv.VideoWriter(temp_output, fourcc, fps, (width, height))

    if not out.isOpened():
        raise ValueError("Cannot create temp video")
    

    frame_count = 0
    detected_plates = {}
    last_ocr_text = {}

    print("Starting video processing...")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1

            if frame_count % 10 == 0:
                detections = detect_plat_from_frame(frame)

                if detections:
                    for detection in detections:
                        bbox = detection.get("bounding_box", {})
                        confidence = detection.get("confidence", 0)
                        cropped = detection.get("cropped_image")

                        if bbox:
                            cv.rectangle(
                                frame, 
                                (bbox["x1"], bbox["y1"]),
                                (bbox["x2"], bbox["y2"]),
                                (0, 255, 0), 3
                            )

                            plate_text = ""
                            track_id = f"{bbox['x1']}_{bbox['y1']}"

                            if cropped is not None and frame_count % 50 == 0:
                                try:
                                    plate_text = recognize_text(cropped)
                                    last_ocr_text[track_id] = plate_text
                                    print(f"Frame {frame_count}: OCR = {plate_text} ({confidence:.1f}%)")
                                except Exception as e:
                                    print(f"OCR error: {e}")
                                    plate_text = last_ocr_text.get(track_id, "")
                            else:
                                plate_text = last_ocr_text.get(track_id, "")

                            # Draw label dengan plate text
                            if plate_text:
                                label = f"{plate_text} ({confidence:.1f}%)"
                            else:
                                label = f"Plate ({confidence:.1f}%)"

                            # Background untuk text 
                            (text_width, text_height), _ = cv.getTextSize(
                                label, cv.FONT_HERSHEY_SIMPLEX, 0.7, 2
                            )

                            cv.rectangle(
                                frame,
                                (bbox["x1"], bbox["y1"] - text_height - 10),
                                (bbox["x1"] + text_width, bbox["y1"]),
                                (0, 255, 0), -1
                            )

                            cv.putText(
                                frame, label,
                                (bbox["x1"], bbox["y1"] - 5),
                                cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2
                            )

                            detected_plates[frame_count] = {
                                "text": plate_text,
                                "confidence": confidence,
                                "bbox": bbox
                            }
            out.write(frame)

            if frame_count % 100 == 0:
                progress = (frame_count / total_frames) * 100
                print(f"Progress: {progress:.1f}% ({frame_count}/{total_frames} frames)")
    
    finally:
        
        cap.release()
        out.release()
    
    print("Re-encoding with FFmpeg (H.264)...")

    try:
        ffmpeg_cmd = [
            'ffmpeg',
            '-i', temp_output,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            '-an',
            '-y',
            output_path
        ]

        result = subprocess.run(
            ffmpeg_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=300
        )

        if result.returncode == 0:
            print("Video re-encode successfully (H.264)")
            os.remove(temp_output)
        else:
            print(f"FFmpeg error: {result.stderr[:200]}")
            os.rename(temp_output, output_path)
            print("Using mp4v codec (may not play in browser)")

    except FileNotFoundError:
        print("FFmpeg not found. Install: choco install ffmpeg")
        os.rename(temp_output, output_path)
        print("Using mp4v coded (may not play in browser)")

    except Exception as e:
        print(f"Re-encoding failed: {e}")
        if os.path.exists(temp_output):
            os.rename(temp_output, output_path)

    print(f"Video processing complete: {frame_count} frames, {len(detected_plates)} detections")
    return detected_plates