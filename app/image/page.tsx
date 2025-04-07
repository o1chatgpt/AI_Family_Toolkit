"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { v4 as uuidv4 } from "uuid"
import { cn } from "@/lib/utils"

// Image generation options
const sizeOptions = [
  { value: "256x256", label: "Small (256x256)" },
  { value: "512x512", label: "Medium (512x512)" },
  { value: "1024x1024", label: "Large (1024x1024)" },
]

const styleOptions = [
  { value: "photorealistic", label: "Photorealistic" },
  { value: "digital-art", label: "Digital Art" },
  { value: "anime", label: "Anime" },
  { value: "oil-painting", label: "Oil Painting" },
  { value: "watercolor", label: "Watercolor" },
  { value: "sketch", label: "Sketch" },
  { value: "3d-render", label: "3D Render" },
]

// Sample image prompts
const imagePrompts = [
  {
    id: "1",
    title: "Landscape Scene",
    content: "A beautiful mountain landscape with a lake at sunset, photorealistic style",
    category: "landscape",
  },
  {
    id: "2",
    title: "Character Portrait",
    content: "A portrait of a fantasy character with glowing eyes and ornate armor",
    category: "portrait",
  },
  {
    id: "3",
    title: "Futuristic City",
    content: "A futuristic cyberpunk city at night with neon lights and flying vehicles",
    category: "cityscape",
  },
  {
    id: "4",
    title: "Product Showcase",
    content: "A sleek modern smartphone on a minimalist desk with soft lighting",
    category: "product",
  },
  {
    id: "5",
    title: "Abstract Art",
    content: "An abstract painting with vibrant colors and flowing shapes",
    category: "abstract",
  },
]

// Generated image type
interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  timestamp: string
  size: string
  style: string
  saved?: boolean
}

export default function ImagePage() {
  const [prompt, setPrompt] = useState("")
  const [size, setSize] = useState("512x512")
  const [style, setStyle] = useState("photorealistic")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setProgress(0)

    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 200)

    // Simulate image generation
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)

      const [width, height] = size.split("x").map(Number)

      const newImage: GeneratedImage = {
        id: uuidv4(),
        prompt: prompt,
        imageUrl: `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(prompt.substring(0, 20))}`,
        timestamp: new Date().toISOString(),
        size: size,
        style: style,
        saved: false,
      }

      setGeneratedImages((prev) => [newImage, ...prev])
      setIsGenerating(false)
      setProgress(0)
      setSelectedImageIndex(0) // Reset to the first image
    }, 3000)
  }

  const handlePromptSelect = (promptContent: string) => {
    setPrompt(promptContent)
  }

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Image Generation</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Column */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Image Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleGenerateImage} disabled={isGenerating || !prompt.trim()} className="w-full">
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

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating image...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thumbnail View */}
          {generatedImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Previous Builds</CardTitle>
              </CardHeader>
              <CardContent className="p-3 flex overflow-x-auto">
                {generatedImages.slice(0, 3).map((image, index) => (
                  <div
                    key={image.id}
                    className={cn(
                      "relative w-24 h-24 border rounded-md overflow-hidden cursor-pointer",
                      index === selectedImageIndex ? "ring-2 ring-primary" : "hover:opacity-75",
                    )}
                    onClick={() => handleSelectImage(index)}
                  >
                    <Image
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={image.prompt}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Second Column */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Images</CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex overflow-x-auto">
              {generatedImages.map((image, index) => (
                <div
                  key={image.id}
                  className={cn(
                    "relative w-24 h-24 border rounded-md overflow-hidden cursor-pointer",
                    index === selectedImageIndex ? "ring-2 ring-primary" : "hover:opacity-75",
                  )}
                  onClick={() => handleSelectImage(index)}
                >
                  <Image src={image.imageUrl || "/placeholder.svg"} alt={image.prompt} fill className="object-cover" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Administrator Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This section will showcase the build under the guidance of the administrator.</p>
            </CardContent>
          </Card>
        </div>

        {/* Third Column */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {generatedImages.length > 0 ? (
                <div className="relative aspect-square w-full">
                  <Image
                    src={generatedImages[selectedImageIndex].imageUrl || "/placeholder.svg"}
                    alt={generatedImages[selectedImageIndex].prompt}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <p className="text-muted-foreground">No image generated yet.</p>
                </div>
              )}
            </CardContent>
            <CardContent className="p-3">
              <div className="flex justify-between">
                <Button variant="outline">Assign Task</Button>
                <Button>Make More Images</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

