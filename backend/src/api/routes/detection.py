"""
Detection endpoints for image processing
"""
from fastapi import APIRouter, UploadFile, File, HTTPException

from services.detection_services import DetectionService
from utils.file_handler import FileHandler
from schemas.detection import DetectionResponse
from config.settings import settings
from core.logger import logger
from core.exceptions import InvalidFileTypeException, ImageProcessingException

router = APIRouter(prefix="/api", tags=["Detection"])

detection_service = DetectionService()
file_handler = FileHandler()

@router.post("/predict", response_model=DetectionResponse)
async def predict_image(file: UploadFile = File(...)):
    """
    Detect license plate from uploaded image
    
    Args:
        file: Image file (JPG, PNG, etc.)

    Returns:
        DetectionResponse with plate number, confidence, and bounding box

    Raises:
        HTTPException: If file type is invalid or processing fails
    """
    file_path = None

    try:
        # Validate file type 
        if not file_handler.validate_image_file(file):
            raise InvalidFileTypeException(
                "Invalid file type. Please upload an image (JPG, PNG)."
            )
        
        # save uploaded file 
        file_path = file_handler.save_upload_file(file, settings.UPLOAD_DIR)

        # Detect license plate
        result = detection_service.detect_image(file_path)

        return result
    
    except InvalidFileTypeException as e:
        logger.warning(f"Invalid file type: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
    except ImageProcessingException as e:
        logger.error(f"Image processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    except Exception as e:
        logger.error(f"Unxpected error in /predict: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )
    
    finally:
        # Cleanup uploaded file 
        if file_path:
            file_handler.cleanup_file(file_path)