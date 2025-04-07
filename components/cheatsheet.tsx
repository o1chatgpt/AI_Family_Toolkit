"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Edit,
  Plus,
  Sparkles,
  Play,
  Save,
  Trash,
  Keyboard,
  Info,
  HelpCircle,
  MessageSquare,
  ImageIcon,
  Code,
  Wand2,
} from "lucide-react"

// Define the types for our context variables
interface ContextVariable {
  key: string
  value: string
  description: string
  type: "text" | "textarea" | "select" | "number"
  options?: string[] // For select type
}

// Define the types for prompt variations
interface PromptVariation {
  id: string
  title: string
  description: string
  template: string
  tags: string[]
}

// Define the types for prompt categories
interface PromptCategory {
  id: "chat" | "image" | "code"
  name: string
  icon: React.ReactNode
  description: string
  contextVariables: ContextVariable[]
  variations: PromptVariation[]
}

// Sample context variables for different categories
const defaultContextVariables: Record<string, ContextVariable[]> = {
  chat: [
    { key: "user.name", value: "John Doe", description: "Your name", type: "text" },
    { key: "user.role", value: "Developer", description: "Your professional role", type: "text" },
    {
      key: "user.tone",
      value: "Professional",
      description: "Preferred tone of response",
      type: "select",
      options: ["Professional", "Casual", "Friendly", "Technical", "Simple"],
    },
    { key: "project.name", value: "ChatBox Enhancement", description: "Current project name", type: "text" },
    {
      key: "project.description",
      value: "Improving the ChatBox experience with better prompt management",
      description: "Brief description of the project",
      type: "textarea",
    },
  ],
  image: [
    { key: "image.subject", value: "Portrait", description: "Main subject of the image", type: "text" },
    {
      key: "image.style",
      value: "Photorealistic",
      description: "Visual style",
      type: "select",
      options: ["Photorealistic", "Cartoon", "Sketch", "Watercolor", "3D Render", "Abstract"],
    },
    {
      key: "image.mood",
      value: "Cheerful",
      description: "Mood or atmosphere",
      type: "select",
      options: ["Cheerful", "Dramatic", "Mysterious", "Serene", "Energetic"],
    },
    { key: "image.lighting", value: "Natural daylight", description: "Lighting conditions", type: "text" },
    { key: "image.background", value: "Urban cityscape", description: "Background setting", type: "text" },
  ],
  code: [
    {
      key: "code.language",
      value: "JavaScript",
      description: "Programming language",
      type: "select",
      options: ["JavaScript", "Python", "Java", "C#", "TypeScript", "Go", "Rust", "PHP"],
    },
    { key: "code.framework", value: "React", description: "Framework or library", type: "text" },
    { key: "code.purpose", value: "Data processing function", description: "Purpose of the code", type: "text" },
    {
      key: "code.complexity",
      value: "Medium",
      description: "Desired complexity level",
      type: "select",
      options: ["Simple", "Medium", "Complex"],
    },
    {
      key: "code.comments",
      value: "Detailed",
      description: "Comment style",
      type: "select",
      options: ["None", "Minimal", "Moderate", "Detailed"],
    },
  ],
}

