"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import type { AIFamilyMember } from "@/constants/ai-family"

const formSchema = z.object({
  id: z.string().min(2, {
    message: "ID must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  specialty: z.string().min(2, {
    message: "Specialty must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  model: z.string().min(2, {
    message: "Model must be at least 2 characters.",
  }),
  fallbackModel: z.string().min(2, {
    message: "Fallback model must be at least 2 characters.",
  }),
  color: z.string().min(2, {
    message: "Color must be at least 2 characters.",
  }),
  systemPrompt: z.string().min(10, {
    message: "System prompt must be at least 10 characters.",
  }),
  voiceService: z.string().optional(),
  voiceId: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  capabilities: z.array(z.string()).optional(),
  toolkits: z.array(z.string()).optional(),
})

export function AIFamilyAddForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState("")
  const [capabilities, setCapabilities] = useState<string[]>([])
  const [newCapability, setNewCapability] = useState("")
  const [toolkits, setToolkits] = useState<string[]>([])
  const [newToolkit, setNewToolkit] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      role: "",
      specialty: "",
      description: "",
      model: "gpt-4",
      fallbackModel: "gpt-3.5-turbo",
      color: "blue",
      systemPrompt: "",
      voiceService: "",
      voiceId: "",
      specialties: [],
      capabilities: [],
      toolkits: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Create a new AI family member
    const newMember: AIFamilyMember = {
      ...values,
      avatarUrl: `/avatars/${values.id}.png`,
      capabilities: capabilities,
      isActive: true,
      tasks: [],
      schedule: [],
      specialties: specialties,
      default_toolkit: toolkits,
    }

    // Here you would typically save this to your database
    console.log("New AI Family Member:", newMember)

    // For now, we'll just simulate a successful save
    setTimeout(() => {
      setIsSubmitting(false)
      // Reset the form
      form.reset()
      setSpecialties([])
      setCapabilities([])
      setToolkits([])

      // Redirect to the AI family roster page
      router.push("/ai-family")
      router.refresh()
    }, 1000)
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() !== "" && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()])
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty))
  }

  const addCapability = () => {
    if (newCapability.trim() !== "" && !capabilities.includes(newCapability.trim())) {
      setCapabilities([...capabilities, newCapability.trim()])
      setNewCapability("")
    }
  }

  const removeCapability = (capability: string) => {
    setCapabilities(capabilities.filter((c) => c !== capability))
  }

  const addToolkit = () => {
    if (newToolkit.trim() !== "" && !toolkits.includes(newToolkit.trim())) {
      setToolkits([...toolkits, newToolkit.trim()])
      setNewToolkit("")
    }
  }

  const removeToolkit = (toolkit: string) => {
    setToolkits(toolkits.filter((t) => t !== toolkit))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            <TabsTrigger value="voice">Voice & Model</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., stan" {...field} />
                    </FormControl>
                    <FormDescription>A unique identifier for this AI family member</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Stan" {...field} />
                    </FormControl>
                    <FormDescription>The display name for this AI family member</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lead Developer" {...field} />
                    </FormControl>
                    <FormDescription>The primary role of this AI family member</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Specialty</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JavaScript & React" {...field} />
                    </FormControl>
                    <FormDescription>The main specialty of this AI family member</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="specialties"
                      render={() => (
                        <FormItem>
                          <FormLabel>Additional Specialties</FormLabel>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              placeholder="Add a specialty"
                              value={newSpecialty}
                              onChange={(e) => setNewSpecialty(e.target.value)}
                            />
                            <Button type="button" variant="outline" onClick={addSpecialty}>
                              Add
                            </Button>
                          </div>
                          <FormDescription>Add multiple specialties for this AI family member</FormDescription>
                        </FormItem>
                      )}
                    />

                    {specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {specialties.map((specialty, index) => (
                          <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-sm">{specialty}</span>
                            <button
                              type="button"
                              onClick={() => removeSpecialty(specialty)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe this AI family member..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>
                    A detailed description of this AI family member's purpose and abilities
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Color</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="teal">Teal</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The theme color for this AI family member</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="capabilities" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="capabilities"
                      render={() => (
                        <FormItem>
                          <FormLabel>Capabilities</FormLabel>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              placeholder="Add a capability"
                              value={newCapability}
                              onChange={(e) => setNewCapability(e.target.value)}
                            />
                            <Button type="button" variant="outline" onClick={addCapability}>
                              Add
                            </Button>
                          </div>
                          <FormDescription>Add capabilities for this AI family member</FormDescription>
                        </FormItem>
                      )}
                    />

                    {capabilities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {capabilities.map((capability, index) => (
                          <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-sm">{capability}</span>
                            <button
                              type="button"
                              onClick={() => removeCapability(capability)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="toolkits"
                      render={() => (
                        <FormItem>
                          <FormLabel>Default Toolkit</FormLabel>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              placeholder="Add a toolkit item"
                              value={newToolkit}
                              onChange={(e) => setNewToolkit(e.target.value)}
                            />
                            <Button type="button" variant="outline" onClick={addToolkit}>
                              Add
                            </Button>
                          </div>
                          <FormDescription>Add default toolkit items for this AI family member</FormDescription>
                        </FormItem>
                      )}
                    />

                    {toolkits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {toolkits.map((toolkit, index) => (
                          <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-sm">{toolkit}</span>
                            <button
                              type="button"
                              onClick={() => removeToolkit(toolkit)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the system prompt for this AI family member..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The system prompt that defines this AI family member's behavior</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="voice" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="voiceService"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a voice service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ElevenLabs">ElevenLabs</SelectItem>
                        <SelectItem value="OpenAI">OpenAI</SelectItem>
                        <SelectItem value="Hume">Hume</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The voice service to use for this AI family member</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voiceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., bella" {...field} />
                    </FormControl>
                    <FormDescription>The voice ID to use for this AI family member</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The primary AI model to use for this AI family member</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fallbackModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fallback Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a fallback model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The fallback AI model to use if the primary model is unavailable</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create AI Family Member"}
        </Button>
      </form>
    </Form>
  )
}

