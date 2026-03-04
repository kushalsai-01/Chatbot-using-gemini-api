"""
services/gemini.py — Google Gemini API integration.

Initialises the Gemini client and exposes a function to generate a
chat response given conversation history.
"""

from __future__ import annotations

import os
import logging
from typing import List, Dict

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=GEMINI_API_KEY)

# ---------------------------------------------------------------------------
# Model configuration
# ---------------------------------------------------------------------------
GENERATION_CONFIG = genai.types.GenerationConfig(
    temperature=0.7,
    top_p=0.95,
    top_k=40,
    max_output_tokens=8192,
)

SAFETY_SETTINGS = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

SYSTEM_INSTRUCTION = (
    "You are a helpful, knowledgeable, and friendly AI assistant. "
    "Respond in well-formatted Markdown. Use code blocks with language "
    "identifiers when providing code. Be concise yet thorough."
)

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=GENERATION_CONFIG,
    safety_settings=SAFETY_SETTINGS,
    system_instruction=SYSTEM_INSTRUCTION,
)


def _build_gemini_history(history: List[Dict[str, str]]) -> list:
    """
    Convert our internal history format to Gemini SDK format.

    Args:
        history: List of {"role": "user"|"assistant", "content": "..."}

    Returns:
        List of {"role": "user"|"model", "parts": [{"text": "..."}]}
    """
    gemini_history = []
    for msg in history:
        role = "model" if msg["role"] == "assistant" else "user"
        gemini_history.append({"role": role, "parts": [{"text": msg["content"]}]})
    return gemini_history


def generate_response(history: List[Dict[str, str]], user_message: str) -> str:
    """
    Send conversation history + new user message to Gemini and return the
    assistant's reply.

    Args:
        history: Previous messages in [{"role": ..., "content": ...}] format.
        user_message: The latest user message.

    Returns:
        The model's text response.

    Raises:
        RuntimeError: If the Gemini API returns an error or empty response.
    """
    try:
        gemini_history = _build_gemini_history(history)
        chat = model.start_chat(history=gemini_history)
        response = chat.send_message(user_message)

        if not response or not response.text:
            raise RuntimeError("Gemini returned an empty response.")

        return response.text

    except Exception as exc:
        logger.exception("Gemini API error: %s", exc)
        raise RuntimeError(f"Failed to get response from Gemini: {exc}") from exc
