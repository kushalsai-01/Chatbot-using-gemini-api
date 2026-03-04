import {
  HiPlus,
  HiSun,
  HiMoon,
  HiXMark,
  HiSparkles,
} from "react-icons/hi2";

/**
 * Sidebar — branding, new-chat button, dark-mode toggle.
 *
 * @param {{ darkMode: boolean, setDarkMode: (v: boolean) => void, onNewChat: () => void, open: boolean, onClose: () => void }} props
 */
export default function Sidebar({ darkMode, setDarkMode, onNewChat, open, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700/50 flex flex-col transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-700/50">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <HiSparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-semibold text-slate-100 tracking-tight">
            Gemini Chat
          </span>

          {/* Close on mobile */}
          <button
            onClick={onClose}
            className="ml-auto md:hidden text-slate-500 hover:text-slate-300"
            aria-label="Close sidebar"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 pt-4">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-600/50 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 transition-colors"
          >
            <HiPlus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer controls */}
        <div className="px-3 pb-4 flex flex-col gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-700/60 hover:text-slate-200 transition-colors"
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

          <p className="text-[11px] text-slate-600 text-center">
            v1.0.0 &middot; Built with Gemini
          </p>
        </div>
      </aside>
    </>
  );
}
