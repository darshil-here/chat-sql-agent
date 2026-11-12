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
    <div className="flex justify-center p-4">
      <div className="w-full max-w-3xl">
        {error && (
          <div className="mb-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">
            {error}
          </div>
        )}
        {dryRun && (
          <div className="mb-2 rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-center text-xs text-blue-400">
            Dry Run mode active. Only SQL will be shown, nothing runs.
          </div>
        )}
        <div className="flex items-end gap-2 rounded-lg border border-border-subtle bg-composer p-3 shadow-soft">
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
            className="max-h-[200px] min-h-[40px] flex-1 resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            type="button"
            size="icon"
            variant={dryRun ? "default" : "outline"}
            onClick={onToggleDryRun}
            className={cn(
              "shrink-0 cursor-pointer rounded-full",
              dryRun && "bg-blue-500 text-white hover:bg-blue-600",
            )}
            aria-label="Toggle Dry Run mode"
            title="Toggle Dry Run mode"
          >
            <FlaskConical className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            disabled={isLoading}
            onClick={submit}
            className="shrink-0 cursor-pointer rounded-full"
            aria-label="Send message"
          >
            {isLoading ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-text-muted">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
