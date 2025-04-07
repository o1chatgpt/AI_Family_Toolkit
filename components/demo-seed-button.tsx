"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Database, Loader2 } from "lucide-react"
import { seedDatabase } from "@/app/actions/seed-data"

export function DemoSeedButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSeed = async () => {
    try {
      setIsLoading(true)
      const result = await seedDatabase()

      if (result.success) {
        toast({
          title: "Success!",
          description: result.error || "Database seeded successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to seed database.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding database:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSeed} disabled={isLoading} variant="outline">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Seeding...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" />
          Initialize Demo Data
        </>
      )}
    </Button>
  )
}

