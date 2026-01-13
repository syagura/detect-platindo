/**
 * Custom hook for file upload functionality
 */
import { useState, useRef } from 'react';
import { validateImageFile, validateVideoFile } from '../utils/validators';

export const useFileUpload = (mode = 'image') => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  /**
   * Handle file selection
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    const validation = mode === 'image' 
      ? validateImageFile(file)
      : validateVideoFile(file);
    
    if (!validation.valid) {
      setError(validation.error);
      setUploadedFile(null);
      return;
    }
    
    // Create file preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile({
        file: file,
        preview: e.target.result,
        name: file.name,
        type: file.type,
        size: file.size
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };
  
  /**
   * Trigger file input click
   */
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  /**
   * Clear uploaded file
   */
  const clearFile = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  /**
   * Reset state
   */
  const reset = () => {
    clearFile();
  };
  
  return {
    uploadedFile,
    error,
    fileInputRef,
    handleFileSelect,
    triggerFileInput,
    clearFile,
    reset,
    setError
  };
};

export default useFileUpload;