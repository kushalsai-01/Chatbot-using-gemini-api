"""
schemas.py — Pydantic request / response models for the chat API.
"""

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Incoming chat payload from the frontend."""

    session_id: str = Field(..., min_length=1, description="UUID session identifier")
    message: str = Field(..., min_length=1, description="User's message text")


class ChatResponse(BaseModel):
    """Response returned to the frontend."""

    response: str = Field(..., description="Assistant reply text")
    session_id: str = Field(..., description="Echo of the session identifier")


class HealthResponse(BaseModel):
    """Health-check response."""

    status: str = "ok"
