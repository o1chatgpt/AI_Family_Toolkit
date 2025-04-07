"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AIFamilySidebar } from "@/components/ai-family-sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAIFamilyMember, type AIFamilyMember } from "@/data/ai-family-members"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { EnhancedChatWithVoice } from "@/components/enhanced-chat-with-voice"

export default function AIFamilyChatPage({ params }: { params: { memberId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [member, setMember] = useState<AIFamilyMember | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState<string | null>(null)

  // Check if there's a task parameter in the URL
  const taskId = searchParams.get("task")

  useEffect(() => {
    // Get member data
    const memberData = getAIFamilyMember(params.memberId)
    if (memberData) {
      setMember(memberData)
    } else {
      toast({
        title: "Member not found",
        description: "The requested AI Family member could not be found.",
        variant: "destructive",
      })
      router.push("/ai-family")
    }

    // Get API keys from localStorage
    const savedApiKey = localStorage.getItem("openai_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }

    const savedElevenlabsApiKey = localStorage.getItem("elevenlabs_api_key")
    if (savedElevenlabsApiKey) {
      setElevenlabsApiKey(savedElevenlabsApiKey)
    }
  }, [params.memberId, router, toast])

  const handleSaveConversation = (messages: any[]) => {
    // In a real app, this would save to a database
    console.log("Saving conversation:", messages)
  }

  if (!member) {
    return (
      <div className="flex h-screen">
        <AIFamilySidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading chat...</p>
          </div>
        </div>
      </div>
    )
  }

  // Prepare initial messages if there's a task
  let initialMessages = []
  if (taskId) {
    const task = member.tasks.find((t) => t.id === taskId)
    if (task) {
      initialMessages = [
        {
          id: Date.now().toString(),
          role: "system",
          content: `Task context: "${task.title}" - ${task.description}`,
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I'm ready to help you with the task: "${task.title}". What would you like to discuss about this task?`,
          timestamp: new Date(),
        },
      ]
    }
  }

  return (
    <div className="flex h-screen">
      <AIFamilySidebar />
      <div className="flex-1 p-8 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/ai-family/${member.id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2" style={{ borderColor: member.color }}>
              <AvatarImage src={member.avatarUrl} alt={member.name} />
              <AvatarFallback style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">{member.name}</h1>
              <p className="text-xs text-muted-foreground">{member.specialty}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <EnhancedChatWithVoice
            member={member}
            initialMessages={initialMessages}
            apiKey={apiKey || undefined}
            elevenlabsApiKey={elevenlabsApiKey || undefined}
            onSaveConversation={handleSaveConversation}
          />
        </div>
      </div>
    </div>
  )
}

