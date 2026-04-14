import logging
from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from database import get_db
from schemas.report import AnalyzeRequest, AnalyzeResponse
from services.auth import get_current_user
from services.yolo import run_yolo
from services.severity import calculate_severity
from services.pricing import recommend_price
from services.llm import generate_explanation

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_images(
    request: AnalyzeRequest,
    db: Client = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Run the full AI analysis pipeline on uploaded images:
    1. YOLOv8 damage detection
    2. Severity scoring
    3. Price recommendation
    4. LLM explanation generation
    5. Save report to database
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

    # Step 1: Run YOLO detection on each image
    all_detections = []
    for url in request.image_urls:
        detections = run_yolo(url)
        all_detections.extend(detections)

    # Step 2: Calculate severity
    severity = calculate_severity(all_detections)

    # Step 3: Price recommendation
    recommended = recommend_price(request.base_price, severity)

    # Step 4: Generate explanation
    explanation = generate_explanation(all_detections, severity)

    # Step 5: Save report to Supabase
    report_data = {
        "user_id": current_user["id"],
        "base_price": request.base_price,
        "severity": severity,
        "recommended_price": recommended,
        "explanation": explanation,
        "image_urls": request.image_urls,
        "detections": all_detections,
    }
    result = db.table("reports").insert(report_data).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save report"
        )

    report = result.data[0]

    # Save image records
    image_records = [{"report_id": report["id"], "url": url} for url in request.image_urls]
    if image_records:
        try:
            image_result = db.table("images").insert(image_records).execute()
        except Exception as e:
            logger.exception("Failed to save image records for report %s", report["id"])
            # Compensating delete: remove the orphaned report
            try:
                db.table("reports").delete().eq("id", report["id"]).execute()
            except Exception as cleanup_err:
                logger.warning("Failed to clean up orphaned report %s: %s", report["id"], cleanup_err)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error while saving images"
            )

        if not image_result.data:
            logger.error("Images insert returned empty data for report %s", report["id"])
            try:
                db.table("reports").delete().eq("id", report["id"]).execute()
            except Exception as cleanup_err:
                logger.warning("Failed to clean up orphaned report %s: %s", report["id"], cleanup_err)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save image records"
            )

    return AnalyzeResponse(
        id=report["id"],
        image_urls=request.image_urls,
        detections=all_detections,
        severity=severity,
        recommended_price=recommended,
        explanation=explanation,
        created_at=report.get("created_at"),
    )
