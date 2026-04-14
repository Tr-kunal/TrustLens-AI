from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from typing import List
from services.auth import get_current_user
from services.storage import save_upload

router = APIRouter(tags=["Upload"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
MAX_FILES = 5


@router.post("/upload")
async def upload_images(
    files: List[UploadFile] = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload 1–5 product images. Returns list of uploaded image URLs."""
    if len(files) > MAX_FILES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum {MAX_FILES} files allowed"
        )

    if len(files) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one file is required"
        )

    urls = []
    for file in files:
        # Validate file extension
        ext = ""
        if file.filename:
            ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type '{ext}' not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # Validate content type
        if file.content_type and not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only image files are allowed"
            )

        url = await save_upload(file)
        urls.append(url)

    return {"image_urls": urls, "count": len(urls)}
