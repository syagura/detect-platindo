"""
Custom exceptions for the application
"""

class DetectPlatIndoException(Exception):
    """Best exception for all custom exceptions"""
    pass

class ModelNotFoundException(DetectPlatIndoException):
    """Raised when YOLO model fails to load"""
    pass

class ModelLoadException(DetectPlatIndoException):
    """Raised when YOLO model fails to load"""
    pass

class InvalidFileTypeException(DetectPlatIndoException):
    """Raised when uploaded file type is no supported"""
    pass

class VideoProcessingException(DetectPlatIndoException):
    """Raised when video processing fails"""
    pass

class ImageProcessingException(DetectPlatIndoException):
    """Raised when image processing fails"""
    pass

class OCRException(DetectPlatIndoException):
    """Raised when OCR processing fails"""
    pass

class FileOperationException(DetectPlatIndoException):
    """Raise when file operations fail"""
    pass