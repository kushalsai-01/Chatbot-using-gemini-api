import { HiPlus, HiXMark, HiTrash, HiSun, HiMoon, HiChatBubbleLeftRight } from "react-icons/hi2";
import { BsStars } from "react-icons/bs";

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 86_400_000) return "Today";
  if (diff < 172_800_000) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Sidebar({ darkMode, setDarkMode, onNewChat, open, onClose, sessions = [], currentSessionId, onSessionSelect }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-[240px] flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--icon-bg)] flex items-center justify-center">
              <BsStars className="w-3.5 h-3.5 text-[var(--icon-text)]" />
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-[var(--text-primary)]">
              Nova AI
            </span>
          </div>

          <button
            onClick={onClose}
            className="md:hidden w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-dim)] transition-all"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[var(--border)] text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-dim)] hover:border-[var(--border-hover)] transition-all duration-200 group"
          >
            <HiPlus className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90" />
            New conversation
          </button>
        </div>

        {/* Session history */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {sessions.length === 0 ? (
            <p className="text-[11px] text-[var(--text-muted)] text-center mt-6 px-3 opacity-60">
              No conversations yet
            </p>
          ) : (
            <div className="space-y-0.5">
              {sessions.map((s) => (
                <button
                  key={s.session_id}
                  onClick={() => onSessionSelect(s.session_id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-150 group ${
                    s.session_id === currentSessionId
                      ? "bg-[var(--accent-dim)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--accent-dim)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <HiChatBubbleLeftRight className="w-3 h-3 mt-0.5 shrink-0 opacity-50" />
                    <div className="min-w-0">
                      <p className="text-[12px] truncate leading-snug">{s.title}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{formatDate(s.created_at)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 space-y-0.5 border-t border-[var(--border)]">
          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-dim)] transition-all duration-200"
          >
            {darkMode ? (
              <><HiSun className="w-3.5 h-3.5" /> Light mode</>
            ) : (
              <><HiMoon className="w-3.5 h-3.5" /> Dark mode</>
            )}
          </button>

          {/* Clear history */}
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <HiTrash className="w-3.5 h-3.5" />
            Clear history
          </button>

          <div className="mt-3 px-3 pb-1">
            <p className="text-[10px] text-[var(--text-muted)] opacity-60 tracking-[0.15em] uppercase">
              Powered by Groq
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
