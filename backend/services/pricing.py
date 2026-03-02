def recommend_price(base_price: float, severity: int) -> float:
    """
    Rule-based price recommendation.

    - Minor damage (1–3): 10% discount
    - Moderate damage (4–7): 30% discount
    - Major damage (8–10): 50% discount
    """
    if severity <= 3:
        return round(base_price * 0.90, 2)
    elif severity <= 7:
        return round(base_price * 0.70, 2)
    else:
        return round(base_price * 0.50, 2)
