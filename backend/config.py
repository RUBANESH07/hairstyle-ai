import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

UPLOAD_DIR = BASE_DIR.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


def _required(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name} (see backend/.env.example)")
    return value


DATABASE_URL = _required("DATABASE_URL")
SECRET_KEY = _required("SECRET_KEY")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days

BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:8000").rstrip("/")
CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",") if o.strip()]

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_IMAGE_SIDE = 1024             # downscale before analysis
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
DEBUG_IMAGES = os.environ.get("DEBUG_IMAGES", "0") == "1"

# Optional admin seeded on first run (skipped when the password is empty)
DEFAULT_ADMIN_NAME = "Admin"
DEFAULT_ADMIN_EMAIL = os.environ.get("DEFAULT_ADMIN_EMAIL", "")
DEFAULT_ADMIN_PASSWORD = os.environ.get("DEFAULT_ADMIN_PASSWORD", "")
