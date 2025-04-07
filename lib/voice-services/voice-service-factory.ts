import type { VoiceServiceInterface } from "./voice-service-interface"
import { ElevenLabsService } from "./elevenlabs-service"
import { OpenAIService } from "./openai-service"
import { type VoiceServiceType, getApiKeyForService } from "./voice-service-provider"

export function createVoiceService(type: VoiceServiceType, apiKey?: string): VoiceServiceInterface | null {
  // If no API key is provided, try to get it from storage
  const key = apiKey || getApiKeyForService(type)

  if (!key) {
    return null
  }

  switch (type) {
    case "elevenlabs":
      return new ElevenLabsService(key)
    case "openai":
      return new OpenAIService(key)
    case "hume":
      // Implement HUME service when needed
      console.warn("HUME voice service not yet implemented")
      return null
    default:
      return null
  }
}

