import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import {
  HiCommandLine,
  HiLightBulb,
  HiPencilSquare,
  HiCpuChip,
} from "react-icons/hi2";
import { BsStars } from "react-icons/bs";

const SUGGESTIONS = [
  { icon: HiCommandLine, label: "Write code", desc: "Python, JS, and more" },
  { icon: HiLightBulb,   label: "Explain",    desc: "Break down concepts" },
  { icon: HiPencilSquare,label: "Draft",       desc: "Emails, essays, docs" },
  { icon: HiCpuChip,     label: "Brainstorm",  desc: "Ideas & strategies" },
];

export default function ChatWindow({ messages, isLoading, onSuggestionClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* ── Empty state ──────────────────────────────────────────────────── */
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 select-none relative overflow-hidden">
        {/* Soft radial spotlight */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.015] blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
          {/* Icon */}
          <div className="relative animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_60px_-15px_rgba(255,255,255,0.15)]">
              <BsStars className="w-7 h-7 text-black" />
            </div>
            <div className="absolute -inset-4 rounded-3xl border border-white/[0.04] animate-icon-spin" style={{ animationDuration: "20s" }} />
          </div>

          {/* Text */}
          <div className="text-center space-y-3 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              What can I help with?
            </h1>
            <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed">
              Ask anything. I can write code, explain concepts, draft content, brainstorm ideas, and more.
            </p>
          </div>

          {/* Suggestion chips */}
          <div
            className="grid grid-cols-2 gap-2.5 w-full animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            {SUGGESTIONS.map(({ icon: Icon, label, desc }) => (
              <button
                key={label}
                onClick={() =>
                  onSuggestionClick?.(
                    label === "Write code"
                      ? "Write a Python fizzbuzz program"
                      : label === "Explain"
                      ? "Explain quantum computing simply"
                      : label === "Draft"
                      ? "Draft a professional email"
                      : "Suggest creative startup ideas"
                  )
                }
                className="group flex items-start gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-hover)] transition-all duration-200 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                  <Icon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[var(--text-primary)] leading-tight">{label}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Messages ─────────────────────────────────────────────────────── */
  return (
    <div className="flex-1 overflow-y-auto py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col gap-1">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} index={i} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
