import React, { useState, useRef } from 'react'
import { Upload, Camera, Video, Image, FileImage, Play, Square } from 'lucide-react'
import api from '../../api'

const PredictPage = () => {
  const [activeTab, setActiveTab] = useState('image')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionResult, setDetectionResult] = useState(null)
  const [error, setError] = useState(null)
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null)
  const [videoProcessing, setVideoProcessing] = useState(false)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedFile({
          file: file,
          preview: e.target.result,
          name: file.name,
          type: file.type
        })
        // Clear previous results and errors when new file is uploaded
        setDetectionResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDetection = async () => {
    if (!uploadedFile) {
      setError('Please upload an image first')
      return
    }

    if (activeTab === 'video' && uploadedFile.type.startsWith('video/')) {
      return handleVideoProcessing()
    }

    setIsDetecting(true)
    setError(null)

    try {
      // Create FormData to send file to backend
      const formData = new FormData()
      formData.append('file', uploadedFile.file)

      console.log('Sending request to backend...') // Debug log

      // Send request to FastAPI backend with explicit headers
      const response = await api.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      
      console.log('Backend response:', response.data) // Debug log
      
      const { plat_number, cropped_plat, confidence, bounding_box } = response.data

      // Convert hex string to base64 for display
      let croppedImageUrl = null
      if (cropped_plat) {
        try {
          // Convert hex to binary string then to base64
          const binaryString = cropped_plat.match(/.{1,2}/g)
            .map(hex => String.fromCharCode(parseInt(hex, 16)))
            .join('')
          const base64String = btoa(binaryString)
          croppedImageUrl = `data:image/jpeg;base64,${base64String}`
        } catch (hexError) {
          console.error('Error converting hex to image:', hexError)
        }
      }

      setDetectionResult({
        plateNumber: plat_number || "Not detected",
        confidence: confidence || 0,
        boundingBox: bounding_box,
        croppedImage: croppedImageUrl
      })

    } catch (err) {
      console.error('Detection error:', err)
      console.error('Error details:', err.response?.data) // More detailed error
      setError(`Failed to detect license plate: ${err.response?.data?.detail || err.message}`)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleVideoProcessing = async () => {
    setVideoProcessing(true)
    setError(null)
    setProcessedVideoUrl(null)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile.file)

      console.log("Processing video... ")

      const response = await api.post('/predict_video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      const { video_id, detected_plates, download_url } = response.data

      // Set the processed video URL
      setProcessedVideoUrl(`http://localhost:8000${download_url}`)

      // Set detection results from video
      const plateNumbers = Object.values(detected_plates).map(p => p.text).filter(t => t)
      const avgConfidence = Object.values(detected_plates).reduce((acc, p) => acc + p.confidence, 0) / Object.keys(detected_plates).length

      setDetectionResults({
        plateNumber: plateNumbers.join(', ') || "No plates detected",
        confidence: avgConfidence || 0,
        boundingBox: null,
        croppedImage: null,
        videoResult: true,
        detectedFrames: Object.keys(detected_plates).length
      })

      console.log('Video processed successfully:', response.data)

    } catch (err) {
      console.error('Video processing error:', err)
      setError(`Failed to precess video: ${err.response?.data?.detail || err.message}`)

    } finally {
      setVideoProcessing(false)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">License Plate Detection</h1>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-600 text-white p-4 rounded-xl text-center">
            {error}
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-full p-1 flex">
            <button
              className={`px-6 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'image' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('image')}
            >
              <Image size={18} />
              Image
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'video' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('video')}
            >
              <Video size={18} />
              Video
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'realtime' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('realtime')}
            >
              <Camera size={18} />
              Realtime
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload/Camera Section */}
          <div className="space-y-6">
            {activeTab === 'realtime' ? (
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Camera Feed</h3>
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-80 bg-gray-700 rounded-xl object-cover"
                    autoPlay
                    muted
                  />
                  {!videoRef.current?.srcObject && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 rounded-xl">
                      <Camera className="w-16 h-16 text-gray-500 mb-4" />
                      <p className="text-gray-400 text-center">Click start to begin camera detection</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={startCamera}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={18} />
                    Start Camera
                  </button>
                  <button
                    onClick={stopCamera}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Square size={18} />
                    Stop Camera
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Upload {activeTab === 'image' ? 'Image' : 'Video'}
                </h3>
                
                {!uploadedFile ? (
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-gray-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium mb-2">
                        Drop {activeTab} here or Browse
                      </p>
                      <p className="text-gray-400 text-sm">
                        {activeTab === 'image' ? 'PNG, JPG up to 10MB' : 'MP4, AVI up to 50MB'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-gray-700 rounded-xl overflow-hidden">
                      {uploadedFile.type.startsWith('image/') ? (
                        <img
                          src={uploadedFile.preview}
                          alt="Uploaded"
                          className="w-full h-80 object-cover"
                        />
                      ) : (
                        <video
                          src={processedVideoUrl || uploadedFile.preview}
                          className="w-full h-80 object-cover"
                          controls
                        />
                      )}
                      {detectionResult && detectionResult.boundingBox && (
                        <div
                          className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20"
                          style={{
                            left: `${detectionResult.boundingBox.x}px`,
                            top: `${detectionResult.boundingBox.y}px`,
                            width: `${detectionResult.boundingBox.width}px`,
                            height: `${detectionResult.boundingBox.height}px`,
                          }}
                        >
                          <div className="bg-red-500 text-white text-xs px-2 py-1 absolute -top-6 left-0">
                            {detectionResult.plateNumber}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-xl">
                      <FileImage className="w-8 h-8 text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{uploadedFile.name}</p>
                        <p className="text-gray-400 text-sm">
                          {detectionResult ? 'Detection completed' : 'Ready for detection'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedFile(null)
                          setDetectionResult(null)
                          setError(null)
                        }}
                        className="text-gray-400 hover:text-white text-xl"
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
            )}

            {/* Detection Controls */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Detection Settings</h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" defaultChecked />
                    Adjust color
                  </label>
                  <span className="text-sm text-gray-400">Style Guide</span>
                </div>
              </div>
              
              <button
                onClick={handleDetection}
                disabled={!uploadedFile && activeTab !== 'realtime' || isDetecting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isDetecting || videoProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {activeTab === 'video' ? 'Processing Video...' : 'Detecting...'}
                  </>
                ) : (
                  `Generate ${activeTab === 'video' ? 'Video Processing' : 'Detection'}`
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Detection Results</h3>
              
              {!detectionResult ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400">No detection results yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Upload an {activeTab} and click detect to see results
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">License Plate</span>
                      <span className="text-sm text-green-400">{detectionResult.confidence}% confident</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400">{detectionResult.plateNumber}</p>
                  </div>
                  
                  {/* Show cropped image if available */}
                  {detectionResult.croppedImage && (
                    <div className="bg-gray-700 rounded-xl p-4">
                      <h4 className="font-medium mb-2">Cropped License Plate</h4>
                      <img 
                        src={detectionResult.croppedImage} 
                        alt="Cropped license plate" 
                        className="w-full h-24 object-contain bg-white rounded"
                      />
                    </div>
                  )}
                  
                  <div className="bg-gray-700 rounded-xl p-4">
                    <h4 className="font-medium mb-2">Detection Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {detectionResult.boundingBox ? (
                        <>
                          <div>
                            <span className="text-gray-400">Position X:</span>
                            <span className="ml-2">{detectionResult.boundingBox.x1}px</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Position Y:</span>
                            <span className="ml-2">{detectionResult.boundingBox.y1}px</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Width:</span>
                            <span className="ml-2">{detectionResult.boundingBox.width}px</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Height:</span>
                            <span className="ml-2">{detectionResult.boundingBox.height}px</span>
                          </div>
                        </>
                      ) : (
                        <div className="col-span-2">
                          <span className="text-gray-400">Status:</span>
                          <span className="ml-2 text-green-400">Detection completed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Save Result
                    </button>
                    <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Export Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Detection History */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-medium mb-4">Recent Detections</h3>
              <div className="space-y-3">
                {[
                  { plate: detectionResult?.plateNumber || "B 1234 ABC", confidence: detectionResult?.confidence, time: "Just now" },
                  { plate: "D 5678 XYZ", confidence: 87.8, time: "5 min ago" },
                  { plate: "F 9012 DEF", confidence: 92.1, time: "8 min ago" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">{item.plate}</p>
                      <p className="text-sm text-gray-400">{item.time}</p>
                    </div>
                    <span className="text-sm text-green-400">{item.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictPage