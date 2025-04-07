"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { v4 as uuidv4 } from "uuid"

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
export interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  timestamp: string
  size: string
  style: string
  saved?: boolean
}

export function SimplifiedImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [size, setSize] = useState("512x512")
  const [style, setStyle] = useState("digital-art")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Get unique categories from image prompts
  const categories = ["all", ...Array.from(new Set(imagePrompts.map((prompt) => prompt.category)))]

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
    }, 3000)
  }

  const handlePromptSelect = (promptContent: string) => {
    setPrompt(promptContent)
  }

  // Filter images by category
  const filteredImages =
    selectedCategory === "all"
      ? generatedImages
      : generatedImages.filter((img) => {
          // This is a simple filter based on keywords in the prompt
          // In a real app, you would have proper categorization
          const lowerPrompt = img.prompt.toLowerCase()
          return lowerPrompt.includes(selectedCategory)
        })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
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
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Prompt Templates</h2>
              <div className="space-y-3">
                {imagePrompts.map((promptItem) => (
                  <div
                    key={promptItem.id}
                    className="p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handlePromptSelect(promptItem.content)}
                  >
                    <h3 className="font-medium text-sm">{promptItem.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{promptItem.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Generated Images</h2>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={image.prompt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                <CardContent className="p-2">
                  <p className="text-xs line-clamp-2">{image.prompt}</p>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{image.style}</span>
                    <span>{image.size.split("x")[0]}px</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

