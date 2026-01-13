/**
 * Helper utility functions
 */

/**
 * Convert hex string to base64 image URL
 * @param {string} hexString - Hex encoded image data
 * @returns {string|null} - Data URL or null if conversion fails
 */
export const hexToBase64 = (hexString) => {
  if (!hexString) return null;
  
  try {
    const binaryString = hexString
      .match(/.{1,2}/g)
      .map((hex) => String.fromCharCode(parseInt(hex, 16)))
      .join('');
    
    const base64String = btoa(binaryString);
    return `data:image/jpeg;base64,${base64String}`;
  } catch (error) {
    console.error('Error converting hex to image:', error);
    return null;
  }
};

/**
 * Format file size to human readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Convert frame number to timestamp string (MM:SS)
 * @param {number} frameNumber - Frame number
 * @param {number} fps - Frames per second (default: 30)
 * @returns {string} - Formatted timestamp
 */
export const frameToTimestamp = (frameNumber, fps = 30) => {
  const seconds = Math.floor(frameNumber / fps);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Parse multiple plate numbers from string
 * @param {string} plateString - Plate numbers separated by |
 * @returns {string[]} - Array of plate numbers
 */
export const parsePlateNumbers = (plateString) => {
  if (!plateString) return [];
  return plateString.split(' | ').filter((p) => p.trim());
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Get file extension from filename
 * @param {string} filename - File name
 * @returns {string} - File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Check if file type is accepted
 * @param {string} fileType - MIME type
 * @param {string[]} acceptedTypes - Array of accepted MIME types
 * @returns {boolean}
 */
export const isFileTypeAccepted = (fileType, acceptedTypes) => {
  return acceptedTypes.includes(fileType);
};

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format date to locale string
 * @param {Date|number} date - Date object or timestamp
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

/**
 * Format time only
 * @param {Date|number} date - Date object or timestamp
 * @returns {string} - Formatted time string
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString();
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};



export default {
  hexToBase64,
  formatFileSize,
  frameToTimestamp,
  parsePlateNumbers,
  debounce,
  copyToClipboard,
  getFileExtension,
  isFileTypeAccepted,
  generateId,
  formatDate,
  formatTime,
  sleep
};