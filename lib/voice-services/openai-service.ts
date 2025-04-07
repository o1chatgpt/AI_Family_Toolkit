import type { VoiceServiceInterface } from "./voice-service-interface"

export class OpenAIService implements VoiceServiceInterface {
  private apiKey: string
  private audio: HTMLAudioElement | null = null
  private isPlayingAudio = false

  // OpenAI voice mapping for AI family members
  private voiceMapping: Record<string, string> = {
    stan: "onyx", // Technical, authoritative
    sophia: "nova", // Articulate, creative
    lyra: "shimmer", // Analytical, precise
    kara: "alloy", // Warm, creative
    max: "echo", // Energetic, enthusiastic
    nova: "fable", // Balanced, neutral
  }

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async speak(text: string, voiceId: string): Promise<void> {
    try {
      this.stop()

      // Map the AI family member ID to an OpenAI voice
      const openAIVoice = this.voiceMapping[voiceId.toLowerCase()] || "alloy"

      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice: openAIVoice,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${response.status} ${JSON.stringify(errorData)}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      this.audio = new Audio(audioUrl)
      this.audio.onended = () => {
        this.isPlayingAudio = false
        if (this.audio) {
          URL.revokeObjectURL(this.audio.src)
          this.audio = null
        }
      }

      this.isPlayingAudio = true
      await this.audio.play()
    } catch (error) {
      console.error("Error generating speech with OpenAI:", error)
      this.isPlayingAudio = false
      throw error
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause()
      URL.revokeObjectURL(this.audio.src)
      this.audio = null
      this.isPlayingAudio = false
    }
  }

  async getVoices(): Promise<Array<{ id: string; name: string }>> {
    // OpenAI has a fixed set of voices
    return [
      { id: "alloy", name: "Alloy" },
      { id: "echo", name: "Echo" },
      { id: "fable", name: "Fable" },
      { id: "onyx", name: "Onyx" },
      { id: "nova", name: "Nova" },
      { id: "shimmer", name: "Shimmer" },
    ]
  }

  isPlaying(): boolean {
    return this.isPlayingAudio
  }
}

