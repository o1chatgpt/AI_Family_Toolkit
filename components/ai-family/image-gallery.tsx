"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AI_FAMILY_MEMBERS } from "@/constants/ai-family"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Share2, Trash2, MessageSquare } from "lucide-react"

interface GeneratedImage {
  id: string
  prompt: string
  aiMemberId: string
  timestamp: string
  images: string[]
  summary?: string
}

export function ImageGallery() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([
    {
      id: "1",
      prompt: "A futuristic city with flying cars and neon lights",
      aiMemberId: "sophia",
      timestamp: new Date().toISOString(),
      images: ["/placeholder.svg?height=512&width=512"],
      summary:
        "A vibrant futuristic cityscape with towering skyscrapers, flying vehicles, and neon-lit streets. The image captures a cyberpunk aesthetic with a mix of high-tech elements and urban density.",
    },
    {
      id: "2",
      prompt: "A serene mountain landscape with a lake at sunset",
      aiMemberId: "lyra",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      images: ["/placeholder.svg?height=512&width=512", "/placeholder.svg?height=512&width=512"],
      summary:
        "A peaceful mountain scene featuring snow-capped peaks reflected in a calm lake. The sunset casts warm golden and pink hues across the landscape, creating a tranquil atmosphere.",
    },
  ])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<string | null>(null)

  useEffect(() => {
    const handleImageGenerated = (event: CustomEvent) => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        ...event.detail,
      }
      setGeneratedImages((prev) => [newImage, ...prev])
    }

    window.addEventListener("imageGenerated", handleImageGenerated as EventListener)

    return () => {
      window.removeEventListener("imageGenerated", handleImageGenerated as EventListener)
    }
  }, [])

  const generateSummary = (imageId: string) => {
    setIsGeneratingSummary(imageId)

    // Simulate generating a summary
    setTimeout(() => {
      setGeneratedImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                summary:
                  "This AI-generated image showcases the elements described in your prompt, with careful attention to composition, lighting, and detail. The visual style aligns with your specifications, creating a cohesive and appealing result.",
              }
            : img,
        ),
      )
      setIsGeneratingSummary(null)
    }, 2000)
  }

  const deleteImage = (imageId: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generated Images</CardTitle>
        <CardDescription>View and manage your AI-generated images</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {generatedImages.length > 0 ? (
              generatedImages.map((item) => {
                const aiMember = AI_FAMILY_MEMBERS.find((m) => m.id === item.aiMemberId)

                return (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {aiMember && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={aiMember.avatarUrl} alt={aiMember.name} />
                              <AvatarFallback>{aiMember.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <CardTitle className="text-base">{aiMember ? aiMember.name : "AI Assistant"}</CardTitle>
                            <CardDescription className="text-xs">
                              {new Date(item.timestamp).toLocaleString()}
                            </CardDescription>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteImage(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm mb-3">{item.prompt}</p>
                      <div className={`grid grid-cols-${Math.min(item.images.length, 2)} gap-2`}>
                        {item.images.map((imgSrc, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-md overflow-hidden cursor-pointer"
                            onClick={() => setSelectedImage(imgSrc)}
                          >
                            <Image
                              src={imgSrc || "/placeholder.svg"}
                              alt={`Generated image ${index + 1} for "${item.prompt}"`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      {item.summary && (
                        <div className="mt-3 p-3 bg-muted rounded-md">
                          <h4 className="text-sm font-medium mb-1">Image Summary:</h4>
                          <p className="text-sm text-muted-foreground">{item.summary}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>

                      {!item.summary && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => generateSummary(item.id)}
                          disabled={isGeneratingSummary === item.id}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {isGeneratingSummary === item.id ? "Analyzing..." : "Generate Summary"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No images generated yet</p>
                <p className="text-sm text-muted-foreground mt-1">Use the form to generate your first image</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>View the full-size generated image</DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full aspect-square">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Full size preview"
                fill
                className="object-contain"
              />
            </div>
          )}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedImage(null)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

