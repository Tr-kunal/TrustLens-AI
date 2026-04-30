from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from typing import List
from database import get_db
from schemas.report import ReportResponse
from services.auth import get_current_user

router = APIRouter(tags=["Reports"])


@router.get("/reports", response_model=List[ReportResponse])
def get_reports(
    db: Client = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Fetch all reports for the authenticated user, newest first."""
    try:
        result = (
            db.table("reports")
            .select("*")
            .eq("user_id", current_user["id"])
            .order("created_at", desc=True)
            .execute()
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch reports"
        )
    return result.data


@router.get("/report/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    db: Client = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Fetch a single report by ID (must belong to the authenticated user)."""
    try:
        result = (
            db.table("reports")
            .select("*")
            .eq("id", report_id)
            .eq("user_id", current_user["id"])
            .execute()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching report: {str(e)}"
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    return result.data[0]
