import React from 'react'
import { CheckCircle, Download, Share2, Zap } from 'lucide-react';

/**
 * Image Detection Resulr Componet
 */

const ImageDetection = ({ detectionResult }) => {
    // Parse multiple plate numbers (separated by " | ")
    const plateNumbers = detectionResult.plateNumber
        ? detectionResult.plateNumber.split(' | ').filter(p => p.trim())
        : [];

    const hasMultiplePlates = plateNumbers.length > 1;

    return (
        <div className="space-y-6">
            {/* Annotated Image Display */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-white">Detection Result</h4>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">
                            {plateNumbers.length} Plate{plateNumbers.length > 1 ? 's' : ''} Detected
                        </span>
                    </div>
                </div>

                {/* Annotated Image */}
                {detectionResult.croppedImage && (
                <div className="relative group">
                    {/* Gradient Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300" />

                    {/* Image Container */}
                    <div className="relative bg-gray-900 rounded-xl overflow-hidden border-2 border-pink-500/30">
                        <img
                            src={detectionResult.croppedImage}
                            alt="Detection result"
                            className="w-full h-64 object-contain"
                        />
                    </div>
                </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-3 mt-4">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Image
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share Result
                    </button>
                </div>
            </div>

            {/* Detection Summary */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Detection Summary</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Plates */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-1">Total Plates</div>
                        <div className="text-3xl font-bold text-blue-400">{plateNumbers.length}</div>
                    </div>

                    {/* Average Confidence */}
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-1">Avg. Confidence</div>
                        <div className="text-3xl font-bold text-green-400">
                        {detectionResult.confidence ? `${detectionResult.confidence.toFixed(1)}%` : 'N/A'}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-1">Status</div>
                        <div className="flex items-center gap-2 mt-2">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <span className="text-lg font-semibold text-purple-400">Completed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Individual Plate Details */}
            {plateNumbers.length > 0 && (
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold text-white mb-4">
                        Detected Plates {hasMultiplePlates && `(${plateNumbers.length})`}
                    </h4>

                    <div className="space-y-3">
                        {plateNumbers.map((plate, index) => (
                            <div
                                key={index}
                                className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 hover:border-pink-500/30 transition-colors group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Plate Number Badge */}
                                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 rounded-lg">
                                            <span className="text-xs font-bold text-white">#{index + 1}</span>
                                        </div>

                                        {/* Plate Number */}
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-400 mb-1">Plate Number</div>
                                            <div className="text-2xl font-bold font-mono tracking-wider bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                                {plate.trim()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Confidence Score */}
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 mb-1">Confidence</div>
                                        <div className="text-xl font-bold text-green-400">
                                            {detectionResult.confidence ? `${detectionResult.confidence.toFixed(1)}%` : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-400">Detected at:</span>
                                        <span className="ml-2 text-white font-medium">
                                            {new Date().toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gray-400">Type:</span>
                                        <span className="ml-2 text-white font-medium">Indonesian Plate</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Detection Message */}
            {plateNumbers.length === 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
                    <div className="text-yellow-400 text-lg font-medium mb-2">No License Plate Detected</div>
                    <p className="text-gray-400 text-sm">
                        Try uploading a clearer image with visible license plates
                    </p>
                </div>
            )}
        </div>
    )
}

export default ImageDetection
