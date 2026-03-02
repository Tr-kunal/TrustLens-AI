from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    base_price = Column(Float, nullable=False)
    severity = Column(Integer, nullable=False)
    recommended_price = Column(Float, nullable=False)
    explanation = Column(Text, nullable=False)
    image_urls = Column(JSON, default=[])
    detections = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    images = relationship("Image", back_populates="report", cascade="all, delete-orphan")
