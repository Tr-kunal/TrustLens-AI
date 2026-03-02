def calculate_severity(detections: list) -> int:
    """
    Calculate a severity score (1–10) based on detections.

    Logic:
    - More detections → higher severity
    - Higher confidence → higher severity
    - Certain damage types are inherently more severe
    """
    if not detections:
        return 1

    severe_labels = {"broken_screen", "water_damage", "bent_frame"}
    moderate_labels = {"crack", "dent"}

    base_score = min(len(detections) * 1.5, 5)

    severity_bonus = 0
    avg_confidence = 0

    for det in detections:
        avg_confidence += det.get("confidence", 0.5)
        label = det.get("label", "")
        if label in severe_labels:
            severity_bonus += 2.0
        elif label in moderate_labels:
            severity_bonus += 1.0
        else:
            severity_bonus += 0.5

    avg_confidence /= len(detections)
    severity_bonus = min(severity_bonus, 4)

    raw_score = base_score + severity_bonus + (avg_confidence * 1.5)
    final_score = max(1, min(10, round(raw_score)))

    return final_score
