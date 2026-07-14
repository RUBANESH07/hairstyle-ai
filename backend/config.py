from pathlib import Path

BASE_DIR = Path(__file__).parent
UPLOAD_DIR = BASE_DIR.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# DATABASE_URL = "postgresql://postgres:postgres123@localhost:5432/neondb"
# Live production database (Neon)
DATABASE_URL = "postgresql://neondb_owner:npg_Pv0ehRaOGu7Q@ep-fancy-field-at9s7ex5-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

SECRET_KEY = "hairstyle-ai-secret-change-in-production"
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

# Default admin seeded on first run
DEFAULT_ADMIN_NAME = "Admin"
DEFAULT_ADMIN_EMAIL = "admin@gmail.com"
DEFAULT_ADMIN_PASSWORD = "rubi@07"
