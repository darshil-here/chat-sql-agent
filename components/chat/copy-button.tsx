"use client";

import { useEffect, useRef, useState } from "react";

const COPIED_FEEDBACK_MS = 1500;

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
      className="cursor-pointer rounded bg-background/70 px-2 py-1 text-[11px] text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
