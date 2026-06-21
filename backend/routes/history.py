from fastapi import APIRouter, Depends

from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/api", tags=["history"])


@router.get("/history")
def get_history(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute(
        """
        SELECT id, image_id, face_shape, confidence, gender, created_at
        FROM face_analysis
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 20
        """,
        (user["id"],),
    ).fetchall()
    conn.close()
    return {"history": [dict(r) for r in rows]}
