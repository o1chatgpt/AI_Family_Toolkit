"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type ConnectionStatus = "connected" | "disconnected" | "connecting" | "error"

interface ApiConnectionContextType {
  connectionStatus: ConnectionStatus
  apiKey: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
  testConnection: () => Promise<boolean>
}

const ApiConnectionContext = createContext<ApiConnectionContextType>({
  connectionStatus: "disconnected",
  apiKey: null,
  setApiKey: () => {},
  clearApiKey: () => {},
  testConnection: async () => false,
})

export function ApiConnectionProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("apiKey")
    if (storedApiKey) {
      setApiKeyState(storedApiKey)
      setConnectionStatus("connected") // Assume connected if key exists
    }
  }, [])

  // Set API key
  const setApiKey = (key: string) => {
    localStorage.setItem("apiKey", key)
    setApiKeyState(key)
    setConnectionStatus("connected")
  }

  // Clear API key
  const clearApiKey = () => {
    localStorage.removeItem("apiKey")
    setApiKeyState(null)
    setConnectionStatus("disconnected")
  }

  // Test connection
  const testConnection = async (): Promise<boolean> => {
    if (!apiKey) return false

    setConnectionStatus("connecting")

    // Simulate a connection test
    return new Promise((resolve) => {
      setTimeout(() => {
        setConnectionStatus("connected")
        resolve(true)
      }, 1000)
    })
  }

  return (
    <ApiConnectionContext.Provider
      value={{
        connectionStatus,
        apiKey,
        setApiKey,
        clearApiKey,
        testConnection,
      }}
    >
      {children}
    </ApiConnectionContext.Provider>
  )
}

// Hook to use the API connection context
export const useApiConnection = () => {
  const context = useContext(ApiConnectionContext)
  if (context === undefined) {
    throw new Error("useApiConnection must be used within an ApiConnectionProvider")
  }
  return context
}

