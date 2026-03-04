import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import { HiSparkles, HiCodeBracket, HiLightBulb, HiPencilSquare, HiCpuChip } from "react-icons/hi2";

/**
 * ChatWindow — premium scrollable chat container.
 */
export default function ChatWindow({ messages, isLoading, onSuggestionClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Premium Empty State ──────────────────────────────────────────────
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 select-none relative">
        {/* Decorative gradient orb */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-violet-600/10 to-indigo-500/5 blur-3xl animate-hero-glow pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg">
          {/* Logo animation */}
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-600/30 animate-float">
              <HiSparkles className="w-10 h-10 text-white" />
            </div>
            {/* Orbiting ring */}
            <div className="absolute -inset-3 rounded-full border border-violet-500/10 animate-spin-slow" />
            <div className="absolute -inset-6 rounded-full border border-violet-500/5 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "15s" }} />
          </div>

          <div className="text-center space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-white via-violet-200 to-indigo-200 bg-clip-text text-transparent">
                Gemini Chatbot
              </span>
            </h1>
            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed">
              Powered by Google Gemini AI. Ask me anything — code, ideas, writing, math, and more.
            </p>
          </div>

          {/* Suggestion cards */}
          <div className="grid grid-cols-2 gap-3 w-full mt-2 animate-slide-up" style={{ animationDelay: "0.25s" }}>
            {[
              { icon: HiCodeBracket, text: "Write a Python fizzbuzz", color: "from-blue-500/10 to-cyan-500/10 border-blue-500/10 hover:border-blue-500/30" },
              { icon: HiLightBulb, text: "Explain quantum computing", color: "from-amber-500/10 to-orange-500/10 border-amber-500/10 hover:border-amber-500/30" },
              { icon: HiPencilSquare, text: "Draft a professional email", color: "from-emerald-500/10 to-green-500/10 border-emerald-500/10 hover:border-emerald-500/30" },
              { icon: HiCpuChip, text: "Suggest startup ideas", color: "from-violet-500/10 to-purple-500/10 border-violet-500/10 hover:border-violet-500/30" },
            ].map(({ icon: Icon, text, color }) => (
              <button
                key={text}
                onClick={() => onSuggestionClick?.(text)}
                className={`card-3d flex items-start gap-3 p-4 rounded-2xl border bg-gradient-to-br ${color} text-left transition-all duration-300 group`}
              >
                <Icon className="w-5 h-5 text-[var(--text-secondary)] mt-0.5 flex-shrink-0 group-hover:text-white transition-colors" />
                <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-relaxed">
                  {text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Messages ─────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-1">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} index={i} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
