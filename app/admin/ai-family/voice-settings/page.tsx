"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAIFamilyMembers, type AIFamilyMember } from "@/data/ai-family-members"
import { getAvailableVoices, AI_FAMILY_VOICES, assignVoiceToMember } from "@/lib/voice-service"
import { Volume2, RefreshCw, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Voice {
  voice_id: string
  name: string
  preview_url: string
  category: string
  labels?: Record<string, string>
}

export default function VoiceSettingsPage() {
  const [apiKey, setApiKey] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [voices, setVoices] = useState<Voice[]>([])
  const [members, setMembers] = useState<AIFamilyMember[]>([])
  const [selectedMember, setSelectedMember] = useState<string>("")
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [voiceSettings, setVoiceSettings] = useState({
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.3,
    use_speaker_boost: true,
  })
  const [previewText, setPreviewText] = useState("Hello, I'm your AI assistant. How can I help you today?")
  const [previewAudio, setPreviewAudio] = useState<string | null>(null)
  const [isPlayingPreview, setIsPlayingPreview] = useState(false)
  const { toast } = useToast()

  // Load AI Family members on mount
  useEffect(() => {
    const allMembers = getAIFamilyMembers()
    setMembers(allMembers)

    // Get API key from localStorage
    const savedApiKey = localStorage.getItem("elevenlabs_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  // Load voices when API key is set
  useEffect(() => {
    if (apiKey) {
      loadVoices()
    }
  }, [apiKey])

  // Load voice settings when member is selected
  useEffect(() => {
    if (selectedMember) {
      const memberVoiceSettings = AI_FAMILY_VOICES[selectedMember as keyof typeof AI_FAMILY_VOICES]
      if (memberVoiceSettings) {
        setSelectedVoice(memberVoiceSettings.voiceId)
        setVoiceSettings(memberVoiceSettings.settings)
      }
    }
  }, [selectedMember])

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (previewAudio) {
        URL.revokeObjectURL(previewAudio)
      }
    }
  }, [previewAudio])

  const loadVoices = async () => {
    setIsLoading(true)
    try {
      const availableVoices = await getAvailableVoices(apiKey)
      setVoices(availableVoices)

      // Save API key to localStorage
      localStorage.setItem("elevenlabs_api_key", apiKey)

      toast({
        title: "Success",
        description: `Loaded ${availableVoices.length} voices from ElevenLabs`,
      })
    } catch (error) {
      console.error("Error loading voices:", error)
      toast({
        title: "Error",
        description: "Failed to load voices. Please check your API key.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const playPreview = async () => {
    if (!selectedVoice || !apiKey) return

    setIsLoading(true)
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: previewText,
          model_id: "eleven_monolingual_v1",
          voice_settings: voiceSettings,
        }),
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`)
      }

      // Get audio as blob
      const audioBlob = await response.blob()

      // Create a URL for the audio blob
      if (previewAudio) {
        URL.revokeObjectURL(previewAudio)
      }

      const audioUrl = URL.createObjectURL(audioBlob)
      setPreviewAudio(audioUrl)

      // Play the audio
      const audio = new Audio(audioUrl)
      audio.addEventListener("play", () => setIsPlayingPreview(true))
      audio.addEventListener("ended", () => setIsPlayingPreview(false))
      audio.addEventListener("pause", () => setIsPlayingPreview(false))
      audio.play()
    } catch (error) {
      console.error("Error playing preview:", error)
      toast({
        title: "Error",
        description: "Failed to generate voice preview.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveVoiceSettings = async () => {
    if (!selectedMember || !selectedVoice) return

    setIsLoading(true)
    try {
      const success = await assignVoiceToMember(selectedMember, selectedVoice, voiceSettings)

      if (success) {
        toast({
          title: "Success",
          description: `Voice settings saved for ${members.find((m) => m.id === selectedMember)?.name}`,
        })
      } else {
        throw new Error("Failed to save voice settings")
      }
    } catch (error) {
      console.error("Error saving voice settings:", error)
      toast({
        title: "Error",
        description: "Failed to save voice settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">AI Family Voice Settings</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ElevenLabs API Configuration</CardTitle>
            <CardDescription>
              Configure your ElevenLabs API key to enable voice capabilities for AI Family members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="api-key">ElevenLabs API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your ElevenLabs API key"
                />
              </div>
              <Button onClick={loadVoices} disabled={!apiKey || isLoading} className="self-end">
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Load Voices
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voice Assignment</CardTitle>
            <CardDescription>Assign voices to AI Family members and customize voice settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="assign">
              <TabsList className="mb-4">
                <TabsTrigger value="assign">Assign Voices</TabsTrigger>
                <TabsTrigger value="settings">Voice Settings</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="assign">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="member-select">Select AI Family Member</Label>
                    <Select value={selectedMember} onValueChange={setSelectedMember}>
                      <SelectTrigger id="member-select">
                        <SelectValue placeholder="Select a member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} - {member.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="voice-select">Select Voice</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={voices.length === 0}>
                      <SelectTrigger id="voice-select">
                        <SelectValue placeholder={voices.length === 0 ? "Load voices first" : "Select a voice"} />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.voice_id} value={voice.voice_id}>
                            {voice.name} {voice.category ? `(${voice.category})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="stability-slider">Stability: {voiceSettings.stability.toFixed(2)}</Label>
                    </div>
                    <Slider
                      id="stability-slider"
                      min={0}
                      max={1}
                      step={0.01}
                      value={[voiceSettings.stability]}
                      onValueChange={(value) => setVoiceSettings({ ...voiceSettings, stability: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher values make the voice more consistent but may sound less natural.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="similarity-slider">
                        Similarity Boost: {voiceSettings.similarity_boost.toFixed(2)}
                      </Label>
                    </div>
                    <Slider
                      id="similarity-slider"
                      min={0}
                      max={1}
                      step={0.01}
                      value={[voiceSettings.similarity_boost]}
                      onValueChange={(value) => setVoiceSettings({ ...voiceSettings, similarity_boost: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher values make the voice sound more like the original voice sample.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="style-slider">Style: {voiceSettings.style.toFixed(2)}</Label>
                    </div>
                    <Slider
                      id="style-slider"
                      min={0}
                      max={1}
                      step={0.01}
                      value={[voiceSettings.style]}
                      onValueChange={(value) => setVoiceSettings({ ...voiceSettings, style: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher values increase style transfer, adding more emotion and expressiveness.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="speaker-boost"
                      checked={voiceSettings.use_speaker_boost}
                      onCheckedChange={(checked) => setVoiceSettings({ ...voiceSettings, use_speaker_boost: checked })}
                    />
                    <Label htmlFor="speaker-boost">Use Speaker Boost</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="preview-text">Preview Text</Label>
                    <Textarea
                      id="preview-text"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="Enter text to preview the voice"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={playPreview}
                      disabled={!selectedVoice || !apiKey || isLoading || !previewText.trim()}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Volume2 className="h-4 w-4 mr-2" />
                      )}
                      {isPlayingPreview ? "Playing..." : "Play Preview"}
                    </Button>

                    <Button
                      onClick={saveVoiceSettings}
                      disabled={!selectedMember || !selectedVoice || isLoading}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Voice Settings
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

