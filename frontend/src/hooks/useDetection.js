import { useState, useCallback } from "react";
import api from '../api/index'
import { hexToBase64 } from '../utils/helper';

/**
 * Custom hook for handling license plate detection
 * Manages detection state, API calls, and result processing
 */
export const useDetection = () => {
    const [isDetecting, setIsDetecting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    /**
     * Detect license plate from uploaded file
     * @param {File} file - Image file to detect
     * @returns {Promise<Object>} Detection result
     */
    const detectPlate = useCallback(async (file) => {
        setIsDetecting(true);
        setError(null);

        // Progress messages for better UX
        const progressMessages = [
        "Uploading image...",
        "Detecting License Plate...",
        "Reading Plate Number...",
        "Processing Result..."
        ];

        let messageIndex = 0;
        const progressInterval = setInterval(() => {
        if (messageIndex < progressMessages.length) {
            setError(progressMessages[messageIndex]);
            messageIndex++;
        }
        }, 200);

        try {
        // Create FormData and append file with proper name
        const formData = new FormData();
        formData.append('file', file);

        console.log('Sending file:', file.name, 'Size:', file.size, 'Type:', file.type);

        // const response = await uploadImage(formData);
        const response = await api.post('/api/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                },
            timeout: 0
        });
        const { plat_number, cropped_plat, confidence, bounding_box } = response.data;

        // Convert hex to base64 for image display
        let croppedImageUrl = null;
        if (cropped_plat) {
            croppedImageUrl = hexToBase64(cropped_plat);
        }

        const detectionResult = {
            plateNumber: plat_number || "Not detected",
            confidence: confidence || 0,
            boundingBox: bounding_box,
            croppedImage: croppedImageUrl
        };

        setResult(detectionResult);
        clearInterval(progressInterval);
        setError(null);
        
        return detectionResult;

        } catch (err) {
        console.error('Detection error:', err);
        const errorMessage = err.response?.data?.detail || err.message || 'Detection failed';
        setError(`Failed to detect license plate: ${errorMessage}`);
        throw err;

        } finally {
        clearInterval(progressInterval);
        setIsDetecting(false);
        }
    }, []);

    /**
     * Reset detection state
     */
    const reset = useCallback(() => {
        setResult(null);
        setError(null);
        setIsDetecting(false);
    }, []);

    return {
        detectPlate,
        isDetecting,
        result,
        error,
        reset
    };
};