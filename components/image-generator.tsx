"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useApiConnection } from "@/components/api-connection-manager"

export function ImageGenerator() {
  const { connectionStatus } = useApiConnection()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedImage(null)

    try {
      // In a real app, this would be an API call to an image generation service
      // For demo purposes, we'll simulate a delay and use a placeholder
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Demo mode - use placeholder image
      const placeholderImage = `/placeholder.svg?height=512&width=512&text=${encodeURIComponent(prompt)}`
      setGeneratedImage(placeholderImage)
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-prompt">Image Description</Label>
        <Textarea
          id="image-prompt"
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <Button
        onClick={handleGenerateImage}
        disabled={isGenerating || !prompt.trim() || connectionStatus !== "connected"}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Image
          </>
        )}
      </Button>

      {connectionStatus !== "connected" && (
        <div className="text-xs text-amber-500">Connect your API key in settings to generate images.</div>
      )}

      {generatedImage && (
        <div className="mt-4">
          <div className="relative aspect-square w-full max-w-md mx-auto border rounded-lg overflow-hidden">
            <Image
              src={generatedImage || "/placeholder.svg"}
              alt={prompt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      )}
    </div>
  )
}

