import os
from pathlib import Path

try:  # optional: load backend/.env for local development
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass

BASE_DIR = Path(__file__).parent
UPLOAD_DIR = BASE_DIR.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Environment variables win when set (recommended for production);
# otherwise fall back to the previous Neon configuration so deploys keep working.
# DATABASE_URL = "postgresql://postgres:postgres123@localhost:5432/neondb"
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_Pv0ehRaOGu7Q@ep-fancy-field-at9s7ex5-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)

SECRET_KEY = os.environ.get("SECRET_KEY", "hairstyle-ai-secret-change-in-production")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days

# Public base URL used for image links (Render provides RENDER_EXTERNAL_URL automatically)
BASE_URL = (
    os.environ.get("BASE_URL")
    or os.environ.get("RENDER_EXTERNAL_URL")
    or "http://127.0.0.1:8000"
).rstrip("/")

# Allowed frontend origins, comma separated. Defaults to "*" (same as before);
# set CORS_ORIGINS to your frontend URL to lock it down.
CORS_ORIGINS = [
    o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",") if o.strip()
]

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_IMAGE_SIDE = 1024             # downscale before analysis
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
DEBUG_IMAGES = os.environ.get("DEBUG_IMAGES", "0") == "1"

# Default admin seeded on first run (same as before; override with env vars)
DEFAULT_ADMIN_NAME = "Admin"
DEFAULT_ADMIN_EMAIL = os.environ.get("DEFAULT_ADMIN_EMAIL", "admin@gmail.com")
DEFAULT_ADMIN_PASSWORD = os.environ.get("DEFAULT_ADMIN_PASSWORD", "rubi@07")
