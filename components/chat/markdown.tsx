"use client";

import type { ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

function MarkdownCode({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const language = /language-(\w+)/.exec(className ?? "")?.[1];
  const code = String(children).replace(/\n$/, "");

  if (language) {
    return <CodeBlock code={code} language={language} className="my-3" />;
  }

  return (
    <code className="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-accent-brand ring-1 ring-border-subtle ring-inset">
      {children}
    </code>
  );
}

const components: Components = {
  code: MarkdownCode,
  table: ({ children }) => (
    <div className="scroll-thin my-3 overflow-x-auto rounded-xl border border-border-subtle [&_tr:last-child_td]:border-0">
      <table className="w-full border-collapse text-[13px] tabular-nums">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border-subtle bg-elevated/70 px-3 py-2 text-left text-[10.5px] font-medium tracking-[0.08em] whitespace-nowrap text-text-muted uppercase">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border-subtle px-3 py-2 align-top text-text-secondary">
      {children}
    </td>
  ),
};

export function MessageMarkdown({ children }: { children: string }) {
  return (
    <div
      className={[
        "prose prose-sm dark:prose-invert max-w-none",
        // Paragraphs are the bulk of the answer: comfortable leading, small
        // rhythm, no first/last margins so messages space evenly.
        "prose-p:my-2 prose-p:leading-[1.72] prose-p:text-pretty",
        // Headings in a chat answer should be labels, not page titles.
        "prose-headings:font-semibold prose-headings:tracking-[-0.01em]",
        "prose-h1:text-[17px] prose-h2:text-[16px] prose-h3:text-[15px] prose-h4:text-sm",
        "prose-h1:mt-4 prose-h2:mt-4 prose-h3:mt-4 prose-h4:mt-3",
        "prose-h1:mb-1.5 prose-h2:mb-1.5 prose-h3:mb-1.5 prose-h4:mb-1",
        "prose-strong:font-semibold prose-strong:text-text-primary",
        "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-li:leading-[1.7]",
        "prose-hr:my-4 prose-hr:border-border-subtle",
        "prose-blockquote:my-3 prose-blockquote:border-l-2 prose-blockquote:border-accent-brand/40 prose-blockquote:pl-3 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-text-secondary",
        "prose-a:text-accent-brand prose-a:decoration-accent-brand/40 prose-a:underline-offset-2 hover:prose-a:decoration-accent-brand",
        "prose-code:before:content-none prose-code:after:content-none",
        "[overflow-wrap:anywhere]",
      ].join(" ")}
    >
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </Markdown>
    </div>
  );
}