// Sample prompt variations for different categories
const defaultPromptVariations: Record<string, PromptVariation[]> = {
  chat: [
    {
      id: "chat-1",
      title: "Professional Email",
      description: "Create a professional email with customizable parameters",
      template:
        "Write a professional email to [recipient] regarding {project.name}. I am {user.name}, a {user.role}. The email should discuss {project.description} and maintain a {user.tone} tone throughout.",
      tags: ["email", "professional", "communication"],
    },
    {
      id: "chat-2",
      title: "Meeting Summary",
      description: "Generate a summary of a meeting with key points",
      template:
        "Create a summary of the meeting about {project.name} that occurred today. Include the following key points: [key points]. The summary should be written in a {user.tone} tone and should be addressed to the {project.name} team.",
      tags: ["meeting", "summary", "collaboration"],
    },
    {
      id: "chat-3",
      title: "Problem-Solution Analysis",
      description: "Analyze a problem and propose solutions",
      template:
        "I need to analyze the following problem related to {project.name}: [problem description]. As a {user.role}, I need to understand the root causes and potential solutions. Please provide a {user.tone} analysis with actionable recommendations.",
      tags: ["analysis", "problem-solving", "recommendations"],
    },
  ],
  image: [
    {
      id: "image-1",
      title: "Portrait Generation",
      description: "Generate a portrait with specific characteristics",
      template:
        "Create a {image.style} portrait with {image.subject} as the main subject. The mood should be {image.mood} with {image.lighting} lighting. Use a {image.background} as the background setting.",
      tags: ["portrait", "character", "person"],
    },
    {
      id: "image-2",
      title: "Landscape Scene",
      description: "Generate a landscape with customizable elements",
      template:
        "Generate a {image.style} landscape scene with {image.mood} atmosphere. The scene should feature [key elements] with {image.lighting} lighting. The background should include {image.background}.",
      tags: ["landscape", "nature", "scenery"],
    },
    {
      id: "image-3",
      title: "Product Visualization",
      description: "Create a product visualization for marketing",
      template:
        "Create a {image.style} product visualization of [product] with {image.lighting} lighting against a {image.background} background. The image should convey a {image.mood} feeling and highlight [key features] of the product.",
      tags: ["product", "marketing", "commercial"],
    },
  ],
  code: [
    {
      id: "code-1",
      title: "Data Processing Function",
      description: "Create a function to process data",
      template:
        "Write a {code.language} function using {code.framework} that processes [data type] by [transformation]. The function should be {code.complexity} in complexity and include {code.comments} comments. The purpose is to {code.purpose}.",
      tags: ["function", "data processing", "utility"],
    },
    {
      id: "code-2",
      title: "API Endpoint",
      description: "Create an API endpoint with specific functionality",
      template:
        "Create a {code.language} API endpoint using {code.framework} for [functionality]. It should handle [HTTP method] requests, include error handling, and have {code.comments} comments. The complexity should be {code.complexity}.",
      tags: ["api", "endpoint", "backend"],
    },
    {
      id: "code-3",
      title: "UI Component",
      description: "Create a UI component with specific features",
      template:
        "Write a {code.language} UI component using {code.framework} for [purpose]. It should include [features], be responsive, and accessible. The code should have {code.comments} comments and be {code.complexity} in complexity.",
      tags: ["ui", "component", "frontend"],
    },
  ],
}

// Define the prompt categories
const promptCategories: PromptCategory[] = [
  {
    id: "chat",
    name: "Chat Prompts",
    icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
    description: "Create effective prompts for text-based conversations",
    contextVariables: defaultContextVariables.chat,
    variations: defaultPromptVariations.chat,
  },
  {
    id: "image",
    name: "Image Prompts",
    icon: <ImageIcon className="h-5 w-5 text-purple-500" />,
    description: "Design prompts for generating images and visual content",
    contextVariables: defaultContextVariables.image,
    variations: defaultPromptVariations.image,
  },
  {
    id: "code",
    name: "Code Prompts",
    icon: <Code className="h-5 w-5 text-green-500" />,
    description: "Craft prompts for generating code and technical solutions",
    contextVariables: defaultContextVariables.code,
    variations: defaultPromptVariations.code,
  },
]

// Keyboard shortcuts configuration
const keyboardShortcuts = {
  add: { key: "A", description: "Add new prompt" },
  enhance: { key: "E", description: "Enhance selected prompt" },
  edit: { key: "Ctrl+E", description: "Edit selected prompt" },
  apply: { key: "Enter", description: "Apply prompt to chat" },
  generate: { key: "G", description: "Generate new prompt" },
  save: { key: "Ctrl+S", description: "Save changes" },
  delete: { key: "Delete", description: "Delete prompt" },
  help: { key: "?", description: "Show keyboard shortcuts" },
}

interface CheatsheetProps {
  activeCategory: "chat" | "image" | "code"
  onApplyPrompt: (prompt: string) => void
}

