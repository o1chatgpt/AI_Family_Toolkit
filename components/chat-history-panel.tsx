"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Download, Trash2, MessageSquare, X } from "lucide-react"

interface ChatSession {
  id: number
  model: string
  messages: Array<{ text: string; sender: "user" | "system" }>
  timestamp: string
}

interface ChatHistoryPanelProps {
  onLoadSession: (sessionId: number) => void
  onClose: () => void
}

export function ChatHistoryPanel({ onLoadSession, onClose }: ChatHistoryPanelProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])

  useEffect(() => {
    // Load chat sessions from localStorage
    const savedSessions = JSON.parse(localStorage.getItem("chat_sessions") || "[]")
    setSessions(savedSessions)
  }, [])

  const deleteSession = (id: number) => {
    // Filter out the session to delete
    const updatedSessions = sessions.filter((session) => session.id !== id)

    // Update localStorage
    localStorage.setItem("chat_sessions", JSON.stringify(updatedSessions))

    // Update state
    setSessions(updatedSessions)
  }

  const exportSessions = () => {
    // Create a JSON file with all sessions
    const dataStr = JSON.stringify(sessions, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    // Create a download link and trigger it
    const exportFileDefaultName = `ai-family-chat-history-${new Date().toISOString().slice(0, 10)}.json`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Chat History</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={exportSessions} title="Export all sessions">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
                onClick={() => onLoadSession(session.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{session.model}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{new Date(session.timestamp).toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(session.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {session.messages[0]?.text || "Empty conversation"}
                </div>
                <div className="text-xs text-gray-500 mt-1">{session.messages.length} messages</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No chat history yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

