from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from config import FRONTEND_URL, UPLOAD_DIR
from routes import auth, upload, analyze, reports

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TrustLens AI",
    description="AI-powered product condition verification API",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images as static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Mount routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(reports.router)


@app.get("/")
def root():
    return {
        "app": "TrustLens AI",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
