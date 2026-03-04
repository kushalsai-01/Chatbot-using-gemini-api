"""
services/gemini.py — Groq Inference API integration.

Uses the Groq client (OpenAI-compatible) with a free fast model.
Set GROQ_API_KEY env var to your Groq API key (console.groq.com).
"""

from __future__ import annotations

import os
import logging
from typing import List, Dict

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY environment variable is not set")

# ---------------------------------------------------------------------------
# Free, fast Groq-hosted model
# ---------------------------------------------------------------------------
MODEL_ID = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = (
    "You are a helpful, knowledgeable, and friendly AI assistant named Nova. "
    "Respond in well-formatted Markdown. Use code blocks with language "
    "identifiers when providing code. Be concise yet thorough."
)

client = Groq(api_key=GROQ_API_KEY)


def generate_response(history: List[Dict[str, str]], user_message: str) -> str:
    """
    Send conversation history + new user message to Groq and return
    the assistant's reply.

    Args:
        history: Previous messages in [{"role": ..., "content": ...}] format.
        user_message: The latest user message.

    Returns:
        The model's text response.

    Raises:
        RuntimeError: On API errors or empty responses.
    """
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        for msg in history:
            role = "assistant" if msg["role"] == "assistant" else "user"
            messages.append({"role": role, "content": msg["content"]})

        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=messages,
            max_tokens=2048,
            temperature=0.7,
        )

        text = response.choices[0].message.content
        if not text:
            raise RuntimeError("Model returned an empty response.")

        return text

    except Exception as exc:
        logger.exception("Groq API error: %s", exc)
        raise RuntimeError(f"Failed to get response from AI model: {exc}") from exc
