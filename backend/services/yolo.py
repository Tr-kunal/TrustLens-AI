import os
import logging
import tempfile
import requests as http_requests
from urllib.parse import urlparse
from pathlib import Path

from ultralytics import YOLO
from config import UPLOAD_DIR, BACKEND_URL

logger = logging.getLogger(__name__)

# ── Model Loading ────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "model", "best_v2.pt")

_model = None


def _get_model() -> YOLO:
    """Lazy-load the YOLO model once and cache it."""
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"YOLO model not found at {MODEL_PATH}. "
                "Please place best_v2.pt in the backend/model/ directory."
            )
        logger.info("Loading YOLO model from %s", MODEL_PATH)
        _model = YOLO(MODEL_PATH)
        logger.info("YOLO model loaded successfully. Classes: %s", _model.names)
    return _model


# ── URL → Local File Resolution ─────────────────────────────────────────────

def _resolve_image_path(image_url: str) -> str:
    """
    Convert an image URL to a local file path for YOLO inference.

    If the URL points to our own /uploads/ directory, resolve it to the
    local filesystem path directly. Otherwise, download to a temp file.
    """
    parsed = urlparse(image_url)

    # Check if this is a local upload URL (e.g. http://localhost:8000/uploads/abc.jpg)
    backend_parsed = urlparse(BACKEND_URL)
    is_local = (
        parsed.hostname in ("localhost", "127.0.0.1", backend_parsed.hostname)
        and parsed.path.startswith("/uploads/")
    )

    if is_local:
        filename = parsed.path.split("/uploads/")[-1]
        local_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(local_path):
            return local_path
        logger.warning("Local file not found at %s, falling back to download", local_path)

    # Fallback: download the image to a temporary file
    logger.info("Downloading image from %s", image_url)
    response = http_requests.get(image_url, timeout=30)
    response.raise_for_status()

    suffix = Path(parsed.path).suffix or ".jpg"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(response.content)
    tmp.close()
    return tmp.name


# ── YOLO Inference ───────────────────────────────────────────────────────────

def run_yolo(image_url: str) -> list:
    """
    Run YOLOv8 inference on an image.

    Args:
        image_url: URL of the image to analyze.

    Returns:
        A list of detections, each containing:
          - label:      class name (e.g. "crack", "scratch", "stain")
          - confidence: detection confidence (0–1)
          - bbox:       [x, y, width, height] in pixels
          - area_pct:   bounding box area as percentage of image area
    """
    model = _get_model()
    image_path = _resolve_image_path(image_url)
    is_temp = not image_path.startswith(UPLOAD_DIR)

    try:
        results = model(image_path, verbose=False)
    finally:
        # Clean up temp files
        if is_temp and os.path.exists(image_path):
            try:
                os.unlink(image_path)
            except OSError:
                pass

    detections = []

    for result in results:
        if result.boxes is None or len(result.boxes) == 0:
            continue

        # Get image dimensions for area_pct calculation
        img_h, img_w = result.orig_shape  # (height, width)
        img_area = img_h * img_w

        for box in result.boxes:
            # xyxy format → convert to [x, y, w, h]
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            w = x2 - x1
            h = y2 - y1
            area_pct = (w * h) / img_area * 100 if img_area > 0 else 0

            cls_id = int(box.cls[0].item())
            label = model.names.get(cls_id, f"class_{cls_id}")
            confidence = round(float(box.conf[0].item()), 4)

            detections.append({
                "label": label,
                "confidence": confidence,
                "bbox": [round(x1, 1), round(y1, 1), round(w, 1), round(h, 1)],
                "area_pct": round(area_pct, 2),
            })

    logger.info(
        "YOLO inference complete: %d detection(s) found in %s",
        len(detections), image_url
    )
    return detections
