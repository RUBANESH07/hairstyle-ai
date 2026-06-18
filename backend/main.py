from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import UPLOAD_DIR
from database import init_db
from routes.auth import router as auth_router
from routes.analyze import router as analyze_router
from routes.history import router as history_router

# ── Initialise database (creates tables + seeds default admin) ─────────────
init_db()

# ── App ────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Hairstyle AI",
    version="1.0.0",
    description="AI-powered face shape detection and hairstyle recommendation API.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded / generated images
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# ── Routers ────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(analyze_router)
app.include_router(history_router)


# ── Health ─────────────────────────────────────────────────────────────────
@app.get("/", tags=["health"])
def root():
    return {"message": "Hairstyle AI Backend Running", "version": "1.0.0"}


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
