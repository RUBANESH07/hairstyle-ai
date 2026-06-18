import hashlib
import secrets
from datetime import datetime, timedelta

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from config import ALGORITHM, SECRET_KEY, TOKEN_EXPIRE_HOURS
from database import get_db

bearer_scheme = HTTPBearer()


# ── Password helpers ───────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    h = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
    return f"{salt}:{h}"


def verify_password(password: str, stored: str) -> bool:
    parts = stored.split(":", 1)
    if len(parts) != 2:
        return False
    salt, h = parts
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest() == h


# ── JWT helpers ────────────────────────────────────────────────────────────

def create_token(user_id: int, email: str) -> str:
    exp = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode(
        {"sub": str(user_id), "email": email, "exp": exp},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# ── Dependency ─────────────────────────────────────────────────────────────

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    conn = get_db()
    user = conn.execute(
        "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
        (user_id,),
    ).fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return dict(user)