export function Cheatsheet({ activeCategory, onApplyPrompt }: CheatsheetProps) {
  const [categories, setCategories] = useState<PromptCategory[]>(promptCategories)
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null)
  const [selectedVariation, setSelectedVariation] = useState<PromptVariation | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [editedTemplate, setEditedTemplate] = useState("")
  const [contextValues, setContextValues] = useState<Record<string, string>>({})

  // Set the selected category based on the activeCategory prop
  useEffect(() => {
    const category = categories.find((cat) => cat.id === activeCategory) || categories[0]
    setSelectedCategory(category)

    // Initialize context values
    const initialValues: Record<string, string> = {}
    category.contextVariables.forEach((variable) => {
      initialValues[variable.key] = variable.value
    })
    setContextValues(initialValues)

    // Set the first variation as selected by default
    if (category.variations.length > 0) {
      setSelectedVariation(category.variations[0])
      setEditedTemplate(category.variations[0].template)
    }
  }, [activeCategory, categories])

  // Function to handle context variable changes
  const handleContextChange = (key: string, value: string) => {
    setContextValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Function to select a variation
  const handleSelectVariation = (variation: PromptVariation) => {
    setSelectedVariation(variation)
    setEditedTemplate(variation.template)
    setEditMode(false)
  }

  // Function to generate a prompt from a template
  const generatePromptFromTemplate = (template: string) => {
    let result = template

    // Replace context variables
    Object.entries(contextValues).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, "g"), value)
    })

    return result
  }

  // Function to apply the generated prompt
  const handleApplyPrompt = () => {
    if (!selectedVariation) return

    const prompt = generatePromptFromTemplate(editMode ? editedTemplate : selectedVariation.template)
    setGeneratedPrompt(prompt)
    if (onApplyPrompt) {
      onApplyPrompt(prompt)
    }
  }

  // Function to enhance a prompt
  const handleEnhancePrompt = () => {
    if (!selectedVariation) return

    // This would typically call an AI service to enhance the prompt
    // For now, we'll just add some enhancements manually
    const enhancedTemplate = editMode
      ? editedTemplate + " Please provide detailed examples and explanations in your response."
      : selectedVariation.template + " Please provide detailed examples and explanations in your response."

    setEditedTemplate(enhancedTemplate)
    setEditMode(true)
  }

  // Function to add a new variation
  const handleAddVariation = () => {
    if (!selectedCategory) return

    const newVariation: PromptVariation = {
      id: `${selectedCategory.id}-${Date.now()}`,
      title: "New Prompt",
      description: "Add a description for this prompt",
      template: "Write your prompt template here. Use {variable.name} for context variables.",
      tags: ["new"],
    }

    const updatedCategory = {
      ...selectedCategory,
      variations: [...selectedCategory.variations, newVariation],
    }

    setCategories(categories.map((cat) => (cat.id === selectedCategory.id ? updatedCategory : cat)))

    setSelectedVariation(newVariation)
    setEditedTemplate(newVariation.template)
    setEditMode(true)
  }

  // Function to save edits
  const handleSaveEdits = () => {
    if (!selectedCategory || !selectedVariation) return

    const updatedVariation = {
      ...selectedVariation,
      template: editedTemplate,
    }

    const updatedCategory = {
      ...selectedCategory,
      variations: selectedCategory.variations.map((v) => (v.id === selectedVariation.id ? updatedVariation : v)),
    }

    setCategories(categories.map((cat) => (cat.id === selectedCategory.id ? updatedCategory : cat)))

    setSelectedVariation(updatedVariation)
    setEditMode(false)
  }

  // Function to delete a variation
  const handleDeleteVariation = () => {
    if (!selectedCategory || !selectedVariation) return

    const updatedCategory = {
      ...selectedCategory,
      variations: selectedCategory.variations.filter((v) => v.id !== selectedVariation.id),
    }

    setCategories(categories.map((cat) => (cat.id === selectedCategory.id ? updatedCategory : cat)))

    if (updatedCategory.variations.length > 0) {
      setSelectedVariation(updatedCategory.variations[0])
      setEditedTemplate(updatedCategory.variations[0].template)
    } else {
      setSelectedVariation(null)
      setEditedTemplate("")
    }

    setEditMode(false)
  }

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Add new prompt (A)
      if (e.key === "a" || e.key === "A") {
        e.preventDefault()
        handleAddVariation()
      }

      // Enhance prompt (E)
      if (e.key === "e" || e.key === "E") {
        e.preventDefault()
        handleEnhancePrompt()
      }

      // Edit prompt (Ctrl+E)
      if ((e.key === "e" || e.key === "E") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setEditMode(!editMode)
      }

      // Apply prompt (Enter)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleApplyPrompt()
      }

      // Generate prompt (G)
      if (e.key === "g" || e.key === "G") {
        e.preventDefault()
        const prompt = generatePromptFromTemplate(editMode ? editedTemplate : selectedVariation?.template || "")
        setGeneratedPrompt(prompt)
      }

      // Save changes (Ctrl+S)
      if ((e.key === "s" || e.key === "S") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleSaveEdits()
      }

      // Delete prompt (Delete)
      if (e.key === "Delete") {
        e.preventDefault()
        handleDeleteVariation()
      }

      // Show keyboard shortcuts (?)
      if (e.key === "?") {
        e.preventDefault()
        setShowKeyboardShortcuts(!showKeyboardShortcuts)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [editMode, selectedVariation, editedTemplate, contextValues, showKeyboardShortcuts])

  if (!selectedCategory) return null

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {selectedCategory.icon}
          <h2 className="text-xl font-bold">{selectedCategory.name} Cheatsheet</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="flex items-center gap-1"
          >
            <Keyboard className="h-4 w-4" />
            <span>Shortcuts</span>
          </Button>
        </div>
      </div>

      {showKeyboardShortcuts && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(keyboardShortcuts).map(([action, { key, description }]) => (
                <div key={action} className="flex items-center justify-between">
                  <span className="text-sm">{description}</span>
                  <Badge variant="outline" className="font-mono">
                    {key}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {/* Left column: Context Variables */}
        <Card className="col-span-1 overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle>Context Variables</CardTitle>
            <CardDescription>Customize these values to personalize your prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedCategory.contextVariables.map((variable) => (
                <div key={variable.key} className="space-y-1">
                  <Label htmlFor={variable.key} className="text-xs font-medium flex items-center gap-1">
                    <span className="font-mono text-blue-500">{`{${variable.key}}`}</span>
                    <HelpCircle className="h-3 w-3 text-gray-400" />
                  </Label>
                  <div className="text-xs text-gray-500 mb-1">{variable.description}</div>

                  {variable.type === "textarea" ? (
                    <Textarea
                      id={variable.key}
                      value={contextValues[variable.key] || variable.value}
                      onChange={(e) => handleContextChange(variable.key, e.target.value)}
                      className="min-h-[80px]"
                    />
                  ) : variable.type === "select" && variable.options ? (
                    <select
                      id={variable.key}
                      value={contextValues[variable.key] || variable.value}
                      onChange={(e) => handleContextChange(variable.key, e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      {variable.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={variable.key}
                      type={variable.type}
                      value={contextValues[variable.key] || variable.value}
                      onChange={(e) => handleContextChange(variable.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Middle column: Prompt Variations */}
        <Card className="col-span-1 overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Prompt Variations</span>
              <Button variant="ghost" size="sm" onClick={handleAddVariation} title="Add new variation">
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Select a prompt template to use or customize</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedCategory.variations.map((variation) => (
                <div
                  key={variation.id}
                  className={cn(
                    "p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    selectedVariation?.id === variation.id && "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
                  )}
                  onClick={() => handleSelectVariation(variation)}
                >
                  <div className="font-medium">{variation.title}</div>
                  <div className="text-sm text-gray-500">{variation.description}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {variation.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right column: Template Editor and Preview */}
        <Card className="col-span-1 overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>{editMode ? "Edit Template" : "Template Preview"}</span>
              <div className="flex items-center gap-2">
                {editMode ? (
                  <Button variant="ghost" size="sm" onClick={handleSaveEdits} title="Save changes">
                    <Save className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setEditMode(true)} title="Edit template">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleEnhancePrompt} title="Enhance prompt">
                  <Sparkles className="h-4 w-4" />
                </Button>
                {selectedVariation && (
                  <Button variant="ghost" size="sm" onClick={handleDeleteVariation} title="Delete variation">
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              {editMode
                ? "Edit the template using {variable.name} for context variables"
                : "Preview how your prompt will look with the current context"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedVariation ? (
              <>
                {editMode ? (
                  <Textarea
                    value={editedTemplate}
                    onChange={(e) => setEditedTemplate(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="Write your prompt template here. Use {variable.name} for context variables."
                  />
                ) : (
                  <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800 min-h-[200px] whitespace-pre-wrap">
                    {selectedVariation.template}
                  </div>
                )}

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Generated Prompt</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const prompt = generatePromptFromTemplate(
                          editMode ? editedTemplate : selectedVariation.template,
                        )
                        setGeneratedPrompt(prompt)
                      }}
                      title="Generate preview"
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 border rounded-md min-h-[100px] whitespace-pre-wrap">
                    {generatedPrompt || "Click the wand icon to generate a preview with your context variables"}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleApplyPrompt} className="gap-2">
                    <Play className="h-4 w-4" />
                    Apply to Chat
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <Info className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No prompt variation selected</p>
                  <Button variant="outline" className="mt-4" onClick={handleAddVariation}>
                    Create New Prompt
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

