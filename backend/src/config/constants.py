"""
Constants and magic numbers used throughout the application
"""

#===============================
# IMAGE PROCESSING CONSTANTS
#===============================
JPEG_QUALITY = 95
MIN_PLATE_HEIGHT = 50
RESIZE_TARGET_HEIGHT = 80

#===============================
# VIDEO ENCODING CONSTANTS
#===============================
FOURCC_CODEC = 'mp4v'
FFMPEG_CODEC = 'libx264'
FFMPEG_PRESET = 'fast'
FFMPEG_CRF = '23'
FFMPEG_PIX_FMT = 'yuv420p'

#===============================
# DETECTION CONSTANTS
#===============================
POLYGON_POINTS = 4
POLYGON_COLOR = (0, 255, 0)
POLYGON_THICKNESS = 3

#===============================
# TEXT ANNOTATION CONSTANTS
#===============================
FONT = 1
TEXT_COLOR = (0, 0, 0)
BACKGROUND_COLOR = (0, 255, 0)
TEXT_PADDING = 10
BACKGROUND_ALPHA = 0.85

# Font scaling based on plate width
FONT_SCALE_MIN = 1.8
FONT_SCALE_MAX = 3.5
FONT_SCALE_DIVISOR = 150

#===============================
# OCR CONSTANTS
#===============================
ROTATION_ANGLES = [0, 180]
DESKEW_MIN_ANGLE = 2
DESKEW_HOUGH_THRESHOLD =  50
DESKEW_MIN_LINE_LENGTH_RATIO = 0.3
DESKEW_MAX_LINE_GAP = 10
DESKEW_ANGLE_RANGE = (-45, 45)

#===============================
# PLATE FORMAT CONSTANT
#===============================
MAX_PREFIX_LENGTH = 2
MAX_MIDDLE_LENGTH = 4
MAX_SUFFIX_LENGTH = 3
MIN_PLATE_LENGTH = 4

# OCR character replacements
OCR_REPLACEMENTS = {
    'O': '0',
    'I': '1',
    '|': '1',
    '*': ''
}

#===============================
# FILE HANDLING CONSTANTS
#===============================
ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']
ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/avi', 'video/mov']
DEFAULT_IMAGE_EXTENSION = '.jpg'
DEFAULT_VIDEO_EXTENSION = '.mp4'

#===============================
# PROGRESS REPORTING
#===============================
PROGRESS_UPDATE_INTERVAL = 100

#===============================
# PLATE TYPES
#===============================
PLATE_TYPES = {
    'plat_putih': 'White Plate',
    'plat_hitam': 'Black Plate'
}

DEFAULT_PLATE_TYPE = 'plat_putih'
