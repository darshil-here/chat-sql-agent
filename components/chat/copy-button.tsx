"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/components/ui/utils";

const COPIED_FEEDBACK_MS = 1500;

const iconTransition =
  "absolute size-3.5 transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  async function copy() {
    const ok = await navigator.clipboard.writeText(text).then(
      () => true,
      () => false,
    );
    if (!ok) return;

    setCopied(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-white/50 transition-[background-color,color] duration-150 ease-out outline-none hover:bg-white/10 hover:text-white/85 focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.96] motion-reduce:active:scale-100"
      aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
    >
      <span aria-hidden className="relative grid size-3.5 place-items-center">
        <Check
          className={cn(
            iconTransition,
            copied
              ? "scale-100 opacity-100 blur-none"
              : "scale-[0.25] opacity-0 blur-[4px]",
          )}
        />
        <Copy
          className={cn(
            iconTransition,
            copied
              ? "scale-[0.25] opacity-0 blur-[4px]"
              : "scale-100 opacity-100 blur-none",
          )}
        />
      </span>
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
