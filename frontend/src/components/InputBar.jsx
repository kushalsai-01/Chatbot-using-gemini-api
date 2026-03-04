import { useRef, useEffect } from "react";
import { HiPaperAirplane } from "react-icons/hi2";

/**
 * InputBar — premium auto-resizing input with glow effects.
 */
export default function InputBar({ onSend, disabled }) {
  const textareaRef = useRef(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 5 * 24;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  };

  useEffect(resize, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const val = textareaRef.current?.value.trim();
    if (!val || disabled) return;
    onSend(val);
    textareaRef.current.value = "";
    resize();
  };

  return (
    <div className="relative border-t border-white/[0.04] bg-[var(--surface-1)]/80 backdrop-blur-xl px-3 sm:px-6 py-4">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-3xl mx-auto">
        <div className="relative glow-input rounded-2xl transition-all duration-300">
          {/* Input container */}
          <div className="flex items-end gap-3 glass-strong rounded-2xl px-4 py-3">
            <textarea
              ref={textareaRef}
              rows={1}
              disabled={disabled}
              onInput={resize}
              onKeyDown={handleKeyDown}
              placeholder="Message Gemini..."
              className="flex-1 resize-none bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm outline-none leading-6 max-h-32 disabled:opacity-40"
            />

            <button
              onClick={submit}
              disabled={disabled}
              aria-label="Send message"
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                disabled
                  ? "bg-white/5 text-white/20 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-600/25 active:scale-90"
              }`}
            >
              {disabled ? (
                <span className="block w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              ) : (
                <HiPaperAirplane className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-[var(--text-muted)] mt-3 select-none tracking-wide">
          Gemini can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
