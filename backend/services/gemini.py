"""
services/gemini.py — Hugging Face Inference API integration.

Uses the HuggingFace InferenceClient (chat completions) with a free
pretrained model. Set HF_TOKEN env var to your HuggingFace access token.
"""

from __future__ import annotations

import os
import logging
from typing import List, Dict

from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

HF_TOKEN: str = os.getenv("HF_TOKEN", "")

if not HF_TOKEN:
    raise RuntimeError("HF_TOKEN environment variable is not set")

# ---------------------------------------------------------------------------
# Model — free to use on HuggingFace Inference API
# ---------------------------------------------------------------------------
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.3"

SYSTEM_PROMPT = (
    "You are a helpful, knowledgeable, and friendly AI assistant named Nova. "
    "Respond in well-formatted Markdown. Use code blocks with language "
    "identifiers when providing code. Be concise yet thorough."
)

client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)


def generate_response(history: List[Dict[str, str]], user_message: str) -> str:
    """
    Send conversation history + new user message to HuggingFace and return
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

        response = client.chat_completion(
            messages=messages,
            max_tokens=2048,
            temperature=0.7,
        )

        text = response.choices[0].message.content
        if not text:
            raise RuntimeError("Model returned an empty response.")

        return text

    except Exception as exc:
        logger.exception("HuggingFace API error: %s", exc)
        raise RuntimeError(f"Failed to get response from AI model: {exc}") from exc
