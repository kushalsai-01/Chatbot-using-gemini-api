"""
routes/sessions.py — Session management endpoints.

GET /sessions            — list recent sessions (title = first user message)
GET /sessions/{id}/messages — all messages for a session (for restoring chat)
"""

from __future__ import annotations

import logging
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from database import get_db
from models import Message
from schemas import SessionInfo, MessageOut

logger = logging.getLogger(__name__)

router = APIRouter(tags=["sessions"])


@router.get("/sessions", response_model=List[SessionInfo])
def list_sessions(db: Session = Depends(get_db)):
    """
    Return up to 50 recent chat sessions, ordered newest-first.
    The session title is the first user message (truncated to 60 chars).
    """
    # Subquery: earliest created_at per session (user messages only)
    subq = (
        db.query(
            Message.session_id,
            func.min(Message.created_at).label("first_at"),
        )
        .filter(Message.role == "user")
        .group_by(Message.session_id)
        .subquery()
    )

    # Join to retrieve the actual message content
    rows = (
        db.query(Message)
        .join(
            subq,
            (Message.session_id == subq.c.session_id)
            & (Message.created_at == subq.c.first_at),
        )
        .order_by(desc(subq.c.first_at))
        .limit(50)
        .all()
    )

    return [
        SessionInfo(
            session_id=r.session_id,
            title=r.content[:60] + ("…" if len(r.content) > 60 else ""),
            created_at=r.created_at.isoformat(),
        )
        for r in rows
    ]


@router.get("/sessions/{session_id}/messages", response_model=List[MessageOut])
def load_session(session_id: str, db: Session = Depends(get_db)):
    """
    Return all messages for a given session ordered oldest-first,
    so the frontend can restore the full conversation.
    """
    rows = (
        db.query(Message)
        .filter(Message.session_id == session_id)
        .order_by(Message.created_at)
        .all()
    )
    return [MessageOut(role=r.role, content=r.content) for r in rows]
