"""
MediaPipe face detection + mesh analysis.
Initialised once at import time so the models are not reloaded per request.
"""
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from fastapi import HTTPException

from config import UPLOAD_DIR

# ── MediaPipe singletons ───────────────────────────────────────────────────
_face_detection = mp.solutions.face_detection.FaceDetection(
    model_selection=1, min_detection_confidence=0.6
)
_face_mesh = mp.solutions.face_mesh.FaceMesh(
    static_image_mode=True, max_num_faces=1, refine_landmarks=True
)


# ── Public API ─────────────────────────────────────────────────────────────

def run_analysis(image_id: str, image_path: Path) -> dict:
    """
    Detect face, extract landmarks, return measurements dict.
    Returns {"face_detected": False} when no face found.
    Raises HTTPException(400) on invalid image.
    """
    img = cv2.imread(str(image_path))
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    h, w, _ = img.shape
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # ── Face detection ─────────────────────────────────────────────────────
    det_result = _face_detection.process(rgb)
    if not det_result.detections:
        return {"face_detected": False, "message": "No face detected"}

    detection = max(det_result.detections, key=lambda d: d.score[0])
    bb = detection.location_data.relative_bounding_box

    x = max(0, int(bb.xmin * w))
    y = max(0, int(bb.ymin * h))
    bw = min(w - x, int(bb.width * w))
    bh = min(h - y, int(bb.height * h))

    crop = img[y: y + bh, x: x + bw]
    crop_path = UPLOAD_DIR / f"{image_id}_face.jpg"
    cv2.imwrite(str(crop_path), crop)

    # ── Face mesh ──────────────────────────────────────────────────────────
    mesh_result = _face_mesh.process(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
    if not mesh_result.multi_face_landmarks:
        return {"face_detected": False, "message": "Face mesh not detected"}

    landmarks = mesh_result.multi_face_landmarks[0].landmark
    crop_h, crop_w = crop.shape[:2]

    def get_xy(idx: int) -> tuple[int, int]:
        p = landmarks[idx]
        return int(p.x * crop_w), int(p.y * crop_h)

    def distance(i: int, j: int) -> float:
        p1, p2 = landmarks[i], landmarks[j]
        return float(np.hypot((p1.x - p2.x) * crop_w, (p1.y - p2.y) * crop_h))

    forehead_width = distance(103, 332)
    cheekbone_width = distance(234, 454)
    jaw_width = distance(172, 397)
    face_length = distance(10, 152)

    # ── Debug image ────────────────────────────────────────────────────────
    debug_img = crop.copy()
    for lm in landmarks:
        cv2.circle(debug_img, (int(lm.x * crop_w), int(lm.y * crop_h)), 1, (0, 255, 0), -1)

    for idx in [103, 332, 234, 454, 172, 397, 10, 152]:
        px, py = get_xy(idx)
        cv2.circle(debug_img, (px, py), 6, (0, 0, 255), -1)
        cv2.putText(debug_img, str(idx), (px + 5, py - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

    for i, j, color in [
        (103, 332, (255, 0, 0)),
        (234, 454, (0, 255, 255)),
        (172, 397, (255, 255, 0)),
        (10, 152, (255, 0, 255)),
    ]:
        cv2.line(debug_img, get_xy(i), get_xy(j), color, 2)

    debug_path = UPLOAD_DIR / f"{image_id}_landmarks.jpg"
    cv2.imwrite(str(debug_path), debug_img)

    return {
        "face_detected": True,
        "bbox": {"x": x, "y": y, "width": bw, "height": bh},
        "measurements": {
            "forehead_width": round(forehead_width, 1),
            "cheekbone_width": round(cheekbone_width, 1),
            "jaw_width": round(jaw_width, 1),
            "face_length": round(face_length, 1),
        },
    }
