export interface VoiceServiceInterface {
  speak(text: string, voiceId: string): Promise<void>
  stop(): void
  getVoices(): Promise<Array<{ id: string; name: string }>>
  isPlaying(): boolean
}

