import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import { HiSparkles } from "react-icons/hi2";

/**
 * ChatWindow — scrollable container of messages.
 *
 * @param {{ messages: Array<{role: string, content: string}>, isLoading: boolean }} props
 */
export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom whenever messages change or loading state flips
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Empty state
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6 select-none">
        <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/20 flex items-center justify-center">
          <HiSparkles className="w-8 h-8 text-brand-400" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-200">
          Gemini Chatbot
        </h2>
        <p className="text-slate-500 max-w-md text-sm leading-relaxed">
          Ask me anything — I can help with code, writing, math, ideas, and
          more. Your conversation is saved for this session.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {[
            "Explain quantum computing",
            "Write a Python fizzbuzz",
            "Suggest startup ideas",
            "Debug my React code",
          ].map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-400"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-1">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
