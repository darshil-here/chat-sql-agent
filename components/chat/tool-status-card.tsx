"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { cn } from "@/components/ui/utils";

const APPEARANCE = {
  running: {
    icon: Loader2,
    iconClass: "animate-spin text-text-muted",
    titleClass: "text-text-secondary",
    borderClass: "border-border-subtle",
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-accent-positive",
    titleClass: "text-text-primary",
    borderClass: "border-border-subtle",
  },
  error: {
    icon: XCircle,
    iconClass: "text-accent-danger",
    titleClass: "text-accent-danger",
    borderClass: "border-accent-danger/30",
  },
} as const;

type ToolStatus = keyof typeof APPEARANCE;

export function ToolStatusCard({
  title,
  status,
  children,
}: {
  title: string;
  status: ToolStatus;
  children?: React.ReactNode;
}) {
  const { icon: Icon, iconClass, titleClass, borderClass } = APPEARANCE[status];

  return (
    <div className={cn("my-2 rounded-lg border bg-panel p-3 text-sm", borderClass)}>
      <div className="mb-1 flex items-center gap-2">
        <Icon className={cn("size-3.5", iconClass)} />
        <span className={cn("font-medium", titleClass)}>{title}</span>
      </div>
      {children && <div className="mt-2 text-text-secondary">{children}</div>}
    </div>
  );
}
