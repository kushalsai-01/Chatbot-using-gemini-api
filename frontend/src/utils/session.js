import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "chatbot_session_id";

/**
 * Retrieve the current session ID from localStorage.
 * If none exists, generate a new UUID and store it.
 *
 * @returns {string} A UUID v4 session identifier.
 */
export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Create a brand-new session by generating a fresh UUID,
 * replacing the existing one in localStorage.
 *
 * @returns {string} The new session ID.
 */
export function newSession() {
  const id = uuidv4();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}
