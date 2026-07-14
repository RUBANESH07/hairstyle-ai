import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from auth import get_current_user
from config import ALLOWED_EXTENSIONS, MAX_FILE_SIZE, UPLOAD_DIR
from database import get_db
from services.face_analysis import run_analysis
from services.face_shape import FACE_SHAPE_INFO, classify_shape
from services.recommendation import get_recommendations

router = APIRouter(prefix="/api", tags=["analyze"])


@router.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    gender: str = Form("female"),
    user: dict = Depends(get_current_user),
):
    # ── Validate file ──────────────────────────────────────────────────────
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG and PNG files are allowed",
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Maximum file size is 10 MB")

    # ── Save original ──────────────────────────────────────────────────────
    image_id = str(uuid.uuid4())
    image_path = UPLOAD_DIR / f"{image_id}{ext}"
    image_path.write_bytes(content)

    # ── Face analysis ──────────────────────────────────────────────────────
    analysis = run_analysis(image_id, image_path)

    if not analysis.get("face_detected"):
        return analysis  # {"face_detected": False, "message": "..."}

    measurements = analysis["measurements"]
    face_shape, confidence = classify_shape(
        fw=measurements["forehead_width"],
        cw=measurements["cheekbone_width"],
        jw=measurements["jaw_width"],
        fl=measurements["face_length"],
    )

    # ── Persist result ─────────────────────────────────────────────────────
    gender_key = gender.lower() if gender.lower() in ("male", "female") else "female"

    conn = get_db()
    conn.execute(
        "INSERT INTO uploaded_images (user_id, image_id, filename, file_path, gender) VALUES (?, ?, ?, ?, ?)",
        (user["id"], image_id, file.filename, str(image_path), gender_key),
    )
    conn.execute(
        "INSERT INTO face_analysis (user_id, image_id, face_shape, confidence, gender) VALUES (?, ?, ?, ?, ?)",
        (user["id"], image_id, face_shape, confidence, gender_key),
    )
    conn.commit()
    conn.close()

    # ── Build response ─────────────────────────────────────────────────────
    shape_info = FACE_SHAPE_INFO.get(face_shape, FACE_SHAPE_INFO["Oval"])

    return {
        "face_detected": True,
        "image_id": image_id,
        "gender": gender_key,
        "debug_image_url": f"http://127.0.0.1:8000/uploads/{image_id}_landmarks.jpg",
        "face_crop_url": f"http://127.0.0.1:8000/uploads/{image_id}_face.jpg",
        "bbox": analysis["bbox"],
        "measurements": measurements,
        "face_shape": face_shape,
        "confidence": confidence,
        "shape_description": shape_info["description"],
        "shape_tip": shape_info["tip"],
        "recommendations": get_recommendations(face_shape, gender_key),
    }
