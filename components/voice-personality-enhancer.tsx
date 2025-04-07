"use client"

import { useState, useEffect } from "react"
import type { AIFamilyMember } from "@/data/ai-family-members"
import { AI_FAMILY_VOICES } from "@/lib/voice-service"
import { useAIVoice } from "@/hooks/use-ai-voice"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Volume2, VolumeX, Settings2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface VoicePersonalityEnhancerProps {
  member: AIFamilyMember
  apiKey?: string
  onVoiceToggle: (enabled: boolean) => void
  isVoiceEnabled: boolean
}

export function VoicePersonalityEnhancer({
  member,
  apiKey,
  onVoiceToggle,
  isVoiceEnabled,
}: VoicePersonalityEnhancerProps) {
  const [volume, setVolume] = useState(1)
  const [autoPlay, setAutoPlay] = useState(true)
  const [personalityIntensity, setPersonalityIntensity] = useState(0.5)
  const [voiceSettings, setVoiceSettings] = useState(
    AI_FAMILY_VOICES[member.id as keyof typeof AI_FAMILY_VOICES]?.settings || {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true,
    },
  )

  const { speak, stop, isPlaying } = useAIVoice(member.id, apiKey)

  // Get voice name for this AI Family member
  const voiceName = AI_FAMILY_VOICES[member.id as keyof typeof AI_FAMILY_VOICES]?.name || "Default"

  // Play introduction when component mounts
  useEffect(() => {
    if (isVoiceEnabled && autoPlay && apiKey) {
      const introMessage = getPersonalizedIntro()
      speak(introMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Generate a personalized introduction based on the AI Family member
  const getPersonalizedIntro = () => {
    const intros = {
      stan: [
        "Hello, I'm Stan. I'm here to help with your technical questions and coding challenges.",
        "Greetings! Stan here, ready to assist with development and programming tasks.",
        "Hi there! I'm Stan, your technical expert. What can I help you build today?",
      ],
      sophia: [
        "Hi, I'm Sophia. I specialize in content creation and can help you craft compelling narratives.",
        "Hello! Sophia here. Ready to help you with writing, editing, and creative projects.",
        "Greetings! I'm Sophia, and I'm excited to collaborate on your content needs.",
      ],
      lyra: [
        "Hello, I'm Lyra. I can help you analyze data and extract meaningful insights.",
        "Hi there! Lyra here. Let's explore your data and discover patterns together.",
        "Greetings! I'm Lyra, your data analysis expert. What would you like to learn from your data today?",
      ],
      kara: [
        "Hi, I'm Kara. I'm here to help with your design projects and visual content.",
        "Hello! Kara here. Let's create something beautiful together.",
        "Greetings! I'm Kara, and I'm excited to bring your visual ideas to life.",
      ],
      max: [
        "Hey there! Max here. I'm all about marketing and growth strategies.",
        "Hi! I'm Max, and I'm ready to supercharge your marketing efforts.",
        "Hello! Max at your service. Let's talk about how to grow your audience and reach.",
      ],
      nova: [
        "Hello, I'm Nova. I'm here to help with research and innovation projects.",
        "Hi there! Nova here. Let's explore new ideas and push boundaries together.",
        "Greetings! I'm Nova, and I'm excited to help you navigate the cutting edge of your field.",
      ],
    }

    const memberIntros = intros[member.id as keyof typeof intros] || intros.stan
    return memberIntros[Math.floor(Math.random() * memberIntros.length)]
  }

  // Apply personality intensity to voice settings
  useEffect(() => {
    if (personalityIntensity !== 0.5) {
      // Adjust voice settings based on personality intensity
      setVoiceSettings((prev) => ({
        ...prev,
        stability: Math.max(0.1, Math.min(0.9, 0.5 - (personalityIntensity - 0.5))),
        style: Math.max(0.1, Math.min(0.9, personalityIntensity * 0.8)),
        similarity_boost: Math.max(0.1, Math.min(0.9, 0.5 + personalityIntensity * 0.4)),
      }))
    }
  }, [personalityIntensity])

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            if (isPlaying) {
              stop()
            } else {
              onVoiceToggle(!isVoiceEnabled)
            }
          }}
          disabled={!apiKey}
          title={isVoiceEnabled ? "Disable voice" : "Enable voice"}
        >
          {isPlaying ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" className={isVoiceEnabled ? "text-primary" : "text-muted-foreground"} />
          )}
        </Button>

        <span className="text-xs text-muted-foreground hidden sm:inline-block">
          {isVoiceEnabled ? `Voice: ${voiceName}` : "Voice off"}
        </span>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!apiKey}>
            <Settings2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voice Settings for {member.name}</DialogTitle>
            <DialogDescription>Customize how {member.name} sounds when speaking to you.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-toggle" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span>Voice Enabled</span>
              </Label>
              <Switch id="voice-toggle" checked={isVoiceEnabled} onCheckedChange={onVoiceToggle} disabled={!apiKey} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="volume-slider">Volume</Label>
                <span className="text-sm">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                id="volume-slider"
                min={0}
                max={1}
                step={0.01}
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                disabled={!isVoiceEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoplay-toggle" className="flex items-center gap-2">
                <span>Auto-play responses</span>
              </Label>
              <Switch
                id="autoplay-toggle"
                checked={autoPlay}
                onCheckedChange={setAutoPlay}
                disabled={!isVoiceEnabled}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="personality-slider">Personality Intensity</Label>
                <span className="text-sm">
                  {personalityIntensity < 0.4 ? "Subtle" : personalityIntensity > 0.7 ? "Expressive" : "Balanced"}
                </span>
              </div>
              <Slider
                id="personality-slider"
                min={0.1}
                max={0.9}
                step={0.1}
                value={[personalityIntensity]}
                onValueChange={(value) => setPersonalityIntensity(value[0])}
                disabled={!isVoiceEnabled}
              />
              <p className="text-xs text-muted-foreground">
                Adjust how strongly {member.name}'s personality comes through in their voice. More expressive settings
                may sound less natural but more distinctive.
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => speak(getPersonalizedIntro())}
                disabled={!isVoiceEnabled || isPlaying}
                className="w-full"
              >
                Test Voice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

