"""
Video processing utilities for license plate detection
"""
import cv2 as cv
import subprocess
import numpy as np
import os
from typing import Dict, Any
from pathlib import Path

from models.yolo_model import detect_plat_from_frame, PlateTracker
from services.ocr_service import recognize_text
from services.image_processor import draw_polygon, draw_label_with_background
from config.settings import settings
from config.constants import (
    FOURCC_CODEC,
    FFMPEG_CODEC,
    FFMPEG_PRESET,
    FFMPEG_CRF,
    FFMPEG_PIX_FMT,
    PROGRESS_UPDATE_INTERVAL,
    FONT,
    POLYGON_COLOR,
    POLYGON_THICKNESS
)
from core.logger import logger
from core.exceptions import VideoProcessingException


class VideoProcessor:
    """Video processing with license plate tracking"""
    
    def __init__(self):
        self.tracker = PlateTracker()
    
    def process_video(
        self,
        input_path: str,
        output_path: str
    ) -> Dict[int, Any]:
        """
        Process video with license plate tracking and OCR
        
        Args:
            input_path: Path to input video
            output_path: Path to save output video
        
        Returns:
            Dictionary of detected plates per frame
        """
        logger.info(f"Processing video: {input_path}")
        
        cap = cv.VideoCapture(input_path)
        
        if not cap.isOpened():
            raise VideoProcessingException("Cannot open video file")
        
        fps = int(cap.get(cv.CAP_PROP_FPS))
        width = int(cap.get(cv.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv.CAP_PROP_FRAME_COUNT))
        
        logger.info(
            f"Video specs: {width}x{height} @ {fps}fps, {total_frames} frames"
        )
        
        fourcc = cv.VideoWriter_fourcc(*FOURCC_CODEC)
        temp_output = output_path.replace('.mp4', '_temp.mp4')
        out = cv.VideoWriter(temp_output, fourcc, fps, (width, height))
        
        if not out.isOpened():
            raise VideoProcessingException("Cannot create output video")
        
        detected_plates = {}
        frame_count = 0
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                
                # Detect every N frames
                if frame_count % settings.DETECT_EVERY_N_FRAMES == 0:
                    try:
                        logger.debug(f"[Frame {frame_count}] Starting detection...")
                        raw_detections = detect_plat_from_frame(frame)
                        logger.debug(f"[Frame {frame_count}] Got {len(raw_detections) if isinstance(raw_detections, list) else 0} raw detections")
                        
                        # Validate raw_detections
                        if not isinstance(raw_detections, list):
                            logger.warning(f"[Frame {frame_count}] Invalid detection format: {type(raw_detections)}")
                            raw_detections = []
                        
                        logger.debug(f"[Frame {frame_count}] Updating tracker...")
                        tracked_detections = self.tracker.update(raw_detections)
                        logger.debug(f"[Frame {frame_count}] Tracker returned {len(tracked_detections) if isinstance(tracked_detections, list) else 0} tracks")
                        
                    except Exception as e:
                        logger.error(f"Detection error at frame {frame_count}: {e}", exc_info=True)
                        tracked_detections = self.tracker.update([])
                else:
                    tracked_detections = self.tracker.update([])
                
                # Validate tracked_detections
                if not isinstance(tracked_detections, list):
                    logger.warning(f"[Frame {frame_count}] Tracker returned invalid type: {type(tracked_detections)}")
                    tracked_detections = []
                
                # Process detections
                logger.debug(f"[Frame {frame_count}] Processing {len(tracked_detections)} detections...")
                for idx, detection in enumerate(tracked_detections):
                    # Validate detection is dict
                    if not isinstance(detection, dict):
                        logger.warning(f"[Frame {frame_count}] Detection {idx} is not dict: {type(detection)}")
                        continue
                    
                    logger.debug(f"[Frame {frame_count}] Detection {idx}: {list(detection.keys())}")
                    
                    frame = self._process_detection(
                        frame,
                        detection,
                        frame_count,
                        detected_plates
                    )
                
                out.write(frame)
                
                # Progress logging
                if frame_count % PROGRESS_UPDATE_INTERVAL == 0:
                    progress = (frame_count / total_frames) * 100
                    logger.info(
                        f"Progress: {progress:.1f}% ({frame_count}/{total_frames}) "
                        f"Active tracks: {len(self.tracker.tracks)}"
                    )
        
        except Exception as e:
            logger.error(f"Video processing error: {e}", exc_info=True)
            raise VideoProcessingException(f"Processing failed: {str(e)}")
        
        finally:
            cap.release()
            out.release()
        
        # Re-encode with FFmpeg if available
        final_output = self._reencode_video(temp_output, output_path)
        
        logger.info(
            f"Processing complete: {frame_count} frames, "
            f"{len(detected_plates)} detections"
        )
        
        return detected_plates
    
    def _process_detection(
        self,
        frame: np.ndarray,
        detection: Dict[str, Any],
        frame_count: int,
        detected_plates: Dict[int, Any]
    ) -> np.ndarray:
        """
        Process single detection on frame
        
        Args:
            frame: Current video frame
            detection: Detection data
            frame_count: Current frame number
            detected_plates: Dictionary to store detections
        
        Returns:
            Annotated frame
        """
        try:
            polygon = detection.get("polygon")
            confidence = float(detection.get("confidence", 0))
            track_id = detection.get("track_id", -1)
            cropped = detection.get("cropped_image")
            
            if not polygon or not isinstance(polygon, list):
                return frame
            
            # Safely create numpy array
            try:
                pts = np.array(polygon, dtype=np.int32).reshape(-1, 2)
            except (ValueError, TypeError) as e:
                logger.debug(f"Invalid polygon format: {e}")
                return frame
            
            cv.polylines(frame, [pts], True, POLYGON_COLOR, POLYGON_THICKNESS)
            
            # OCR every N frames
            if cropped is not None and frame_count % settings.OCR_EVERY_N_FRAMES == 0:
                try:
                    plate_type = detection.get("plate_type", "plat_putih")
                    plate_text = recognize_text(cropped, plate_type)
                    plate_text = str(plate_text) if plate_text else ""
                    
                    if track_id in self.tracker.tracks:
                        self.tracker.tracks[track_id]['ocr_text'] = plate_text
                    
                    logger.debug(
                        f"Frame {frame_count}, Track {track_id}: "
                        f"OCR = {plate_text} ({confidence:.1f}%)"
                    )
                
                except Exception as e:
                    logger.error(f"OCR error: {e}")
            
            # Get cached OCR text
            plate_text = ""
            if track_id in self.tracker.tracks:
                plate_text = self.tracker.tracks[track_id].get('ocr_text', "")

            frame = draw_polygon(frame, polygon)
            
            # Draw label - safely get polygon coordinates
            try:
                label = self._create_label(track_id, plate_text, confidence)
                # frame = self.draw_(frame, label, polygon)
                frame = draw_label_with_background(frame, label, polygon)
            except Exception as e:
                logger.debug(f"Label drawing skipped: {e}")
            
            # Store detection
            detected_plates[frame_count] = {
                'track_id': track_id,
                'text': str(plate_text),
                'confidence': float(confidence),
                'polygon': polygon
            }
        
        except Exception as e:
            logger.error(f"Detection processing error: {e}")
        
        return frame
    
    def _create_label(
        self,
        track_id: int,
        plate_text: str,
        confidence: float
    ) -> str:
        """Create label text for detection"""
        if plate_text:
            return f"ID{track_id}: {plate_text} ({confidence:.1f}%)"
        return f"ID{track_id}: Detecting... ({confidence:.1f}%)"
    
    def _draw_label(
        self,
        frame: np.ndarray,
        label: str,
        polygon: list
    ) -> np.ndarray:
        """Draw label with background on frame"""
        try:
            # Validate polygon
            if not polygon or not isinstance(polygon, list) or len(polygon) < 2:
                return frame
            
            (text_width, text_height), _ = cv.getTextSize(
                label, FONT, 0.6, 2
            )
            
            # Safely get coordinates
            try:
                label_x = int(polygon[0])
                label_y = int(polygon[1])
            except (IndexError, TypeError, ValueError):
                # Fallback to top-left corner
                label_x = 10
                label_y = 30
            
            # Background
            cv.rectangle(
                frame,
                (label_x, label_y - text_height - 10),
                (label_x + text_width, label_y),
                POLYGON_COLOR,
                -1
            )
            
            # Text
            cv.putText(
                frame,
                label,
                (label_x, label_y - 5),
                FONT,
                0.6,
                (0, 0, 0),
                2
            )
        
        except Exception as e:
            logger.debug(f"Label drawing error: {e}")
        
        return frame
    
    def _reencode_video(
        self,
        temp_path: str,
        output_path: str
    ) -> str:
        """
        Re-encode video with FFmpeg for better browser compatibility
        
        Args:
            temp_path: Temporary video path
            output_path: Final output path
        
        Returns:
            Path to final video
        """
        if not settings.FFMPEG_ENABLED:
            logger.info("FFmpeg disabled, using temp video")
            os.rename(temp_path, output_path)
            return output_path
        
        logger.info("Re-encoding with FFmpeg (H.264)...")
        
        try:
            ffmpeg_cmd = [
                'ffmpeg',
                '-i', temp_path,
                '-c:v', FFMPEG_CODEC,
                '-preset', FFMPEG_PRESET,
                '-crf', FFMPEG_CRF,
                '-pix_fmt', FFMPEG_PIX_FMT,
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
                timeout=settings.FFMPEG_TIMEOUT
            )
            
            if result.returncode == 0:
                logger.info("Video re-encoded successfully (H.264)")
                os.remove(temp_path)
            else:
                logger.warning(f"FFmpeg error: {result.stderr[:200]}")
                os.rename(temp_path, output_path)
                logger.warning("Using mp4v codec (may not play in browser)")
        
        except FileNotFoundError:
            logger.warning("FFmpeg not found. Install with: choco install ffmpeg")
            os.rename(temp_path, output_path)
            logger.warning("Using mp4v codec (may not play in browser)")
        
        except subprocess.TimeoutExpired:
            logger.error("FFmpeg timeout")
            if os.path.exists(temp_path):
                os.rename(temp_path, output_path)
        
        except Exception as e:
            logger.error(f"Re-encoding failed: {e}")
            if os.path.exists(temp_path):
                os.rename(temp_path, output_path)
        
        return output_path


def process_video_with_tracking(
    input_path: str,
    output_path: str
) -> Dict[int, Any]:
    """
    Convenience function for video processing
    
    Args:
        input_path: Path to input video
        output_path: Path to save output video
    
    Returns:
        Dictionary of detected plates
    """
    processor = VideoProcessor()
    return processor.process_video(input_path, output_path)