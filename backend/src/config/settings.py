"""
Configuration management using environment variables
"""
import os
from typing import List
from pathlib import Path
from dotenv import load_dotenv

# Load environtment variables
load_dotenv()

class Settings:
    """Application settings from environment variables"""

    # ================================
    # SERVER CONFIGURATION
    # ================================
    HOST: str = os.getenv("HOST")
    PORT: int = int(os.getenv("PORT"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT")

    # ================================
    # API CONFIGURATION
    # ================================
    API_TITLE: str = "DetectPlatIndo API"
    API_DESCRIPTION: str = "API untuk deteksi plat nomor kendaraan Indonesia menggunakan YOLO OBB"
    API_VERSION: str = "1.0.0"

    # ================================
    # CORS CONFIGURATION
    # ================================
    CORS_ORIGINS: List[str] = os.getenv(
        "CORS_ORIGINS"
    )

    # ================================
    # MODEL CONFIGURATION
    # ================================
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    MODEL_PATH: str = os.getenv("MODEL_PATH", "weights/best_obb_openvino_model")
    MODEL_FULL_PATH: Path = BASE_DIR / MODEL_PATH
    MODEL_TASK: str = os.getenv("MODEL_TASK")
    MODEL_CONFIDENCE_THRESHOLD: float = float(
        os.getenv("MODEL_CONFIDENCE_THRESHOLD")
    )

    # ================================
    # DIRECTORY PATHS
    # ================================
    UPLOAD_DIR: Path = BASE_DIR / os.getenv("UPLOAD_DIR", "uploads")
    OUTPUT_DIR: Path = BASE_DIR / os.getenv("OUTPUT_DIR", "outputs")

    # ================================
    # VIDEO PROCESSING SETTINGS 
    # ================================
    DETECT_EVERY_N_FRAMES: int = int(os.getenv("DETECT_EVERY_N_FRAMES"))
    OCR_EVERY_N_FRAMES: int = int(os.getenv("OCR_EVERY_N_FRAMES"))
    VIDEO_CODEC: str = os.getenv("VIDEO_CODEC")
    FFMPEG_ENABLED: bool = os.getenv("FFMPEG_ENABLED", "true").lower() == "true"
    FFMPEG_TIMEOUT: int = int(os.getenv("FFMPEG_TIMEOUT"))

    # ================================
    # TRACKING SETTINGS
    # ================================
    TRACKER_MAX_DISAPPEARED: int = int(os.getenv("TRACKER_MAX_DISAPPEARED"))
    TRACKER_IOU_THRESHOLD: float = float(os.getenv("TRACKER_IOU_THRESHOLD"))

    # ================================
    # OCR SETTINGS
    # ================================
    OCR_LANGUAGE: str = os.getenv("OCR_LANGUAGE")
    OCR_GPU: bool = os.getenv("OCR_GPU", "false").lower() == "true"
    OCR_MIN_HEIGHT: int = int(os.getenv("OCR_MIN_HEIGHT"))
    OCR_RESIZE_HEIGHT: int = int(os.getenv("OCR_RESIZE_HEIGHT"))

    # ================================
    # LOGGING CONFIGURATION
    # ================================
    LOG_LEVEL: str = os.getenv("LOG_LEVEL")
    LOG_FORMAT: str = os.getenv("LOG_FORMAT")

    @classmethod
    def create_directories(cls):
        """Create necessary directories if they don't exist"""
        cls.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        cls.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    @classmethod
    def validate(cls):
        """Validate critical settings"""
        if not cls.MODEL_FULL_PATH.exists():
            raise FileNotFoundError(
                f"Model not found at: {cls.MODEL_FULL_PATH}"
            )
        
        cls.create_directories()

# Initialize Settings
settings = Settings()

# validate on import
settings.validate()