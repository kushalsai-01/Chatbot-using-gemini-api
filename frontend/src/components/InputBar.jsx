import { useRef, useEffect } from "react";
import { HiArrowUp } from "react-icons/hi2";

export default function InputBar({ onSend, disabled }) {
  const textareaRef = useRef(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
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
    <div className="border-t border-[var(--border)] bg-[var(--bg-primary)] px-4 sm:px-6 py-4">
      <div className="max-w-3xl mx-auto">
        {/* Input container */}
        <div className="input-glow rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex items-end gap-2 px-4 py-3">
          <textarea
            ref={textareaRef}
            rows={1}
            disabled={disabled}
            onInput={resize}
            onKeyDown={handleKeyDown}
            placeholder="Message Nova..."
            className="flex-1 resize-none bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm outline-none leading-6 max-h-[120px] disabled:opacity-40"
          />

          <button
            onClick={submit}
            disabled={disabled}
            aria-label="Send message"
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
              disabled
                ? "bg-[var(--accent-dim)] text-[var(--text-muted)] cursor-not-allowed"
                : "bg-white text-black hover:bg-white/90 active:scale-90"
            }`}
          >
            {disabled ? (
              <span className="block w-3.5 h-3.5 border-2 border-[var(--text-muted)] border-t-[var(--text-primary)] rounded-full animate-spin" />
            ) : (
              <HiArrowUp className="w-4 h-4 stroke-[0.5]" />
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-[var(--text-muted)] mt-3 select-none">
          Nova can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
