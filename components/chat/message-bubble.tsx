"use client"

import { memo } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/components/ui/utils"

interface MessageBubbleProps {
  role: "user" | "assistant" | "system"
  children: React.ReactNode
}

export const MessageBubble = memo(({ role, children }: MessageBubbleProps) => {
  return (
    <div className="flex items-start gap-3 max-w-full">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback>
          {role === "user" ? "U" : role === "system" ? "S" : "AI"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "rounded-lg p-3 max-w-full text-sm leading-relaxed",
            role === "user"
              ? "bg-elevated text-text-primary"
              : role === "system"
              ? "bg-panel text-text-muted italic"
              : "bg-panel text-text-primary"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
})

MessageBubble.displayName = "MessageBubble"
