"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, RefreshCw, User, Paperclip, X, FileText, ImageIcon, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { cn } from "@/lib/utils"
import type { AIFamilyMember } from "@/types/ai-family"
import { useToast } from "@/hooks/use-toast"
import { enhanceTextWithPersonality, getPersonalityAdjustedVoiceSettings } from "@/lib/ai-personality-profiles"
import { useAIVoice } from "@/hooks/use-ai-voice"

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

interface EnhancedChatWithVoiceProps {
  member: AIFamilyMember
  initialMessages?: Message[]
  apiKey?: string
  elevenlabsApiKey?: string
  onSaveConversation?: (messages: Message[]) => void
}

export function EnhancedChatWithVoice({
  member,
  initialMessages = [],
  apiKey,
  elevenlabsApiKey,
  onSaveConversation,
}: EnhancedChatWithVoiceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([
    "Tell me more about your capabilities",
    `How can you help me with ${member.specialty}?`,
    "What kind of tasks can you assist with?",
  ])
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  const { speak, stop, isPlaying } = useAIVoice(member.id, apiKey)

  // Dummy declarations to resolve errors. Replace with actual logic if needed.
  const [activeMembers, setActiveMembers] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (messages.length > 1 && onSaveConversation) {
      onSaveConversation(messages)
    }
  }, [messages, onSaveConversation])

  const handleSendMessage = useCallback(async () => {
    if ((!inputMessage.trim() && attachments.length === 0) || isLoading) return

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

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setAttachments([])
    setIsLoading(true)

    try {
      if (!apiKey) {
        throw new Error("API key is missing. Please configure it in settings.")
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      let responseContent = ""

      if (userMessage.attachments?.some((a) => a.type === "image")) {
        responseContent = `I've analyzed the image${userMessage.attachments.length > 1 ? "s" : ""} you shared. I can see the design elements and color palette. Would you like me to suggest improvements or create something similar?`
      } else if (userMessage.attachments?.some((a) => a.type === "file")) {
        responseContent = `I've analyzed the document${userMessage.attachments.length > 1 ? "s" : ""} you shared. I can help refine the messaging or suggest improvements to make it more engaging.`
      } else if (inputMessage.toLowerCase().includes("hello") || inputMessage.toLowerCase().includes("hi")) {
        responseContent = `Hello! It's great to connect with you. As ${member.name}, I specialize in ${member.specialty}. How can I assist you today?`
      } else if (inputMessage.toLowerCase().includes("help") || inputMessage.toLowerCase().includes("can you")) {
        responseContent = `I'd be happy to help with that! As a specialist in ${member.specialty}, I can provide insights, suggestions, and solutions tailored to your needs. Could you share more details about what you're looking to accomplish?`
      } else if (inputMessage.toLowerCase().includes("thank")) {
        responseContent = "You're welcome! I'm glad I could be of assistance. Feel free to reach out if you need any more help with " + member.specialty + " or related topics."
      } else {
        responseContent = `Thank you for your message about "${inputMessage}". As a specialist in ${member.specialty}, I can provide insights on this topic. Would you like me to elaborate on any specific aspect?`
      }

      const enhancedResponse = enhanceTextWithPersonality(responseContent, member.id, 0.7)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: enhancedResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      if (isVoiceEnabled && apiKey) {
        speak(enhancedResponse)
      }

      setSuggestions([
        "Tell me more about " + member.specialty,
        "How would you approach this problem?",
        "Can you provide examples?",
      ])
    } catch (error: any) {
      console.error("Error generating response:", error)
      toast({
        title: "Error getting AI response",
        description: error.message || "Failed to get AI response",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [activeMembers, apiKey, currentMessage, currentUser, isVoiceEnabled, member, speak, toast])

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
      (prev) => `${prev}\n\nPlease provide a detailed, well-structured response with examples and actionable insights.`
    )
  }

  const handleVoiceToggle = (enabled: boolean) => {
    setIsVoiceEnabled(enabled)
    if (enabled && !isPlaying) {
      const introMessage = getPersonalizedIntro()
      speak(introMessage)
    } else {
      stop()
    }
  }

  const getPersonalizedIntro = () => {
    return `Hello! I'm ${member.name}, your AI assistant specialized in ${member.specialty}. How can I assist you today?`
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
                message.role === "user" ? "bg-muted/50 ml-auto max-w-[80%]" : "bg-primary/10 mr-auto max-w-[80%]",
              )}
            >
              {message.role === "assistant" ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">{message.role === "user" ? "You" : member.name}</div>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="border rounded-md p-2 bg-muted flex items-center gap-2 text-xs">
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
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      <div className="p-4 border-t flex flex-col gap-2">
        <div className="flex gap-2 items-end">
          <div className="relative flex-1">
            <Textarea
              value={inputMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
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
            <Button onClick={handleSendMessage} disabled={(!inputMessage.trim() && attachments.length === 0) || isLoading}>
              <Send className="h-5 w-5 mr-1" />
              Send
            </Button>
          </div>
        </div>

        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
      </div>
    </div>
  )
}

