// This file will manage different voice service providers

export type VoiceServiceType = "elevenlabs" | "openai" | "hume" | "none"

export interface VoiceServiceConfig {
  type: VoiceServiceType
  apiKey?: string
}

// Store the current voice service configuration
let currentVoiceService: VoiceServiceConfig = {
  type: "none",
}

// Get the current voice service configuration
export function getVoiceServiceConfig(): VoiceServiceConfig {
  // Check localStorage first (for client-side)
  if (typeof window !== "undefined") {
    const storedConfig = localStorage.getItem("voice_service_config")
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig)
        currentVoiceService = parsedConfig
      } catch (error) {
        console.error("Error parsing voice service config:", error)
      }
    }
  }

  return currentVoiceService
}

// Set the voice service configuration
export function setVoiceServiceConfig(config: VoiceServiceConfig): void {
  currentVoiceService = config

  // Save to localStorage (for client-side)
  if (typeof window !== "undefined") {
    localStorage.setItem("voice_service_config", JSON.stringify(config))
  }
}

// Check if a voice service is configured
export function hasVoiceService(): boolean {
  const config = getVoiceServiceConfig()
  return config.type !== "none" && !!config.apiKey
}

// Get API key for a specific service
export function getApiKeyForService(type: VoiceServiceType): string | undefined {
  if (typeof window === "undefined") return undefined

  switch (type) {
    case "elevenlabs":
      return localStorage.getItem("elevenlabs_api_key") || undefined
    case "openai":
      return localStorage.getItem("openai_api_key") || undefined
    case "hume":
      return localStorage.getItem("hume_api_key") || undefined
    default:
      return undefined
  }
}

