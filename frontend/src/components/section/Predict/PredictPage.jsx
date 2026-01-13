import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, Camera } from 'lucide-react';
import { useDetection } from '../../../hooks/useDetection';
import { useFileUpload } from '../../../hooks/useFileUpload';
import ImageDetection from './ImageDetection';
import VideoDetection from './VideoDetection';
import api from '../../../api';

/**
 * Main Predict Page Component
 * Handles image and video detection
 */

const PredictPage = () => {
    const [activeTab, setActiveTab] = useState('image');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [detectionResult, setDetectionResult] = useState(null);
    const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
    const [detectedPlatesData, setDetectedPlatesData] = useState(null);
    const [videoProcessing, setVideoProcessing] = useState(false);

    const fileInputRef = useRef(null);

    const { detectPlate, isDetecting, error: detectionError } = useDetection();
    const { validateFile } = useFileUpload();

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        // const validation = validateFile(file, activeTab === 'image' ? 'image' : 'video');
        // if (!validation.valid) {
        //     alert(validation.error);
        //     return;
        // }

        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedFile({
                file: file,
                preview: e.target.result,
                name: file.name,
                type: file.type
            });
            // Clear previous results
            setDetectionResult(null);
            setProcessedVideoUrl(null);
            setDetectedPlatesData(null);
        };
        reader.readAsDataURL(file);
    };

    const handleImageDetection = async () => {
        if (!uploadedFile) {
            alert('Please upload an image first');
            return;
        }

        try {
            const result = await detectPlate(uploadedFile.file);
            setDetectionResult(result);
        } catch (err) {
            console.error('Detection failed:', err);
            alert(`Detection error: ${err.response?.data?.detail || err.message}`)
        }
    };

    const handleVideoDetection = async () => {
        if (!uploadedFile) {
            alert('Please upload a video first');
            return;
        }

        setVideoProcessing(true);

        try {
            const formData = new FormData();
            formData.append('file', uploadedFile.file);

            const response = await api.post('/api/predict_video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 0
            });

            const { video_id, detected_plates } = response.data;
            setDetectedPlatesData(detected_plates);
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            setProcessedVideoUrl(`${apiBaseUrl}/api/stream_video/${video_id}`);

            // Calculate stats
            const plateNumbers = Object.values(detected_plates).map(p => p.text).filter(t => t);
            const avgConfidence = 
                Object.values(detected_plates).reduce((acc, p) => acc + p.confidence, 0) / 
                Object.keys(detected_plates).length;

            setDetectionResult({
                plateNumber: plateNumbers.join(', ') || 'No plates detected',
                confidence: avgConfidence || 0,
                videoResult: true,
                detectedFrames: Object.keys(detected_plates).length,
                videoId: video_id
            });

        } catch (err) {
            console.error('Video processing error:', err);
            alert(`Failed to process video: ${err.response?.data?.detail || err.message}`);
        } finally {
            setVideoProcessing(false);
        }
    };

    const handleDetection = () => {
        if (activeTab === 'image') {
            handleImageDetection();
        } else if (activeTab === 'video') {
            handleVideoDetection();
        }
    };

    const handleReset = () => {
        setUploadedFile(null);
        setDetectionResult(null);
        setProcessedVideoUrl(null);
        setDetectedPlatesData(null);
    };


    return (
        <div className="min-h-screen bg-dark text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* <h1 className="text-3xl font-bold mb-8 text-center">License Plate Detection</h1> */}
                <div className='h-[56px] mb-8'></div>

                {/* Error Message */}
                {detectionError && (
                    <div className="mb-6 bg-red6 text-white p-4 rounded-xl text-center">
                        {detectionError}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray8 rounded-full p-1 flex">
                        <button
                            className={`px-6 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                                activeTab === 'image' ? 'bg-blue6 text-white' : 'text-gray4 hover:text-white'
                            }`}
                            onClick={() => { setActiveTab('image'); handleReset(); }}
                        >
                            <ImageIcon size={18} />
                            Image
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                                activeTab === 'video' ? 'bg-blue6 text-white' : 'text-gray4 hover:text-white'
                            }`}
                            onClick={() => { setActiveTab('video'); handleReset(); }}
                        >
                            <Video size={18} />
                            Video
                        </button>
                        <button
                            className="px-6 py-2 rounded-full transition-all duration-200 flex items-center gap-2 text-gray5 cursor-not-allowed relative group"
                            disabled
                        >
                            <Camera size={18} />
                            Realtime
                            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray9 text-white text-xs px-3 py-2 rounded whitespace-nowrap">
                                Coming Soon 🚀
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="space-y-6">
                        <div className="bg-gray8 rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4">
                                Upload {activeTab === 'image' ? 'Image' : 'Video'}
                            </h3>

                            {!uploadedFile ? (
                                <div
                                    className="border-2 border-dashed border-gray6 rounded-xl p-12 text-center cursor-pointer hover:border-gray5 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray7 rounded-xl flex items-center justify-center mb-4">
                                            <Upload className="w-8 h-8 text-gray4" />
                                        </div>
                                        <p className="text-lg font-medium mb-2">Drop {activeTab} here or Browse</p>
                                        <p className="text-gray4 text-sm">
                                            {activeTab === 'image' ? 'PNG, JPG up to 10MB' : 'MP4, AVI up to 50MB'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative bg-gray7 rounded-xl overflow-hidden">
                                        {uploadedFile.type.startsWith('image/') ? (
                                            <img src={uploadedFile.preview} alt="Uploaded" className="w-full h-80 object-cover" />
                                        ) : (
                                            <video src={uploadedFile.preview} className="w-full h-80 object-cover" controls />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray7 rounded-xl">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{uploadedFile.name}</p>
                                            <p className="text-gray4 text-sm">
                                                {detectionResult ? 'Detection completed' : 'Ready for detection'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleReset}
                                            className="text-gray4 hover:text-white text-xl px-3 py-1 hover:bg-gray6 rounded-lg transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={activeTab === 'image' ? 'image/*' : 'video/*'}
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Detection Button */}
                        <div className="bg-gray8 rounded-2xl p-6">
                            <button
                                onClick={handleDetection}
                                disabled={!uploadedFile || isDetecting || videoProcessing}
                                className="w-full bg-blue6 hover:bg-blue7 disabled:bg-gray6 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {isDetecting || videoProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {activeTab === 'video' ? 'Processing Video...' : 'Detecting...'}
                                    </>
                                ) : (
                                    `Start ${activeTab === 'video' ? 'Video Processing' : 'Detection'}`
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        <div className="bg-gray8 rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4">Detection Results</h3>
                            {!detectionResult ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray7 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Camera className="w-8 h-8 text-gray5" />
                                    </div>
                                    <p className="text-gray4">No detection results yet</p>
                                    <p className="text-gray5 text-sm mt-2">
                                         Upload an {activeTab} and click detect to see results
                                    </p>
                                </div>
                            ) : detectionResult.videoResult ? (
                                <VideoDetection
                                    detectionResult={detectionResult}
                                    processedVideoUrl={processedVideoUrl}
                                    detectedPlatesData={detectedPlatesData}
                                />
                            ) : (
                                <ImageDetection detectionResult={detectionResult} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PredictPage
