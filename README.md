# 🛡️ TrustLens AI

**AI-Powered Product Condition Verification Platform**

Upload product images and receive instant damage detection, severity scoring, price recommendations, and AI-generated explanations — powered by a custom-trained YOLOv8 model.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-cyan) ![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-purple) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald)

---

## ✨ Features

- 📱 **Phone Price Prediction** — Upload phone details (Brand, Model, RAM, Storage, Condition) and images for accurate market valuation
- 🔍 **YOLOv8 Damage Detection** — Custom-trained model detecting **cracks, scratches, and stains**
- 📊 **Area-Weighted Severity Scoring** — Scores 0–10 using damage area % and class-specific weights
- 💰 **Price Recommendation** — Rule-based pricing engine with 5 discount tiers
- 📝 **AI Explanation** — Class-specific damage descriptions with resale recommendations
- 🔐 **JWT Authentication** — Secure signup, login, and protected routes
- 📂 **Report History** — All analyses saved and accessible from dashboard
- 🖼️ **Bounding Box Visualization** — Canvas-rendered detection overlays on images
- 🛡️ **Robust Error Handling** — Sanitized client responses, server-side logging, and compensating transactions

---

## 🛠️ Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 18 + Vite + Tailwind CSS              |
| Backend  | FastAPI + Supabase REST API                 |
| ML Model | YOLOv8n (Ultralytics) — 4 classes          |
| Database | Supabase (PostgreSQL)                       |
| Auth     | JWT (access + refresh tokens) + bcrypt      |
| Storage  | Local filesystem (pluggable to S3/Supabase) |

---

## 📁 Project Structure

```
TrustLensAI/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── config.py                # Environment config (validated at startup)
│   ├── database.py              # Supabase client setup
│   ├── .env                     # Environment variables
│   ├── requirements.txt
│   ├── model/
│   │   └── best_v2.pt           # Trained YOLOv8 weights
│   ├── schemas/                 # Pydantic schemas
│   │   ├── auth.py
│   │   └── report.py
│   ├── routes/                  # API endpoints
│   │   ├── auth.py              # signup, login, logout, me
│   │   ├── upload.py            # image upload (1–5)
│   │   ├── analyze.py           # full AI pipeline
│   │   └── reports.py           # report history & detail
│   ├── services/                # Business logic
│   │   ├── auth.py              # JWT + bcrypt
│   │   ├── yolo.py              # YOLOv8 inference
│   │   ├── severity.py          # Area-weighted scoring
│   │   ├── pricing.py           # Price recommendation
│   │   ├── llm.py               # Explanation generator
│   │   └── storage.py           # File upload handler
│   └── uploads/                 # Uploaded images
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
│       ├── api/axios.js         # Axios + JWT interceptors
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
│           ├── PhonePrediction.jsx
│           └── AnalysisResult.jsx
│
├── Final YOLOv8 Model/          # Model training artifacts
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and npm
- **Supabase account** with a project created

### 1. Backend Setup

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate            # Windows
# source venv/bin/activate       # macOS/Linux

# Install dependencies
pip install -r requirements.txt
pip install ultralytics          # For YOLOv8

# Configure environment variables (see section below)
# Copy .env.example to .env and fill in values

# Place your trained model
# Copy best_v2.pt to backend/model/best_v2.pt

# Start the server
uvicorn main:app --reload --port 8000
```

> **Note:** Without `best_v2.pt`, the app runs in **placeholder mode** with mock detections.

> **Important:** The server will **refuse to start** if `SUPABASE_URL` or `SUPABASE_KEY` are missing — this is intentional to prevent silent runtime failures.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Access the App

| Service      | URL                        |
| ------------ | -------------------------- |
| Frontend     | http://localhost:5173      |
| Backend API  | http://localhost:8000      |
| Swagger Docs | http://localhost:8000/docs |

---

## 🔌 API Endpoints

