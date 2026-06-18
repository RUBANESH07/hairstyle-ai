from pathlib import Path

BASE_DIR = Path(__file__).parent
UPLOAD_DIR = BASE_DIR.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
DB_PATH = BASE_DIR / "database.db"

SECRET_KEY = "hairstyle-ai-secret-change-in-production"
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

# Default admin seeded on first run
DEFAULT_ADMIN_NAME = "Admin Rubi"
DEFAULT_ADMIN_EMAIL = "adminrubi@gmail.com"
DEFAULT_ADMIN_PASSWORD = "rubi@07"
