import { useState, useEffect, useCallback, useRef } from "react";
import { cameraWS } from '../api/websocket';

/**
 * Custom hook for WebSocket real-time detection
 * Manages WebSocket connection, frame streaming, and detection results
 */

export const useWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [currentFrame, setCurrentFrame] = useState(null);
    const [currentDetections, setCurrentDetections] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const reconnectTimeRef = useRef(null);
    const frameIntervalRef = useRef(null);

    /**
     * Connect to WebSocket server
     */
    const connect = useCallback(async () => {
        try {
            await cameraWS.connect();
            setIsConnected(true);
            setConnectionError(null);
            console.log('WebSocket connected');

            // Setup message handler
            cameraWS.onMessage = (data) => {
                if (data.type === 'frame') {
                    setCurrentFrame(data.image);
                    if (data.detections && data.detections.length > 0) {
                        setCurrentDetections(data.detections);
                    }
                } else if (data.type === 'error') {
                    setConnectionError(data.message);
                }
            };

            // Setup error handler
            cameraWS.onError = (error) => {
                console.error('WebSocket error:', error);
                setConnectionError('WebSocket connection error');
                setIsConnected(false);
            };

            // Setup close handler
            cameraWS.onClose = () => {
                console.log('WebSocket closed');
                setIsConnected(false);
                setCurrentFrame(null);
                setCurrentDetections([]);

                // Auto reconnect if streaming 
                if (isStreaming) {
                    reconnectTimeRef.current = setTimeout(() => {
                        console.log('Attempting to reconnect...');
                        connect();
                    }, 2000);
                }
            };
        } catch (error) {
            console.error('Failed to connect:', error);
            setConnectionError('Failed to connect to real-time detection service');
        }
    }, [isStreaming]);

    /**
     * Disconnect from WebSocket server
     */
    const disconnect = useCallback(() => {
        if (reconnectTimeRef.current) {
            clearTimeout(reconnectTimeRef.current);
            reconnectTimeRef.current = null;
        }

        if (frameIntervalRef.current) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = null;
        }

        cameraWS.close();
        setIsConnected(false);
        setIsStreaming(false);
        setCurrentFrame(null);
        setCurrentDetections([]);
    }, []);

    /**
     * Send frame to server for detection
     * @param {string} frameData = Base64 encoded frame data
     */
    const sendFrame = useCallback((frameData) => {
        if (!isConnected || isStreaming) {
            console.log('Skip frame - not ready');
            return false;
        }

        try {
            cameraWS.send({
                type: 'frame',
                image: frameData
            });
            return true;
        } catch (error) {
            console.error('Error sending frame:', error);
            return false;
        }
    }, [isConnected, isStreaming]);

    /**
     * Strat streaming frames
     */
    const stratStreaming = useCallback(() => {
        console.log('Starting streaming...');
        setIsStreaming(true);
    }, []);

    /**
     * Stop streaming frames
     */
    const stopStreaming = useCallback(() => {
        console.log('Stopping streaming...');
        setIsStreaming(false);

        if (frameIntervalRef.current) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = null;
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        isConnected,
        connectionError,
        currentFrame,
        currentDetections,
        isStreaming,
        connect,
        disconnect,
        sendFrame,
        stratStreaming,
        stopStreaming
    };
};