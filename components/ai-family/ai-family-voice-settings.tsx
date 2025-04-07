"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VolumeIcon, Volume2Icon, MicIcon, PlayIcon, PauseIcon } from "lucide-react"

interface AIFamilyVoiceSettingsProps {
  memberId: string
  voiceId: string
  voiceService: string
}

export function AIFamilyVoiceSettings({ memberId, voiceId, voiceService }: AIFamilyVoiceSettingsProps) {
  const [selectedVoiceService, setSelectedVoiceService] = useState(voiceService || "ElevenLabs")
  const [selectedVoiceId, setSelectedVoiceId] = useState(voiceId || "")
  const [volume, setVolume] = useState(80)
  const [speed, setSpeed] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const voiceServices = [
    { id: "ElevenLabs", name: "ElevenLabs" },
    { id: "OpenAI", name: "OpenAI" },
    { id: "Hume", name: "Hume" },
  ]

  const voiceOptions = {
    ElevenLabs: [
      { id: "bella", name: "Bella" },
      { id: "tony", name: "Tony" },
      { id: "midnight", name: "Midnight" },
    ],
    OpenAI: [
      { id: "nova", name: "Nova" },
      { id: "echo", name: "Echo" },
      { id: "flux", name: "Flux" },
      { id: "soul", name: "Soul" },
    ],
    Hume: [{ id: "dawn", name: "Dawn" }],
  }

  const handlePlaySample = () => {
    setIsPlaying(!isPlaying)

    // Simulate playing a voice sample
    if (!isPlaying) {
      setTimeout(() => {
        setIsPlaying(false)
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Voice Settings</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="voice-enabled" className="text-sm">
                Enable Voice
              </Label>
              <Switch id="voice-enabled" checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
            </div>
          </div>
          <CardDescription>Configure the voice settings for this AI family member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="voice-service">Voice Service</Label>
                <Select value={selectedVoiceService} onValueChange={setSelectedVoiceService} disabled={!voiceEnabled}>
                  <SelectTrigger id="voice-service">
                    <SelectValue placeholder="Select voice service" />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-id">Voice</Label>
                <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId} disabled={!voiceEnabled}>
                  <SelectTrigger id="voice-id">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceOptions[selectedVoiceService as keyof typeof voiceOptions]?.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="volume">Volume: {volume}%</Label>
                  <VolumeIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={1}
                  value={[volume]}
                  onValueChange={(values) => setVolume(values[0])}
                  disabled={!voiceEnabled}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="speed">Speed: {speed.toFixed(1)}x</Label>
                  <Volume2Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Slider
                  id="speed"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={[speed]}
                  onValueChange={(values) => setSpeed(values[0])}
                  disabled={!voiceEnabled}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="pitch">Pitch: {pitch.toFixed(1)}</Label>
                  <MicIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Slider
                  id="pitch"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={[pitch]}
                  onValueChange={(values) => setPitch(values[0])}
                  disabled={!voiceEnabled}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePlaySample}
                disabled={!voiceEnabled || !selectedVoiceId}
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="h-4 w-4 mr-2" />
                    Stop Sample
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Play Voice Sample
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Text-to-Speech Settings</CardTitle>
          <CardDescription>Configure when and how text-to-speech is triggered</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="triggers">
            <TabsList className="mb-4">
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="triggers">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-read-messages" className="font-medium">
                      Auto-read Messages
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically read messages from this AI family member
                    </p>
                  </div>
                  <Switch id="auto-read-messages" defaultChecked={true} disabled={!voiceEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="read-notifications" className="font-medium">
                      Read Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Read notifications from this AI family member</p>
                  </div>
                  <Switch id="read-notifications" defaultChecked={false} disabled={!voiceEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="read-task-updates" className="font-medium">
                      Read Task Updates
                    </Label>
                    <p className="text-sm text-muted-foreground">Read task updates from this AI family member</p>
                  </div>
                  <Switch id="read-task-updates" defaultChecked={true} disabled={!voiceEnabled} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stream-audio" className="font-medium">
                      Stream Audio
                    </Label>
                    <p className="text-sm text-muted-foreground">Stream audio as it's being generated</p>
                  </div>
                  <Switch id="stream-audio" defaultChecked={true} disabled={!voiceEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cache-audio" className="font-medium">
                      Cache Audio
                    </Label>
                    <p className="text-sm text-muted-foreground">Cache audio for faster playback</p>
                  </div>
                  <Switch id="cache-audio" defaultChecked={true} disabled={!voiceEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-length">Maximum Text Length</Label>
                  <Select defaultValue="500" disabled={!voiceEnabled}>
                    <SelectTrigger id="max-length">
                      <SelectValue placeholder="Select maximum text length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 characters</SelectItem>
                      <SelectItem value="250">250 characters</SelectItem>
                      <SelectItem value="500">500 characters</SelectItem>
                      <SelectItem value="1000">1000 characters</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Maximum text length to convert to speech</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

