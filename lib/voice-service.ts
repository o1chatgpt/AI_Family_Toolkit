// Voice service for AI Family members using ElevenLabs API

// Custom voice IDs provided by the user
const CUSTOM_VOICE_IDS = {
  female: [
    "9BWtsMINqrJLrRacOk9x", // Aria
    "ThT5KcBeYPX3keUQqHPh", // Dorothy
    "jsCqWAovK2LkecY7zXl4", // Freya
    "z9fAnlkpzviPz146aGWa", // Glinda
    "oWAxZDx7w5VEj9dCyTzz", // Grace
  ],
  male: [
    "nPczCjzI2devNBz1zQrb", // Brian
    "iP95p4xoKVk53GoZ742B", // Chris
    "onwK4e9ZLuTAKqWW03F9", // Daniel
    "CYw3kZ02Hs0563khs1Fj", // Dave
    "29vD33N1CtxCmqQRPOHJ", // Drew
  ],
}

// Voice settings for each AI Family member with personality-appropriate voices
export const AI_FAMILY_VOICES = {
  stan: {
    voiceId: CUSTOM_VOICE_IDS.male[0], // Brian - technical, authoritative
    name: "Brian",
    settings: {
      stability: 0.4,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
  sophia: {
    voiceId: CUSTOM_VOICE_IDS.female[0], // Aria - articulate, creative
    name: "Aria",
    settings: {
      stability: 0.7,
      similarity_boost: 0.6,
      style: 0.4,
      use_speaker_boost: true,
    },
  },
  lyra: {
    voiceId: CUSTOM_VOICE_IDS.female[2], // Freya - analytical, precise
    name: "Freya",
    settings: {
      stability: 0.6,
      similarity_boost: 0.7,
      style: 0.5,
      use_speaker_boost: true,
    },
  },
  kara: {
    voiceId: CUSTOM_VOICE_IDS.female[3], // Glinda - warm, creative
    name: "Glinda",
    settings: {
      stability: 0.5,
      similarity_boost: 0.8,
      style: 0.6,
      use_speaker_boost: true,
    },
  },
  max: {
    voiceId: CUSTOM_VOICE_IDS.male[2], // Daniel - energetic, enthusiastic
    name: "Daniel",
    settings: {
      stability: 0.4,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
  nova: {
    voiceId: CUSTOM_VOICE_IDS.female[4], // Grace - balanced, neutral
    name: "Grace",
    settings: {
      stability: 0.6,
      similarity_boost: 0.7,
      style: 0.4,
      use_speaker_boost: true,
    },
  },
}

// Cache for audio URLs to avoid regenerating the same text
const audioCache = new Map<string, string>()

export async function textToSpeech(
  text: string,
  memberId: string,
  apiKey: string = process.env.ELEVENLABS_API_KEY || "",
): Promise<string> {
  // Limit text length to avoid excessive API usage
  const limitedText = text.length > 300 ? text.substring(0, 300) + "..." : text

  // Create a cache key based on text and member ID
  const cacheKey = `${memberId}:${limitedText}`

  // Check if we have this audio cached
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!
  }

  // Get voice settings for the AI Family member
  const voiceSettings = AI_FAMILY_VOICES[memberId as keyof typeof AI_FAMILY_VOICES] || AI_FAMILY_VOICES.stan

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceSettings.voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: limitedText,
        model_id: "eleven_multilingual_v2", // Using the multilingual model for better quality
        voice_settings: voiceSettings.settings,
      }),
    })

    if (!response.ok) {
      console.error("ElevenLabs API error:", await response.text())
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    // Get audio as blob
    const audioBlob = await response.blob()

    // Create a URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob)

    // Cache the audio URL
    audioCache.set(cacheKey, audioUrl)

    return audioUrl
  } catch (error) {
    console.error("Error generating speech:", error)
    throw error
  }
}

// Function to clean up cached audio URLs
export function cleanupAudioCache() {
  audioCache.forEach((url) => {
    URL.revokeObjectURL(url)
  })
  audioCache.clear()
}

// Function to get available voices from ElevenLabs
export async function getAvailableVoices(apiKey: string): Promise<any[]> {
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.voices || []
  } catch (error) {
    console.error("Error fetching voices:", error)
    return []
  }
}

// Function to assign a voice to an AI Family member
export async function assignVoiceToMember(memberId: string, voiceId: string, settings?: any): Promise<boolean> {
  try {
    // In a real implementation, this would update a database
    // For now, we'll just update our in-memory object
    if (AI_FAMILY_VOICES[memberId as keyof typeof AI_FAMILY_VOICES]) {
      AI_FAMILY_VOICES[memberId as keyof typeof AI_FAMILY_VOICES].voiceId = voiceId

      if (settings) {
        AI_FAMILY_VOICES[memberId as keyof typeof AI_FAMILY_VOICES].settings = {
          ...AI_FAMILY_VOICES[memberId as keyof typeof AI_FAMILY_VOICES].settings,
          ...settings,
        }
      }

      return true
    }
    return false
  } catch (error) {
    console.error("Error assigning voice:", error)
    return false
  }
}

