# detect-platindo 🚘🇮🇩

**detect-platindo** adalah sistem deteksi plat kendaraan berbasis AI menggunakan YOLO dan FastAPI di backend, serta React + Tailwind di frontend. Proyek ini ditujukan untuk kebutuhan demo, portofolio, dan eksperimen AI open source buatan anak bangsa.

## 🧩 Tech Stack

- 🧠 YOLOv5 (Deteksi Plat)
- ⚡ FastAPI (Backend API)
- 🎨 React + Tailwind (Frontend UI)
- 🐳 Docker (Deployment)
- ☁️ Hugging Face Spaces (Backend Hosting)
- 🌐 Vercel (Frontend Hosting)

## 📁 Struktur Folder
detect-platindo/
├── backend/ # FastAPI & YOLO
├── frontend/ # React + Tailwind


## 🛠 Cara Jalankan Lokal

```bash
# Jalankan backend (venv + uvicorn)
uvicorn app.main:app --reload

# Jalankan frontend
npm install
npm run dev


⚖️ License
MIT License - feel free to use, modify, and share.

---

## ✅ Langkah Selanjutnya:

1. Buat folder dan file-nya:
   ```bash
   mkdir detect-platindo && cd detect-platindo
   mkdir backend frontend
   touch LICENSE README.md .gitignore
