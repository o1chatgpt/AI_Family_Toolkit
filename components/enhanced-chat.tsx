"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, RefreshCw, User, Paperclip, X, FileText, ImageIcon, Sparkles, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AIFamilyMember } from "@/data/ai-family-members"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  attachments?: {
    type: "file" | "image"
    name: string
    url: string
  }[]
}

interface EnhancedChatProps {
  member: AIFamilyMember
  initialMessages?: Message[]
  apiKey?: string
  onSaveConversation?: (messages: Message[]) => void
}

export function EnhancedChat({ member, initialMessages = [], apiKey, onSaveConversation }: EnhancedChatProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: "welcome",
            role: "assistant",
            content: `Hello! I'm ${member.name}, your AI assistant specialized in ${member.specialty}. How can I help you today?`,
            timestamp: new Date(),
          },
        ],
  )
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([
    "Tell me more about your capabilities",
    `How can you help me with ${member.specialty}?`,
    "What kind of tasks can you assist with?",
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Save conversation when messages change
  useEffect(() => {
    if (messages.length > 1 && onSaveConversation) {
      onSaveConversation(messages)
    }
  }, [messages, onSaveConversation])

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && attachments.length === 0) || isLoading) return

    // Create a new user message
    const userMessageId = Date.now().toString()
    const userAttachments = attachments.map((file) => ({
      type: file.type.startsWith("image/") ? ("image" as const) : ("file" as const),
      name: file.name,
      url: URL.createObjectURL(file),
    }))

    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      attachments: userAttachments.length > 0 ? userAttachments : undefined,
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setAttachments([])
    setIsLoading(true)

    // In a real implementation, you would call the OpenAI API here
    // For now, we'll simulate a response
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a contextual response based on the user's message and member's specialty
      let responseContent = ""

      if (userMessage.attachments?.some((a) => a.type === "image")) {
        responseContent = `I've analyzed the image${userMessage.attachments.length > 1 ? "s" : ""} you shared. `

        if (member.specialty.toLowerCase().includes("design") || member.id === "kara") {
          responseContent +=
            "I can see the design elements and color palette. The composition is interesting. Would you like me to suggest improvements or create something similar?"
        } else if (member.specialty.toLowerCase().includes("data") || member.id === "lyra") {
          responseContent +=
            "I can see some data visualizations. The patterns suggest some interesting trends. Would you like me to help analyze this further?"
        } else {
          responseContent +=
            "Based on what I can see, this relates to " +
            member.specialty +
            ". Would you like me to provide more specific insights about this?"
        }
      } else if (userMessage.attachments?.some((a) => a.type === "file")) {
        responseContent = `I've analyzed the document${userMessage.attachments.length > 1 ? "s" : ""} you shared. `

        if (member.specialty.toLowerCase().includes("code") || member.id === "stan") {
          responseContent +=
            "The code structure looks well-organized. I notice some potential optimizations we could discuss. Would you like me to review any specific parts in detail?"
        } else if (member.specialty.toLowerCase().includes("content") || member.id === "sophia") {
          responseContent +=
            "The content is well-structured. I can help refine the messaging or suggest improvements to make it more engaging."
        } else {
          responseContent +=
            "I've extracted the key information related to " +
            member.specialty +
            ". Would you like me to summarize the main points or focus on a specific aspect?"
        }
      } else if (inputMessage.toLowerCase().includes("hello") || inputMessage.toLowerCase().includes("hi")) {
        responseContent = `Hello! It's great to connect with you. As ${member.name}, I specialize in ${member.specialty}. How can I assist you today?`
      } else if (inputMessage.toLowerCase().includes("help") || inputMessage.toLowerCase().includes("can you")) {
        responseContent = `I'd be happy to help with that! As a specialist in ${member.specialty}, I can provide insights, suggestions, and solutions tailored to your needs. Could you share more details about what you're looking to accomplish?`
      } else if (inputMessage.toLowerCase().includes("thank")) {
        responseContent =
          "You're welcome! I'm glad I could be of assistance. Feel free to reach out if you need any more help with " +
          member.specialty +
          " or related topics."
      } else {
        // Generic response based on member's specialty
        responseContent = `Thank you for your message about "${inputMessage}". As a specialist in ${member.specialty}, I can provide insights on this topic. ${member.systemPrompt.split(".")[0]}. Would you like me to elaborate on any specific aspect?`
      }

      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      // Add assistant message to chat
      setMessages((prev) => [...prev, assistantMessage])

      // Generate new contextual suggestions
      setSuggestions([
        "Tell me more about " + member.specialty,
        "How would you approach this problem?",
        "Can you provide examples?",
      ])
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleEnhanceMessage = () => {
    if (!inputMessage.trim()) return

    setInputMessage(
      (prev) => `${prev}\n\nPlease provide a detailed, well-structured response with examples and actionable insights.`,
    )
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b">
          <CardTitle className="text-base font-medium">Chat with {member.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 rounded-lg p-3",
                message.role === "user"
                  ? "bg-muted/50 ml-auto max-w-[80%]"
                  : message.role === "system"
                    ? "bg-yellow-100/50 dark:bg-yellow-900/20 max-w-[80%]"
                    : "bg-primary/10 mr-auto max-w-[80%]",
              )}
            >
              {message.role === "assistant" ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : message.role === "system" ? (
                <Avatar className="h-8 w-8 bg-yellow-500">
                  <Wand2 className="h-4 w-4 text-white" />
                </Avatar>
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">
                  {message.role === "user" ? "You" : message.role === "system" ? "System" : member.name}
                </div>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                {/* Render attachments if any */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="border rounded-md p-2 bg-background flex items-center gap-2 text-xs">
                        {attachment.type === "image" ? (
                          <>
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {attachment.name}
                            </a>
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 text-blue-500" />
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {attachment.name}
                            </a>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center text-gray-500">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              <span>{member.name} is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto py-2 px-1">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="whitespace-nowrap text-xs"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border-t">
          {attachments.map((file, index) => (
            <div key={index} className="border rounded-md p-2 bg-muted flex items-center gap-2 text-xs">
              {file.type.startsWith("image/") ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              <span className="truncate max-w-[150px]">{file.name}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleRemoveAttachment(index)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t flex flex-col gap-2">
        <div className="flex gap-2 items-end">
          <div className="relative flex-1">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${member.name}...`}
              className="min-h-[80px] pr-10 resize-none"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6 opacity-70 hover:opacity-100"
              onClick={handleEnhanceMessage}
              disabled={!inputMessage.trim()}
              title="Enhance message"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              className="h-10"
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && attachments.length === 0) || isLoading}
            >
              <Send className="h-5 w-5 mr-1" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

