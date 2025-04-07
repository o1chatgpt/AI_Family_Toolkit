"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AI_FAMILY_MEMBERS } from "@/constants/ai-family"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  prompt: z.string().min(5, {
    message: "Prompt must be at least 5 characters.",
  }),
  negativePrompt: z.string().optional(),
  aiMemberId: z.string({
    required_error: "Please select an AI family member.",
  }),
  width: z.number().min(256).max(1024),
  height: z.number().min(256).max(1024),
  numImages: z.number().min(1).max(4),
})

export function ImageGenerationForm() {
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      negativePrompt: "",
      aiMemberId: "",
      width: 512,
      height: 512,
      numImages: 1,
    },
  })

  // Filter AI family members who have image generation capabilities
  const imageGenerationMembers = AI_FAMILY_MEMBERS.filter(
    (member) =>
      member.capabilities.some(
        (cap) => cap.includes("image") || cap.includes("design") || cap.includes("ui") || cap.includes("ux"),
      ) || member.default_toolkit?.some((tool) => tool.includes("image")),
  )

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)

    // Simulate image generation
    console.log("Generating images with:", values)

    // In a real implementation, you would call your image generation API here
    setTimeout(() => {
      setIsGenerating(false)

      // Dispatch an event to notify the gallery component
      const event = new CustomEvent("imageGenerated", {
        detail: {
          prompt: values.prompt,
          aiMemberId: values.aiMemberId,
          timestamp: new Date().toISOString(),
          images: [
            `/placeholder.svg?height=${values.height}&width=${values.width}`,
            `/placeholder.svg?height=${values.height}&width=${values.width}`,
          ].slice(0, values.numImages),
        },
      })
      window.dispatchEvent(event)

      form.reset({
        ...values,
        prompt: "",
        negativePrompt: "",
      })
    }, 3000)
  }

  const selectedMember = AI_FAMILY_MEMBERS.find((m) => m.id === form.watch("aiMemberId"))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Images</CardTitle>
        <CardDescription>Use AI to generate images based on your prompts</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="aiMemberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Assistant</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an AI assistant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {imageGenerationMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatarUrl} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose an AI assistant to generate your images</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedMember && (
              <div className="bg-muted p-3 rounded-md flex items-start gap-3">
                <Avatar className="h-10 w-10 mt-1">
                  <AvatarImage src={selectedMember.avatarUrl} alt={selectedMember.name} />
                  <AvatarFallback>{selectedMember.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedMember.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedMember.role}</p>
                  <p className="text-sm mt-1">{selectedMember.description}</p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the image you want to generate..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Be detailed and specific about what you want to see in the image</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="negativePrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Negative Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you don't want to see in the image..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Specify elements you want to exclude from the generated image</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width: {field.value}px</FormLabel>
                    <FormControl>
                      <Slider
                        min={256}
                        max={1024}
                        step={64}
                        defaultValue={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height: {field.value}px</FormLabel>
                    <FormControl>
                      <Slider
                        min={256}
                        max={1024}
                        step={64}
                        defaultValue={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="numImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Images: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={4}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Images"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

