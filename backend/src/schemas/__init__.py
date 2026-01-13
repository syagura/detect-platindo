"""
Pydantic schemas module
"""
from .detection import (
    DetectionResponse,
    VideoProcessingResponse,
    HealthResponse,
    BoundingBox,
    OBBPolygon
)

__all__ = [
    "DetectionResponse",
    "VideoProcessingResponse",
    "HealthResponse",
    "BoundingBox",
    "OBBPolygon"
]