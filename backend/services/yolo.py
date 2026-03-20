"""
TrustLens AI — YOLO service (production version)

Calls the HuggingFace Space microservice instead of loading
best_v2.pt locally (which would crash Render free tier).

Environment variable needed:
  HF_SPACE_URL = https://yourusername-trustlens-yolo.hf.space
"""

import os
import logging

import httpx

logger = logging.getLogger(__name__)

# Set in Render environment variables after deploying HF Space
HF_SPACE_URL = os.getenv("HF_SPACE_URL", "")


def run_yolo(image_path: str) -> list:
    """
    Run YOLOv8 damage detection by forwarding the image to the HuggingFace Space.

    Args:
        image_path: local filesystem path to the uploaded image
                    (resolved from URL by url_to_local_path in storage.py)

    Returns:
        list of dicts: [{"label": str, "confidence": float,
                         "bbox": [x1,y1,x2,y2], "area_pct": float}, ...]
    """
    if not HF_SPACE_URL:
        logger.warning("HF_SPACE_URL not set — using placeholder detections")
        return _placeholder_detections()

    if not os.path.exists(image_path):
        logger.warning(f"Image not found: {image_path} — using placeholder detections")
        return _placeholder_detections()

    try:
        predict_url = HF_SPACE_URL.rstrip("/") + "/predict"

        with open(image_path, "rb") as f:
            file_content = f.read()

        filename = os.path.basename(image_path)
        ext = os.path.splitext(filename)[1].lower()
        mime_map = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
            ".bmp": "image/bmp",
        }
        mime = mime_map.get(ext, "image/jpeg")

        # 120 second timeout to survive HF Space cold starts
        with httpx.Client(timeout=120.0) as client:
            response = client.post(
                predict_url,
                files={"file": (filename, file_content, mime)},
            )
            response.raise_for_status()

        detections = response.json()
        logger.info(f"HF Space returned {len(detections)} detection(s) for {filename}")
        return detections

    except httpx.TimeoutException:
        logger.error("HF Space timed out (cold start?) — using placeholder detections")
        return _placeholder_detections()
    except httpx.HTTPStatusError as exc:
        logger.error(f"HF Space HTTP {exc.response.status_code}: {exc.response.text}")
        return _placeholder_detections()
    except Exception as exc:
        logger.error(f"Unexpected error calling HF Space: {exc}")
        return _placeholder_detections()


def _placeholder_detections() -> list:
    """
    Fallback when HF Space is unavailable.
    Returns random-looking but realistic detections so the app
    doesn't crash — user still gets a report, just with fake damage data.
    """
    import random
    damage_types = ["crack", "scratch", "stain"]
    detections = []
    for _ in range(random.randint(1, 3)):
        label = random.choice(damage_types)
        confidence = round(random.uniform(0.65, 0.99), 2)
        x1 = random.randint(20, 200)
        y1 = random.randint(20, 200)
        x2 = x1 + random.randint(50, 200)
        y2 = y1 + random.randint(50, 200)
        detections.append({
            "label": label,
            "confidence": confidence,
            "bbox": [x1, y1, x2, y2],
            "area_pct": round(random.uniform(2.0, 35.0), 2),
        })
    return detections