| Method | Endpoint         | Auth | Description                        |
| ------ | ---------------- | ---- | ---------------------------------- |
| POST   | `/auth/signup` | ❌   | Register new user                  |
| POST   | `/auth/login`  | ❌   | Login and get JWT                  |
| POST   | `/auth/logout` | ❌   | Logout (stateless)                 |
| GET    | `/auth/me`     | ✅   | Current user profile               |
| POST   | `/upload`      | ✅   | Upload 1–5 product images         |
| POST   | `/analyze`     | ✅   | Run full AI analysis               |
| GET    | `/reports`     | ✅   | All reports for user               |
| GET    | `/report/{id}` | ✅   | Single report detail               |
| GET    | `/health`      | ❌   | App health check                   |
| GET    | `/health/db`   | ❌   | DB connectivity (503 if unhealthy) |

---

## 🤖 AI Pipeline

### Detection → Severity → Price → Explanation

```
Image Upload → YOLOv8 Detection → Severity Scoring → Price Recommendation → Explanation
```

### YOLOv8 Model

- **Architecture:** YOLOv8n (nano) — fast inference
- **Classes:** `crack` (0), `good` (1), `scratch` (2), `stain` (3)
- **Training:** 50 epochs, 640×640, batch 16
- **Dataset:** Merged from per-class datasets (crack, scratch, stain, good)

### Severity Scoring (Area-Weighted)

```
score = √(total_weighted_score / 10) × 3.16
```

| Class   | Weight | Impact                       |
| ------- | ------ | ---------------------------- |
| Crack   | 1.0    | Highest — structural damage |
| Scratch | 0.6    | Medium — cosmetic           |
| Stain   | 0.4    | Lowest — cleanable          |

### Price Recommendation

| Severity | Condition | Discount |
| -------- | --------- | -------- |
| 0        | Good      | 0%       |
| 1–2     | Minor     | 10%      |
| 3–4     | Moderate  | 25%      |
| 5–7     | Severe    | 40%      |
| 8–10    | Critical  | 55%      |

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

| Variable                        | Required | Default                   | Description                  |
| ------------------------------- | -------- | ------------------------- | ---------------------------- |
| `SUPABASE_URL`                | ✅       | —                        | Supabase project URL         |
| `SUPABASE_KEY`                | ✅       | —                        | Supabase anon/service key    |
| `SECRET_KEY`                  | ⚠️     | `fallback-secret-key`   | JWT signing secret           |
| `ALGORITHM`                   | ❌       | `HS256`                 | JWT algorithm                |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌       | `30`                    | Access token TTL (minutes)   |
| `REFRESH_TOKEN_EXPIRE_DAYS`   | ❌       | `7`                     | Refresh token TTL (days)     |
| `BACKEND_URL`                 | ❌       | `http://localhost:8000` | Backend URL for upload paths |
| `FRONTEND_URL`                | ❌       | `http://localhost:5173` | CORS allowed origin          |

> **⚠️ Warning:** `SECRET_KEY` has a hardcoded fallback for development only. Always set a strong, unique secret in production.

---

## 🛡️ Error Handling & Reliability

The backend implements several layers of defensive error handling:

- **Startup validation** — `SUPABASE_URL` and `SUPABASE_KEY` are validated at import time; missing values crash the server immediately with a clear error message.
- **Atomic signup** — User registration performs a direct insert and catches the PostgreSQL unique constraint violation (`23505`) instead of a racy select-then-insert pattern. A `UNIQUE` constraint is enforced on `users.email`.
- **Sanitized error responses** — Internal exception details are logged server-side via Python's `logging` module and never leaked to clients. All error responses use generic messages.
- **Compensating transactions** — If saving image records fails after a report is created, the orphaned report is automatically deleted. Cleanup failures are logged with the report ID for operator visibility.
- **Health checks** — The `/health/db` endpoint returns HTTP **503** (not 200) when the database is unreachable, with a consistent response schema.
- **Database call protection** — All Supabase queries across routes are wrapped in `try/except` blocks with appropriate HTTP status codes (400, 404, 500).

---

## 🚢 Deployment

### Backend

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend

```bash
npm run build
# Serve dist/ with Nginx, Vercel, or Netlify
```

### Supabase (Production)

Ensure your Supabase project has the following tables:

- `users` — with a `UNIQUE` constraint on `email`
- `reports` — linked to `users` via `user_id`
- `images` — linked to `reports` via `report_id`

Set `SUPABASE_URL` and `SUPABASE_KEY` in your production environment variables.
