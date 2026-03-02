def generate_explanation(detections: list, severity: int) -> str:
    """
    Generate a human-readable explanation of the damage assessment.

    This is a placeholder that produces template-based explanations.
    Replace with actual LLM API call (GPT/Claude) for production use.
    """
    if not detections:
        return "No damage was detected on this product. It appears to be in excellent condition."

    damage_labels = list(set(det.get("label", "unknown").replace("_", " ") for det in detections))
    num_issues = len(detections)

    if severity <= 3:
        level_desc = "minor"
        condition = "good"
        recommendation = "The product is still in good usable condition with minimal cosmetic issues."
    elif severity <= 7:
        level_desc = "moderate"
        condition = "fair"
        recommendation = "The product shows noticeable wear but remains functional. Buyers should expect some visible imperfections."
    else:
        level_desc = "significant"
        condition = "poor"
        recommendation = "The product has substantial damage that may affect functionality or aesthetics. Significant repairs may be needed."

    damage_list = ", ".join(damage_labels[:-1]) + (" and " + damage_labels[-1] if len(damage_labels) > 1 else damage_labels[0] if damage_labels else "damage")

    explanation = (
        f"Our AI analysis detected {num_issues} issue(s) including {damage_list}. "
        f"The overall condition is assessed as {condition} with {level_desc} damage "
        f"(severity score: {severity}/10). {recommendation}"
    )

    return explanation
