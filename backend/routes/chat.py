"""
routes/chat.py — /chat endpoint.

Handles the full request lifecycle:
  1. Validate incoming payload
  2. Fetch conversation history from DB
  3. Generate assistant response via Gemini
  4. Persist both messages
  5. Return the response
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from schemas import ChatRequest, ChatResponse
from services.history import get_history, save_message
from services.gemini import generate_response

logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Send a message and receive an AI response",
)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Main chat endpoint.

    Accepts a session_id and user message, retrieves conversation context,
    queries Gemini, stores both messages, and returns the assistant reply.
    """
    try:
        # 1 — Fetch recent history
        history = get_history(db, request.session_id, limit=12)

        # 2 — Generate assistant response
        assistant_reply = generate_response(history, request.message)

        # 3 — Persist user message
        save_message(db, request.session_id, "user", request.message)

        # 4 — Persist assistant reply
        save_message(db, request.session_id, "assistant", assistant_reply)

        return ChatResponse(response=assistant_reply, session_id=request.session_id)

    except RuntimeError as exc:
        logger.error("Chat processing error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        logger.exception("Unexpected error in /chat: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred. Please try again later.",
        ) from exc
