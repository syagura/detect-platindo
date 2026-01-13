/**
 * Application constants
 */

// Detecion Modes 
export const DETECTION_MODES = {
    IMAGE: 'image',
    VIDEO: 'video',
    REALTIME: 'realtime'
};

// File Types 
export const ACCEPTED_FILE_TYPES = {
    IMAGE: {
        MIME: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
        EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
        DISPLAY: 'JPG, PNG, WebP'
    },
    VIDEO: {
        MIME: ['video/mp4', 'video/avi', 'video/mov'],
        EXTENSIONS: ['.mp4', '.avi', '.mov'],
        DISPLAY: ['MP4, AVI, MOV']
    }
};

// Processinh Stats 
export const PROCESSING_STATES = {
    IDLE: 'idle',
    UPLOADING: 'uploading',
    DETECTING: 'detecting',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    ERROR: 'error'
};

// WebSocket States 
export const WS_STATES = {
    CONNECTING: 'connecting',
    OPEN: 'open',
    CLOSING: 'closing',
    CLOSED: 'closed',
    UNKNOWN: 'unknown'
};

// Progress Message 
export const PROGRESS_MESSAGES = {
    IMAGE: [
        'Uploading image...',
        'Detecting license plate...',
        'Reading plate number...',
        'Processing result'
    ],
    VIDEO: [
        'Uploading video...',
        'Processing frames...',
        'Tracking license plates...',
        'Generating output...'
    ]
};

// Status Badge Color 
export const STATUS_COLORS = {
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    processing: 'bg-purple-500/20 border-purple-500/30 text-purple-400'
}

// Social Links 
export const SOCIAL_LINKS = {
    github: import.meta.env.VITE_GITHUB_REPOSITORY,
    githubprofile: import.meta.env.VITE_GITHUB_PROFILE,
    linkedin: import.meta.env.VITE_LINKEDIN_PROFILE,
    instagram: import.meta.env.VITE_INSTAGRAM_PROFILE,
    email: import.meta.env.VITE_EMAIL,
    emailto: import.meta.env.VITE_EMAIL_TO
};

// Navigation Links 
export const NAV_LINKS = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/docs', label: 'Docs' },
    { path: '/contact', label: 'Contact' },
    { path: '/predict', label: 'Try Detection' }
];

// API Endpoints (relative path)
export const API_PATHS = {
    HEALTH: '/health',
    PREDICT_IMAGE: '/api/predict',
    PREDICT_VIDEO: '/api/predict_video',
    STREAM_VIDEO: '/api/stream_video',
    DOWNLOAD_VIDEO: '/api/download_video',
    WS_CAMERA: '/ws/camera'
};

// Video Processing 
export const VIDEO_CONFIG = {
    FPS: 30,
    FRAME_INTERVAL: 200,
    CANVAS_WIDTH: 640,
    CANVAS_HEIGHT: 480
};

// Timing 
export const TIMING = {
    TOAST_DURATION: 5000,
    COPY_FEEDBACK_DURATION: 2000,
    DEBOUNCE_DELAY: 300
};

// src/config/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  WS_URL: import.meta.env.VITE_WS_BASE_URL,
  TIMEOUT: 120000,
};

// File Upload Limits
export const FILE_LIMITS = {
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
  },
  VIDEO: {
    MAX_SIZE: 100 * 1024 * 1024, // 100MB
    ACCEPTED_FORMATS: ['video/mp4', 'video/avi', 'video/mov'],
    ACCEPTED_EXTENSIONS: ['.mp4', '.avi', '.mov']
  }
};

// Detection Configuration
export const DETECTION_CONFIG = {
  MIN_CONFIDENCE: 0.5,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  FRAME_RATE: 30 // FPS for video processing
};

// UI Messages
export const MESSAGES = {
  UPLOAD_SUCCESS: 'File uploaded successfully',
  DETECTION_SUCCESS: 'Detection completed',
  DETECTION_ERROR: 'Detection failed. Please try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FORMAT: 'Invalid file format',
  NO_PLATE_DETECTED: 'No license plate detected',
  PROCESSING: 'Processing...',
};


// Navigation Links
export const QUICK_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Documentation', path: '/docs' },
  { name: 'Contact', path: '/contact' },
  { name: 'Try Detection', path: '/predict' }
];

export const RESOURCES = [
  { name: 'API Reference', path: '/docs#api' },
  { name: 'Getting Started', path: '/docs#getting-started' },
  { name: 'Examples', path: '/docs#examples' },
  { name: 'FAQ', path: '/docs#faq' }
];

// WebSocket Events
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  FRAME: 'frame',
  DETECTION: 'detection'
};

// Detection Status
export const DETECTION_STATUS = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error'
};

export default {
    DETECTION_MODES,
    ACCEPTED_FILE_TYPES,
    PROCESSING_STATES,
    WS_STATES,
    PROGRESS_MESSAGES,
    STATUS_COLORS,
    SOCIAL_LINKS,
    NAV_LINKS,
    API_PATHS,
    VIDEO_CONFIG,
    TIMING,
    API_CONFIG,
    FILE_LIMITS,
    DETECTION_CONFIG,
    MESSAGES,
    QUICK_LINKS,
    RESOURCES,
    WS_EVENTS,
    DETECTION_STATUS
}