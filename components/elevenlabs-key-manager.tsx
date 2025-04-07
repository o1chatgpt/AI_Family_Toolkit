"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { setVoiceServiceConfig } from "@/lib/voice-services/voice-service-provider"

export function ElevenlabsKeyManager() {
  const [apiKey, setApiKey] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isTestingKey, setIsTestingKey] = useState(false)
  const [keyStatus, setKeyStatus] = useState<"unknown" | "valid" | "invalid">("unknown")
  const { toast } = useToast()

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem("elevenlabs_api_key")
    if (savedKey) {
      setApiKey(savedKey)
      setKeyStatus("unknown") // We don't know if it's valid until tested
    }
  }, [])

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    // Save to localStorage
    localStorage.setItem("elevenlabs_api_key", apiKey.trim())

    // Set as the active voice service if valid
    if (keyStatus === "valid") {
      setVoiceServiceConfig({
        type: "elevenlabs",
        apiKey: apiKey.trim(),
      })
    }

    toast({
      title: "API Key Saved",
      description: "Your ElevenLabs API key has been saved",
    })

    setIsSaving(false)

    // Test the key after saving
    testApiKey()
  }

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key",
        variant: "destructive",
      })
      return
    }

    setIsTestingKey(true)
    setKeyStatus("unknown")

    try {
      // Test the API key by making a request to the ElevenLabs API
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "xi-api-key": apiKey.trim(),
        },
      })

      if (response.ok) {
        setKeyStatus("valid")
        toast({
          title: "API Key Valid",
          description: "Your ElevenLabs API key is valid",
        })

        // Set as the active voice service
        setVoiceServiceConfig({
          type: "elevenlabs",
          apiKey: apiKey.trim(),
        })
      } else {
        setKeyStatus("invalid")
        toast({
          title: "Invalid API Key",
          description: "The ElevenLabs API key is invalid or has expired",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error testing API key:", error)
      setKeyStatus("invalid")
      toast({
        title: "Connection Error",
        description: "Could not connect to ElevenLabs API. Please check your internet connection.",
        variant: "destructive",
      })
    } finally {
      setIsTestingKey(false)
    }
  }

  const clearApiKey = () => {
    localStorage.removeItem("elevenlabs_api_key")
    setApiKey("")
    setKeyStatus("unknown")
    toast({
      title: "API Key Removed",
      description: "Your ElevenLabs API key has been removed",
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="api-key">API Key</Label>
        <div className="flex">
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your ElevenLabs API key"
            className="flex-1"
          />
          <Button
            variant="outline"
            className="ml-2"
            onClick={() => {
              const input = document.getElementById("api-key") as HTMLInputElement
              if (input) {
                input.type = input.type === "password" ? "text" : "password"
              }
            }}
          >
            <Key className="h-4 w-4" />
          </Button>
        </div>

        {keyStatus === "valid" && (
          <div className="flex items-center text-green-600 text-sm mt-1">
            <Check className="h-4 w-4 mr-1" />
            API key is valid
          </div>
        )}

        {keyStatus === "invalid" && (
          <div className="flex items-center text-red-600 text-sm mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            API key is invalid
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-1">
          You can get an API key from{" "}
          <a
            href="https://elevenlabs.io/app/api-key"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            ElevenLabs API Key page
          </a>
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={clearApiKey}>
          Clear Key
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={testApiKey} disabled={isTestingKey || !apiKey.trim()}>
            {isTestingKey ? "Testing..." : "Test Key"}
          </Button>
          <Button onClick={saveApiKey} disabled={isSaving || !apiKey.trim()}>
            {isSaving ? "Saving..." : "Save Key"}
          </Button>
        </div>
      </div>
    </div>
  )
}

