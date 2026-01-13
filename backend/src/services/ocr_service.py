"""
OCR Service for license plate text recognition
"""
import easyocr
import cv2 as cv
import numpy as np
import re
from typing import Optional, Tuple, List

from config.settings import settings
from config.constants import (
    OCR_REPLACEMENTS,
    ROTATION_ANGLES,
    DESKEW_MIN_ANGLE,
    DESKEW_HOUGH_THRESHOLD,
    DESKEW_MIN_LINE_LENGTH_RATIO,
    DESKEW_MAX_LINE_GAP,
    DESKEW_ANGLE_RANGE,
    MAX_PREFIX_LENGTH,
    MAX_MIDDLE_LENGTH,
    MAX_SUFFIX_LENGTH,
    MIN_PLATE_LENGTH
)
from core.logger import logger
from core.exceptions import OCRException


class OCRService:
    """Singleton OCR service"""
    
    _instance: Optional[easyocr.Reader] = None
    
    @classmethod
    def get_instance(cls) -> easyocr.Reader:
        """Get or create OCR reader instance"""
        if cls._instance is None:
            cls._instance = cls._initialize_reader()
        return cls._instance
    
    @classmethod
    def _initialize_reader(cls) -> easyocr.Reader:
        """Initialize EasyOCR reader"""
        logger.info("Loading EasyOCR reader...")
        try:
            reader = easyocr.Reader(
                [settings.OCR_LANGUAGE],
                gpu=settings.OCR_GPU,
                verbose=False
            )
            logger.info("EasyOCR loaded successfully")
            return reader
        except Exception as e:
            raise OCRException(f"Failed to initialize OCR: {str(e)}")


# Initialize OCR reader on import
reader = OCRService.get_instance()


def deskew_plate(image: np.ndarray) -> np.ndarray:
    """
    Auto-straighten tilted plate after crop
    
    Args:
        image: Input plate image
    
    Returns:
        Deskewed image
    """
    if image is None or image.size == 0:
        return image
    
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
    
    edges = cv.Canny(gray, 50, 150, apertureSize=3)
    
    min_line_length = int(gray.shape[1] * DESKEW_MIN_LINE_LENGTH_RATIO)
    lines = cv.HoughLinesP(
        edges,
        1,
        np.pi / 180,
        threshold=DESKEW_HOUGH_THRESHOLD,
        minLineLength=min_line_length,
        maxLineGap=DESKEW_MAX_LINE_GAP
    )
    
    if lines is None or len(lines) == 0:
        return image
    
    angles = []
    for line in lines:
        x1, y1, x2, y2 = line[0]
        angle = np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi
        
        if DESKEW_ANGLE_RANGE[0] < angle < DESKEW_ANGLE_RANGE[1]:
            angles.append(angle)
    
    if not angles:
        return image
    
    median_angle = np.median(angles)
    
    if abs(median_angle) > DESKEW_MIN_ANGLE:
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv.getRotationMatrix2D(center, median_angle, 1.0)
        
        cos = np.abs(M[0, 0])
        sin = np.abs(M[0, 1])
        new_w = int((h * sin) + (w * cos))
        new_h = int((h * cos) + (w * sin))
        
        M[0, 2] += (new_w / 2) - center[0]
        M[1, 2] += (new_h / 2) - center[1]
        
        rotated = cv.warpAffine(
            image,
            M,
            (new_w, new_h),
            flags=cv.INTER_CUBIC,
            borderMode=cv.BORDER_REPLICATE
        )
        
        logger.debug(f"Deskewed by {median_angle:.1f}°")
        return rotated
    
    return image


def preprocess_image(image: np.ndarray) -> np.ndarray:
    """
    Preprocess image for better OCR results
    
    Args:
        image: Input image
    
    Returns:
        Preprocessed image
    """
    image = deskew_plate(image)
    
    h, w = image.shape[:2]
    if h < settings.OCR_MIN_HEIGHT:
        scale = settings.OCR_RESIZE_HEIGHT / h
        image = cv.resize(
            image,
            (int(w * scale), settings.OCR_RESIZE_HEIGHT),
            interpolation=cv.INTER_CUBIC
        )
    
    return image


