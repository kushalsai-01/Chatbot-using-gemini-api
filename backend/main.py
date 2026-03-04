"""
main.py — FastAPI application entry-point.

Sets up CORS, includes routers, and provides a health-check endpoint.
"""

from __future__ import annotations

import os
import logging

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from schemas import HealthResponse
from routes.chat import router as chat_router

# ---------------------------------------------------------------------------
# Bootstrap
# ---------------------------------------------------------------------------
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Gemini Chatbot API",
    description="Backend API for the Gemini-powered chatbot",
    version="1.0.0",
)

# CORS — allow the configured frontend origins
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(chat_router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", response_model=HealthResponse, tags=["system"])
def health():
    """
    Lightweight health-check endpoint used by deployment platforms.
    """
    return HealthResponse(status="ok")


# ---------------------------------------------------------------------------
# Startup event — verify DB connectivity
# ---------------------------------------------------------------------------
@app.on_event("startup")
def on_startup():
    """Verify that the database is reachable on startup."""
    try:
        with engine.connect() as conn:
            conn.execute(
                __import__("sqlalchemy").text("SELECT 1")
            )
        logger.info("✓ Database connection verified")
    except Exception as exc:
        logger.error("✗ Database connection failed: %s", exc)
        # Don't crash — the app can still serve /health for diagnostics
