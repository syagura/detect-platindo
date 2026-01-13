"""
Image processing utilities for detection visualization
"""
import cv2 as cv
import numpy as np
from typing import List, Tuple

from config.constants import(
    POLYGON_COLOR,
    POLYGON_THICKNESS,
    FONT,
    TEXT_COLOR,
    BACKGROUND_COLOR,
    TEXT_PADDING,
    BACKGROUND_ALPHA,
    FONT_SCALE_MIN,
    FONT_SCALE_MAX,
    FONT_SCALE_DIVISOR,
    JPEG_QUALITY
)
from core.logger import logger

def draw_polygon(image: np.ndarray, polygon: List[float]) -> np.ndarray:
    """
    Draw polygon on image
    
    Args:
        image: Input image
        polygon: Polygon coordinates
    
    Returns:
        Image with drawn polygon
    """
    pts = np.array(polygon, dtype=np.int32).reshape(-1, 2)
    cv.polylines(image, [pts], True, POLYGON_COLOR, POLYGON_THICKNESS)
    return image

def calculate_font_scale(polygon: List[float]) -> float:
    """
    Calculate approriate font scale based on plate width
    
    Args:
        polygon: Polygon coordinates

    Returns:
        Font scale value
    """
    pts = np.array(polygon, dtype=np.int32).reshape(-1, 2)
    sorted_pts = pts[np.argsort(pts[:, 1])]
    top_edge = sorted_pts[:2]

    if top_edge[0][0] > top_edge[1][0]:
        top_edge = top_edge[::-1]

    p1, p2 = top_edge
    plate_width = np.linalg.norm(p2 - p1)

    # font_scale = plate_width / FONT_SCALE_DIVISOR
    # font_scale = np.clip(font_scale, FONT_SCALE_MIN, FONT_SCALE_MAX)
    if plate_width < 150:
        font_scale = FONT_SCALE_MIN * 1.5
    else:
        font_scale = plate_width / FONT_SCALE_DIVISOR
    
    font_scale = np.clip(font_scale, FONT_SCALE_MIN, FONT_SCALE_MAX)

    return font_scale

def get_label_position(
        polygon: List[float],
        text_size: Tuple[int, int],
        baseline = int
) -> Tuple[int, int]:
    """
    Calculate optimal label position above polygon
    
    Args:
        polygon: Polygon coordinates
        text_size: (width, height) of text
        baseline: Text baseline

    Returns:
        (x, y) position for label background
    """
    pts = np.array(polygon, dtype=np.int32).reshape(-1, 2)
    sorted_pts = pts[np.argsort(pts[:, 1])]
    top_edge = sorted_pts[:2]

    if top_edge[0][0] > top_edge[1][0]:
        top_edge = top_edge[::-1]

    p1, p2 = top_edge

    text_width, text_height = text_size
    box_w = text_width + TEXT_PADDING * 2
    box_h = text_height + baseline + TEXT_PADDING * 2

    mid_x = int((p1[0] + p2[0]) / 2)
    top_y = int(min(p1[1], p2[1]) - 12)

    label_x = int(mid_x - box_w / 2)
    label_y = int(top_y - box_h)

    label_x = max(0, label_x)
    label_y = max(box_h + 5, label_y)

    return label_x, label_y

def draw_label_with_background(
        image: np.ndarray,
        label: str,
        polygon: List[float],
        font_scale: float = None
) -> np.ndarray:
    """
    Draw label with semi-transparent background
    
    Args:
        image: Input image
        label: Label text
        polygon: polygon coordinates
        font_scale: Font scale (auto-calculaed if None)
    
    Returns:
        Image with label drawn
    """
    if font_scale is None:
        font_scale = calculate_font_scale(polygon)

    thickness = max(3, int(font_scale * 2.5))

    (text_width, text_height), baseline = cv.getTextSize(
        label, FONT, font_scale, thickness
    )

    label_x, label_y = get_label_position(
        polygon, (text_width, text_height), baseline
    )

    box_w = text_width + TEXT_PADDING * 2
    box_h = text_height + baseline + TEXT_PADDING * 2

    overlay = image.copy()
    cv.rectangle(
        overlay,
        (label_x, label_y),
        (label_x + box_w, label_y + box_h),
        BACKGROUND_COLOR,
        -1
    )

    image = cv.addWeighted(overlay, BACKGROUND_ALPHA, image, 1 - BACKGROUND_ALPHA, 0)

    cv.putText(
        image,
        label,
        (label_x + TEXT_PADDING, label_y + box_h - TEXT_PADDING - baseline),
        FONT,
        font_scale,
        TEXT_COLOR,
        thickness,
        cv.LINE_AA
    )

    return image

def annotate_detection(
        image: np.ndarray,
        polygon: List[float],
        plate_number: str,
        confidence: float
) -> np.ndarray:
    """
    Annotate single detection on image
    
    Args:
        image: Input image
        polygon: Polygon coordinates
        plate_number: Detected plate number
        confidence: Detection confidence
    
    Returns:
        Annotated image
    """
    image = draw_polygon(image, polygon)

    label = f"{plate_number} ({confidence:.1f}%)"
    image = draw_label_with_background(image, label, polygon)

    return image

def encode_image_to_bytes(image: np.ndarray) -> bytes:
    """
    Encode image to JPEG bytes
    
    Args:
        image: Input image

    Returns:
        Encoded image bytes
    """
    encode_success, buffer = cv.imencode(
        '.jpg',
        image,
        [cv.IMWRITE_JPEG_QUALITY, JPEG_QUALITY]
    )

    if not encode_success:
        raise ValueError("Failed to encode image")
    
    return buffer.tobytes()