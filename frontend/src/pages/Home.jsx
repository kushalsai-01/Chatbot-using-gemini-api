import { useState, useCallback } from "react";
import { HiBars3 } from "react-icons/hi2";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import InputBar from "../components/InputBar.jsx";
import { getSessionId, newSession } from "../utils/session.js";
import { sendMessage } from "../api/chat.js";

/**
 * Home — main page layout.
 * Manages all chat state and orchestrates sidebar, messages, and input.
 *
 * @param {{ darkMode: boolean, setDarkMode: (v: boolean) => void }} props
 */
export default function Home({ darkMode, setDarkMode }) {
  const [sessionId, setSessionId] = useState(getSessionId);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /**
   * Handle sending a user message:
   *  1. Optimistically append user bubble
   *  2. Call backend
   *  3. Append assistant bubble (or error)
   */
  const handleSend = useCallback(
    async (text) => {
      const userMsg = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const reply = await sendMessage(sessionId, text);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: "error", content: err.message || "Something went wrong." },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId]
  );

  /** Start a fresh session. */
  const handleNewChat = useCallback(() => {
    const id = newSession();
    setSessionId(id);
    setMessages([]);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNewChat={handleNewChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar (mobile hamburger) */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/50 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-slate-200"
            aria-label="Open sidebar"
          >
            <HiBars3 className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-slate-300">
            Gemini Chat
          </span>
        </header>

        {/* Chat messages */}
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* Input */}
        <InputBar onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
