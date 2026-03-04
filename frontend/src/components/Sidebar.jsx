import {
  HiPlus,
  HiSun,
  HiMoon,
  HiXMark,
  HiSparkles,
  HiTrash,
} from "react-icons/hi2";

/**
 * Sidebar — premium glassmorphism sidebar with branding.
 */
export default function Sidebar({ darkMode, setDarkMode, onNewChat, open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-[260px] bg-[var(--surface-2)] border-r border-white/[0.04] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
            <HiSparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
              Gemini Chat
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">AI Assistant</span>
          </div>

          <button
            onClick={onClose}
            className="ml-auto md:hidden w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
            aria-label="Close sidebar"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>

        {/* ── New Chat Button ────────────────────────────────────────── */}
        <div className="px-4 pt-5">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.06] text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-300 group"
          >
            <HiPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            New Chat
          </button>
        </div>

        {/* ── Spacer ─────────────────────────────────────────────────── */}
        <div className="flex-1" />

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="px-4 pb-5 flex flex-col gap-1.5">
          {/* Clear chat */}
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <HiTrash className="w-4 h-4" />
            Clear History
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition-all duration-200"
          >
            {darkMode ? (
              <>
                <HiSun className="w-4 h-4" /> Light Mode
              </>
            ) : (
              <>
                <HiMoon className="w-4 h-4" /> Dark Mode
              </>
            )}
          </button>

          {/* Branding */}
          <div className="mt-2 pt-3 border-t border-white/[0.04] text-center">
            <p className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
              Powered by Gemini
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
