"use client";

import { Bot, SquareActivity, User } from "lucide-react";
import { cn } from "@/components/ui/utils";

const APPEARANCE = {
  user: {
    icon: User,
    avatar: "bg-elevated text-text-secondary ring-border-subtle",
    label: "Your message",
    // Compact bubble: it should read as a message, not a full-width row.
    bubble:
      "w-fit max-w-[85%] rounded-2xl rounded-tl-md bg-elevated px-4 py-2.5 text-text-primary ring-1 ring-border-subtle",
  },
  assistant: {
    icon: Bot,
    avatar: "bg-accent-brand/15 text-accent-brand ring-accent-brand/20",
    // The answer is prose, not a card. Keeping it on the page surface lets
    // the SQL card be the only nested surface; no card-in-a-card.
    bubble: "w-full bg-transparent p-0 text-text-primary",
    label: "Assistant message",
  },
  system: {
    icon: SquareActivity,
    avatar: "bg-panel text-text-muted ring-border-subtle",
    bubble: "w-fit rounded-2xl bg-panel px-4 py-2.5 text-text-muted italic",
    label: "System message",
  },
} as const;

export function MessageBubble({
  role,
  children,
}: {
  role: keyof typeof APPEARANCE;
  children: React.ReactNode;
}) {
  const { icon: Icon, avatar, bubble, label } = APPEARANCE[role];

  return (
    <div
      role="article"
      aria-label={label}
      className="message-in flex max-w-full items-start gap-3"
    >
      <div
        aria-hidden
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
          avatar,
        )}
      >
        <Icon className="size-3.5" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn("text-sm leading-relaxed", bubble)}>{children}</div>
      </div>
    </div>
  );
}