def extract_text_from_image(
    image: np.ndarray,
    rotation_angle: int = 0
) -> Tuple[str, float]:
    """
    Extract text from image using OCR
    
    Args:
        image: Input image
        rotation_angle: Rotation angle to apply
    
    Returns:
        Tuple of (extracted_text, confidence)
    """
    if rotation_angle == 180:
        image = cv.rotate(image, cv.ROTATE_180)
    
    detections = reader.readtext(image, paragraph=False)
    
    if not detections:
        return "", 0.0
    
    plate_text = ''
    confidences = []
    
    for detection in detections:
        try:
            # Handle different EasyOCR return formats
            if isinstance(detection, (list, tuple)) and len(detection) >= 3:
                bbox, text, conf = detection[0], detection[1], detection[2]
            else:
                logger.warning(f"Unexpected detection format: {detection}")
                continue
            
            # Validate bbox format
            if not isinstance(bbox, (list, tuple)) or len(bbox) < 2:
                continue
            
            # Get y-coordinate safely
            try:
                y_coord = float(bbox[0][1]) if isinstance(bbox[0], (list, tuple)) else float(bbox[0])
            except (IndexError, TypeError, ValueError):
                continue
            
            # Filter upper half only
            if y_coord < image.shape[0] / 2:
                text_str = str(text).upper().replace(' ', '')
                plate_text += text_str
                confidences.append(float(conf))
        
        except Exception as e:
            logger.debug(f"Skipping detection due to error: {e}")
            continue
    
    if not plate_text or not confidences:
        return "", 0.0
    
    avg_conf = sum(confidences) / len(confidences)
    
    return plate_text, avg_conf


def clean_ocr_text(text: str) -> str:
    """
    Clean OCR text with character replacements
    
    Args:
        text: Raw OCR text
    
    Returns:
        Cleaned text
    """
    text = str(text).upper()
    
    for old_char, new_char in OCR_REPLACEMENTS.items():
        text = text.replace(old_char, new_char)
    
    text = ' '.join(text.split())
    return text


def fix_indonesia_plate(text: str) -> str:
    """
    Format text to match Indonesian license plate format
    
    Args:
        text: Raw text from OCR
    
    Returns:
        Formatted plate number (e.g., "B 1234 ABC")
    """
    if not text or len(text) < MIN_PLATE_LENGTH:
        return text
    
    text = str(text)
    clean = text.replace(' ', '').upper()
    clean = ''.join(c for c in clean if c.isalnum())
    
    regex_match = re.findall(r"[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,3}", clean)
    
    if regex_match:
        matched = regex_match[0]
        
        if len(matched) >= MIN_PLATE_LENGTH:
            prefix, middle, suffix = parse_plate_components(matched)
            
            if prefix and middle and suffix:
                return f"{prefix} {middle} {suffix}"
    
    prefix, middle, suffix = parse_plate_components(clean)
    
    if prefix and middle and suffix:
        prefix = prefix[:MAX_PREFIX_LENGTH]
        middle = middle[:MAX_MIDDLE_LENGTH]
        suffix = suffix[:MAX_SUFFIX_LENGTH]
        return f"{prefix} {middle} {suffix}"
    
    if len(prefix) > MAX_PREFIX_LENGTH and suffix and len(suffix) <= MAX_PREFIX_LENGTH:
        return f"{suffix} {middle} {prefix[:MAX_PREFIX_LENGTH]}"
    
    return text


def parse_plate_components(text: str) -> Tuple[str, str, str]:
    """
    Parse plate text into prefix, middle, suffix components
    
    Args:
        text: Plate text
    
    Returns:
        Tuple of (prefix, middle, suffix)
    """
    prefix = ""
    middle = ""
    suffix = ""
    
    i = 0
    while i < len(text) and text[i].isalpha():
        prefix += text[i]
        i += 1
    
    while i < len(text) and text[i].isdigit():
        middle += text[i]
        i += 1
    
    while i < len(text) and text[i].isalpha():
        suffix += text[i]
        i += 1
    
    return prefix, middle, suffix


def recognize_text(image: np.ndarray, plate_type: str = 'plat_putih') -> str:
    """
    Recognize text from license plate image
    
    Args:
        image: Cropped plate image
        plate_type: Type of plate (not currently used)
    
    Returns:
        Recognized and formatted plate number
    """
    if reader is None or image is None or image.size == 0:
        return "Unknown"
    
    try:
        image = preprocess_image(image)
        
        best_result = ""
        best_confidence = 0
        best_rotation = 0
        
        for angle in ROTATION_ANGLES:
            try:
                plate_text, avg_conf = extract_text_from_image(image, angle)
                
                if not plate_text:
                    continue
                
                logger.debug(f"OCR at {angle}°: '{plate_text}' (conf: {avg_conf:.2f})")
                
                if avg_conf > best_confidence:
                    best_confidence = avg_conf
                    best_result = plate_text
                    best_rotation = angle
            
            except Exception as e:
                logger.error(f"Error at rotation {angle}°: {e}")
                continue
        
        if not best_result:
            return "Unknown"
        
        logger.debug(
            f"Best result: {best_rotation}° (conf: {best_confidence:.2f})"
        )
        
        text = clean_ocr_text(best_result)
        formatted = fix_indonesia_plate(text)
        
        return formatted if formatted else "Unknown"
    
    except Exception as e:
        logger.error(f"OCR error: {e}", exc_info=True)
        return "Unknown"