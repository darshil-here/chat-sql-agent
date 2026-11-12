"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/ui/utils";

interface ComposerProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  error: string | null;
  dryRun: boolean;
  onToggleDryRun: () => void;
}

export function Composer({
  onSubmit,
  isLoading,
  error,
  dryRun,
  onToggleDryRun,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  function submit() {
    const message = value.trim();
    if (!message || isLoading) return;

    onSubmit(message);
    setValue("");
  }

  return (
    <div className="flex justify-center px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="w-full max-w-3xl">
        {error && (
          <div
            role="alert"
            className="mb-2 rounded-lg border border-accent-danger/25 bg-accent-danger/10 px-3 py-2 text-center text-xs text-accent-danger"
          >
            {error}
          </div>
        )}
        {dryRun && (
          <div className="mb-2 flex items-center justify-center gap-1.5 rounded-lg border border-border-subtle bg-elevated/70 px-3 py-1.5 text-center text-[11px] text-text-secondary">
            <FlaskConical className="size-3 text-accent-brand" aria-hidden />
            Dry Run mode active. Only SQL will be shown, nothing runs.
          </div>
        )}

        <div
          className={cn(
            "flex items-end gap-2 rounded-2xl border border-border-subtle bg-composer p-2.5 ps-4 shadow-soft backdrop-blur-xl",
            "transition-[border-color,box-shadow] duration-200 ease-out",
            "focus-within:border-accent-focus/45 focus-within:ring-2 focus-within:ring-accent-focus/20 focus-within:shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
            "dark:focus-within:shadow-[0_10px_30px_rgba(0,0,0,0.4)]",
          )}
        >
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="Ask about your database..."
            disabled={isLoading}
            className="max-h-[200px] min-h-8 flex-1 resize-none border-0 bg-transparent p-0 py-1 text-base leading-6 sm:text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
          />

          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onToggleDryRun}
              className={cn(
                "size-8 cursor-pointer rounded-full text-text-muted",
                dryRun &&
                  "bg-accent-brand/15 text-accent-brand hover:bg-accent-brand/20 hover:text-accent-brand",
              )}
              aria-label="Toggle Dry Run mode"
              aria-pressed={dryRun}
              title="Toggle Dry Run mode"
            >
              <FlaskConical className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              disabled={isLoading || value.trim().length === 0}
              onClick={submit}
              className="size-8 cursor-pointer rounded-full bg-accent-brand text-background hover:bg-accent-brand/90 disabled:bg-elevated disabled:text-text-muted disabled:opacity-100"
              aria-label="Send message"
            >
              {isLoading ? (
                <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <ArrowUp className="size-4" strokeWidth={2.25} />
              )}
            </Button>
          </div>
        </div>

        <p className="mt-2 hidden text-center text-[11px] text-text-muted sm:block">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
