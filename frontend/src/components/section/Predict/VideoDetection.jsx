import React, { useState } from 'react';
import { CheckCircle, Download, Share2, ChevronDown, ChevronUp, Clock, Film } from 'lucide-react';
import { getDownloadVideoUrl } from '../../../api/endpoints';

/**
 * Video Detection Result Component
 */

const VideoDetection = ({ detectionResult, processedVideoUrl, detectedPlatesData }) => {
    const [showDetailedList, setShowDetailedList] = useState(false);
    const [visibleDetections, setVisibleDetections] = useState(5);

    // Convert detected_plates object to array
    const detectionsList = detectedPlatesData
        ? Object.entries(detectedPlatesData)
            .map(([frameKey, data]) => ({
                frameNumber: parseInt(frameKey),
                plateNumber: data.text,
                confidence: data.confidence
            }))
            .filter(d => d.plateNumber && d.plateNumber.trim() !== '')
            .sort((a, b) => a.frameNumber - b.frameNumber)
        : [];

    const totalDetections = detectionsList.length;
    const hasMoreDetections = visibleDetections < totalDetections;

    // Calculate unique plates
    const uniquePlates = [...new Set(detectionsList.map(d => d.plateNumber))].filter(Boolean);

    // Convert frame number to timestamp (assuming 30 FPS)
    const frameToTimestamp = (frameNum) => {
        const seconds = Math.floor(frameNum / 30);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            {/* Video Player Section */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Film className="w-6 h-6 text-purple-400" />
                        Processed Video
                    </h4>
                    {processedVideoUrl && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">Ready</span>
                        </div>
                    )}
                </div>

                {/* Video Container */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300" />

                    <div className="relative bg-gray-900 rounded-xl overflow-hidden border-2 border-pink-500/30">
                        {processedVideoUrl ? (
                            <video
                                src={processedVideoUrl}
                                className="w-full h-64 object-contain bg-black rounded"
                                controls
                                preload="metadata"
                                onError={(e) => console.error('Video error:', e.target.error)}
                            >
                                <source src={processedVideoUrl} type="video/mp4" />
                                Your browser does not support the video tag
                            </video>
                        ) : (
                            <div className="w-full h-64 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-gray-400">Processing Video...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3 mt-4">
                    <a
                        href={getDownloadVideoUrl(detectionResult.videoId)}
                        download={`tracked_video_${Date.now()}.mp4`}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download Video
                    </a>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share Result
                    </button>
                </div>
            </div>

            {/* Processing Summary */}
            <div className="bg-gray7 rounded-xl p-4 border border-gray-600">
                <h4 className="font-medium mb-2 text-lg text-white">Processing Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray4">Status:</span>
                        <span className="ml-2 text-green4">Completed</span>
                    </div>
                    <div>
                        <span className="text-gray4">Detected Frames:</span>
                        <span className="ml-2 text-white">{detectionResult.detectedFrames || 0}</span>
                    </div>
                    <div>
                        <span className="text-gray4">Average Confidence:</span>
                        <span className="ml-2 text-white">{detectionResult.confidence.toFixed(1)}%</span>
                    </div>
                    <div>
                        <span className="text-gray4">Total Detections:</span>
                        <span className="ml-2 text-white">{totalDetections}</span>
                    </div>
                </div>
            </div>

            {/* Detected Plates List (Collapsible) */}
            {totalDetections > 0 && (
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    {/* Header with Toggle */}
                    <div
                        className="flex items-center justify-between cursor-pointer mb-4"
                        onClick={() => setShowDetailedList(!showDetailedList)}
                    >
                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Film className="w-5 h-5 text-pink-400" />
                            Detections by Frame ({totalDetections})
                        </h4>
                        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                            {showDetailedList ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                    </div>

                    {/* Collapsible Content */}
                    {showDetailedList && (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                            {detectionsList.slice(0, visibleDetections).map((detection, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 hover:border-pink-500/30 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        {/* Left Side: Frame Info + Plate Number */}
                                        <div className="flex items-center gap-4 flex-1">
                                            {/* Frame Badge */}
                                            <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 rounded-lg">
                                                <span className="text-xs font-bold text-white">#{index + 1}</span>
                                            </div>

                                            {/* Frame & Timestamp */}
                                            <div>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Frame {detection.frameNumber}</span>
                                                    <span className="text-gray-500">•</span>
                                                    <span>{frameToTimestamp(detection.frameNumber)}</span>
                                                </div>
                                                {/* Plate Number */}
                                                <div className="text-xl font-bold font-mono tracking-wider bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                                    {detection.plateNumber || 'Unknown'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Confidence */}
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400 mb-1">Confidence</div>
                                            <div className="text-xl font-bold text-green-400">
                                                {detection.confidence.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Show More Button */}
                            {hasMoreDetections && (
                                <button
                                    onClick={() => setVisibleDetections(prev => prev + 5)}
                                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                    Show More ({totalDetections - visibleDetections} remaining)
                                </button>
                            )}
                        </div>
                    )}

                    {/* Summary when collapsed */}
                    {!showDetailedList && (
                        <div className="text-sm text-gray-400">Click to view frame-by-frame detections</div>
                    )}
                </div>
            )}

            {/* No Detections Message */}
            {totalDetections === 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
                    <div className="text-yellow-400 text-lg font-medium mb-2">No License Plates Detected</div>
                    <p className="text-gray-400 text-sm">No license plates were found in the video frames</p>
                </div>
            )}
        </div>
    )
}

export default VideoDetection
