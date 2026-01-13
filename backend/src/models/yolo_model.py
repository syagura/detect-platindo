"""
YOLO OBB Model and Plate Tracking
"""
from ultralytics import YOLO
import cv2 as cv
import numpy as np
from typing import List, Dict, Optional, Any

from config.settings import settings
from config.constants import POLYGON_POINTS
from core.logger import logger
from core.exceptions import ModelNotFoundException, ModelLoadException


class YOLOModel:
    """Singleton YOLO model wrapper"""
    
    _instance: Optional[YOLO] = None
    
    @classmethod
    def get_instance(cls) -> YOLO:
        """Get or create YOLO model instance"""
        if cls._instance is None:
            cls._instance = cls._load_model()
        return cls._instance
    
    @classmethod
    def _load_model(cls) -> YOLO:
        """Load YOLO OBB model"""
        model_path = settings.MODEL_FULL_PATH
        
        logger.info(f"Loading YOLO OBB model from {model_path}")
        
        if not model_path.exists():
            raise ModelNotFoundException(
                f"Model not found: {model_path}"
            )
        
        try:
            model = YOLO(str(model_path), task=settings.MODEL_TASK)
            logger.info("YOLO OBB model loaded successfully")
            return model
        except Exception as e:
            raise ModelLoadException(
                f"Failed to load YOLO model: {str(e)}"
            )


# Initialize model on import
model = YOLOModel.get_instance()


