"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"
import { AlertCircle, Download, ImageIcon, Loader2, RefreshCw, Share2, Sparkles, ThumbsUp } from "lucide-react"
import { useApiConnection } from "@/components/api-connection-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { getUserId } from "@/lib/supabase/utils"

// Sample image generation history
const sampleHistory = [
  {
    id: "img1",
    prompt: "A futuristic city with flying cars and neon lights",
    model: "dall-e-3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    imageUrl: "/placeholder.svg?height=512&width=512",
    status: "completed",
    bookmarked: true,
  },
  {
    id: "img2",
    prompt: "A serene mountain landscape with a lake at sunset",
    model: "dall-e-3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    imageUrl: "/placeholder.svg?height=512&width=512",
    status: "completed",
    bookmarked: false,
  },
  {
    id: "img3",
    prompt: "An astronaut riding a horse on Mars, digital art",
    model: "dall-e-3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    imageUrl: "/placeholder.svg?height=512&width=512",
    status: "completed",
    bookmarked: true,
  },
]

export default function ImagePage() {
  const router = useRouter()
  const { connectionStatus, apiKey } = useApiConnection()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("generate")
  const [imageHistory, setImageHistory] = useState(sampleHistory)
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [imageSettings, setImageSettings] = useState({
    model: "dall-e-3",
    size: "1024x1024",
    quality: "standard",
    style: "vivid",
    numberOfImages: 1,
  })
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const id = await getUserId()
        setUserId(id)
        setIsAuthenticated(!!id)
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedImage(null)

    try {
      // In a real app, this would be an API call to an image generation service
      // For demo purposes, we'll simulate a delay and use a placeholder
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Demo mode - use placeholder image
      const placeholderImage = `/placeholder.svg?height=1024&width=1024&text=${encodeURIComponent(prompt)}`
      setGeneratedImage(placeholderImage)

      // Create a new history item
      const newImage = {
        id: uuidv4(),
        prompt,
        model: imageSettings.model,
        createdAt: new Date().toISOString(),
        imageUrl: placeholderImage,
        status: "completed",
        bookmarked: false,
      }

      // Add to history
      setImageHistory((prev) => [newImage, ...prev])

      // If authenticated, save to Supabase
      if (isAuthenticated && userId) {
        try {
          // Save image generation to Supabase
          const { error } = await supabase.from("image_generations").insert({
            user_id: userId,
            prompt: prompt,
            model: imageSettings.model,
            image_url: placeholderImage, // In a real app, this would be the actual image URL
            settings: imageSettings,
          })

          if (error) {
            console.error("Error saving image generation:", error)
          }
        } catch (error) {
          console.error("Error saving to Supabase:", error)
        }
      }

      toast({
        title: "Image generated",
        description: "Your image has been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBookmarkToggle = (id: string) => {
    setImageHistory((prev) => prev.map((img) => (img.id === id ? { ...img, bookmarked: !img.bookmarked } : img)))
  }

  const handleImageSelect = (image: any) => {
    setSelectedImage(image)
    setActiveTab("view")
  }

  const handleDownloadImage = (imageUrl: string) => {
    // In a real app, this would download the actual image
    // For demo purposes, we'll just show a toast
    toast({
      title: "Image downloaded",
      description: "Your image has been downloaded successfully.",
    })
  }

  const handleShareImage = (id: string) => {
    // In a real app, this would generate a shareable link
    // For demo purposes, we'll just copy a fake URL to clipboard
    const shareUrl = `https://example.com/shared-image/${id}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link copied",
      description: "Shareable link has been copied to clipboard.",
    })
  }

  const handleDeleteImage = (id: string) => {
    setImageHistory((prev) => prev.filter((img) => img.id !== id))
    if (selectedImage?.id === id) {
      setSelectedImage(null)
      setActiveTab("generate")
    }
    toast({
      title: "Image deleted",
      description: "The image has been removed from your history.",
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              History
            </TabsTrigger>
            {selectedImage && (
              <TabsTrigger value="view" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                View
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Image Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the image you want to generate..."
                  className="min-h-[120px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select
                    value={imageSettings.model}
                    onValueChange={(value) => setImageSettings({ ...imageSettings, model: value })}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                      <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                      <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select
                    value={imageSettings.size}
                    onValueChange={(value) => setImageSettings({ ...imageSettings, size: value })}
                  >
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024x1024">1024 x 1024</SelectItem>
                      <SelectItem value="1024x1792">1024 x 1792</SelectItem>
                      <SelectItem value="1792x1024">1792 x 1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="advanced-settings" className="cursor-pointer">
                  Advanced Settings
                </Label>
                <Switch
                  id="advanced-settings"
                  checked={showAdvancedSettings}
                  onCheckedChange={setShowAdvancedSettings}
                />
              </div>

              {showAdvancedSettings && (
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quality">Quality</Label>
                      <Select
                        value={imageSettings.quality}
                        onValueChange={(value) => setImageSettings({ ...imageSettings, quality: value })}
                      >
                        <SelectTrigger id="quality">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="hd">HD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="style">Style</Label>
                      <Select
                        value={imageSettings.style}
                        onValueChange={(value) => setImageSettings({ ...imageSettings, style: value })}
                      >
                        <SelectTrigger id="style">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vivid">Vivid</SelectItem>
                          <SelectItem value="natural">Natural</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="number-of-images">Number of Images: {imageSettings.numberOfImages}</Label>
                    </div>
                    <Slider
                      id="number-of-images"
                      min={1}
                      max={4}
                      step={1}
                      value={[imageSettings.numberOfImages]}
                      onValueChange={(value) => setImageSettings({ ...imageSettings, numberOfImages: value[0] })}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerateImage}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
                size="lg"
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
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Demo Mode</AlertTitle>
                  <AlertDescription>
                    You're in demo mode. Images will be placeholders. Connect your API key in settings for real
                    generation.
                  </AlertDescription>
                </Alert>
              )}

              {!isAuthenticated && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Not Logged In</AlertTitle>
                  <AlertDescription>
                    You're not logged in. Your generated images won't be saved to your account.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex flex-col items-center justify-center border rounded-lg p-6 min-h-[400px]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                  <h3 className="text-xl font-medium mb-2">Generating Your Image</h3>
                  <p className="text-muted-foreground max-w-md">
                    This may take a moment. We're turning your description into a visual masterpiece.
                  </p>
                </div>
              ) : generatedImage ? (
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-full aspect-square mb-4">
                    <Image
                      src={generatedImage || "/placeholder.svg"}
                      alt={prompt}
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => handleDownloadImage(generatedImage)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleShareImage(imageHistory[0]?.id || "temp")}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleBookmarkToggle(imageHistory[0]?.id || "temp")}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <ImageIcon className="h-12 w-12 mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No Image Generated Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Enter a description and click "Generate Image" to create your image.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Image History</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Images</SelectItem>
                  <SelectItem value="bookmarked">Bookmarked Only</SelectItem>
                  <SelectItem value="recent">Recent (7 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {imageHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ImageIcon className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No Images Yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  You haven't generated any images yet. Go to the Generate tab to create your first image.
                </p>
                <Button onClick={() => setActiveTab("generate")}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Your First Image
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {imageHistory.map((image) => (
                  <Card
                    key={image.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleImageSelect(image)}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={image.prompt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {image.bookmarked && <Badge className="absolute top-2 right-2 bg-primary">Bookmarked</Badge>}
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm font-medium line-clamp-2">{image.prompt}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                        <span>{image.model}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {selectedImage && (
          <TabsContent value="view">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-square border rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.imageUrl || "/placeholder.svg"}
                  alt={selectedImage.prompt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {selectedImage.bookmarked && <Badge className="absolute top-2 right-2 bg-primary">Bookmarked</Badge>}
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Image Details</h2>
                  <p className="text-muted-foreground">{selectedImage.prompt}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <p className="font-medium">{new Date(selectedImage.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Model</Label>
                    <p className="font-medium">{selectedImage.model}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className="font-medium capitalize">{selectedImage.status}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">ID</Label>
                    <p className="font-medium text-xs truncate">{selectedImage.id}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-3">
                  <Button onClick={() => handleDownloadImage(selectedImage.imageUrl)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                  <Button variant="outline" onClick={() => handleShareImage(selectedImage.id)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Image
                  </Button>
                  <Button
                    variant={selectedImage.bookmarked ? "default" : "outline"}
                    onClick={() => handleBookmarkToggle(selectedImage.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {selectedImage.bookmarked ? "Bookmarked" : "Bookmark"}
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteImage(selectedImage.id)}>
                    Delete Image
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Try Similar</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPrompt(selectedImage.prompt)}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPrompt(`${selectedImage.prompt}, but at night`)
                        setActiveTab("generate")
                      }}
                    >
                      Night Version
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPrompt(`${selectedImage.prompt}, but in a different style`)
                        setActiveTab("generate")
                      }}
                    >
                      Different Style
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

