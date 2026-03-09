from services.severity import get_condition_label


def generate_explanation(detections: list, severity: int) -> str:
    """
    Generate a human-readable explanation of the damage assessment.

    Ported from the TrustLens AI Colab notebook — produces detailed,
    class-specific damage descriptions with resale recommendations.
    """
    condition = get_condition_label(severity)

    if severity == 0 or not detections:
        return (
            "No damage detected. The device appears to be in excellent condition "
            "and is suitable for resale at full price."
        )

    # Group detections by class
    class_summary = {}
    for d in detections:
        cls = d.get("label", "unknown")
        if cls not in class_summary:
            class_summary[cls] = {"count": 0, "total_area": 0}
        class_summary[cls]["count"] += 1
        class_summary[cls]["total_area"] += d.get("area_pct", 5.0)

    # Build damage description for each class
    damage_parts = []

    if "crack" in class_summary:
        c = class_summary["crack"]
        area = round(c["total_area"], 1)
        word = "severe" if area > 50 else "significant" if area > 20 else "minor"
        count = c["count"]
        damage_parts.append(
            f"{count} {word} crack{'s' if count > 1 else ''} covering {area}% of the surface"
        )

    if "scratch" in class_summary:
        s = class_summary["scratch"]
        count = s["count"]
        area = round(s["total_area"], 1)
        damage_parts.append(
            f"{count} scratch{'es' if count > 1 else ''} covering {area}% of the surface"
        )

    if "stain" in class_summary:
        st = class_summary["stain"]
        count = st["count"]
        area = round(st["total_area"], 2)
        damage_parts.append(
            f"{count} stain{'s' if count > 1 else ''} detected ({area}% total area)"
        )

    # Handle any unexpected classes
    for cls in class_summary:
        if cls not in ("crack", "scratch", "stain"):
            info = class_summary[cls]
            damage_parts.append(
                f"{info['count']} {cls} issue{'s' if info['count'] > 1 else ''} detected"
            )

    # Join damage parts naturally
    if len(damage_parts) == 1:
        damage_description = damage_parts[0]
    elif len(damage_parts) == 2:
        damage_description = f"{damage_parts[0]} and {damage_parts[1]}"
    else:
        damage_description = ", ".join(damage_parts[:-1]) + f", and {damage_parts[-1]}"

    # Recommendation based on severity score
    if severity <= 2:
        recommendation = "Suitable for resale with minor cosmetic disclosure."
    elif severity <= 4:
        recommendation = "Suitable for resale at reduced price with damage disclosure."
    elif severity <= 7:
        recommendation = "Requires repair before resale. Price should reflect damage."
    else:
        recommendation = "Not suitable for resale without significant repair."

    explanation = (
        f"Damage detected on this device: {damage_description}. "
        f"Severity Score: {severity}/10 ({condition}). "
        f"Recommendation: {recommendation}"
    )

    return explanation
