"""
Health check endpoints
"""
import time
from fastapi import APIRouter

from schemas.detection import HealthResponse
from models.yolo_model import model

router = APIRouter(tags=["Health"])

@router.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "DetectPlatIndo - Indonesian License Plate Detection API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "predict_image": "/api/predict",
            "predict_video": "/api/predict_video",
            "stream_video": "/api/stream_video/{video_id}",
            "download_video": "/api/download_video/{video_id}"
        }
    }

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint

    Returns service status and model availability
    """
    return HealthResponse(
        status="healthy",
        yolo_model="loaded" if model else "not loaded",
        timestamp=time.time()
    )