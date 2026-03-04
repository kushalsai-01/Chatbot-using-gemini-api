import { useRef, useEffect } from "react";
import { HiPaperAirplane } from "react-icons/hi2";

/**
 * InputBar — auto-resizing textarea + send button.
 *
 * @param {{ onSend: (msg: string) => void, disabled: boolean }} props
 */
export default function InputBar({ onSend, disabled }) {
  const textareaRef = useRef(null);

  /** Auto-resize the textarea up to 5 lines. */
  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 5 * 24; // ~5 lines
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
    <div className="border-t border-slate-700/60 bg-slate-900/80 backdrop-blur-md px-3 sm:px-6 py-3">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            disabled={disabled}
            onInput={resize}
            onKeyDown={handleKeyDown}
            placeholder="Send a message…"
            className="w-full resize-none rounded-xl bg-slate-800 border border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 text-slate-100 placeholder-slate-500 px-4 py-3 pr-12 text-sm outline-none transition-all disabled:opacity-50"
          />
        </div>

        <button
          onClick={submit}
          disabled={disabled}
          aria-label="Send message"
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 transition-all text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {disabled ? (
            <span className="block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <HiPaperAirplane className="w-4 h-4" />
          )}
        </button>
      </div>

      <p className="text-center text-[11px] text-slate-600 mt-2 select-none">
        Powered by Google Gemini — responses may be inaccurate
      </p>
    </div>
  );
}
