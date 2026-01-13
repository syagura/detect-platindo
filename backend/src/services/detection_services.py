"""
Detection service for image and video processing
"""
import time
import cv2 as cv
import numpy as np
from typing import Dict, Any

from models.yolo_model import detect_plat
from services.ocr_service import recognize_text
from services.image_processor import annotate_detection, encode_image_to_bytes
from services.video_processor import process_video_with_tracking
from schemas.detection import DetectionResponse
from core.logger import logger
from core.exceptions import ImageProcessingException

class DetectionService:
    """Service for handling detection logic"""

    @staticmethod
    def detect_image(file_path: str) -> DetectionResponse:
        """
        Detect license plate from image
        
        Args:
            file_path: Path to image file

        Returns:
            DetectionResponse with detection results
        """
        start_time = time.time()

        # YOLO detection 
        detect_start = time.time()
        detection_result = detect_plat(file_path)
        detect_time = time.time() - detect_start
        logger.info(f"YOLO detection: {detect_time*1000:.1f}ms")

        if detection_result is None:
            return DetectionResponse(
                plat_number="No License plate detected",
                cropped_plat=None,
                confidence=0.0,
                polygon=None,
                plate_type=None
            )
        
        original_image = detection_result["original_image"]
        detections = detection_result["detections"]

        logger.info(f"Found {len(detections)} plate(s)")

        annotated_image = original_image.copy()
        all_plate_numbers = []
        total_confidence = 0

        for idx, detection in enumerate(detections):
            cropped_image = detection["cropped_image"]
            polygon = detection["polygon"]
            confidence = detection["confidence"]
            plate_type = detection.get("plate_type", "plat_putih")

            logger.info(f"Processing plate #{idx+1}")

            # OCR
            ocr_start = time.time()
            plate_number = recognize_text(cropped_image, plate_type)
            ocr_time = time.time() - ocr_start
            logger.info(
                f"OCR ({plate_type}): {ocr_time*1000:.1f}ms -> {plate_number}"
            )

            all_plate_numbers.append(plate_number)
            total_confidence += confidence

            # Annotate image
            annotated_image = annotate_detection(
                annotated_image,
                polygon,
                plate_number,
                confidence
            )

        # Encode image
        encode_start = time.time()
        try:
            image_bytes = encode_image_to_bytes(annotated_image)
        except Exception as e:
            raise ImageProcessingException(f"Failed to encode image: {str(e)}")
        
        total_time = time.time() - encode_start
        logger.info(f"Encode: {total_time*1000:.1f}ms")

        # Combine results
        combined_plates = " | ".join(all_plate_numbers)
        avg_confidence = total_confidence / len(detections) if detections else 0

        return DetectionResponse(
            plat_number=combined_plates,
            cropped_plat=image_bytes.hex(),
            confidence=round(avg_confidence, 2),
            polygon=None,
            plate_type=plate_type
        )
    
    @staticmethod
    def process_video(input_path: str, output_path: str) -> Dict[int, Any]:
        """
        Process video with license plate tracking
        
        Args:
            input_path: Path to input video
            output_path: Path to save output video
        
        Returns:
            Dictionary with detected plates per frame
        """
        logger.info(f"Starting video processing: {input_path}")
        detected_plates = process_video_with_tracking(input_path, output_path)
        logger.info(f"Video processed: {len(detected_plates)} detections")
        return detected_plates