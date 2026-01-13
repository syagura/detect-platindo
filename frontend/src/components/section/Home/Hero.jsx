import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedCars from './AnimatedCars';
import Features from './Features';
import python from '../../../assets/images/python.png';
import FastAPI from '../../../assets/images/fastapi.png';
import Yolo from '../../../assets/images/yolo.png';
import react_logo from '../../../assets/images/react.png';

/**
 * Hero Section Component
 * Main landing section with animated cars and tech stack
 */

const Hero = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/predict');
    };

    const techStack = [
        {
            icon: python,
            title: 'PYTHON',
            description: 'Core language for model inference, data processing, and OCR pipeline.',
            color: 'yellow51',
            colorText: 'yellow4'
        },
        {
            icon: FastAPI,
            title: 'FASTAPI',
            description: 'High-performance backend API for handling detection requests and model serving.',
            color: 'pink51',
            colorText: 'pink4'
        },
        {
            icon: Yolo,
            title: 'YOLO V11',
            description: 'Real-time object detection model for accurate vehicle license plate localization.',
            color: 'blue51',
            colorText: 'blue4'
        },
        {
            icon: react_logo,
            title: 'REACT JS',
            description: 'Modern frontend for interactive UI, visualization, and user-friendly experience.',
            color: 'purple51',
            colorText: 'purple4'
        }
    ];

    return (
        <section className="relative z-10 min-h-screen">
            {/* Background Elements */}
            <div className="relative z-10 flex items-center min-h-screen">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Gradient Orbs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink6 to-purple6 rounded-full opacity-30 blur-3xl transform-gpu mix-blend-screen" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue5 to-blue4 rounded-full opacity-30 transform-gpu mix-blend-screen blur-3xl" />
                </div>
                <div className="container mx-auto px-10 py-20 relative z-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                    Detect PlatIndo,
                                    <br />
                                    <span
                                        className="inline-block mt-2 text-transparent pb-2 font-extrabold"
                                        style={{
                                            backgroundImage: 'linear-gradient(to right, #ec4899, #a855f7)',
                                            WebkitBackgroundClip: 'text',
                                            backgroundClip: 'text',
                                            backgroundSize: '200% auto',
                                        }}
                                    >
                                        Indonesian Vehicle License Plate Detection
                                    </span>
                                </h1>

                                <p className="text-xl text-gray3 max-w-lg leading-relaxed font-poppins">
                                    <span className="text-white font-medium">
                                        AI-powered license plate detection
                                    </span>{" "}
                                    from images, videos, and live camera streams.
                                    Design for{" "}
                                    <span className="text-purple3">Indonesian traffic conditions</span>{" "}
                                    with real-world scenarios in mind.
                                </p>
                            </div>

                            {/* CTA Button */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleGetStarted}
                                    className="px-8 py-4 bg-gradient-to-r from-purple6 to-pink6 hover:from-purple7 hover:to-pink7 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg cursor-pointer z-30"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Animated Cars */}
                        <AnimatedCars />
                    </div>
                </div>
            </div>

            {/* Tech Stack Section */}
            <div className="relative z-10 py-20 border-t border-gray85">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {techStack.map((tech, index) => (
                            <div key={index} className="text-center space-y-4">
                                <div className={`w-16 h-16 mx-auto bg-${tech.color} rounded-2xl flex items-center justify-center`}>
                                    <div className="relative w-10 h-10">
                                        <img src={tech.icon} alt={tech.title} />
                                    </div>
                                </div>
                                <h3 className={`text-sm font-bold tracking-wider text-${tech.colorText}`} >
                                    {tech.title}
                                </h3>
                                <p className="text-gray3 text-sm leading-relaxed">
                                    {tech.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative z-10 py-20">
                <div className="mx-auto">
                    <Features />
                </div>
            </div>
        </section>
    )
}

export default Hero
