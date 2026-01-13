"""
Machine learning models module
"""
from .yolo_model import model, PlateTracker, detect_plat, detect_plat_from_frame

__all__ = ["model", "PlateTracker", "detect_plat", "detect_plat_from_frame"]