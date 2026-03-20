import os
import uuid
import aiofiles
from fastapi import UploadFile
from config import UPLOAD_DIR, BACKEND_URL

async def save_upload(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    async with aiofiles.open(file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    return f"{BACKEND_URL}/uploads/{unique_name}"


def url_to_local_path(image_url: str) -> str:
    if "/uploads/" in image_url:
        filename = image_url.split("/uploads/")[-1]
        return os.path.join(UPLOAD_DIR, filename)
    # Already a local path (e.g. during testing)
    if os.path.exists(image_url):
        return image_url
    return image_url
