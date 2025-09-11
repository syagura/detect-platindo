import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import python from '../../assets/images/python.png';
import FastAPI from '../../assets/images/fastapi.png';
import Yolo from '../../assets/images/yolo.png'
import react_logo from '../../assets/images/react.png'
import predict from '../../assets/images/predict.png'

const HeroSection = () => {
  const navigate = useNavigate(); // Hook untuk navigasi

  // Function untuk handle klik tombol Get Started
  const handleGetStarted = () => {
    navigate('/predict');
  };
  return (
    <section className="relative min-h-screen bg-dark overflow-hidden">

      <div className="relative z-10 flex items-center min-h-screen">
        {/* Background Elements */}
        <div className="absolute inset-0">
            {/* Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Detect PlatIndo,
                  <br />
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Deteksi Plat Nomor Kendaraan
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-lg leading-relaxed font-poppins">
                  <span className="text-white font-medium">Mendeteksi plat nomor</span> dari gambar, video, atau kamera secara real-time. seluruh wilayah <span className="text-purple-300">Indonesia</span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </button>
                {/* <button className="px-8 py-4 border border-purple-400/30 text-purple-300 hover:bg-purple-400/10 font-semibold rounded-xl transition-all">
                  Learn More
                </button> */}
              </div>
            </div>

            {/* Right Content - Synth Interface Mockup */}
            <div className="relative">
              {/* Main Interface Window */}
              <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                {/* Window Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-400">entonal</div>
                </div>

                {/* Interface Content */}
                <div className="space-y-4">
                  {/* Circular Visualization */}
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full"></div>
                    <div className="absolute inset-4 border border-purple-400/20 rounded-full"></div>
                    <div className="absolute inset-8 border border-purple-300/10 rounded-full"></div>
                    
                    {/* Center Dot */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    
                    {/* Scale Points */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-1 h-1 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                          i % 3 === 0 ? 'bg-pink-400' : 'bg-purple-300/60'
                        }`}
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-90px)`
                        }}
                      />
                    ))}
                  </div>

                  {/* Control Panels */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-2">SCALE</div>
                      <div className="space-y-1">
                        <div className="h-1 bg-purple-500/60 rounded w-3/4"></div>
                        <div className="h-1 bg-purple-400/40 rounded w-1/2"></div>
                        <div className="h-1 bg-purple-300/30 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-2">TUNING</div>
                      <div className="space-y-1">
                        <div className="h-1 bg-pink-500/60 rounded w-4/5"></div>
                        <div className="h-1 bg-pink-400/40 rounded w-3/5"></div>
                        <div className="h-1 bg-pink-300/30 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-1">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`w-1 h-6 rounded ${
                          i % 2 === 0 ? 'bg-purple-500/60' : 'bg-gray-600/40'
                        }`}></div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">440 Hz</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 border-t border-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Radial Graph */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-yellow-500/10 rounded-2xl flex items-center justify-center">
                <div className="relative w-10 h-10">
                  <img src={python} alt="" />
                </div>
              </div>
              <h3 className="text-yellow-400 text-sm font-bold tracking-wider">PYTHON</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Intuitively dial in<br />custom tunings
              </p>
            </div>

            {/* Plugin Host */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-pink-500/10 rounded-2xl flex items-center justify-center">
                <img src={FastAPI} alt="" className='w-10 h-10'/>
              </div>
              <h3 className="text-pink-400 text-sm font-bold tracking-wider">FASTAPI</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Make any synth<br />microtonal
              </p>
            </div>

            {/* 200 Presets */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <img src={Yolo} alt="" className='w-10 h-10' />
              </div>
              <h3 className="text-blue-400 text-sm font-bold tracking-wider">YOLO V8</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Easy to browse and explore<br />for beginners
              </p>
            </div>

            {/* Multiple Formats */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <img src={react_logo} alt="" className='w-10 h-10'/>
              </div>
              <h3 className="text-purple-400 text-sm font-bold tracking-wider">REACT JS</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Standalone, plugin<br />instrument, MIDI plugin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Radial Graph Section */}
      <div className="relative z-10 py-20">
        <div className=" mx-auto">
          <RadialGraphSection />
        </div>
      </div>
    </section>
  );
};

// Radial Graph Section Component dengan full width alternating
const RadialGraphSection = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  const slides = [
    {
      title: "Infinite freedom to create",
      features: [
        "Easily retune scale notes by colour and angular position",
        "Drag notes or have them snap to ratios", 
        "View relative intervals between two or more held notes"
      ],
      thumbnail:predict
    },
    {
      title: "Advanced microtonal control",
      features: [
        "Real-time frequency adjustment with visual feedback",
        "Custom temperament creation and modification",
        "Harmonic series exploration and interval mapping"
      ],
      thumbnail:predict
    },
    {
      title: "Intuitive workflow design",
      features: [
        "Color-coded note identification system",
        "Gesture-based note manipulation interface",
        "Live preview of tuning changes in real-time"
      ],
      thumbnail:predict
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full flex flex-col gap-28">
      {slides.map((features, index) => (
        <div key={features.id || index} className="relative w-full">
          {/* Full width background yang extend ke samping */}
          <div className={`absolute inset-0 bg-zinc-50/30 ${
            index % 2 === 0 
              ? 'lg:rounded-r-3xl md:rounded-r-3xl lg:mr-50 md:mr-50' 
              : 'lg:rounded-l-3xl md:rounded-l-3xl lg:ml-50 md:ml-50 ' 
          }`}></div>
          
          {/* Content container dengan positioning yang bisa digeser */}
          <div className={`relative z-10 px-4 md:px-8 lg:px-16 ${
            index % 2 === 0 
              ? 'lg:ml-0 md:ml-0 lg:mr-auto md:mr-auto lg:max-w-4xl md:max-w-xl' 
              : 'lg:mr-0 md:mr-0 lg:ml-auto md:ml-auto lg:max-w-4xl md:max-w-xl' 
          }`}>
            <div className={`flex flex-col lg:flex-row ${
              index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
            } items-center gap-10 py-16`}>
              <div className="w-full lg:w-1/2">
                <img 
                  src={features.thumbnail} 
                  alt={features.title} 
                  className="rounded-xl w-full object-cover shadow-md" 
                />
              </div>
              <div className="w-full lg:w-1/2 text-white">
                <h2 className="text-2xl font-bold mb-2 text-black">{features.title}</h2>
                <p className="mb-4 text-gray-700">{features.overview}</p>
                <p className='text-gray-600 mb-4 text-sm'>
                  <span className='font-semibold'>Created By : </span>
                  {features.createdBy}
                </p>
                <div className="flex flex-wrap gap-2">
                  {features.techStack?.map((tool, i) => (
                    <span key={i} className="bg-[#A1A1A14D] px-3 py-1 rounded-lg text-sm text-gray-700">
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => openModal(features)}
                    className="text-black flex text-xs p-2 rounded-full cursor-pointer bg-white hover:bg-stone-300 transition-colors duration-300"
                  >
                    See Details 
                    <span className="ml-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up-right">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M17 7l-10 10" />
                        <path d="M8 7l9 0l0 9" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default HeroSection;