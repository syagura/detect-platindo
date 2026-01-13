"""
FIle handling utilities
"""
import os
import uuid
import shutil
from pathlib import Path
from fastapi import UploadFile
from typing import Optional

from core.logger import logger
from core.exceptions import FileOperationException

class FileHandler:
    """Utility for file operation"""

    @staticmethod
    def save_upload_file(
        file: UploadFile,
        upload_dir: Path,
        custom_filename: Optional[str] = None
    ) -> str:
        """
        Save uploaded file to directory
        
        Args:
            file: FastAPI UploadFile object
            upload_dir: Directory to save file
            custom_filename: Custom filename (optional)
        
        Returns:
            Path to saved file
        """
        upload_dir.mkdir(parents=True, exist_ok=True)

        if custom_filename:
            filename = custom_filename
        else:
            ext = Path(file.filename).suffix if file.filename else '.jpg'
            filename = f"{uuid.uuid4()}{ext}"

        file_path = upload_dir / filename

        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            logger.info(f"File saved: {filename}")
            return str(file_path)
        
        except Exception as e:
            raise FileOperationException(f"Failed to save file: {str(e)}")
        
    @staticmethod
    def cleanup_file(file_path: str) -> bool:
        """
        Delete file if exists
        
        Args:
            file_path: Path to file

        Returns:
            True if successfully deteled, False otherwise
        """
        if not os.path.exists(file_path):
            return False
        
        try:
            os.remove(file_path)
            logger.info(f"Filw deleted: {Path(file_path).name}")
            return True
        except Exception as e:
            logger.error(f"Failed to deleted file: {e}")
            return False
        
    @staticmethod
    def check_file_exists(file_path: str) -> bool:
        """
        Check if file exists
        
        Args:
            file_path: Path to file

        Returns:
            True if file exists, False otherwise
        """
        return os.path.exists(file_path)
    
    @staticmethod
    def get_file_size(file_path: str) -> int:
        """
        Get file size in bytes
        
        Args:
            file_path: Path to file

        Returns:
            File size in bytes, 0 if file does'nt exist
        """
        if os.path.exists(file_path):
            return os.path.getsize(file_path)
        return 0
    
    @staticmethod
    def validate_image_file(file: UploadFile) -> bool:
        """
        Validate if uploaded file is an image
        
        Args:
            file: Uploaded File

        Returns:
            True if valid image, False otherwise
        """
        if not file.content_type:
            return False
        return file.content_type.startswith('image/')
    
    @staticmethod
    def validate_video_file(file: UploadFile) -> bool:
        """
        Validate if uploaded is a video
        
        Args:
            file: Uploaded File

        Returns:
            True if valid video, False otherwise
        """
        if not file.content_type:
            return False
        return file.content_type.startswith('video/')
