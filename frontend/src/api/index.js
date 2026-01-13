/**
 * API Client Configuration
 */
import axios from 'axios';
import env from '../config/environment';
import { API_CONFIG } from '../config/constant';

// Create axios instance 
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request intercetor 
api.interceptors.request.use(
    (config) => {
        if (env.IS_DEV) {
            console.log('API Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor 
api.interceptors.response.use(
    (response) => {
        if (env.IS_DEV) {
        console.log('API Response:', response.status, response.config.url);
        }
        return response;
    },
    (error) => {
        if (env.IS_DEV) {
        console.error('API Error:', error.response?.status, error.message);
        }

        // Handle specific error cases 
        if (error.response?.status === 404) {
            console.error('Endpoint not found:', error.config.url);
        } else if (error.response?.status === 500) {
            console.error('Server error:', error.response.data);
        }

        return Promise.reject(error)
    }
);

export default api;