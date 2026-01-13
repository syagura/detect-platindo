import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Zap, Shield, Users, Award, Cpu } from 'lucide-react';
import syahrul from '../../../assets/images/me.JPG';

/**
 * About Section Component
 */

const About = () => {
    const navigate = useNavigate();
    const handleDemo = () => {
        navigate('/predict');
    };

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: Zap,
            title: "Fast & Accurate",
            description: "Built on YOLO-based object detection for fast and reliable license plate localization."
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your data is never permanently stored or shared."
        },
        {
            icon: Code,
            title: "Open Source",
            description: "Built with modern web technologies and open for contributions."
        },
        {
            icon: Cpu,
            title: "AI-Powered",
            description: "Deep learning model adapted to Indonesian license plate formats and conditions."
        }
    ];

    const techStack = [
        { name: "YOLOv11", category: "AI Model" },
        { name: "React", category: "Frontend" },
        { name: "TailwindCSS", category: "Styling" },
        { name: "Python", category: "Backend" },
        { name: "FastAPI", category: "API Framework" }
    ];

    const stats = [
        { value: "95%+", label: "Accuracy Rate" },
        { value: "<100ms", label: "Processing Time" },
        { value: "1000+", label: "Detections Made" },
        { value: "24/7", label: "Available" }
    ];

    return (
        <div className="min-h-screen bg-dark">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-dark backdrop-blur-3xl" />
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink4/10 to-purple6/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue5/10 to-blue4/10 rounded-full blur-3xl" />
                </div>

                <div
                    className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink6 to-purple6">
                            About DetectPlatIndo
                        </h1>
                        <p className="text-xl md:text-2xl text-gray3 max-w-3xl mx-auto">
                            AI-powered license plate detection system designed specifically for Indonesian vehicles
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-pink4/50 transition-all duration-300 hover:scale-105"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink4 to-purple6 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="w-8 h-8 text-purple6" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Our Mission</h2>
                    </div>

                    <p className="text-lg text-gray3 mb-6 leading-relaxed">
                        DetectPlatIndo was developed to address the challenges of automatic
                        license plate detection in Indonesia, where variations in plate formats,
                        lighting conditions, and camera angles often reduce model reliability.
                    </p>

                    <p className="text-lg text-gray3 leading-relaxed">
                        This project focuses on building a robust and efficient computer vision
  pipeline that can be used for research, prototyping, and real-world
  applications such as parking systems, traffic monitoring, and smart city solutions.
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                    Why DetectPlatIndo
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-pink4/50 transition-all duration-300 hover:scale-105 group"
                        >
                            <div className="bg-gradient-to-br from-pink6 to-purple6 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
                    <div className="flex items-center gap-3 mb-8">
                        <Code className="w-8 h-8 text-blue5" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Core Technologies</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {techStack.map((tech, index) => (
                            <div
                                key={index}
                                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue5/50 transition-all duration-300 hover:translate-x-1"
                            >
                                <div className="text-lg font-semibold text-white">{tech.name}</div>
                                <div className="text-sm text-gray-400">{tech.category}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* About Creator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="w-8 h-8 text-purple6" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white">About the Creator</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Text Content */}
                        <div className="flex-1">
                            <p className="text-lg text-gray3 mb-6 leading-relaxed">
                                Hi, I'm <span className='text-white font-medium'>Syahrul Gunawan Ramdhani</span>, 
                                a Machine Learning and Computer Vision enthusiast with a strong interest in
                                building practical AI systems.
                                DetectPlatIndo is part of my exploration in applying deep learning models
                                to real-world problems, particularly in vehicle and traffic-related scenarios.
                            </p>

                            <p className="text-lg text-gray3 leading-relaxed">
                                This project focuses on end-to-end development, from model training and inference
                                to backend deployment and frontend visualization.
                                DetectPlatIndo is continously improved as a research and portfolio project,
                                and open to feedback, discussion, and collaboration.
                            </p>
                        </div>

                        {/* Photo */}
                        <div className="w-full md:w-64 flex justify-center md:justify-end">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink to-purple6 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                                <img
                                src={syahrul}
                                alt="Creator"
                                className="relative w-64 h-64 object-cover rounded-2xl border-4 border-white/10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-r from-purple6 to-pink6 rounded-3xl p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Try the Detection Demo
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Test the system using images or videos directly from your browser
                    </p>
                    <button onClick={handleDemo} className="bg-white text-purple6 px-8 py-4 cursor-pointer rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl">
                        Start Detecting Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default About
