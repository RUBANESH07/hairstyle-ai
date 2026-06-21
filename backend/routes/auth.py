from fastapi import APIRouter, HTTPException, Depends

from auth import create_token, hash_password, verify_password, get_current_user
from database import get_db
from models.schemas import LoginRequest, RegisterRequest

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register")
def register(body: RegisterRequest):
    if len(body.name.strip()) < 2:
        raise HTTPException(status_code=400, detail="Name must be at least 2 characters")
    if "@" not in body.email:
        raise HTTPException(status_code=400, detail="Invalid email address")
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    email = body.email.lower().strip()

    conn = get_db()
    existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=409, detail="Email already registered")

    cursor = conn.execute(
        "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, %s) RETURNING id",
        (body.name.strip(), email, hash_password(body.password), "user"),
    )
    conn.commit()
    user_id = cursor.fetchone()["id"]
    conn.close()

    token = create_token(user_id, email)
    return {
        "token": token,
        "user": {"id": user_id, "name": body.name.strip(), "email": email, "role": "user"},
    }


@router.post("/login")
def login(body: LoginRequest):
    email = body.email.lower().strip()

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token(user["id"], user["email"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        },
    }


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {"user": user}
