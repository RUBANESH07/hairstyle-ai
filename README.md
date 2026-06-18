# Hairstyle AI (Simple MVP)

Upload a photo → detect face → classify face shape → get top 4 hairstyle recommendations.

## Stack

- **Backend:** FastAPI, MediaPipe, OpenCV
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS

## Requirements

- Python 3.10+
- Node.js 18+ (for Next.js 15)
- MediaPipe is pinned to `0.10.14` (newer versions removed the `solutions` API)

## Quick start

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

## API

**POST** `/api/analyze` — multipart form with `file` (jpg/jpeg/png, max 10MB)

Returns face shape, measurements, and 4 hairstyle recommendations.

## Project structure

```
hairstyple/
├── backend/main.py       # All backend logic
├── frontend/             # Next.js app
└── uploads/              # Uploaded images (local storage)
```
