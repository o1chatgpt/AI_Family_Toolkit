"use client"

import { useState, useEffect } from "react"
import { ElevenlabsKeyManager } from "@/components/elevenlabs-key-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Volume2, Settings, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  type VoiceServiceType,
  getVoiceServiceConfig,
  setVoiceServiceConfig,
  getApiKeyForService,
} from "@/lib/voice-services/voice-service-provider"

export default function VoiceSettingsPage() {
  const [activeTab, setActiveTab] = useState("api-key")
  const [selectedService, setSelectedService] = useState<VoiceServiceType>("elevenlabs")
  const [openaiApiKey, setOpenaiApiKey] = useState("")
  const [humeApiKey, setHumeApiKey] = useState("")
  const { toast } = useToast()

  // Load saved configuration
  useEffect(() => {
    const config = getVoiceServiceConfig()
    if (config.type !== "none") {
      setSelectedService(config.type)
    }

    // Load API keys
    const openaiKey = getApiKeyForService("openai")
    if (openaiKey) setOpenaiApiKey(openaiKey)

    const humeKey = getApiKeyForService("hume")
    if (humeKey) setHumeApiKey(humeKey)
  }, [])

  const saveOpenAIKey = () => {
    if (!openaiApiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem("openai_api_key", openaiApiKey.trim())

    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved",
    })
  }

  const saveHumeKey = () => {
    if (!humeApiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your HUME API key",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem("hume_api_key", humeApiKey.trim())

    toast({
      title: "API Key Saved",
      description: "Your HUME API key has been saved",
    })
  }

  const setActiveVoiceService = (type: VoiceServiceType) => {
    setSelectedService(type)

    // Get the API key for the selected service
    const apiKey = getApiKeyForService(type)

    // Only set if we have an API key
    if (apiKey) {
      setVoiceServiceConfig({
        type,
        apiKey,
      })

      toast({
        title: "Voice Service Updated",
        description: `Voice service set to ${type.toUpperCase()}`,
      })
    } else {
      toast({
        title: "API Key Required",
        description: `Please add your ${type.toUpperCase()} API key first`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Voice Settings</h1>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="api-key" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="voice-service" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span>Voice Service</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-key" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ElevenLabs</CardTitle>
              <CardDescription>High-quality, realistic voice synthesis</CardDescription>
            </CardHeader>
            <CardContent>
              <ElevenlabsKeyManager />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OpenAI</CardTitle>
              <CardDescription>Text-to-speech using OpenAI's TTS models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">API Key</Label>
                <div className="flex">
                  <Input
                    id="openai-api-key"
                    type="password"
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="flex-1"
                  />
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  You can get an API key from{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    OpenAI API Keys page
                  </a>
                </p>
              </div>

              <Button onClick={saveOpenAIKey} disabled={!openaiApiKey.trim()}>
                Save OpenAI Key
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HUME</CardTitle>
              <CardDescription>Expressive voice synthesis with HUME AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hume-api-key">API Key</Label>
                <div className="flex">
                  <Input
                    id="hume-api-key"
                    type="password"
                    value={humeApiKey}
                    onChange={(e) => setHumeApiKey(e.target.value)}
                    placeholder="Enter your HUME API key"
                    className="flex-1"
                  />
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  You can get an API key from{" "}
                  <a
                    href="https://hume.ai/products"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    HUME AI website
                  </a>
                </p>
              </div>

              <Button onClick={saveHumeKey} disabled={!humeApiKey.trim()}>
                Save HUME Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice-service" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Voice Service</CardTitle>
              <CardDescription>Choose which voice service to use for AI Family members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={selectedService}
                onValueChange={(value) => setActiveVoiceService(value as VoiceServiceType)}
              >
                <div className="flex items-center space-x-2 space-y-2">
                  <RadioGroupItem value="elevenlabs" id="elevenlabs" disabled={!getApiKeyForService("elevenlabs")} />
                  <Label htmlFor="elevenlabs" className={!getApiKeyForService("elevenlabs") ? "opacity-50" : ""}>
                    ElevenLabs
                    {selectedService === "elevenlabs" && getApiKeyForService("elevenlabs") && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    )}
                  </Label>
                </div>

                <div className="flex items-center space-x-2 space-y-2">
                  <RadioGroupItem value="openai" id="openai" disabled={!getApiKeyForService("openai")} />
                  <Label htmlFor="openai" className={!getApiKeyForService("openai") ? "opacity-50" : ""}>
                    OpenAI TTS
                    {selectedService === "openai" && getApiKeyForService("openai") && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    )}
                  </Label>
                </div>

                <div className="flex items-center space-x-2 space-y-2">
                  <RadioGroupItem value="hume" id="hume" disabled={!getApiKeyForService("hume")} />
                  <Label htmlFor="hume" className={!getApiKeyForService("hume") ? "opacity-50" : ""}>
                    HUME AI (Coming Soon)
                    {selectedService === "hume" && getApiKeyForService("hume") && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    )}
                  </Label>
                </div>
              </RadioGroup>

              <div className="text-sm mt-4">
                <h3 className="font-medium mb-2">Voice Service Comparison:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-medium">ElevenLabs:</span>
                    <span className="text-muted-foreground">
                      Highest quality, most realistic voices with excellent emotional range. Best for natural
                      conversations.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">OpenAI TTS:</span>
                    <span className="text-muted-foreground">
                      Good quality voices with natural intonation. Limited voice selection but reliable performance.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">HUME AI:</span>
                    <span className="text-muted-foreground">
                      Specialized in emotional expression. Good for conveying specific emotions in responses.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voice Assignments</CardTitle>
              <CardDescription>How AI Family members are mapped to voices in each service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">ElevenLabs Voices:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Stan - Brian (Technical, authoritative)</li>
                    <li>Sophia - Aria (Articulate, creative)</li>
                    <li>Lyra - Freya (Analytical, precise)</li>
                    <li>Kara - Glinda (Warm, creative)</li>
                    <li>Max - Daniel (Energetic, enthusiastic)</li>
                    <li>Nova - Grace (Balanced, neutral)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">OpenAI Voices:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Stan - Onyx (Technical, authoritative)</li>
                    <li>Sophia - Nova (Articulate, creative)</li>
                    <li>Lyra - Shimmer (Analytical, precise)</li>
                    <li>Kara - Alloy (Warm, creative)</li>
                    <li>Max - Echo (Energetic, enthusiastic)</li>
                    <li>Nova - Fable (Balanced, neutral)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

