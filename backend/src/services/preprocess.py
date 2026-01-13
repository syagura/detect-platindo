import cv2 as cv
import subprocess
import numpy as np
import os
import traceback 
from models.yolo_model import detect_plat_from_frame, PlateTracker
from backend.src.services.recognize import recognize_text

def encode_image_to_bytes(img):
    img = cv.resize(img, (img.shape[1], img.shape[0]), fx=0.2, fy=0.2)
    _, buffer = cv.imencode('.png', img)
    return buffer.tobytes()

def process_video_with_tracking(video_path: str, output_path: str):
    """Process video with FFmpeg post-processing + OCR"""

    cap = cv.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError("Cannot open video file")

    # Get video properties
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
    
    # ==== Initialize Tracker ====
    tracker = PlateTracker(max_disappeared=15, iou_threshold=0.3)

    frame_count = 0
    detected_plates = {}
    # last_ocr_text = {}

    # Settings
    DETECT_EVERY_N_FRAMES = 3
    OCR_EVERY_N_FRAMES = 30

    print("Starting video processing")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1

            if frame_count % DETECT_EVERY_N_FRAMES == 0:
                try:
                    raw_detections = detect_plat_from_frame(frame)

                    tracked_detections = tracker.update(raw_detections)
                
                except Exception as e:
                    print(f"Detection error at frame {frame_count}: {e}")
                    tracked_detections = tracker.update([])
            else:
                tracked_detections = tracker.update([])
            for detection in tracked_detections:
                try:
                    polygon = detection.get("polygon")
                    confidence = float(detection.get("confidence", 0))
                    track_id = detection.get("track_id", -1)
                    cropped = detection.get("cropped_image")

                    if polygon:
                        pts = np.array(polygon, dtype=np.int32).reshape(-1, 2)

                        # Draw OBB polygons
                        cv.polylines(frame, [pts], True, (0, 255, 0), 3)

                        if cropped is not None and frame_count % OCR_EVERY_N_FRAMES == 0:
                            try:
                                plate_type = detection.get("plate_type", "plat_putih")
                                plate_text = recognize_text(cropped, plate_type)
                                plate_text = str(plate_text) if plate_text else ""

                                if track_id in tracker.tracks:
                                    tracker.tracks[track_id]['ocr_text'] = plate_text

                                print(f"Frame {frame_count}, Track {track_id}: OCR = {plate_text} ({confidence:.1f}%)")

                            except Exception as e:
                                print(f"OCR error: {e}")
                                
                        # Get OCR text (use chached from tracker)
                        if track_id in tracker.tracks:
                            plate_text = tracker.tracks[track_id].get('ocr_text', "")
                        else:
                            plate_text = ""

                        # Draw label
                        if plate_text:
                            label = f"ID{track_id}: {plate_text} ({confidence:.1f}%)"
                        else:
                            label = f"ID{track_id}: Detecting... ({confidence:.1f}%)"

                        try:
                            (text_width, text_height), _ = cv.getTextSize(
                                label, cv.FONT_HERSHEY_SIMPLEX, 0.6, 2
                            )

                            label_x = int(polygon[0])
                            label_y = int(polygon[1])

                            # Background
                            cv.rectangle(
                                frame,
                                (label_x, label_y - text_height - 10),
                                (label_x + text_width, label_y),
                                (0, 255, 0), -1
                            )

                            # Text 
                            cv.putText(
                                frame, label,
                                (label_x, label_y - 5),
                                cv.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2
                            )
                        except Exception as e:
                            print(f"Draw label error: {e}")
                            traceback.print_exc()
                            continue
                        
                        # store detection
                        detected_plates[frame_count] = {
                            'track_id': track_id,
                            'text': str(plate_text),
                            'confidence': float(confidence),
                            'polygon': polygon
                        }

                except Exception as e:
                    print(f"Detection processing error: {e}")
                    continue
            
            # Write frame 
            out.write(frame)

            # Progress
            if frame_count % 100 == 0:
                progress = (frame_count / total_frames) * 100
                print(f"Progress: {progress:.1f}% ({frame_count} / {total_frames}) Active tracks: {len(tracker.tracks)}")



    except Exception as e:
        print(f"Video processing error: {e}")
        traceback.print_exc()
        raise
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
        print("Using mp4v codec (may not play in browser)")

    except Exception as e:
        print(f"Re-encoding failed: {e}")
        if os.path.exists(temp_output):
            os.rename(temp_output, output_path)

    print(f"Video processing complete: {frame_count} frames, {len(detected_plates)} detections")
    return detected_plates