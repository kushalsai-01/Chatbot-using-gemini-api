"""
services/history.py — Chat history persistence layer.

Provides helpers to fetch and store messages in PostgreSQL.
"""

from __future__ import annotations

from typing import List, Dict

from sqlalchemy.orm import Session
from sqlalchemy import desc

from models import Message


def get_history(db: Session, session_id: str, limit: int = 12) -> List[Dict[str, str]]:
    """
    Retrieve the most recent *limit* messages for a session, ordered
    oldest-first so they can be fed directly to the LLM.

    Args:
        db: Active SQLAlchemy session.
        session_id: The UUID session identifier.
        limit: Max number of messages to return (default 12).

    Returns:
        A list of dicts: [{"role": "user"|"assistant", "content": "..."}]
    """
    rows = (
        db.query(Message)
        .filter(Message.session_id == session_id)
        .order_by(desc(Message.created_at))
        .limit(limit)
        .all()
    )
    # Reverse so oldest message comes first
    rows.reverse()
    return [{"role": r.role, "content": r.content} for r in rows]


def save_message(db: Session, session_id: str, role: str, content: str) -> Message:
    """
    Persist a single message to the database.

    Args:
        db: Active SQLAlchemy session.
        session_id: The UUID session identifier.
        role: Either 'user' or 'assistant'.
        content: The message text.

    Returns:
        The created Message ORM instance.
    """
    msg = Message(session_id=session_id, role=role, content=content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
