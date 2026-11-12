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
    <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[13px] text-accent-danger">
      {children}
    </code>
  );
}

const components: Components = {
  code: MarkdownCode,
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-border-subtle">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border-subtle bg-elevated px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border-subtle px-3 py-2 text-text-primary">
      {children}
    </td>
  ),
};

export function MessageMarkdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </Markdown>
    </div>
  );
}
