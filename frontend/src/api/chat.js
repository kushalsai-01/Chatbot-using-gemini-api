import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 60_000, // 60 s — LLM responses can be slow
  headers: { "Content-Type": "application/json" },
});

/**
 * Send a user message to the backend and return the assistant reply.
 *
 * @param {string} sessionId - UUID session identifier.
 * @param {string} message   - The user's message text.
 * @returns {Promise<string>} Assistant response text.
 * @throws {Error} If the request fails.
 */
export async function sendMessage(sessionId, message) {
  try {
    const { data } = await client.post("/chat", {
      session_id: sessionId,
      message,
    });
    return data.response;
  } catch (err) {
    if (err.response) {
      const detail = err.response.data?.detail || err.response.statusText;
      throw new Error(`Server error (${err.response.status}): ${detail}`);
    }
    if (err.request) {
      throw new Error(
        "Unable to reach the server. Please check your connection."
      );
    }
    throw err;
  }
}

/**
 * Hit the /health endpoint.
 *
 * @returns {Promise<{status: string}>}
 */
export async function healthCheck() {
  const { data } = await client.get("/health");
  return data;
}
