import hashlib
import secrets
import sqlite3

from config import DB_PATH, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_NAME, DEFAULT_ADMIN_PASSWORD


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def _hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    h = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
    return f"{salt}:{h}"


def init_db() -> None:
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT    NOT NULL,
            email         TEXT    UNIQUE NOT NULL,
            password_hash TEXT    NOT NULL,
            role          TEXT    NOT NULL DEFAULT 'user',
            created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS analyses (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            image_id    TEXT    NOT NULL,
            face_shape  TEXT,
            confidence  REAL,
            gender      TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    """)
    conn.commit()

    # Add role column if missing (migration for existing DBs)
    cols = [r[1] for r in conn.execute("PRAGMA table_info(users)").fetchall()]
    if "role" not in cols:
        conn.execute("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'")
        conn.commit()

    # Seed default admin if not exists
    existing = conn.execute(
        "SELECT id FROM users WHERE email = ?", (DEFAULT_ADMIN_EMAIL,)
    ).fetchone()

    if not existing:
        conn.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
            (
                DEFAULT_ADMIN_NAME,
                DEFAULT_ADMIN_EMAIL,
                _hash_password(DEFAULT_ADMIN_PASSWORD),
                "admin",
            ),
        )
        conn.commit()
        print(f"[DB] Default admin seeded → {DEFAULT_ADMIN_EMAIL}")

    conn.close()
