import random


def run_yolo(image_path: str) -> list:
    """
    Placeholder YOLOv8 detection function.
    Replace this with actual YOLO model inference when ready.

    Returns a list of detections, each with:
      - label: type of damage detected
      - confidence: detection confidence score
      - bbox: [x, y, width, height] bounding box
    """
    damage_types = [
        "crack", "scratch", "dent", "chip", "discoloration",
        "broken_screen", "water_damage", "bent_frame"
    ]

    num_detections = random.randint(1, 4)
    detections = []

    for _ in range(num_detections):
        label = random.choice(damage_types)
        confidence = round(random.uniform(0.65, 0.99), 2)
        x = random.randint(20, 300)
        y = random.randint(20, 300)
        w = random.randint(40, 150)
        h = random.randint(40, 150)
        detections.append({
            "label": label,
            "confidence": confidence,
            "bbox": [x, y, w, h]
        })

    return detections
