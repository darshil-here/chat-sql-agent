"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/components/ui/utils";
import { CopyButton } from "./copy-button";

const FONT_STACK =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

export function CodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border-subtle",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border-subtle bg-elevated px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-text-muted">
          {language}
        </span>
        <CopyButton text={code} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "13px",
          lineHeight: "1.5",
          padding: "12px 14px",
          overflowX: "auto",
          background: "#0d0b0c",
        }}
        codeTagProps={{ style: { fontFamily: FONT_STACK } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
