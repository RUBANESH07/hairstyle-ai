FACE_SHAPE_INFO: dict[str, dict[str, str]] = {
    "Oval": {
        "description": (
            "Oval faces are balanced and versatile — slightly longer than wide "
            "with a gently rounded jaw. Almost any hairstyle works well."
        ),
        "tip": "You can pull off virtually any style — lucky you!",
    },
    "Round": {
        "description": (
            "Round faces have similar width and length with full cheeks and a "
            "rounded jawline. Styles that add height and reduce width look best."
        ),
        "tip": "Add height on top and avoid styles that add volume to the sides.",
    },
    "Square": {
        "description": (
            "Square faces have a strong jaw and wide forehead of similar width. "
            "Soft, flowing styles complement the angular structure."
        ),
        "tip": "Soft layers and waves help soften the strong jawline.",
    },
    "Heart": {
        "description": (
            "Heart-shaped faces are wider at the forehead, tapering to a narrower "
            "chin. Styles with volume near the jaw balance the shape."
        ),
        "tip": "Add volume near the chin and keep the top sleek.",
    },
    "Diamond": {
        "description": (
            "Diamond faces are narrow at the forehead and chin with wide cheekbones. "
            "Styles with fringe or volume at the temples work great."
        ),
        "tip": "Full fringe and styles with width at the forehead flatter this shape.",
    },
    "Oblong": {
        "description": (
            "Oblong faces are noticeably longer than wide with a long straight cheek "
            "line. Styles with volume on the sides create balance."
        ),
        "tip": "Side-swept styles and volume on the sides help shorten the face visually.",
    },
}


def classify_shape(
    fw: float, cw: float, jw: float, fl: float
) -> tuple[str, float]:
    """Return (face_shape, confidence) from four measurements."""

    def approx(a: float, b: float, tolerance: float = 0.12) -> bool:
        return abs(a - b) / b <= tolerance if b else False

    lc = fl / cw if cw else 0

    scores: dict[str, float] = {
        "Oval": 0.0,
        "Round": 0.0,
        "Square": 0.0,
        "Heart": 0.0,
        "Diamond": 0.0,
        "Oblong": 0.0,
    }

    if lc > 1.45:
        scores["Oblong"] += 0.90
    if approx(fl, cw) and approx(jw, fw):
        scores["Round"] += 0.85
    if approx(fl, cw) and approx(jw, fw) and approx(jw, cw):
        scores["Square"] += 0.88
    if fw > cw > jw:
        scores["Heart"] += 0.82
    if cw > fw and cw > jw:
        scores["Diamond"] += 0.80
    if fl > cw and approx(jw, fw):
        scores["Oval"] += 0.82

    shape = max(scores, key=scores.get)
    confidence = round(max(scores[shape], 0.55), 2)
    return shape, confidence
