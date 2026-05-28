"use client"

import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageBubble } from "./message-bubble"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatContainerProps {
  messages: Message[]
}

export function ChatContainer({ messages }: ChatContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center max-w-lg">
          <div className="size-16 mx-auto mb-4 rounded-full bg-panel flex items-center justify-center">
            <span className="text-3xl">💬</span>
          </div>
          <h2 className="text-xl font-medium text-text-primary mb-2">
            Start a conversation
          </h2>
          <p className="text-base text-text-muted">
            Ask questions about your database. Try &ldquo;Show me all active
            customers&rdquo; or &ldquo;What&apos;s the total revenue from
            completed orders?&rdquo;
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1">
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role}>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </MessageBubble>
        ))}
      </div>
    </ScrollArea>
  )
}
