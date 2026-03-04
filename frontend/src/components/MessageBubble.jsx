import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { HiClipboard, HiCheck } from "react-icons/hi2";

/**
 * MessageBubble — renders a single chat message.
 *
 * @param {{ role: "user"|"assistant", content: string }} props
 */
export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  const isError = role === "error";

  if (isError) {
    return (
      <div className="flex justify-center animate-fade-in my-2">
        <div className="max-w-2xl w-full bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
          ⚠️ {content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in my-1.5`}
    >
      <div
        className={`relative max-w-[80%] md:max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
          isUser
            ? "bg-brand-600 text-white rounded-br-md"
            : "bg-slate-800 text-slate-200 rounded-bl-md border border-slate-700/50"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose-chat">
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
    </div>
  );
}

/* ── Code block with copy button ────────────────────────────────────────── */
function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {/* Language badge + copy button */}
      <div className="flex items-center justify-between bg-slate-900 rounded-t-lg px-4 py-1.5 text-xs text-slate-400 border-b border-slate-700/50">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-slate-200 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <HiCheck className="w-3.5 h-3.5 text-green-400" /> Copied
            </>
          ) : (
            <>
              <HiClipboard className="w-3.5 h-3.5" /> Copy
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        style={atomDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          fontSize: "0.8125rem",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
