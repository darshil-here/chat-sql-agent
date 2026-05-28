"use client"

import { memo } from "react"
import { cn } from "@/components/ui/utils"
import { CheckCircle, Loader2, XCircle } from "lucide-react"

type ToolStatus = "running" | "success" | "error"

interface ToolStatusCardProps {
  title: string
  status: ToolStatus
  children?: React.ReactNode
}

export const ToolStatusCard = memo(({ title, status, children }: ToolStatusCardProps) => {
  return (
    <div
      className={cn(
        "my-2 p-3 rounded-lg border text-sm",
        status === "running" && "bg-panel border-border-subtle",
        status === "success" && "bg-panel border-border-subtle",
        status === "error" && "bg-panel border-accent-danger/30"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {status === "running" && (
          <Loader2 className="size-3.5 text-text-muted animate-spin" />
        )}
        {status === "success" && (
          <CheckCircle className="size-3.5 text-accent-positive" />
        )}
        {status === "error" && (
          <XCircle className="size-3.5 text-accent-danger" />
        )}
        <span
          className={cn(
            "font-medium",
            status === "running" && "text-text-secondary",
            status === "success" && "text-text-primary",
            status === "error" && "text-accent-danger"
          )}
        >
          {title}
        </span>
      </div>
      {children && (
        <div className="mt-2 text-text-secondary">
          {children}
        </div>
      )}
    </div>
  )
})

ToolStatusCard.displayName = "ToolStatusCard"
