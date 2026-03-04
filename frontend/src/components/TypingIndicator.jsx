/**
 * TypingIndicator — three bouncing dots displayed while the AI is thinking.
 */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in my-1.5">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-md px-5 py-3.5 flex items-center gap-1.5 shadow-md">
        <span
          className="block w-2 h-2 rounded-full bg-brand-400 animate-bounce-dot"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="block w-2 h-2 rounded-full bg-brand-400 animate-bounce-dot"
          style={{ animationDelay: "0.16s" }}
        />
        <span
          className="block w-2 h-2 rounded-full bg-brand-400 animate-bounce-dot"
          style={{ animationDelay: "0.32s" }}
        />
      </div>
    </div>
  );
}
