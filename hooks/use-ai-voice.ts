"use client"

import { useState, useEffect, useCallback } from "react"
import { createVoiceService } from "@/lib/voice-services/voice-service-factory"
import { getVoiceServiceConfig } from "@/lib/voice-services/voice-service-provider"

// Voice ID mapping for ElevenLabs
const voiceIdMapping: Record<string, string> = {
  stan: "pNInz6obpgDQGcFmaJgB", // Brian
  sophia: "EXAVITQu4vr4xnSDxMaL", // Aria
  lyra: "jsCqWAovK2LkecY7zXl4", // Freya
  kara: "z9fAnlkpzviPz146aGWa", // Glinda
  max: "CYw3kZ02Hs0563khs1Fj", // Daniel
  nova: "oWAxZDx7w5VEj9dCyTzz", // Grace
}

export function useAIVoice(aiMemberId: string, apiKey?: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voiceService, setVoiceService] = useState<any>(null)

  // Initialize the voice service
  useEffect(() => {
    const config = getVoiceServiceConfig()

    if (config.type !== "none" && (config.apiKey || apiKey)) {
      const service = createVoiceService(config.type, apiKey || config.apiKey)
      setVoiceService(service)
    }
  }, [apiKey])

  // Get the appropriate voice ID based on the service type and AI member ID
  const getVoiceId = useCallback(() => {
    const config = getVoiceServiceConfig()

    // For ElevenLabs, use the voice ID mapping
    if (config.type === "elevenlabs") {
      return voiceIdMapping[aiMemberId] || voiceIdMapping.nova
    }

    // For other services, just pass the AI member ID
    // The service implementation will handle the mapping
    return aiMemberId
  }, [aiMemberId])

  // Speak the text
  const speak = useCallback(
    async (text: string) => {
      if (!voiceService) {
        setError("Voice service not initialized")
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const voiceId = getVoiceId()
        await voiceService.speak(text, voiceId)

        setIsPlaying(true)
      } catch (err) {
        console.error("Error speaking:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    },
    [voiceService, getVoiceId],
  )

  // Stop the audio
  const stop = useCallback(() => {
    if (voiceService) {
      voiceService.stop()
      setIsPlaying(false)
    }
  }, [voiceService])

  // Update isPlaying state based on the voice service
  useEffect(() => {
    if (voiceService) {
      const checkPlayingInterval = setInterval(() => {
        setIsPlaying(voiceService.isPlaying())
      }, 500)

      return () => clearInterval(checkPlayingInterval)
    }
  }, [voiceService])

  return { speak, stop, isLoading, isPlaying, error }
}

