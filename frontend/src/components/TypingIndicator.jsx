import { BsStars } from "react-icons/bs";

export default function TypingIndicator() {
  return (
    <div className="animate-slide-left py-3">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center mt-0.5">
          <BsStars className="w-3.5 h-3.5 text-[var(--text-secondary)] animate-icon-spin" style={{ animationDuration: "3s" }} />
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5 py-2.5 px-1">
          {[0, 0.15, 0.3].map((delay, i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-typing"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
          <span className="ml-1.5 text-[11px] text-[var(--text-muted)]">Thinking</span>
        </div>
      </div>
    </div>
  );
}
