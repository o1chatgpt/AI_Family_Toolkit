"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { seedChatData, seedCodeSnippets } from "@/app/actions/seed-data"

interface SeedButtonProps {
  type: "chat" | "code" | "all"
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function SeedButton({ type, variant = "outline", size = "default", className }: SeedButtonProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Update the handleSeed function to provide better error handling
  const handleSeed = async () => {
    try {
      setIsLoading(true)

      if (type === "chat" || type === "all") {
        const chatResult = await seedChatData()
        if (!chatResult.success) {
          console.error("Chat seeding error:", chatResult.error)
          toast({
            title: "Warning",
            description: "Chat data seeding completed with some issues",
            variant: "default",
          })
        }
      }

      if (type === "code" || type === "all") {
        const codeResult = await seedCodeSnippets()
        if (!codeResult.success) {
          console.error("Code seeding error:", codeResult.error)
          toast({
            title: "Warning",
            description: "Code snippets seeding completed with some issues",
            variant: "default",
          })
        }
      }

      toast({
        title: "Success",
        description: "Sample data has been added to your database",
      })
    } catch (error) {
      console.error("Error seeding data:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to seed data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleSeed} disabled={isLoading} className={className}>
      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
      {type === "all" ? "Seed Sample Data" : `Seed ${type === "chat" ? "Chat" : "Code"} Data`}
    </Button>
  )
}

