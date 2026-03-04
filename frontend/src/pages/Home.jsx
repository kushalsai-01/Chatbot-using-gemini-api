import { useState, useCallback } from "react";
import { HiBars3 } from "react-icons/hi2";
import { BsStars } from "react-icons/bs";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import InputBar from "../components/InputBar.jsx";
import { getSessionId, newSession } from "../utils/session.js";
import { sendMessage } from "../api/chat.js";

export default function Home({ darkMode, setDarkMode }) {
  const [sessionId, setSessionId] = useState(getSessionId);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleNewChat = useCallback(() => {
    const id = newSession();
    setSessionId(id);
    setMessages([]);
  }, []);

  return (
    <div className="relative flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="bg-mesh" />

      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNewChat={handleNewChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="relative z-10 flex flex-col flex-1 min-w-0">
        {/* Mobile header */}
        <header className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border)] md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-dim)] transition-all"
          >
            <HiBars3 className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--icon-bg)] flex items-center justify-center">
              <BsStars className="w-3 h-3 text-[var(--icon-text)]" />
            </div>
            <span className="text-[13px] font-semibold tracking-tight">Nova AI</span>
          </div>
        </header>

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSuggestionClick={handleSend}
          darkMode={darkMode}
        />

        <InputBar onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
