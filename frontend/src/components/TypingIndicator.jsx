import { HiSparkles } from "react-icons/hi2";

/**
 * TypingIndicator — premium animated thinking indicator.
 */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-message-in my-2">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mr-3 mt-1 shadow-lg shadow-violet-600/20">
        <HiSparkles className="w-4 h-4 text-white animate-spin-slow" />
      </div>

      <div className="glass rounded-2xl rounded-bl-md px-6 py-4 flex items-center gap-2">
        <span
          className="block w-2 h-2 rounded-full bg-violet-400 animate-typing-dot"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="block w-2 h-2 rounded-full bg-violet-400 animate-typing-dot"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="block w-2 h-2 rounded-full bg-violet-400 animate-typing-dot"
          style={{ animationDelay: "0.4s" }}
        />
        <span className="ml-2 text-xs text-slate-500">Thinking...</span>
      </div>
    </div>
  );
}
