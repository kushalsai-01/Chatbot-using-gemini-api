import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { HiClipboard, HiCheck } from "react-icons/hi2";
import { BsStars } from "react-icons/bs";

export default function MessageBubble({ role, content, index = 0, darkMode = true }) {
  const isUser = role === "user";
  const isError = role === "error";

  /* ── Error state ──────────────────────────────────────────────────── */
  if (isError) {
    return (
      <div
        className="animate-fade-up py-3"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        <div className="max-w-3xl mx-auto flex items-start gap-3 px-1">
          <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs">⚠️</span>
          </div>
          <p className="text-sm text-red-400/90 leading-relaxed pt-0.5">{content}</p>
        </div>
      </div>
    );
  }

  /* ── User message ─────────────────────────────────────────────────── */
  if (isUser) {
    return (
      <div
        className="animate-slide-right py-3"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        <div className="flex justify-end">
          <div className="max-w-[80%] md:max-w-xl px-4 py-3 rounded-2xl rounded-br-md bg-[var(--user-bubble-bg)] text-[var(--user-bubble-text)] text-sm leading-relaxed">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Assistant message ────────────────────────────────────────────── */
  return (
    <div
      className="animate-slide-left py-3"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center mt-0.5">
          <BsStars className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 max-w-2xl">
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match) {
                    return (
                      <CodeBlock language={match[1]} darkMode={darkMode}>
                        {String(children).replace(/\n$/, "")}
                      </CodeBlock>
                    );
                  }
                  return <code className={className} {...props}>{children}</code>;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Code Block ─────────────────────────────────────────────────────────── */
function CodeBlock({ language, children, darkMode = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--code-bg)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
        <div className="flex items-center gap-2 text-[11px]">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
            <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
            <span className="w-2 h-2 rounded-full bg-[#28CA42]" />
          </div>
          <span className="text-[var(--text-muted)] font-medium ml-1">{language}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-2 py-1 rounded hover:bg-[var(--accent-dim)]"
        >
          {copied ? (
            <>
              <HiCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <HiClipboard className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        style={darkMode ? oneDark : oneLight}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          background: darkMode ? '#0D0D0D' : '#F5F5F5',
          borderRadius: 0,
          fontSize: '0.8rem',
          padding: '1rem 1.25rem',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
