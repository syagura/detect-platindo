/**
 * Validation utility functions
 */
import { ACCEPTED_FILE_TYPES } from '../config/constant';
import env from '../config/environment';

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  // Check file type
  if (!ACCEPTED_FILE_TYPES.IMAGE.MIME.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Accepted: ${ACCEPTED_FILE_TYPES.IMAGE.DISPLAY}`
    };
  }
  
  // Check file size
  if (file.size > env.MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${env.MAX_IMAGE_SIZE / 1024 / 1024}MB`
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate video file
 * @param {File} file - File to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateVideoFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  // Check file type
  if (!ACCEPTED_FILE_TYPES.VIDEO.MIME.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Accepted: ${ACCEPTED_FILE_TYPES.VIDEO.DISPLAY}`
    };
  }
  
  // Check file size
  if (file.size > env.MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${env.MAX_VIDEO_SIZE / 1024 / 1024}MB`
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export const validateForm = (formData, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${field} is required`;
    }
  });
  
  // Validate email if present
  if (formData.email && !validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateImageFile,
  validateVideoFile,
  validateEmail,
  validateForm
};