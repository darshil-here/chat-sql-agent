"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/components/ui/utils";
import { CopyButton } from "./copy-button";

const FONT_STACK =
  "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";

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
      className={cn("overflow-hidden rounded-xl border", className)}
      style={{
        borderColor: "var(--code-border)",
        backgroundColor: "var(--code-surface)",
        boxShadow: "0 1px 0 0 rgba(255,255,255,0.04) inset",
      }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b px-3 py-1.5"
        style={{ borderColor: "var(--code-border)" }}
      >
        <span className="font-mono text-[10.5px] tracking-[0.08em] text-white/40 uppercase">
          {language}
        </span>
        <CopyButton text={code} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        wrapLongLines
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "12.5px",
          lineHeight: "1.65",
          padding: "12px 14px",
          background: "transparent",
          overflowX: "auto",
        }}
        codeTagProps={{ style: { fontFamily: FONT_STACK } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
