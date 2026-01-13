from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, Union

class BoundingBox(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int
    width: int
    height: int

class OBBPolygon(BaseModel):
    points: list
    
class DetectionResponse(BaseModel):
    plat_number: str
    cropped_plat: Optional[str] = None
    confidence: float
    polygon: Optional[OBBPolygon] = None
    # bounding_box: Optional[BoundingBox] = None
    plate_type: Optional[str] = None

class VideoProcessingResponse(BaseModel):
    message: str
    video_id: str
    output_filename: str
    detected_plates: Dict[Union[str, int], Any]  # Accept both string and int keys
    download_url: str
    
    # Validator to convert int keys to str for JSON serialization
    @field_validator('detected_plates', mode='before')
    @classmethod
    def convert_keys_to_str(cls, v):
        """Convert integer keys to strings for JSON compatibility"""
        if isinstance(v, dict):
            return {str(k): val for k, val in v.items()}
        return v

class HealthResponse(BaseModel):
    status: str
    yolo_model: str = 'loaded'
    timestamp: float