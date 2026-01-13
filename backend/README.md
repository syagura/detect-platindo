# DetectPlatIndo 🚗

Indonesian License Plate Detection API menggunakan YOLO OBB (Oriented Bounding Box) dan EasyOCR untuk mendeteksi dan membaca plat nomor kendaraan Indonesia.

## 🚀 Features

- ✅ **Image Detection** - Deteksi plat nomor dari gambar
- ✅ **Video Processing** - Tracking plat nomor di video dengan stabilisasi
- ✅ **OCR Integration** - Pembacaan teks plat nomor otomatis
- ✅ **Multiple Plate Types** - Support untuk plat putih dan hitam
- ✅ **RESTful API** - FastAPI dengan dokumentasi Swagger otomatis
- ✅ **Docker Ready** - Deploy mudah dengan Docker & Docker Compose
- ✅ **Production Ready** - Logging, error handling, dan validasi lengkap

## 📋 Requirements

### System Requirements
- Python 3.10+
- FFmpeg (optional, untuk video re-encoding)
- CUDA (optional, untuk GPU acceleration)

### Python Dependencies
Lihat `requirements.txt` untuk daftar lengkap dependencies.

## 🛠️ Installation

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd detect-platindo/backend
```

### 2. Setup Virtual Environment
```bash
# Menggunakan Conda
conda create -n detectplatindo python=3.10
conda activate detectplatindo

# Atau menggunakan venv
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env sesuai kebutuhan
```

### 5. Pastikan Model YOLO Tersedia
Letakkan model YOLO OBB di:
```
backend/weights/best_obb_openvino_model/
```

## 🚀 Running the Application

### Development Mode
```bash
cd src
python main.py
```

atau

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode (Docker)
```bash
# Build and run dengan Docker Compose
docker-compose up -d

# Atau build manual
docker build -t detectplatindo .
docker run -p 8000:8000 detectplatindo
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Image Detection
```
POST /api/predict
Content-Type: multipart/form-data
Body: file (image file)
```

### Video Processing
```
POST /api/predict_video
Content-Type: multipart/form-data
Body: file (video file)
```

### Stream Video
```
GET /api/stream_video/{video_id}
```

### Download Video
```
GET /api/download_video/{video_id}
```

## 📚 API Documentation

Setelah aplikasi berjalan, akses dokumentasi interaktif di:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── main.py                 # Entry point aplikasi
│   ├── config/
│   │   ├── settings.py         # Konfigurasi dari environment
│   │   └── constants.py        # Constants & magic numbers
│   ├── core/
│   │   ├── exceptions.py       # Custom exceptions
│   │   └── logger.py           # Logging configuration
│   ├── models/
│   │   └── yolo_model.py       # YOLO model & tracking
│   ├── schemas/
│   │   └── detection.py        # Pydantic schemas
│   ├── services/
│   │   ├── detection_service.py    # Main detection logic
│   │   ├── ocr_service.py          # OCR processing
│   │   ├── image_processor.py      # Image utilities
│   │   └── video_processor.py      # Video processing
│   ├── api/
│   │   └── routes/
│   │       ├── health.py       # Health endpoints
│   │       ├── detection.py    # Detection endpoints
│   │       └── video.py        # Video endpoints
│   └── utils/
│       └── file_handler.py     # File operations
├── weights/                    # YOLO model weights
├── uploads/                    # Temporary uploads
├── outputs/                    # Processed outputs
├── .env                        # Environment variables
├── .env.example                # Environment template
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose setup
└── README.md                   # This file
```

## ⚙️ Configuration

Edit `.env` untuk konfigurasi:

```env
# Server
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# CORS
CORS_ORIGINS=http://localhost:5173

# Model
MODEL_PATH=weights/best_obb_openvino_model
MODEL_CONFIDENCE_THRESHOLD=0.25

# Video Processing
DETECT_EVERY_N_FRAMES=3
OCR_EVERY_N_FRAMES=30

# Logging
LOG_LEVEL=INFO
```

## 🔧 Troubleshooting

### Model Not Found
```
FileNotFoundError: Model not found: weights/best_obb_openvino_model
```
**Solution:** Pastikan model YOLO ada di path yang benar.

### FFmpeg Not Found
```
FFmpeg not found. Install with: choco install ffmpeg
```
**Solution:** Install FFmpeg atau set `FFMPEG_ENABLED=false` di `.env`

### CORS Error
```
Access to fetch at ... has been blocked by CORS policy
```
**Solution:** Tambahkan origin frontend ke `CORS_ORIGINS` di `.env`

## 🚢 Deployment

### Hugging Face Spaces
1. Create new Space (Docker SDK)
2. Upload code & model
3. Set environment variables
4. Deploy!

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Railway akan auto-detect Dockerfile
4. Deploy!

### Cloud Platforms
- Google Cloud Run
- AWS ECS/Fargate
- Azure Container Instances

## 📝 License

MIT License

Copyright (c) 2025 Syahrul Gunawan Ramdhani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 👥 Contributors

- Syahrul Gunawan Ramdhani - Initial work

## 🙏 Acknowledgments

- Ultralytics YOLO
- EasyOCR
- FastAPI
- OpenCV

---

**Made with ❤️ for portfolio project**