class PlateTracker:
    """
    Track license plates across video frames for stable detection
    Uses IoU-based matching with distance similarity
    """
    
    def __init__(
        self,
        max_disappeared: int = None,
        iou_threshold: float = None
    ):
        """
        Initialize tracker
        
        Args:
            max_disappeared: Max frames before removing track
            iou_threshold: Minimum IoU for matching detections
        """
        self.tracks: Dict[int, Dict[str, Any]] = {}
        self.next_id: int = 0
        self.max_disappeared = (
            max_disappeared or settings.TRACKER_MAX_DISAPPEARED
        )
        self.iou_threshold = (
            iou_threshold or settings.TRACKER_IOU_THRESHOLD
        )
    
    def calculate_iou_polygon(
        self,
        poly1: List[float],
        poly2: List[float]
    ) -> float:
        """
        Calculate IoU between two polygons using center distance
        
        Args:
            poly1: First polygon coordinates
            poly2: Second polygon coordinates
        
        Returns:
            Similarity score (0-1)
        """
        try:
            pts1 = np.array(poly1).reshape(POLYGON_POINTS, 2)
            pts2 = np.array(poly2).reshape(POLYGON_POINTS, 2)
            
            center1 = pts1.mean(axis=0)
            center2 = pts2.mean(axis=0)
            
            distance = np.linalg.norm(center1 - center2)
            
            size1 = np.linalg.norm(pts1[0] - pts1[2])
            size2 = np.linalg.norm(pts2[0] - pts2[2])
            avg_size = (size1 + size2) / 2
            
            if avg_size == 0:
                return 0
            
            similarity = max(0, 1 - (distance / avg_size))
            return similarity
        
        except Exception as e:
            logger.error(f"IoU calculation error: {e}")
            return 0
    
    def update(self, detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Update tracks with new detections
        
        Args:
            detections: List of detection dictionaries
        
        Returns:
            List of stable tracked detections
        """
        # Validate input
        if not isinstance(detections, list):
            logger.warning(f"Invalid detections type: {type(detections)}")
            detections = []
        
        for track_id in self.tracks:
            self.tracks[track_id]['disappeared'] += 1
        
        if len(detections) == 0:
            self._remove_stale_tracks()
            return list(self.tracks.values())
        
        matched_tracks = set()
        matched_detections = set()
        
        for det_idx, detection in enumerate(detections):
            # Validate detection format
            if not isinstance(detection, dict):
                logger.warning(f"Detection {det_idx} is not dict: {type(detection)}")
                continue
            
            polygon = detection.get('polygon')
            if not polygon or not isinstance(polygon, list):
                logger.debug(f"Detection {det_idx} has invalid polygon")
                continue
            
            best_match_id = None
            best_similarity = 0
            
            for track_id, track in self.tracks.items():
                if track_id in matched_tracks:
                    continue
                
                track_polygon = track.get('polygon')
                if not track_polygon or not isinstance(track_polygon, list):
                    continue
                
                similarity = self.calculate_iou_polygon(
                    polygon,
                    track_polygon
                )
                
                if similarity > self.iou_threshold and similarity > best_similarity:
                    best_similarity = similarity
                    best_match_id = track_id
            
            if best_match_id is not None:
                self._update_existing_track(best_match_id, detection)
                matched_tracks.add(best_match_id)
                matched_detections.add(det_idx)
            else:
                self._create_new_track(detection)
                matched_detections.add(det_idx)
        
        self._remove_stale_tracks()
        return list(self.tracks.values())
    
    def _update_existing_track(
        self,
        track_id: int,
        detection: Dict[str, Any]
    ):
        """Update existing track with new detection"""
        self.tracks[track_id].update({
            'polygon': detection['polygon'],
            'confidence': detection['confidence'],
            'plate_type': detection['plate_type'],
            'cropped_image': detection['cropped_image'],
            'disappeared': 0,
            'frames_tracked': self.tracks[track_id]['frames_tracked'] + 1
        })
    
    def _create_new_track(self, detection: Dict[str, Any]):
        """Create new track from detection"""
        self.tracks[self.next_id] = {
            'track_id': self.next_id,
            'polygon': detection['polygon'],
            'confidence': detection['confidence'],
            'plate_type': detection['plate_type'],
            'cropped_image': detection['cropped_image'],
            'disappeared': 0,
            'frames_tracked': 1,
            'ocr_text': ""
        }
        self.next_id += 1
    
    def _remove_stale_tracks(self):
        """Remove tracks that have disappeared for too long"""
        to_remove = [
            tid for tid, track in self.tracks.items()
            if track['disappeared'] > self.max_disappeared
        ]
        for tid in to_remove:
            del self.tracks[tid]


def crop_polygon(image: np.ndarray, polygon: List[float]) -> np.ndarray:
    """
    Straighten and crop plate using perspective transform
    
    Args:
        image: Input image
        polygon: Polygon coordinates
    
    Returns:
        Cropped and straightened plate image
    """
    pts = np.array(polygon, dtype=np.float32).reshape(POLYGON_POINTS, 2)
    
    rect = np.zeros((POLYGON_POINTS, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    
    (tl, tr, br, bl) = rect
    
    widthA = np.linalg.norm(br - bl)
    widthB = np.linalg.norm(tr - tl)
    maxW = int(max(widthA, widthB))
    
    heightA = np.linalg.norm(tr - br)
    heightB = np.linalg.norm(tl - bl)
    maxH = int(max(heightA, heightB))
    
    dst = np.array([
        [0, 0],
        [maxW - 1, 0],
        [maxW - 1, maxH - 1],
        [0, maxH - 1]
    ], dtype="float32")
    
    M = cv.getPerspectiveTransform(rect, dst)
    warped = cv.warpPerspective(image, M, (maxW, maxH))
    
    return warped


def detect_plat(image_path: str) -> Optional[Dict[str, Any]]:
    """
    Detect license plates from image file
    
    Args:
        image_path: Path to image file
    
    Returns:
        Detection results with original image and detections list
    """
    results = model(
        image_path,
        task=settings.MODEL_TASK,
        conf=settings.MODEL_CONFIDENCE_THRESHOLD
    )
    
    img = cv.imread(image_path)
    detections = []
    
    for result in results:
        obb = result.obb
        
        if obb is not None:
            boxes = obb.xyxyxyxy.cpu().numpy()
            conf = obb.conf.cpu().numpy()
            id_class = obb.cls.cpu().numpy()
            
            for i in range(boxes.shape[0]):
                box = boxes[i]
                confidence = float(conf[i]) * 100
                class_id = int(id_class[i])
                class_name = model.names[class_id]
                
                polygon = box.reshape(-1).tolist()
                cropped = crop_polygon(img, polygon)
                
                detections.append({
                    "cropped_image": cropped,
                    "polygon": polygon,
                    "confidence": confidence,
                    "plate_type": class_name
                })
    
    if len(detections) == 0:
        return None
    
    return {
        "original_image": img,
        "detections": detections
    }


def detect_plat_from_frame(frame: np.ndarray) -> List[Dict[str, Any]]:
    """
    Detect license plates from video frame
    
    Args:
        frame: Video frame (numpy array)
    
    Returns:
        List of detections
    """
    results = model(
        frame,
        task=settings.MODEL_TASK,
        conf=settings.MODEL_CONFIDENCE_THRESHOLD
    )
    
    detections = []
    
    for result in results:
        obb = result.obb
        
        if obb is not None:
            boxes = obb.xyxyxyxy.cpu().numpy()
            conf = obb.conf.cpu().numpy()
            cls = obb.cls.cpu().numpy()
            
            for i in range(boxes.shape[0]):
                box = boxes[i]
                confidence = float(conf[i]) * 100
                class_id = int(cls[i])
                class_name = model.names[class_id]
                
                polygon = box.reshape(-1).tolist()
                cropped = crop_polygon(frame, polygon)
                
                detections.append({
                    "cropped_image": cropped,
                    "polygon": polygon,
                    "confidence": confidence,
                    "plate_type": class_name
                })
    
    return detections