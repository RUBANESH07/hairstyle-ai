import hashlib
import secrets

import psycopg2
import psycopg2.extras

from config import DATABASE_URL, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_NAME, DEFAULT_ADMIN_PASSWORD


class DBConnection:
    """Thin wrapper around psycopg2 that mimics the sqlite3 connection API."""

    def __init__(self, conn):
        self._conn = conn

    def execute(self, query: str, params=None):
        query = query.replace("?", "%s")
        cur = self._conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(query, params)
        return cur

    def commit(self):
        self._conn.commit()

    def close(self):
        self._conn.close()


def get_db() -> DBConnection:
    conn = psycopg2.connect(DATABASE_URL)
    return DBConnection(conn)


def _hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    h = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
    return f"{salt}:{h}"


def init_db() -> None:
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id            SERIAL PRIMARY KEY,
            name          TEXT    NOT NULL,
            email         TEXT    UNIQUE NOT NULL,
            password_hash TEXT    NOT NULL,
            role          TEXT    NOT NULL DEFAULT 'user',
            created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS uploaded_images (
            id          SERIAL PRIMARY KEY,
            user_id     INTEGER NOT NULL REFERENCES users(id),
            image_id    TEXT    NOT NULL UNIQUE,
            filename    TEXT,
            file_path   TEXT,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS face_analysis (
            id          SERIAL PRIMARY KEY,
            user_id     INTEGER NOT NULL REFERENCES users(id),
            image_id    TEXT    NOT NULL,
            face_shape  TEXT,
            confidence  REAL,
            gender      TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS hairstyles (
            id          SERIAL PRIMARY KEY,
            face_shape  TEXT    NOT NULL,
            gender      TEXT    NOT NULL,
            name        TEXT    NOT NULL,
            description TEXT,
            image_url   TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()

    existing = conn.execute(
        "SELECT id FROM users WHERE email = %s", (DEFAULT_ADMIN_EMAIL,)
    ).fetchone()

    if not existing:
        conn.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, %s)",
            (DEFAULT_ADMIN_NAME, DEFAULT_ADMIN_EMAIL, _hash_password(DEFAULT_ADMIN_PASSWORD), "admin"),
        )
        conn.commit()
        print(f"[DB] Default admin seeded → {DEFAULT_ADMIN_EMAIL}")

    conn.close()
