import axios from 'axios';

const API_BASE_URL = "http://localhost:8000";
const WS_BASE_URL = "ws://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'content-Type': 'application/json',
    }
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Websocket connection for realtime detection
class CameraWebSocket {
    constructor() {
        this.ws = null;
        // PERBAIKAN: Jangan dobel path
        this.wsUrl = `${WS_BASE_URL}/ws/camera`;  // Ini sudah benar
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
        this.reconnectTimer = null;

        // Event handlers
        this.onOpen = null;
        this.onMessage = null;
        this.onError = null;
        this.onClose = null;
        this.onReconnect = null;

        // Connection state 
        this.shouldReconnect = true;
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                // Close existing connection if any 
                this.close();

                console.log('Connecting to:', this.wsUrl);  // Debug log
                this.ws = new WebSocket(this.wsUrl);

                this.ws.onopen = () => {
                    console.log('WebSocket connected successfully');
                    this.reconnectAttempts = 0;

                    if (this.onOpen) {
                        this.onOpen();
                    }
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (this.onMessage) {
                            this.onMessage(data);
                        }
                    } catch (err) {
                        console.error('Error parsing WebSocket message:', err);
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    if (this.onError) {
                        this.onError(error);
                    }
                    reject(error);
                };

                this.ws.onclose = (event) => {
                    console.log('WebSocket closed:', event.code, event.reason);

                    if (this.onClose) {
                        this.onClose(event);
                    }

                    if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnectAttempts++;
                        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

                        this.reconnectTimer = setTimeout(() => {
                            this.connect().catch(err => {
                                console.error('Reconnect failed:', err);
                            });
                        }, this.reconnectInterval);

                        if (this.onReconnect) {
                            this.onReconnect(this.reconnectAttempts);
                        }
                    }
                };
            } catch (error) {
                console.error('Failed to create WebSocket:', error);
                reject(error);
            }
        });
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
            return true;
        } else {
            console.warn('WebSocket is not connected');
            return false;
        }
    }

    close() {
        this.shouldReconnect = false;

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    getState() {
        if (!this.ws) return 'CLOSED';

        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return 'CONNECTING';
            case WebSocket.OPEN:
                return 'OPEN';
            case WebSocket.CLOSING:
                return 'CLOSING';
            case WebSocket.CLOSED:
                return 'CLOSED';
            default:
                return 'UNKNOWN';
        }
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

const apiEndPoints = {
    checkCameraStatus: () => api.get('/camera/status'),

    // File Upload for static detection 
    uploadImage: (FormData) => {
        return api.post('/predict', FormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    // Health check 
    healthCheck: () => api.get('/'),
};

export const cameraWS = new CameraWebSocket();

export const {
    checkCameraStatus,
    uploadImage,
    healthCheck
} = apiEndPoints;

export default api;