"use client";

import { Bot, SquareActivity, User } from "lucide-react";
import { cn } from "@/components/ui/utils";

const APPEARANCE = {
  user: { icon: User, bubble: "bg-elevated text-text-primary" },
  assistant: { icon: Bot, bubble: "bg-panel text-text-primary" },
  system: { icon: SquareActivity, bubble: "bg-panel text-text-muted italic" },
} as const;

export function MessageBubble({
  role,
  children,
}: {
  role: keyof typeof APPEARANCE;
  children: React.ReactNode;
}) {
  const { icon: Icon, bubble } = APPEARANCE[role];

  return (
    <div className="flex max-w-full items-start gap-3">
      <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-elevated">
        <Icon className="size-4 text-text-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "max-w-full rounded-lg p-3 text-sm leading-relaxed",
            bubble,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
