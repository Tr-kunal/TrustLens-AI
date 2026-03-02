from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime


class DetectionItem(BaseModel):
    label: str
    confidence: float
    bbox: List[float]


class AnalyzeRequest(BaseModel):
    image_urls: List[str]
    base_price: float


class AnalyzeResponse(BaseModel):
    id: int
    image_urls: List[str]
    detections: List[Any]
    severity: int
    recommended_price: float
    explanation: str
    created_at: Optional[datetime] = None


class ReportResponse(BaseModel):
    id: int
    user_id: int
    base_price: float
    severity: int
    recommended_price: float
    explanation: str
    image_urls: List[Any]
    detections: List[Any]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
