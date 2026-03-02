# TrustLens AI

**AI-Powered Product Condition Verification Platform**

Upload product images and receive instant damage detection, severity scoring, price recommendations, and AI-generated explanations.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-cyan) ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red)

---

## Features

- 🔍 **YOLOv8 Damage Detection** — Detects cracks, scratches, dents, and more (placeholder, ready for real model)
- 📊 **Severity Scoring** — AI-computed 1–10 damage score
- 💰 **Price Recommendation** — Rule-based pricing engine adjusts value based on condition
- 📝 **AI Explanation** — Human-readable damage summary (LLM placeholder)
- 🔐 **JWT Authentication** — Secure signup, login, and protected routes
- 📂 **Report History** — All past analyses saved and accessible
- 🖼️ **Bounding Box Visualization** — Canvas-rendered detection overlays on images

---

## Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS |
| Backend    | FastAPI + SQLAlchemy           |
| Database   | SQLite (dev) / PostgreSQL      |
| Auth       | JWT (access + refresh tokens)  |
| Storage    | Local filesystem (pluggable)   |

---

## Project Structure

```
TrustLensAI/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── config.py             # Environment config
│   ├── database.py           # SQLAlchemy setup
│   ├── .env                  # Environment variables
│   ├── requirements.txt
│   ├── models/               # SQLAlchemy models
│   │   ├── user.py
│   │   ├── report.py
│   │   └── image.py
│   ├── schemas/              # Pydantic schemas
│   │   ├── auth.py
│   │   └── report.py
│   ├── routes/               # API endpoints
│   │   ├── auth.py
│   │   ├── upload.py
│   │   ├── analyze.py
│   │   └── reports.py
│   ├── services/             # Business logic
│   │   ├── auth.py
│   │   ├── yolo.py
│   │   ├── severity.py
│   │   ├── pricing.py
│   │   ├── llm.py
│   │   └── storage.py
│   └── uploads/              # Uploaded images
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/axios.js
│       ├── context/AuthContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── LoadingSpinner.jsx
│       └── pages/
│           ├── Landing.jsx
│           ├── Signup.jsx
│           ├── Login.jsx
│           ├── Dashboard.jsx
│           ├── Upload.jsx
│           └── AnalysisResult.jsx
│
└── README.md
```

---

## Setup & Installation

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**

### 1. Clone the Repository

```bash
git clone <repo-url>
cd TrustLensAI
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env with your settings (defaults work for development)

# Run the server
uvicorn main:app --reload --port 8000
```

The API is now running at **http://localhost:8000**
- Swagger docs: **http://localhost:8000/docs**
- Health check: **http://localhost:8000/health**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app is now running at **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint         | Auth | Description                  |
|--------|------------------|------|------------------------------|
| POST   | `/auth/signup`   | ❌   | Register a new user          |
| POST   | `/auth/login`    | ❌   | Login and get JWT tokens     |
| POST   | `/auth/logout`   | ❌   | Logout (stateless)           |
| GET    | `/auth/me`       | ✅   | Get current user profile     |
| POST   | `/upload`        | ✅   | Upload 1–5 product images   |
| POST   | `/analyze`       | ✅   | Run AI analysis pipeline     |
| GET    | `/reports`       | ✅   | Get all reports for user     |
| GET    | `/report/{id}`   | ✅   | Get specific report          |

---

## Environment Variables

| Variable                     | Default                     | Description              |
|------------------------------|-----------------------------|--------------------------|
| `DATABASE_URL`               | `sqlite:///./trustlens.db`  | Database connection URL  |
| `SECRET_KEY`                 | (auto-generated)            | JWT signing secret       |
| `ALGORITHM`                  | `HS256`                     | JWT algorithm            |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| `30`                        | Token expiration (min)   |
| `OPENAI_API_KEY`             | (empty)                     | For real LLM integration |
| `BACKEND_URL`                | `http://localhost:8000`     | Backend URL for uploads  |
| `FRONTEND_URL`               | `http://localhost:5173`     | Frontend URL for CORS    |

---

## Replacing Placeholders

### YOLOv8
Replace `backend/services/yolo.py` → `run_yolo()` with actual Ultralytics model loading and inference.

### LLM Explanation
Replace `backend/services/llm.py` → `generate_explanation()` with OpenAI/Claude API call. Set `OPENAI_API_KEY` in `.env`.

### Storage (S3 / Supabase)
Replace `backend/services/storage.py` → `save_upload()` with your cloud storage SDK.

### PostgreSQL
Change `DATABASE_URL` in `.env` to `postgresql://user:pass@host:5432/dbname`.

---

## Deployment

### Backend
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend
```bash
npm run build
# Serve the dist/ folder with Nginx, Vercel, Netlify, etc.
```

---

## License

MIT
