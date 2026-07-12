"use client";

import { useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, FlaskConical } from "lucide-react";

interface ComposerProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  isInitializing?: boolean;
  error?: string | null;
  dryRun?: boolean;
  onToggleDryRun?: () => void;
}

export function Composer({
  onSubmit,
  disabled = false,
  isLoading = false,
  isInitializing = false,
  error = null,
  dryRun = false,
  onToggleDryRun,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [disabled]);

  const handleSubmit = useCallback(() => {
    const value = textareaRef.current?.value.trim();
    if (!value || disabled) return;

    onSubmit(value);

    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
  }, [onSubmit, disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-3xl">
        {error && (
          <div className="mb-2 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}
        {dryRun && (
          <div className="mb-2 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs text-center">
            Dry Run mode active — only SQL will be shown, no execution
          </div>
        )}
        <div className="flex items-end gap-2 bg-composer border border-border-subtle rounded-lg p-3 shadow-soft">
          <Textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask about your database..."
            disabled={disabled || isInitializing}
            className="flex-1 min-h-[40px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            onKeyDown={handleKeyDown}
          />
          {onToggleDryRun && (
            <Button
              type="button"
              size="icon"
              variant={dryRun ? "default" : "outline"}
              onClick={onToggleDryRun}
              disabled={isInitializing}
              className={`shrink-0 rounded-full cursor-pointer ${dryRun ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}`}
              title="Toggle Dry Run mode"
            >
              <FlaskConical className="size-4" />
            </Button>
          )}
          <Button
            type="button"
            size="icon"
            disabled={disabled || isInitializing}
            onClick={handleSubmit}
            className="shrink-0 rounded-full cursor-pointer"
          >
            {isLoading ? (
              <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center justify-center mt-2">
          <span className="text-xs text-text-muted">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
}