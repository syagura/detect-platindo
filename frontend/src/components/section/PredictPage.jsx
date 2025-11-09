import React, { useState, useRef, useEffect } from 'react'
import { Upload, Camera, Video, Image, FileImage, Play, Square } from 'lucide-react'
import api, { cameraWS } from '../../api'

const PredictPage = () => {

  const [activeTab, setActiveTab] = useState('image')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionResult, setDetectionResult] = useState(null)
  const [error, setError] = useState(null)
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null)
  const [videoProcessing, setVideoProcessing] = useState(false)
  const [currentDetections, setCurrentDetections] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(null)
  const [localStream, setLocalStream] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  const fileInputRef = useRef(null)
  const localVideoRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const reconnectTimerRef = useRef(null)
  const frameIntervalRef = useRef(null)

  const connectWebSocket = async () => {
    try {
      await cameraWS.connect();
      setIsConnected(true);
      console.log("WebSocket Connected");
      
      cameraWS.onMessage = (data) => {
        console.log("Received data type:", data.type);

        if (data.type === "frame") {
          console.log("Frame received size:", data.image?.length);
          setCurrentFrame(data.image);

          if (data.detections && data.detections.length > 0) {
            setCurrentDetections(data.detections);
          }
        } else if (data.type === 'error') {
          setError(data.message);
        }
      };
      
      cameraWS.onError = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
        setIsConnected(false);
      };
      
      cameraWS.onClose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setCurrentFrame(null);  // ✅ Uncomment ini
        setCurrentDetections([]);
        
        // Auto reconnect
        if (activeTab === 'realtime') {
          reconnectTimerRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connectWebSocket();
          }, 2000);
        }
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      setError('Failed to connect to real-time detection service');
      setIsInitializing(false);
    }
  };

  const disconnectWebSocket = () => {
    // Clear reconnect timer
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    cameraWS.close();
    setIsConnected(false);
    setCurrentDetections([]);
    setCurrentFrame(null);
    };

  const startLocalCamera = async () => {
    try {
      console.log("Rquesting camera access....");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment'
        }
      });

      console.log("Camera access granted");
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;

        localVideoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded")
          localVideoRef.current.play();
        };
      }
      
      console.log('Camera started successfully');
      return true;

    } catch (err) {
      console.error("Error accessing camera:", err);
      // setError("Could not access camera. Please check permissions.");
      setError(`Could not access camera: ${err.message}`);
      setIsInitializing(false);
      return false;
    }
  };

  const stopLocalCamera = () => {
    console.log("Stopping camera...");

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const captureAndSendFrame = () => {
    if (!localVideoRef.current || !isConnected || !isStreaming) {
      console.log("Skip frame - condition not met", {
        hasVideo: !!localVideoRef.current,
        isConnected,
        isStreaming
      });
      return;
    };

    const video = localVideoRef.current;

    if (video.readyState != video.HAVE_ENOUGH_DATA) {
      console.log("Video not ready yet");
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const frameData = canvas.toDataURL('image/jpeg', 0.7);

    console.log("Sending frame...")
    cameraWS.send({
      type: 'frame',
      image: frameData
    });
  };

  const startDetection = () => {
    console.log("Starting detection...");
    setIsStreaming(true);
    setIsDetecting(true);

    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }

    frameIntervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, 200);
  };

  const stopDetection = () => {
    console.log("Stopping detection...");
    setIsStreaming(false);
    setIsDetecting(false);

    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
  };

  const startCameraDetection = () => {
    if (isConnected) {
      cameraWS.send({ command: 'start_camera' });
    }
  };

  const stopCameraDetection = () => {
    if (isConnected) {
      cameraWS.send({ command: 'stop_camera' });
    }
  };

  const intializeRealtime = async () => {
    console.log("Initializing realtime detection...");
    setIsInitializing(true);
    setError(null);

    try{
      await connectWebSocket();
      await new Promise(resolve => setTimeout(resolve, 500));

      const cameraStarted = await startLocalCamera();
      if(!cameraStarted) {
        throw new Error("Failed to start camera");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      startDetection();

      setIsInitializing(false);
      console.log("Realtime detection initialized successfully");
    } catch (error) {
      console.log("Failed to initialize realtime:", error);
      setError(`Failed to start realtime detection: ${error.message}`);
      setIsInitializing(false);
    }
  };

  const cleanupRealtime = () => {
    console.log("Cleaning up realtime detection...");

    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    setIsStreaming(false);
    setIsDetecting(false);

    // stopDetection();
    stopLocalCamera();
    disconnectWebSocket();

    setIsInitializing(false);
    setError(null);
  };

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await api.get("/health");
        console.log('Backend Ready:', response.data);
      } catch (error) {
        consol.error('Backend Not Ready:', error);
      }
    };

    checkBackendHealth();
  }, []);

  useEffect(() => {
    let intervalId;

    if (isStreaming && isConnected) {
      intervalId = setInterval(() => {
        captureAndSendFrame();
      }, 500); // 5 FPS
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isStreaming, isConnected]);

  useEffect(() => {
    if (currentFrame && canvasRef.current) {
      console.log("Rendering frame to canvas");
      const img = document.createElement('img');

      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };

      img.onerror = (e) => {
        console.log('Error loading image:', e);
      };

      img.src = currentFrame;
    }
  }, [currentFrame]);

  useEffect(() => {
    if (activeTab === 'realtime') {
      intializeRealtime();
    } else {
      cleanupRealtime();
    }

    return () => {
      cleanupRealtime();
    };
  }, [activeTab]);

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

    //Handle Video Processing
    if (activeTab === 'video' && uploadedFile.type.startsWith('video/')) {
      return handleVideoProcessing()
    }

    //Handle image processing
    setIsDetecting(true)
    setError(null)

    const progressMessages = [
      "Uploading image...",
      "Detecting License Plate...",
      "Reading Plate Number...",
      "Processing Result..."
    ];

    let messageIndex = 0;
    const progressInterval = setInterval(() => {
      if (messageIndex < progressMessages.length) {
        setError(progressMessages[messageIndex]);
        messageIndex++;
      }
    }, 200)

    try {
      // Create FormData to send file to backend
      const formData = new FormData()
      formData.append('file', uploadedFile.file)

      console.log('Sending request to backend...') // Debug log

      // Send request to FastAPI backend with explicit headers
      const response = await api.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 0
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

      clearInterval(progressInterval);
      setError(null)

    } catch (err) {
      console.error('Detection error:', err)
      console.error('Error details:', err.response?.data)
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
        },
        timeout: 0
      })

      const { video_id, detected_plates, download_url } = response.data

      // Set the processed video URL
      setProcessedVideoUrl(`http://localhost:8000/stream_video/${video_id}`)

      // Set detection results from video
      const plateNumbers = Object.values(detected_plates).map(p => p.text).filter(t => t)
      const avgConfidence = Object.values(detected_plates).reduce((acc, p) => acc + p.confidence, 0) / Object.keys(detected_plates).length

      setDetectionResult({
        plateNumber: plateNumbers.join(', ') || "No plates detected",
        confidence: avgConfidence || 0,
        boundingBox: null,
        croppedImage: null,
        videoResult: true,
        detectedFrames: Object.keys(detected_plates).length,
        videoId: video_id
      })

      console.log('Video processed successfully:', response.data)

    } catch (err) {
      console.error('Video processing error:', err)
      setError(`Failed to precess video: ${err.response?.data?.detail || err.message}`)

    } finally {
      setVideoProcessing(false)
    }
  }

  // const startCamera = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true })
  //     if (videoRef.current) {
  //       videoRef.current.srcObject = stream
  //     }
  //   } catch (err) {
  //     console.error("Error accessing camera:", err)
  //     setError("Could not access camera. Please check permissions.")
  //   }
  // }

  // const stopCamera = () => {
  //   if (videoRef.current && videoRef.current.srcObject) {
  //     const tracks = videoRef.current.srcObject.getTracks()
  //     tracks.forEach(track => track.stop())
  //     videoRef.current.srcObject = null
  //   }
  // }

  return (
     <div className="min-h-screen bg-dark text-white p-6">
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
          {/* Camera Section */}
          <div className="space-y-6">
            {activeTab === 'realtime' ? (
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Real-time Camera Detection</h3>

                <video 
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ display: 'none' }}
                />

                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    className="w-full max-w-2xl border rounded bg-gray-900"
                  />
                  {(!currentFrame || isInitializing) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700/90 rounded-xl">
                      <Camera className="w-16 h-16 text-gray-500 mb-4" />
                      <p className="text-gray-300 text-center mb-2">
                        {isInitializing ? 'Initializing camera...' : 
                        !isConnected ? 'Connecting to server...' : 
                        !localStream ? 'Starting camera...' :
                        !isStreaming ? 'Starting detection...' :
                        'Waiting for frames...'}
                      </p>
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {isConnected && (
                    <span className="flex items-center gap-2 bg-green-600/20 text-green-400 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Server Connected
                    </span>
                  )}
                  {localStream && (
                    <span className="flex items-center gap-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                      Camera Active
                    </span>
                  )}
                  {isDetecting && (
                    <span className="flex items-center gap-2 bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                      Detecting...
                    </span>
                  )}
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
                          src={uploadedFile.preview}
                          className="w-full h-80 object-cover"
                          controls
                          key="original-video"
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
                          setProcessedVideoUrl(null)
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
              ) : detectionResult.videoResult ?  (
                // Video Results - hanya tampilkan video processed
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-xl p-4">
                    <div className='flex items-center justify-between mb-2'>
                      <h4 className="font-medium mb-2">Processed Video with Tracking</h4>
                      {processedVideoUrl && (
                        <span className="text-xs text-green-400">● Ready</span>
                      )}
                    </div>
                    {processedVideoUrl ? (
                      <video 
                        src={processedVideoUrl}
                        className="w-full h-64 object-contain bg-black rounded"
                        controls
                        preload='metadata'
                        key="processed-video"
                        onError={(e) => {
                          console.error('Video error:', e.target.error)

                          const errorCode = e.target.error?.code
                          const errorMessages = {
                            1: 'MEDIA_ERR_ABORTED',
                            2: 'MEDIA_ERR_NETWORK',
                            3: 'MEDIA_ERR_DECODE',
                            4: 'MEDIA_ERR_SRC_NOT_SUPPORTED'
                          }
                          console.error('Error code:', errorCode, errorMessages[errorCode])
                          setError(`Video playback failed: ${errorMessages[errorCode] || 'Unknown error'}`)
                        }}
                        onLoadStart={() => console.log('Video loading...')}
                        onLoadedMetadata={() => console.log('Video metadata loaded')}
                        onCanPlay={() => console.log('Video ready to play')}
                      >
                        <source src={processedVideoUrl} type='video/mp4' />
                        Your browser does not support the video tag
                      </video>
                    ) : (
                      <div className="w-full h-64 bg-gray-600 rounded flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className='text-gray-400'>Processing Video...</p>
                      </div>
                    )}
                  </div>
                    {/* <video 
                      src={processedVideoUrl}
                      className="w-full h-64 object-contain bg-black rounded"
                      controls
                      preload='metadata'
                      onError={(e) => console.error('Video error:', e)}
                      onLoadStart={() => console.log('Video loading started')}
                      onCanPlay={() => console.log('Video can play')}
                    >
                      <source src={processedVideoUrl} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                    {!processedVideoUrl && (
                      <div className="w-full h-64 bg-gray-600 rounded flex items-center justify-center">
                        <p className="text-gray-400">Video not available</p>
                      </div>
                    )} */}

                  <div className="bg-gray-700 rounded-xl p-4">
                    <h4 className="font-medium mb-2">Processing Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className="ml-2 text-green-400">Processing completed</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Detected Frames:</span>
                        <span className="ml-2">{detectionResult.detectedFrames || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Average Confidence:</span>
                        <span className="ml-2">{detectionResult.confidence.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Processing Type:</span>
                        <span className="ml-2">Video Tracking</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a 
                      href={`http://localhost:8000/download_video/${detectionResult.videoId}`}
                      download={`tracked_video_${Date.now()}.mp4`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center flex items-center justify-center"
                    >
                      Download Processed Video
                    </a>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Save Result
                    </button>
                  </div>
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