import React, { useState } from 'react';
import { BookOpen, Code, Zap, AlertCircle, CheckCircle, ChevronDown, ChevronRight, FileText, Lightbulb } from 'lucide-react';
import python from '../../../assets/images/python.png';
import FastAPI from '../../../assets/images/fastapi.png';
import react_logo from '../../../assets/images/react.png';

/**
 * Documentation Section Component
 */

const Documentation = () => {
    const githubLink = import.meta.env.VITE_GITHUB_REPOSITORY;

    const [activeSection, setActiveSection] = useState('getting-started');
    const [expandedFaq, setExpandedFaq] = useState(null);

    const sections = [
        { id: 'getting-started', title: 'Getting Started', icon: Zap },
        { id: 'features', title: 'Features & Capabilities', icon: Code },
        { id: 'technical', title: 'Technical Details', icon: FileText },
        { id: 'faq', title: 'FAQ', icon: AlertCircle }
    ];

    const faqs = [
        {
            question: "What image formats are supported?",
            answer: "DetectPlatIndo supports JPG, PNG, and WebP image formats. For optimal results, images with a resolution between 640×480 and 1920×1080 pixels are recommended."
        },
        {
            question: "How accurate is the detection?",
            answer: "The detection model performs reliably on Indonesian license plates under common conditions. Accuracy may vary depending on lighting, viewing angle, motion blur, and plate visibility. This project is intended for research, prototyping, and demonstration purposes."
        },
        {
            question: "Is there a file size limit?",
            answer: "Yes, the maximum file size is 10MB per image. We recommend compressing large images before uploading for faster processing."
        },
        {
            question: "What's the difference between image and video detection?",
            answer: "Image detection analyzes single static images instantly. Video detection processes footage frame-by-frame, allowing you to track plates across multiple frames with timestamped results. Both methods use the same AI model for consistent accuracy."
        },
        {
            question: "How long does processing take?",
            answer: "Processing time depends on image resolution, server load, and input type. Image inference is typically completed in real-time, while video processing speed varies based on video length and resolution."
        },
        {
            question: "Is my data stored or shared?",
            answer: "Uploaded files are used only for inference during the session. DetectPlatIndo does not permanently store user data and is designed as a demonstration and research project."
        },
        {
            question: "What if the detection fails or is inaccurate?",
            answer: "Try improving lighting conditions, ensuring the plate is clearly visible, and using a front-facing angle. If issues persist, the plate might be too damaged, heavily occluded, or at an extreme angle (>45°). You can also try adjusting the image brightness or contrast before uploading."
        }
    ];
    
    return (
        <div className="min-h-screen bg-dark">
            {/* Header */}
            <div className="bg-gradient-to-r from-dark backdrop-blur-xl border-b border-white/10">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink4/10 to-purple6/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue5/10 to-blue4/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex items-center gap-4 mb-4">
                        <BookOpen className="w-12 h-12 text-purple6" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">Documentation</h1>
                    </div>
                    <p className="text-xl text-gray3">
                        This page focuses on how to use DetectPlatIndo.
                        For a detailed technical workflow and model explanation, please visit the project portfolio.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-8 bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Sections</h3>
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-2 py-3 rounded-xl transition-all duration-300 ${
                                    activeSection === section.id
                                        ? 'bg-gradient-to-r from-purple6 to-pink6 text-white'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <section.icon className="w-5 h-5" />
                                    <span className="font-medium">{section.title}</span>
                                </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Getting Started Section */}
                            {activeSection === 'getting-started' && (
                                <div className="space-y-8">
                                    <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/10">
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                            <Zap className="w-8 h-8 text-blue5" />
                                            Quick Start Guide
                                        </h2>

                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                                    <span className="bg-gradient-to-r from-pink6 to-purple6 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                                        1
                                                    </span>
                                                    Upload Your Image
                                                </h3>
                                                <p className="text-gray3 ml-10">
                                                    Navigate to the Predict page and click on the upload area or drag & drop your image containing an Indonesian license plate.
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                                    <span className="bg-gradient-to-r from-pink6 to-purple6 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                                        2
                                                    </span>
                                                    Wait for Processing
                                                </h3>
                                                <p className="text-gray3 ml-10">
                                                    Our AI model will automatically detect and extract license plate information from your image. Processing time depends on the input size and current system load, but results are typically returned in near real-time.
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                                    <span className="bg-gradient-to-r from-pink6 to-purple6 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                                        3
                                                    </span>
                                                    View Results
                                                </h3>
                                                <p className="text-gray3 ml-10">
                                                    The detected license plate will be highlighted with a bounding box, and you'll see the detected license plate region highlighted with a bounding box along with the model confidence score.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tips Section */}
                                    <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/10">
                                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                            <Lightbulb className="w-7 h-7 text-yellow4" />
                                            Tips for Best Results
                                        </h3>
                                        <ul className="space-y-3 text-gray3">
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                                <span>Use images with good lighting conditions</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                                <span>Ensure the license plate is clearly visible and not heavily occluded</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                                <span>Front-facing or slightly angled shots work best</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                                <span>Higher resolution images generally provide better accuracy</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Features Section - SIMPLIFIED untuk hemat token */}
                            {activeSection === 'features' && (
                                <div className='bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/10'>
                                    <h2 className='md:text-3xl text-2xl font-bold text-white mb-6 flex items-center gap-3'>
                                        <Code className='w-8 h-8 text-[#a855f7]' />
                                        Features & Capabilities 
                                    </h2>

                                    {/* Image Detection */}
                                    <div className='mb-8 bg-gradient-to-br from-[#ec4899]/10 to-[#9333ea]/10 rounded-xl p-6 border border-[#ec4899]/20'>
                                        <div className='flex items-center gap-3 mb-4'>
                                            <div className='bg-gradient-to-r from-[#ec4899] to-[#9333ea] w-10 h-10 rounded-lg flex items-center justify-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                                    <polyline points="21 15 16 10 5 21"/>
                                                </svg>
                                            </div>
                                            <h3 className='text-xl md:text-2xl font-bold text-white'>Image Detection</h3>
                                        </div>
                                        <p className='text-[#d1d5db] mb-4'>Analyze still images to localize vehicle license plates using a YOLO-based detection model.</p>

                                        <h4 className='text-white font-semibold mb-2'>Supported Formats:</h4>
                                        <ul className='space-y-2 mb-4'>
                                            <li className='flex items-start gap-3'>
                                                <CheckCircle className='w-5 h-5 text-green-400 mb-0.5 flex-shrink-0' />
                                                <span className='text-[#d1d5db]'><strong>JPG/JPEG</strong> - Most common format, optimized compression</span>
                                            </li>
                                            <li className='flex items-start gap-3'>
                                                <CheckCircle className='w-5 h-5 text-green-400 mb-0.5 flex-shrink-0' />
                                                <span className='text-[#d1d5db]'><strong>PNG</strong> - Lossless quality, transparent background support</span>
                                            </li>
                                            <li className='flex items-start gap-3'>
                                                <CheckCircle className='w-5 h-5 text-green-400 mb-0.5 flex-shrink-0' />
                                                <span className='text-[#d1d5db]'><strong>WebP</strong> - Modern format with excellent compression</span>
                                            </li>
                                        </ul>

                                        <h4 className='text-white font-semibold mb-2'>Key Features:</h4>
                                        <div className='grid md:grid-cols-2 gap-3'>
                                            <div className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-gradient-to-r from-[#ec4899] to-[##9333ea] rounded-full mt-2'></div>
                                                <span className='text-[#d1d5db] text-sm'>Batch processing support</span>
                                            </div>
                                            <div className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-gradient-to-r from-[#ec4899] to-[##9333ea] rounded-full mt-2'></div>
                                                <span className='text-[#d1d5db] text-sm'>Confidence score display</span>
                                            </div>
                                            <div className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-gradient-to-r from-[#ec4899] to-[##9333ea] rounded-full mt-2'></div>
                                                <span className='text-[#d1d5db] text-sm'>Bounding box visualization</span>
                                            </div>
                                            <div className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-gradient-to-r from-[#ec4899] to-[##9333ea] rounded-full mt-2'></div>
                                                <span className='text-[#d1d5db] text-sm'>Download result option</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video Detection */}
                                    <div className='mb-8 bg-gradient-to-br from-[#3b82f6]/10 to-[#06b6d4]/10 rounded-xl p-6 border border-[#3b82f6]/20'>
                                        <div className='flex items-center gap-3 mb-4'>
                                            <div className='bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] w-10 h-10 rounded-lg flex items-center justify-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="23 7 16 12 23 17 23 7"/>
                                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                                                </svg>
                                            </div>
                                            <h3 className='text-xl md:text-2xl font-bold text-white'>Video Detection</h3>
                                        </div>
                                        <p className='text-[#d1d5db] mb-4'>Run frame-by-frame inference on video files to detect and track license plates across time.</p>

                                        <h4 className='text-white font-semibold mb-2'>Supported Formats:</h4>
                                        <ul className='space-y-2 mb-4'>
                                            <li className='flex items-start gap-3'>
                                                <CheckCircle className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                                                <span className='text-[#d1d5db]'><strong>MP4</strong> - Universal format, wide compability</span>
                                            </li>
                                            <li className='flex items-start gap-3'>
                                                <CheckCircle className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                                                <span className='text-[#d1d5db]'><strong>AVI</strong> - High quality, uncompressed option</span>
                                            </li>
                                            <li className='flex items-start gap-3'>
                                                <CheckCircle className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                                                <span className='text-[#d1d5db]'><strong>MOV</strong> - Apple format with excellent quality</span>
                                            </li>
                                        </ul>

                                        <h4 className='text-white font-semibold mb-2'>Key Features:</h4>
                                        <div className='grid md:grid-cols-2 gap-3'>
                                            <div className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-full mt-2'></div>
                                                <span className='text-[#d1d5db] text-sm'>Frame-by-frame analysis</span>
                                            </div>
                                            <div className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-full mt-2'></div>
                                                <span className='text-[#d1d5db] text-sm'>Timeline navigation</span>
                                            </div>
                                            <div className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-full mt-2'></div>
                                                <span className='text-[#d1d5db] text-sm'>Multiple plate tracking</span>
                                            </div>
                                            <div className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-full mt-2'></div>
                                                <span className='text-[#d1d5db] text-sm'>Export timestamped results</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real-time Camera */}
                                    <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl p-6 border border-gray-600/30">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-gradient-to-r from-gray-600 to-gray-700 w-10 h-10 rounded-lg flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                                    <circle cx="12" cy="13" r="4"/>
                                                </svg>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-white">Real-time Camera Detection</h3>
                                            <span className="bg-gray-600/50 text-gray-300 px-1 py-1 rounded-lg text-xs font-semibold">Coming Soon</span>
                                        </div>
                                        <p className="text-gray-400 mb-4">Live detection directly from your device camera with instant results.</p>
                                        
                                        <h4 className="text-white font-semibold mb-2">Planned Features:</h4>
                                        <div className="grid md:grid-cols-2 gap-3">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2"></div>
                                            <span className="text-gray-400 text-sm">Webcam integration</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2"></div>
                                            <span className="text-gray-400 text-sm">Mobile camera support</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2"></div>
                                            <span className="text-gray-400 text-sm">Auto-capture on detection</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2"></div>
                                                <span className="text-gray-400 text-sm">Real-time processing</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Technical Section */}
                            {activeSection === 'technical' && (
                                <div className="space-y-8">
                                    <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/10">
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Technical Details</h2>

                                        {/* AI Model */}
                                        <div className="mb-8">
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">AI Model</h3>
                                            <div className="bg-white/5 rounded-xl p-6">
                                                <div className="grid md:grid-cols-2 gap-6 text-gray3">
                                                    <div>
                                                        <h4 className="text-white font-semibold mb-2">Model Architecture</h4>
                                                        <p className="mb-4">YOLO-based object detection model fine-tuned for Indonesian license plate localization.</p>
                                                        <h4 className="text-white font-semibold mb-2">Training Data</h4>
                                                        <p>Custom dataset containing Indonesian vehicle license plates captured under diverse conditions.</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-semibold mb-2">Performance Notes</h4>
                                                        <p className="mb-4">The model is optimized for real-time inference, with performance varying depending on input resolution and deployment environment.</p>
                                                        {/* <h4 className="text-white font-semibold mb-2">Processing Speed</h4>
                                                        <p>&lt;100ms per image</p> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tech Stack */}
                                        <div className="mb-8">
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Technology Stack</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {[
                                                    { img: python, name: 'Python', desc: 'Backend & AI Processing' },
                                                    { img: FastAPI, name: 'FastAPI', desc: 'REST API Framework' },
                                                    { img: react_logo, name: 'React', desc: 'Frontend Framework' },
                                                    { icon: '🎨', name: 'TailwindCSS', desc: 'Styling Framework' }
                                                ].map((tech, i) => (
                                                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-3">
                                                        {tech.img ? (
                                                            <img src={tech.img} alt={tech.name} className="w-10 h-10" />
                                                        ) : (
                                                            <span className="text-3xl">{tech.icon}</span>
                                                        )}
                                                        <div>
                                                            <h4 className="text-white font-semibold">{tech.name}</h4>
                                                            <p className="text-gray3 text-sm">{tech.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Limitations */}
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Current Limitations</h3>
                                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                                                <p className="text-gray3 mb-4">
                                                    As with most computer vision systems, DetectPlatIndo has several known limitations:
                                                </p>

                                                <ul className="space-y-3 text-gray3">
                                                    <li className="flex items-start gap-3">
                                                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                                        <span>Performance may decrease in extremely low light or high glare</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                                        <span>Heavily damaged or obscured plates may not be detected</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                                        <span>Extreme angles (&gt;45°) may reduce accuracy</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FAQ Section */}
                            {activeSection === 'faq' && (
                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-purple56/10 to-purple6/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/10">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                        <AlertCircle className="w-8 h-8 text-purple6" />
                                        Frequently Asked Questions
                                    </h2>

                                    <div className="space-y-4">
                                        {faqs.map((faq, index) => (
                                            <div
                                                key={index}
                                                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-purple6/50"
                                            >
                                                <button
                                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                                    className="w-full flex items-center justify-between p-6 text-left"
                                                >
                                                    <span className="text-lg font-semibold text-white pr-4">{faq.question}</span>
                                                    {expandedFaq === index ? (
                                                        <ChevronDown className="w-5 h-5 text-purple6 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                    )}
                                                </button>

                                                {expandedFaq === index && (
                                                    <div className="px-6 pb-6">
                                                        <p className="text-gray3 leading-relaxed">{faq.answer}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Still Have Questions */}
                                <div className="bg-gradient-to-r from-purple6 to-pink6 rounded-2xl p-8 text-center">
                                    <h3 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h3>
                                    <p className="text-white/90 mb-6">Can't find what you're looking for? Reach out to us!</p>
                                    <a 
                                        href={githubLink}
                                        target='_blank'
                                        rel="noopener noreferrer"
                                        className="bg-white text-purple6 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                                    >
                                        View Project Repository
                                    </a>
                                    {/* <button onClick={githubLink} className="bg-white text-purple6 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                                        View Project Repository
                                    </button> */}
                                </div>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Documentation
