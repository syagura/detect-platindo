import React from 'react';

/**
 * Animated Cars Component
 * Displays animated cars with license plates for visual effect
 */
const AnimatedCars = () => {
    return (
        <div className="relative">
        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-gray98 to-gray79 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden">
            {/* Window Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red5 rounded-full" />
                    <div className="w-3 h-3 bg-yellow5 rounded-full" />
                    <div className="w-3 h-3 bg-green5 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green5 rounded-full animate-pulse" />
                    <span className="text-xs text-gray3">Live Detection</span>
                </div>
            </div>

            {/* Animation Area */}
            <div className="relative bg-gradient-to-b from-gray79 to-gray98 rounded-xl h-64 overflow-hidden border border-pink5/20">
                {/* Road Lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gray-700" />
                    <div className="absolute w-full flex justify-around">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="w-8 h-1 bg-gray-600 rounded animate-road-line"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Scanning Line Effect */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink5 to-transparent animate-scan-slow opacity-50" />
                </div>

                {/* Car 1 - Blue Car (Left to Right, Bottom) */}
                <div className="absolute bottom-16 left-0 w-full animate-car-lr-slow">
                    <svg width="120" height="60" viewBox="0 0 120 60" className="drop-shadow-lg">
                        <rect x="10" y="30" width="100" height="20" rx="3" fill="#3b82f6" />
                        <rect x="25" y="15" width="70" height="20" rx="3" fill="#60a5fa" />
                        <rect x="30" y="18" width="25" height="14" rx="2" fill="#1e3a8a" opacity="0.6" />
                        <rect x="65" y="18" width="25" height="14" rx="2" fill="#1e3a8a" opacity="0.6" />
                        <circle cx="30" cy="50" r="8" fill="#1f2937" />
                        <circle cx="30" cy="50" r="5" fill="#4b5563" />
                        <circle cx="90" cy="50" r="8" fill="#1f2937" />
                        <circle cx="90" cy="50" r="5" fill="#4b5563" />
                        <rect x="45" y="48" width="30" height="8" rx="1" fill="#ffffff" />
                        <text x="60" y="54" fontSize="5" fontFamily="monospace" fontWeight="bold" fill="#000" textAnchor="middle">B 1234 XY</text>
                        <circle cx="105" cy="40" r="3" fill="#fbbf24" opacity="0.8" />
                    </svg>
                </div>

                {/* Car 2 - Purple Car (Right to Left, Middle) */}
                <div className="absolute top-16 right-0 w-full animate-car-rl-medium">
                    <svg width="100" height="50" viewBox="0 0 100 50" className="drop-shadow-lg" style={{ transform: 'scaleX(-1)' }}>
                        <rect x="5" y="25" width="90" height="18" rx="3" fill="#9333ea" />
                        <rect x="20" y="12" width="60" height="18" rx="3" fill="#a855f7" />
                        <rect x="25" y="15" width="22" height="12" rx="2" fill="#581c87" opacity="0.6" />
                        <rect x="53" y="15" width="22" height="12" rx="2" fill="#581c87" opacity="0.6" />
                        <circle cx="25" cy="43" r="7" fill="#1f2937" />
                        <circle cx="25" cy="43" r="4" fill="#4b5563" />
                        <circle cx="75" cy="43" r="7" fill="#1f2937" />
                        <circle cx="75" cy="43" r="4" fill="#4b5563" />
                        <rect x="37" y="41" width="26" height="7" rx="1" fill="#ffffff" />
                        <text x="50" y="46.5" fontSize="4.5" fontFamily="monospace" fontWeight="bold" fill="#000" textAnchor="middle">D 5678 AB</text>
                        <circle cx="10" cy="35" r="2.5" fill="#fbbf24" opacity="0.8" />
                    </svg>
                </div>

                {/* Car 3 - Pink Car (Left to Right, Top) */}
                <div className="absolute top-8 left-0 w-full animate-car-lr-fast">
                    <svg width="90" height="45" viewBox="0 0 90 45" className="drop-shadow-lg">
                        <rect x="5" y="22" width="80" height="16" rx="2" fill="#ec4899" />
                        <rect x="18" y="10" width="54" height="16" rx="2" fill="#f472b6" />
                        <rect x="22" y="13" width="20" height="11" rx="1.5" fill="#9d174d" opacity="0.6" />
                        <rect x="48" y="13" width="20" height="11" rx="1.5" fill="#9d174d" opacity="0.6" />
                        <circle cx="22" cy="38" r="6" fill="#1f2937" />
                        <circle cx="22" cy="38" r="3.5" fill="#4b5563" />
                        <circle cx="68" cy="38" r="6" fill="#1f2937" />
                        <circle cx="68" cy="38" r="3.5" fill="#4b5563" />
                        <rect x="33" y="36" width="24" height="6" rx="1" fill="#ffffff" />
                        <text x="45" y="41" fontSize="4" fontFamily="monospace" fontWeight="bold" fill="#000" textAnchor="middle">E 9012 CD</text>
                        <circle cx="82" cy="30" r="2" fill="#fbbf24" opacity="0.8" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Decoration Elements */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-pink5/20 to-purple6/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue5/20 to-blue4/20 rounded-full blur-2xl pointer-events-none" />
        </div>
    );
};

export default AnimatedCars;