"""
database.py — SQLAlchemy engine & session factory.

Reads DATABASE_URL from the environment and creates a connection-pooled engine
suitable for synchronous FastAPI usage with psycopg2.

IMPORTANT: For Render.com free tier, use Supabase **Connection Pooler** URL
(IPv4, port 6543) instead of the direct connection (port 5432).
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")

# Supabase requires SSL; append sslmode if not already present
if "supabase.co" in DATABASE_URL and "sslmode" not in DATABASE_URL:
    separator = "&" if "?" in DATABASE_URL else "?"
    DATABASE_URL = f"{DATABASE_URL}{separator}sslmode=require"

# When using Supabase connection pooler (PgBouncer) with prepared_statement_cache_size,
# we must disable statement caching to avoid prepared statement errors
connect_args = {}
if "pooler.supabase.com" in DATABASE_URL:
    connect_args["options"] = "-c statement_timeout=60000"

engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
