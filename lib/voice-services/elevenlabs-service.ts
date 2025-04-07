import type { VoiceServiceInterface } from "./voice-service-interface"

export class ElevenLabsService implements VoiceServiceInterface {
  private apiKey: string
  private audio: HTMLAudioElement | null = null
  private isPlayingAudio = false

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async speak(text: string, voiceId: string): Promise<void> {
    try {
      this.stop()

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`)
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
      console.error("Error generating speech with ElevenLabs:", error)
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
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "xi-api-key": this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const data = await response.json()
      return data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
      }))
    } catch (error) {
      console.error("Error fetching ElevenLabs voices:", error)
      return []
    }
  }

  isPlaying(): boolean {
    return this.isPlayingAudio
  }
}

