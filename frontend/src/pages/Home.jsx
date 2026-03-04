import { useState, useCallback } from "react";
import { HiBars3, HiSparkles } from "react-icons/hi2";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import InputBar from "../components/InputBar.jsx";
import { getSessionId, newSession } from "../utils/session.js";
import { sendMessage } from "../api/chat.js";

/**
 * Home — main page layout with premium glassmorphism UI.
 */
export default function Home({ darkMode, setDarkMode }) {
  const [sessionId, setSessionId] = useState(getSessionId);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /** Send a message (from input bar or suggestion click). */
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
    [sessionId],
  );

  /** Start a fresh session. */
  const handleNewChat = useCallback(() => {
    const id = newSession();
    setSessionId(id);
    setMessages([]);
  }, []);

  return (
    <div className="relative flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ── Animated background orbs ─────────────────────────────── */}
      <div className="bg-mesh" />

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNewChat={handleNewChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.04] md:hidden backdrop-blur-xl bg-[var(--surface-1)]/60">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
            aria-label="Open sidebar"
          >
            <HiBars3 className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <HiSparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
              Gemini Chat
            </span>
          </div>
        </header>

        {/* Chat messages — suggestion clicks also trigger handleSend */}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSuggestionClick={handleSend}
        />

        {/* Input bar */}
        <InputBar onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
