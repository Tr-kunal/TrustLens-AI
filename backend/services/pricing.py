def recommend_price(base_price: float, severity: int) -> float:
    """
    Rule-based price recommendation.

    Aligned with the TrustLens AI severity scoring:
    - No damage (0):        Full price (0% discount)
    - Minor (1–2):          10% discount
    - Moderate (3–4):       25% discount
    - Severe (5–7):         40% discount
    - Critical (8–10):      55% discount
    """
    if severity == 0:
        return round(base_price, 2)
    elif severity <= 2:
        return round(base_price * 0.90, 2)
    elif severity <= 4:
        return round(base_price * 0.75, 2)
    elif severity <= 7:
        return round(base_price * 0.60, 2)
    else:
        return round(base_price * 0.45, 2)
