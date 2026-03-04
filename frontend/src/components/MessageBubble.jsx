import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { HiClipboard, HiCheck, HiSparkles } from "react-icons/hi2";

/**
 * MessageBubble — renders a single chat message with premium styling.
 */
export default function MessageBubble({ role, content, index = 0 }) {
  const isUser = role === "user";
  const isError = role === "error";

  if (isError) {
    return (
      <div
        className="flex justify-center animate-message-in my-3"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="max-w-2xl w-full glass border-red-500/20 text-red-300 rounded-2xl px-5 py-4 text-sm flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <span>{content}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-message-in my-2`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mr-3 mt-1 shadow-lg shadow-violet-600/20">
          <HiSparkles className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={`relative max-w-[82%] md:max-w-2xl rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white px-5 py-3.5 rounded-br-md shadow-lg shadow-violet-600/15"
            : "glass px-5 py-4 rounded-bl-md"
        }`}
      >
        {/* Shimmer on user messages */}
        {isUser && (
          <div className="absolute inset-0 rounded-2xl rounded-br-md overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                 style={{ animation: "shimmer 3s infinite" }} />
          </div>
        )}

        {isUser ? (
          <p className="whitespace-pre-wrap relative z-10">{content}</p>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match) {
                    return (
                      <CodeBlock language={match[1]}>
                        {String(children).replace(/\n$/, "")}
                      </CodeBlock>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center ml-3 mt-1 shadow-lg text-xs font-bold text-white">
          U
        </div>
      )}
    </div>
  );
}

/* ── Premium Code Block ─────────────────────────────────────────────────── */
function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-white/[0.06]">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#1a1a2e] px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-violet-300/70 font-medium ml-2">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-all duration-200 px-2 py-1 rounded-md hover:bg-white/5"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <HiCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <HiClipboard className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          background: "#0f0f1a",
          borderRadius: 0,
          fontSize: "0.8rem",
          padding: "1rem 1.25rem",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
