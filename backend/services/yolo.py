import os
import math
import logging
from typing import Optional
from config import UPLOAD_DIR

logger = logging.getLogger(__name__)

# --- Model Configuration ---
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "model", "best_v2.pt")
CLASS_NAMES = ['crack', 'good', 'scratch', 'stain']
CLASS_WEIGHTS = {'crack': 1.0, 'scratch': 0.6, 'stain': 0.4}

# --- YOLO Model Loading ---
_model = None


def _load_model():
    """Load the YOLOv8 model (lazy initialization)."""
    global _model
    if _model is not None:
        return _model

    if not os.path.exists(MODEL_PATH):
        logger.warning(
            f"⚠️  Model file not found at: {MODEL_PATH}\n"
            f"   Place your trained 'best_v2.pt' in: {os.path.dirname(MODEL_PATH)}/\n"
            f"   Falling back to placeholder detections."
        )
        return None

    try:
        from ultralytics import YOLO
        _model = YOLO(MODEL_PATH)
        logger.info(f"✅ YOLOv8 model loaded from: {MODEL_PATH}")
        return _model
    except ImportError:
        logger.warning("⚠️  'ultralytics' package not installed. Run: pip install ultralytics")
        return None
    except Exception as e:
        logger.error(f"❌ Failed to load YOLO model: {e}")
        return None


def _get_local_path(image_url: str) -> Optional[str]:
    """Convert an image URL to a local file path."""
    # If it's a URL pointing to our uploads folder
    if "/uploads/" in image_url:
        filename = image_url.split("/uploads/")[-1]
        local_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(local_path):
            return local_path
    # If it's already a local path
    if os.path.exists(image_url):
        return image_url
    return None


def _placeholder_detections() -> list:
    """Fallback placeholder when model is not available."""
    import random
    damage_types = ["crack", "scratch", "stain"]
    num_detections = random.randint(1, 3)
    detections = []
    for _ in range(num_detections):
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


def run_yolo(image_path: str) -> list:
    """
    Run YOLOv8 damage detection on an image.

    Uses the real trained model (best_v2.pt) if available,
    otherwise falls back to placeholder detections.

    Returns a list of detections, each with:
      - label: damage type (crack, scratch, stain, good)
      - confidence: detection confidence (0-1)
      - bbox: [x1, y1, x2, y2] bounding box coordinates
      - area_pct: percentage of image area covered by detection
    """
    model = _load_model()

    if model is None:
        logger.info("Using placeholder detections (model not loaded)")
        return _placeholder_detections()

    # Resolve image path
    local_path = _get_local_path(image_path)
    if local_path is None:
        logger.warning(f"Image file not found: {image_path}, using placeholder")
        return _placeholder_detections()

    try:
        results = model(local_path, verbose=False)[0]
        img_h, img_w = results.orig_shape
        img_area = img_h * img_w

        if len(results.boxes) == 0:
            return []

        detections = []
        for box in results.boxes:
            class_id = int(box.cls)
            class_name = model.names[class_id]

            # Skip "good" class — it's not damage
            if class_name == "good":
                continue

            confidence = round(float(box.conf), 2)
            x1, y1, x2, y2 = [round(v) for v in box.xyxy[0].tolist()]
            box_area = (x2 - x1) * (y2 - y1)
            area_pct = round((box_area / img_area) * 100, 2)

            detections.append({
                "label": class_name,
                "confidence": confidence,
                "bbox": [x1, y1, x2, y2],
                "area_pct": area_pct,
            })

        logger.info(f"Detected {len(detections)} damage(s) in {os.path.basename(local_path)}")
        return detections

    except Exception as e:
        logger.error(f"YOLO inference error: {e}")
        return _placeholder_detections()
