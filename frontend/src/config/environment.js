/**
 * Environment configuration
 * Access environment variables with proper defaults
 */

export const env = {
    // API Configuration 
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000',

    // App Configuration 
    APP_NAME: import.meta.env.VITE_APP_NAME || 'DetectPlatIndo',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // File Upload Limits (in bytes)
    MAX_IMAGE_SIZE: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE) || 10 * 1024 * 1024,
    MAX_VIDEO_SIZE: parseInt(import.meta.env.VITE_MAX_VIDEO_SIZE) || 50 * 1024 * 1024,

    // API Timeouts 
    API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 120000,
    WS_RECONNECT_INTERVAL: parseInt(import.meta.env.VITE_WS_RECONNECT_INTERVAL) || 3000,
    WS_MAX_RECONNECT_ATTEMMPTS: parseInt(import.meta.env.VITE_MAX_RECONNECT_ATTEMPTS) || 5,

    // Development mode 
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD
}

export default env;