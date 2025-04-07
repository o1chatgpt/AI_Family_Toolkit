"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ApiConnectionContextType {
  apiKey: string
  setApiKey: (key: string) => void
  connectionStatus: "connected" | "disconnected" | "connecting"
  testConnection: () => Promise<boolean>
}

const ApiConnectionContext = createContext<ApiConnectionContextType>({
  apiKey: "",
  setApiKey: () => {},
  connectionStatus: "disconnected",
  testConnection: async () => false,
})

export function ApiConnectionProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string>("")
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")

  useEffect(() => {
    // Load API key from localStorage on component mount
    const storedApiKey = localStorage.getItem("openai-api-key")
    if (storedApiKey) {
      setApiKey(storedApiKey)
      setConnectionStatus("connected")
    }
  }, [])

  useEffect(() => {
    // Save API key to localStorage when it changes
    if (apiKey) {
      localStorage.setItem("openai-api-key", apiKey)
    }
  }, [apiKey])

  const testConnection = async (): Promise<boolean> => {
    if (!apiKey) return false

    setConnectionStatus("connecting")

    // Simulate API connection test
    return new Promise((resolve) => {
      setTimeout(() => {
        setConnectionStatus("connected")
        resolve(true)
      }, 1000)
    })
  }

  return (
    <ApiConnectionContext.Provider value={{ apiKey, setApiKey, connectionStatus, testConnection }}>
      {children}
    </ApiConnectionContext.Provider>
  )
}

export function useApiConnection() {
  return useContext(ApiConnectionContext)
}

