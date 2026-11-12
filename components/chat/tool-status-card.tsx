"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { cn } from "@/components/ui/utils";

const APPEARANCE = {
  running: {
    icon: Loader2,
    iconClass: "animate-spin text-text-muted",
    iconWrap: "bg-text-muted/10 text-text-muted",
    titleClass: "text-text-secondary",
    borderClass: "border-border-subtle",
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-accent-positive",
    iconWrap: "bg-accent-positive/10 text-accent-positive",
    titleClass: "text-text-primary",
    borderClass: "border-border-subtle",
  },
  error: {
    icon: XCircle,
    iconClass: "text-accent-danger",
    iconWrap: "bg-accent-danger/10 text-accent-danger",
    titleClass: "text-accent-danger",
    borderClass: "border-accent-danger/25",
  },
} as const;

type ToolStatus = keyof typeof APPEARANCE;

export function ToolStatusCard({
  title,
  status,
  meta,
  children,
}: {
  title: string;
  status: ToolStatus;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { icon: Icon, iconClass, iconWrap, titleClass, borderClass } =
    APPEARANCE[status];

  return (
    <div
      className={cn(
        "my-3 overflow-hidden rounded-xl border bg-panel/60",
        borderClass,
      )}
    >
      <div className="flex items-center gap-2.5 px-3 py-2">
        <span
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-full",
            iconWrap,
          )}
        >
          <Icon className={cn("size-3", iconClass)} strokeWidth={2.25} />
        </span>
        <span className={cn("text-[12.5px] font-medium", titleClass)}>
          {title}
        </span>
        {meta && (
          <span className="ml-auto font-mono text-[10.5px] tabular-nums text-text-muted">
            {meta}
          </span>
        )}
      </div>
      {children && (
        <div className="border-t border-border-subtle/70 px-3 py-3 text-text-secondary">
          {children}
        </div>
      )}
    </div>
  );
}
