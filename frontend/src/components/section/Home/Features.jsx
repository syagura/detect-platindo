import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImageDetection from '../../../assets/images/image_detection.png'
import VideoDetection from '../../../assets/images/video_detection.png'
import ComingSoon from '../../../assets/images/coming soon.png'

/**
 * Features Section Component
 */

const Features = () => {
    const navigate = useNavigate();

    const handleTryNow = () => {
        navigate('/predict');
    };

    const features = [
        {
            id: 1,
            title: "Image Detection",
            description: "Upload and analyze license plate images instantly with high accuracy",
            features: [
                "Support for JPG, PNG, and WebP formats",
                "Confidence score for each detection",
                "Download results with bounding boxes"
            ],
            status: "available",
            thumbnail: ImageDetection,
            badge: "Fast & Accurate"
        },
        {
            id: 2,
            title: "Video Detection",
            description: "Detect license plates frame-by-frame from video files",
            features: [
                "Support for MP4, AVI, and MOV formats",
                "Real-time frame processing",
                "Track plates across multiple frames",
                "Export timestamped results"
            ],
            status: "available",
            thumbnail: VideoDetection,
            badge: "Advanced"
        },
        {
            id: 3,
            title: "Real-time Camera",
            description: "Live detection directly from your device camera",
            features: [
                "Instant plate recognition",
                "Works with webcam or mobile camera",
                "Auto-capture when plate detected",
                "Perfect for parking systems"
            ],
            status: "coming-soon",
            thumbnail: ComingSoon,
            badge: "Coming Soon"
        }
    ];

    return (
        <div className="w-full py-20">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Multiple Detection Methods
                    </h2>
                    <p className="text-gray3 text-lg max-w-2xl mx-auto">
                        Detect vehicle license plate using multiple input sources,
                        from static images to video files and live camera streams.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="space-y-12">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className={`relative ${index % 2 === 0 ? 'lg:pl-0 lg:pr-20' : 'lg:pr-0 lg:pl-20'}`}
                        >
                            {/* Main Content */}
                            <div
                                className={`relative z-10 flex flex-col ${
                                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                } items-center gap-8 py-8 px-6 lg:px-12 bg-gradient-to-br ${
                                feature.status === 'coming-soon'
                                    ? 'from-gray-800/80 to-gray-700/50'
                                    : 'from-purple56/10 to-purple6/10'
                                } backdrop-blur-md border rounded-3xl lg:bg-transparent lg:border-0`}
                            >
                                {/* Image Side */}
                                <div className="w-full lg:w-1/2 relative group">
                                    {/* Badge */}
                                    <div
                                        className={`absolute -top-3 -right-3 z-20 px-4 py-2 rounded-xl font-semibold text-sm shadow-lg ${
                                        feature.status === 'coming-soon'
                                            ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200'
                                            : 'bg-gradient-to-r from-pink6 to-purple6 text-white'
                                        }`}
                                    >
                                        {feature.badge}
                                    </div>

                                    {/* Gradient Glow */}
                                    <div
                                        className={`absolute -inset-1 ${
                                        feature.status === 'coming-soon'
                                            ? 'bg-gradient-to-r from-gray-600 to-gray-700'
                                            : 'bg-gradient-to-r from-pink6 to-purple6'
                                        } rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300`}
                                    />

                                    {/* Image */}
                                    <div className="relative">
                                        <img
                                        src={feature.thumbnail}
                                        alt={feature.title}
                                        className={`rounded-2xl w-full h-full object-cover shadow-2xl border-2 ${
                                            feature.status === 'coming-soon' ? 'border-gray-700/50 opacity-60' : 'border-pink6/30'
                                        }`}
                                        />
                                        {feature.status === 'coming-soon' && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                                            <div className="text-center">
                                            <div className="text-4xl mb-2">🚀</div>
                                            <div className="text-white font-bold text-lg">Coming Soon</div>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="w-full lg:w-1/2 space-y-4">
                                    <h3
                                        className={`text-2xl md:text-3xl font-bold ${
                                        feature.status === 'coming-soon' ? 'text-gray-300' : 'text-white'
                                        }`}
                                    >
                                        {feature.title}
                                    </h3>

                                    <p
                                        className={`text-lg ${feature.status === 'coming-soon' ? 'text-gray-400' : 'text-gray3'}`}
                                    >
                                        {feature.description}
                                    </p>

                                    {/* Features List */}
                                    <ul className="space-y-2 pt-2">
                                        {feature.features.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div
                                                    className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                                        feature.status === 'coming-soon'
                                                        ? 'bg-gray-500'
                                                        : 'bg-gradient-to-r from-pink6 to-purple6'
                                                    }`}
                                                />
                                                    <span
                                                        className={`text-sm ${feature.status === 'coming-soon' ? 'text-gray-400' : 'text-gray3'}`}
                                                    >
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    {feature.status === 'available' ? (
                                        <button
                                            onClick={handleTryNow}
                                            className="cursor-pointer mt-4 px-6 py-3 bg-gradient-to-r from-purple6 to-pink6 hover:from-purple7 hover:to-pink7 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center gap-2">
                                            Try Now
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M5 12h14" />
                                                <path d="m12 5 7 7-7 7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            className="mt-4 px-6 py-3 bg-gray-700/50 text-gray-400 font-semibold rounded-xl cursor-not-allowed flex items-center gap-2"
                                            disabled
                                        >
                                            Coming Soon
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Features
