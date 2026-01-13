/**
 * WebSocket Client for Real-Time Detection
 */
import env from '../config/environment';
import { API_PATHS, WS_STATES } from '../config/constant';

class CameraWebSocket {
    constructor() {
        this.ws = null;
        this.wsUrl = `${env.WS_BASE_URL}${API_PATHS.WS_CAMERA}`;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = env.WS_MAX_RECONNECT_ATTEMPTS;
        this.reconnectInterval = env.WS_RECONNECT_INTERVAL;
        this.reconnectTimer = null;
        this.shouldReconnect = true;

        // Even handlers
        this.onOpen = null;
        this.onMessage = null;
        this.onError = null;
        this.onClose = null;
        this.onReconnect = null;
    }

    /**
     * Connect to WebSocket server
     */
    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.close();

                if (env.IS_DEV) {
                    console.log('Connecting to WebSocket:', this.wsUrl);
                }

                this.ws = new WebSocket(this.wsUrl);

                this.ws.onopen = () => {
                    console.log('WebSocket connected');
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

                    if (
                        this.shouldReconnect &&
                        this.reconnectAttempts < this.maxReconnectAttempts
                    ) {
                        this.reconnectAttempts++;
                        console.log(
                            `Reconnectiong... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
                        );

                        this.reconnectTimer = setTimeout(() => {
                            this.connect().catch((err) => {
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

    /**
     * Send data througgh WebSocket
     * @param {Object/string} data - Data to send
     */
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
            return true;
        } else {
            console.warn('WebSocket is not connected');
            return false;
        }
    }

    /**
     * Close WebSocket connection
     */
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

    /**
     * Get current connection state
     */
    getState() {
        if (!this.ws) return WS_STATES.CLOSED;

        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return WS_STATES.CONNECTING;
            case WebSocket.OPEN:
                return WS_STATES.OPEN;
            case WebSocket.CLOSING:
                return WS_STATES.CLOSING;
            case WebSocket.CLOSED:
                return WS_STATES.CLOSED;
            default:
                return WS_STATES.UNKNOWN;
        }
    }

    /**
     * Check if WebSocket is connected
     */
    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

// Export singleton instance 
export const cameraWS = new CameraWebSocket();

export default CameraWebSocket;