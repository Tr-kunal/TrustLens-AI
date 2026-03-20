from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.report import Report
from models.image import Image as ImageModel
from schemas.report import AnalyzeRequest, AnalyzeResponse
from services.auth import get_current_user
from services.yolo import run_yolo
from services.severity import calculate_severity
from services.pricing import recommend_price
from services.llm import generate_explanation
from services.storage import url_to_local_path 

router = APIRouter(tags=["Analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_images(
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Run the full AI analysis pipeline on uploaded images:
    1. Resolve each image URL → local file path on disk
    2. Forward image to HuggingFace Space for YOLOv8 detection
    3. Severity scoring
    4. Price recommendation
    5. Explanation generation
    6. Save report to database
    """
    if not request.image_urls:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one image URL is required"
        )

    if request.base_price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Base price must be a positive number"
        )

    # Step 1 + 2: Resolve each URL to a local file path, then run YOLO via HF Space
    all_detections = []
    for url in request.image_urls:
        local_path = url_to_local_path(url)
        detections = run_yolo(local_path)
        all_detections.extend(detections)

    # Step 3: Calculate severity
    severity = calculate_severity(all_detections)

    # Step 4: Price recommendation
    recommended = recommend_price(request.base_price, severity)

    # Step 5: Generate explanation
    explanation = generate_explanation(all_detections, severity)

    # Step 6: Save report to database
    report = Report(
        user_id=current_user.id,
        base_price=request.base_price,
        severity=severity,
        recommended_price=recommended,
        explanation=explanation,
        image_urls=request.image_urls,
        detections=all_detections,
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # Save image records
    for url in request.image_urls:
        img = ImageModel(report_id=report.id, url=url)
        db.add(img)
    db.commit()

    return AnalyzeResponse(
        id=report.id,
        image_urls=request.image_urls,
        detections=all_detections,
        severity=severity,
        recommended_price=recommended,
        explanation=explanation,
        created_at=report.created_at,
    )
