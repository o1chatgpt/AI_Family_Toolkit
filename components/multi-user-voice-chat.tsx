"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useAIVoice } from "@/hooks/use-ai-voice"
import { getAIFamilyMembers } from "@/data/ai-family-members"
import { enhanceTextWithPersonality } from "@/lib/ai-personality-profiles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Volume2, VolumeX, UserPlus, Users } from "lucide-react"
import { cn } from "@/lib/utils"

// This would be a simplified version - in a real implementation,
// you would use WebSockets or a similar technology for real-time communication

export function MultiUserVoiceChat() {
  const [activeMembers, setActiveMembers] = useState([
    getAIFamilyMembers()[0], // Stan by default
  ])
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [currentUser, setCurrentUser] = useState({
    name: "You",
    avatar: "",
  })
  const [otherUsers, setOtherUsers] = useState([])
  const [speakingMemberId, setSpeakingMemberId] = useState(null)
  const [voicesReady, setVoicesReady] = useState(false)
  const messagesEndRef = useRef(null)

  // Load API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem("elevenlabs_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  // Initialize voice hooks for each active member
  const voiceHooks = useRef({})

  // Initialize voice hooks for each active member
  useEffect(() => {
    if (apiKey) {
      // Initialize voice hooks for each active member
      const hooks = activeMembers.reduce((acc, member) => {
        acc[member.id] = useAIVoice(member.id, apiKey)
        return acc
      }, {})
      voiceHooks.current = hooks
      setVoicesReady(true)
    } else {
      voiceHooks.current = {}
      setVoicesReady(false)
    }
  }, [activeMembers, apiKey])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = useCallback(() => {
    if (!currentMessage.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: currentUser,
      content: currentMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")

    // Determine which AI Family member should respond
    // In a real implementation, you would use NLP to route the message
    // or have a more sophisticated system for determining who responds

    // For now, we'll just pick a random active member
    const respondingMember = activeMembers[Math.floor(Math.random() * activeMembers.length)]

    // Generate a response
    setTimeout(() => {
      // Generate a more realistic response based on the member's specialty
      let responseContent = ""

      if (respondingMember.id === "stan") {
        responseContent = `I've analyzed your message about "${currentMessage.substring(0, 20)}...". From a technical perspective, this appears to be related to software development. I can help you optimize your approach with some code examples if you'd like.`
      } else if (respondingMember.id === "sophia") {
        responseContent = `I love your question about "${currentMessage.substring(0, 20)}...". Let's craft this narrative together. From a storytelling perspective, we could explore several creative angles to make your content more engaging.`
      } else if (respondingMember.id === "lyra") {
        responseContent = `Analyzing your query about "${currentMessage.substring(0, 20)}...". The data indicates that this is an interesting problem to solve. From a statistical perspective, we should consider multiple variables before drawing conclusions.`
      } else if (respondingMember.id === "kara") {
        responseContent = `I'm visualizing what you're asking about "${currentMessage.substring(0, 20)}...". From a design perspective, we could create something visually stunning that communicates your message effectively while maintaining aesthetic harmony.`
      } else {
        responseContent = `Thanks for your message about "${currentMessage.substring(0, 20)}...". As a specialist in ${respondingMember.specialty}, I can provide insights on this topic.`
      }

      // Enhance the response with personality
      const enhancedResponse = enhanceTextWithPersonality(responseContent, respondingMember.id, 0.7)

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: respondingMember,
        content: enhancedResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Speak the response
      if (apiKey && voiceHooks.current[respondingMember.id] && voicesReady) {
        setSpeakingMemberId(respondingMember.id)
        voiceHooks.current[respondingMember.id].speak(enhancedResponse, () => {
          setSpeakingMemberId(null)
        })
      }
    }, 1000)
  }, [activeMembers, apiKey, currentMessage, currentUser, voicesReady])

  const addAIFamilyMember = () => {
    // Show a dialog to select an AI Family member to add to the chat
    const allMembers = getAIFamilyMembers()
    const availableMembers = allMembers.filter(
      (member) => !activeMembers.some((activeMember) => activeMember.id === member.id),
    )

    if (availableMembers.length === 0) return

    // For simplicity, we'll just add the first available member
    setActiveMembers((prev) => [...prev, availableMembers[0]])
  }

  const handleVoiceToggle = (memberId) => {
    if (voiceHooks.current[memberId]) {
      if (voiceHooks.current[memberId].isPlaying) {
        voiceHooks.current[memberId].stop()
        setSpeakingMemberId(null)
      }
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="py-3 px-4 border-b flex flex-row justify-between items-center">
        <CardTitle className="text-base font-medium">Multi-User AI Chat</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={addAIFamilyMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add AI Member
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Active participants */}
        <div className="flex flex-wrap gap-2 pb-2 border-b">
          {activeMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-1 text-xs bg-primary/10 rounded-full px-2 py-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{member.name}</span>
              {apiKey && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => handleVoiceToggle(member.id)}
                  disabled={speakingMemberId !== null && speakingMemberId !== member.id}
                >
                  {speakingMemberId === member.id ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
              )}
            </div>
          ))}

          <div className="flex items-center gap-1 text-xs bg-muted rounded-full px-2 py-1">
            <Avatar className="h-5 w-5">
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <span>{currentUser.name}</span>
          </div>
        </div>

        {/* Chat messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-3 rounded-lg p-3",
              message.sender.name === currentUser.name
                ? "bg-muted/50 ml-auto max-w-[80%]"
                : "bg-primary/10 mr-auto max-w-[80%]",
            )}
          >
            <Avatar className="h-8 w-8">
              {message.sender.name !== currentUser.name ? (
                <>
                  <AvatarImage src={message.sender.avatarUrl} alt={message.sender.name} />
                  <AvatarFallback style={{ backgroundColor: `${message.sender.color}20`, color: message.sender.color }}>
                    {message.sender.name.charAt(0)}
                  </AvatarFallback>
                </>
              ) : (
                <AvatarFallback>Y</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1 flex items-center justify-between">
                <span>{message.sender.name}</span>

                {message.sender.name !== currentUser.name && apiKey && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      if (voiceHooks.current[message.sender.id] && voicesReady) {
                        setSpeakingMemberId(message.sender.id)
                        voiceHooks.current[message.sender.id].speak(message.content, () => {
                          setSpeakingMemberId(null)
                        })
                      }
                    }}
                    disabled={speakingMemberId !== null && speakingMemberId !== message.sender.id}
                  >
                    {speakingMemberId === message.sender.id ? (
                      <VolumeX className="h-3 w-3" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
            Send
          </Button>
        </div>
      </div>
    </Card>
  )
}

