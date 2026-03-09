import math

# Class-specific weights — higher weight = more impactful on severity
CLASS_WEIGHTS = {'crack': 1.0, 'scratch': 0.6, 'stain': 0.4}


def calculate_severity(detections: list) -> int:
    """
    Calculate a severity score (1–10) based on YOLO detections.

    Uses area-weighted scoring from the trained model pipeline:
    - Each detection's contribution = area_pct × class_weight
    - Total is normalized using square root scaling for balanced results
    - Crack has highest weight (1.0), scratch moderate (0.6), stain lowest (0.4)

    Returns:
        int: severity score from 0 (no damage) to 10 (critical)
    """
    if not detections:
        return 0

    total_weighted_score = 0

    for det in detections:
        label = det.get("label", "")
        area_pct = det.get("area_pct", 5.0)  # fallback if area not computed
        weight = CLASS_WEIGHTS.get(label, 0.5)
        detection_score = area_pct * weight
        total_weighted_score += detection_score

    # Normalize: 100% area × 1.0 weight = 100 → divide by 10 → sqrt → scale
    raw_score = total_weighted_score / 10
    severity_score = min(round(math.sqrt(raw_score) * 3.16, 1), 10)
    severity_score = max(severity_score, 1) if total_weighted_score > 0 else 0

    return int(round(severity_score))


def get_condition_label(severity: int) -> str:
    """Get human-readable condition label from severity score."""
    if severity == 0:
        return "Good"
    elif severity <= 2:
        return "Minor Damage"
    elif severity <= 4:
        return "Moderate Damage"
    elif severity <= 7:
        return "Severe Damage"
    else:
        return "Critical Damage"
