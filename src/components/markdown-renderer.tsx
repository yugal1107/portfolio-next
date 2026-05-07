"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock = ({ children, className }: { children: string; className?: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const language = className ? className.replace(/language-/, "") : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // copy failed
    }
  };

  return (
    <div className="relative group my-8 rounded-xl overflow-hidden shadow-2xl border border-outline-variant/20 bg-[#0a0f1a]">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low/50 border-b border-outline-variant/10">
        <span className="text-xs font-mono text-outline-variant uppercase tracking-wider">{language || "Code"}</span>
        <button
          onClick={handleCopy}
          className="text-outline-variant hover:text-primary transition-colors p-1"
          title="Copy code"
        >
          {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: "1.7",
        }}
        wrapLongLines={true}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: () => null,
        h2: ({ children }) => (
          <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tighter text-on-surface mb-6 mt-10 border-b border-outline-variant/20 pb-4">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-2xl font-headline font-bold text-on-surface mb-4 mt-8">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-lg md:text-xl leading-relaxed font-body text-on-surface-variant mb-6">
            {children}
          </p>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="space-y-3 mb-6 text-on-surface-variant">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-3 mb-6 text-on-surface-variant list-decimal list-inside">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-lg leading-relaxed flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
            <span>{children}</span>
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 bg-surface-container-low/30 rounded-r-xl">
            <p className="text-xl font-headline italic text-on-surface-variant">
              {children}
            </p>
          </blockquote>
        ),
        pre: ({ children }) => {
          const childArray = React.Children.toArray(children);
          const codeChild = childArray[0] as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
          const className = codeChild?.props?.className || "";
          const codeString = codeChild?.props?.children || "";
          return <CodeBlock className={className}>{String(codeString)}</CodeBlock>;
        },
        code: ({ children }) => (
          <code className="bg-surface-container-high px-[0.3em] py-0 rounded-md font-mono text-[0.9em] text-primary/90 leading-none">
            {children}
          </code>
        ),
        hr: () => <hr className="border-outline-variant/20 my-12" />,
        table: ({ children }) => (
          <div className="overflow-x-auto my-8">
            <table className="w-full border-collapse border border-outline-variant/20 rounded-xl">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-surface-container-low">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="border border-outline-variant/20 px-4 py-3 text-left font-bold text-on-surface uppercase tracking-wider text-sm">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-outline-variant/20 px-4 py-3 text-on-surface-variant">
            {children}
          </td>
        ),
        strong: ({ children }) => (
          <strong className="text-on-surface font-bold">
            {children}
          </strong>
        ),
        img: ({ src, alt }) => (
          <div className="my-8 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src || ""} alt={alt || ""} className="w-full object-cover" loading="lazy" />
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
