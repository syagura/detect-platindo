/**
 * API Endpoints
 * Centralized API calls
 */
import api from './index';
import { API_PATHS } from '../config/constant';

/**
 * Health Check
 */
export const healthCheck = async () => {
    try {
        const response = await api.get(API_PATHS.HEALTH);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Upload Image for Detection
 * @param {File} file - Image file
 * @returns {Promise}
 */
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(API_PATHS.PREDICT_IMAGE, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * Upload Video for Processing
 * @param {File} file - Video file
 * @returns {Promise}
 */
export const uploadVideo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(API_PATHS.PREDICT_VIDEO, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 0
    });
};

/**
 * Get Stream Video URL
 * @param {String} videoID - Video ID
 * @returns {string}
 */
export const getStreamVideoUrl = (videoId) => {
    return `${import.meta.env.VITE_API_BASE_URL}${API_PATHS.STREAM_VIDEO}/${videoId}`;
};

/**
 * Get Download Video URL
 * @param {string} videoId - Video ID
 * @returns {string}
 */
export const getDownloadVideoUrl = (videoId) => {
    return `${import.meta.env.VITE_API_BASE_URL}${API_PATHS.DOWNLOAD_VIDEO}/${videoId}`;
};

/**
 * Check Camera Status
 */
export const checkCameraStatus = async () => {
    try {
        const response = await api.get('/camera/status');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export default {
    healthCheck,
    uploadImage,
    uploadVideo,
    getStreamVideoUrl,
    getDownloadVideoUrl,
    checkCameraStatus
};