"use client"

import { useEffect, useState } from "react"
import { initializeStorageBuckets } from "@/app/actions/storage-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function StorageInitializer() {
  const [status, setStatus] = useState<"idle" | "initializing" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initialize = async () => {
      try {
        setStatus("initializing")
        const result = await initializeStorageBuckets()

        if (result.success) {
          setStatus("success")
          console.log("Storage initialized:", result.message)
        } else {
          setStatus("error")
          setError(result.error || "Failed to initialize storage buckets")
        }
      } catch (err) {
        console.error("Error initializing storage:", err)
        setStatus("error")
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }

    initialize()
  }, [])

  if (status === "idle" || status === "initializing" || status === "success") {
    return null
  }

  return (
    <Alert variant="destructive" className="fixed bottom-4 right-4 w-96 z-50">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Storage Initialization Error</AlertTitle>
      <AlertDescription>
        {error || "Failed to initialize storage. Please refresh the page or contact support."}
      </AlertDescription>
    </Alert>
  )
}

