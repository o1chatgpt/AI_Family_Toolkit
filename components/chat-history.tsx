"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MessageSquare, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { getChatSessions, deleteChatSession, createChatSession } from "@/app/actions/storage-actions"
import { useToast } from "@/hooks/use-toast"

type ChatSession = {
  id: string
  title: string
  ai_model: string
  created_at: string
  updated_at: string
}

export function ChatHistory() {
  const router = useRouter()
  const { toast } = useToast()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const result = await getChatSessions()

      if (result.success) {
        setSessions(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error)
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const result = await deleteChatSession(id)

      if (result.success) {
        setSessions(sessions.filter((session) => session.id !== id))
        toast({
          title: "Success",
          description: "Chat session deleted",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete chat session",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting chat session:", error)
      toast({
        title: "Error",
        description: "Failed to delete chat session",
        variant: "destructive",
      })
    }
  }

  const createNewChat = async () => {
    try {
      const result = await createChatSession("New Chat", "gpt-4o")

      if (result.success) {
        router.push(`/chat`)
        toast({
          title: "Success",
          description: "New chat session created",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to create new chat session",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating chat session:", error)
      toast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Button onClick={createNewChat} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 rounded-md border">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No chat history yet</p>
              <p className="text-sm">Start a new conversation</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Link
                key={session.id}
                href={`/chat`}
                className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="overflow-hidden">
                  <h3 className="font-medium truncate">{session.title}</h3>
                  <p className="text-xs text-gray-500">{new Date(session.updated_at).toLocaleDateString()}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-50 hover:opacity-100"
                  onClick={(e) => handleDelete(session.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

