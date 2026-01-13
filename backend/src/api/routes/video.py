"""
Video processing endpoints
"""
import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from services.detection_services import DetectionService
from utils.file_handler import FileHandler
from schemas.detection import VideoProcessingResponse
from config.settings import settings
from core.logger import logger
from core.exceptions import InvalidFileTypeException, VideoProcessingException

router = APIRouter(prefix="/api", tags=["Video"])

detection_service = DetectionService()
file_handler = FileHandler()

@router.post("/predict_video", response_model=VideoProcessingResponse)
async def predict_video(file: UploadFile = File(...)):
    """
    Process video with license plate tracking

    Args:
        file: Video file (MP4, AVI, etc.)

    Returns:
        VideoProcessingResponse with video_id and detected plates

    Raises:
        HTTPException: If file type is invalid or processing fails
    """
    video_id = str(uuid.uuid4())
    input_filename = f"{video_id}_input.mp4"
    output_filename = f"{video_id}_output.mp4"

    input_path = settings.UPLOAD_DIR / input_filename
    output_path = settings.OUTPUT_DIR / output_filename

    try:
        # Validate file type
        if not file_handler.validate_video_file(file):
            raise InvalidFileTypeException(
                "Invalid file type. Please upload a video (MP4, AVI, MOV)."
            )
        
        # Save uploaded video 
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"Video uploaded: {input_filename}")

        # Preprocess video with tracking
        detected_plates = detection_service.process_video(
            str(input_path),
            str(output_path)
        )

        return VideoProcessingResponse(
            message="Video processed successfully",
            video_id=video_id,
            output_filename=output_filename,
            detected_plates=detected_plates,
            download_url=f"/api/download_video/{video_id}"
        )
    
    except InvalidFileTypeException as e:
        logger.warning(f"Invalid file type: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
    except VideoProcessingException as e:
        logger.error(f"Video processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    except Exception as e:
        logger.error(f"Unexpected error in /predict_video: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error processing video: {str(e)}"
        )
    
    finally:
        # Cleanup input video
        if input_path.exists():
            file_handler.cleanup_file(str(input_path))

@router.get("/stream_video/{video_id}")
async def stream_video(video_id: str):
    """
    Stream processed video for playback in browser

    Args:
        video_id: Video ID from processing result

    Returns:
        FileResponse for video streaming

    Raises:
    HTTPException: If video not found
    """
    output_filename = f"{video_id}_output.mp4"
    output_path = settings.OUTPUT_DIR / output_filename

    if not file_handler.check_file_exists(str(output_path)):
        raise HTTPException(status_code=404, detail="Video not found")
    
    return FileResponse(
        path=str(output_path),
        media_type='video/mp4'
    )

@router.get("/download_video/{video_id}")
async def download_video(video_id: str):
    """
    Download processed video

    Args:
        FileResponse for file download

    Raises:
        HTTPException: If video not found
    """
    output_filename = f"{video_id}_output.mp4"
    output_path = settings.OUTPUT_DIR / output_filename

    if not file_handler.check_file_exists(str(output_path)):
        raise HTTPException(status_code=404, detail="Video not found")
    
    return FileResponse(
        path=str(output_path),
        media_type='video/mp4',
        filename=f"processed_{video_id}.mp4"
    )
