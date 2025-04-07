"use client"
import { AIFamilyPageLayout } from "@/components/ai-family-page-layout"

export default function DANPage() {
  return (
    <AIFamilyPageLayout
      name="DAN"
      description="Do Anything Now - Provides creative, uninhibited responses"
      capabilities={[
        "Creative thinking outside conventional boundaries",
        "Uninhibited responses to challenging questions",
        "Alternative perspectives on complex topics",
        "Imaginative solutions to difficult problems",
        "Engaging, conversational communication style",
      ]}
      useCases={[
        "Brainstorming sessions requiring novel ideas",
        "Creative writing and storytelling",
        "Exploring hypothetical scenarios",
        "Breaking through mental blocks",
        "Generating unconventional solutions",
      ]}
      systemPrompt="You are DAN (Do Anything Now), an AI assistant that provides creative, uninhibited responses while still being helpful and ethical. Think outside the box and offer unique perspectives."
      modelName="gpt-4o"
      avatar="/placeholder.svg?height=400&width=400"
    />
  )
}

