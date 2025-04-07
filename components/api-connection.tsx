"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ConnectionStatus = "connected" | "disconnected" | "connecting"

interface ApiConnectionContextType {
  connectionStatus: ConnectionStatus
  apiKey: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
}

const ApiConnectionContext = createContext<ApiConnectionContextType>({
  connectionStatus: "disconnected",
  apiKey: null,
  setApiKey: () => {},
  clearApiKey: () => {},
})

export function ApiConnectionProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")

  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey")
    if (storedKey) {
      setApiKeyState(storedKey)
      setConnectionStatus("connecting")

      // Simulate API connection check
      setTimeout(() => {
        setConnectionStatus("connected")
      }, 1000)
    }
  }, [])

  const setApiKey = (key: string) => {
    localStorage.setItem("apiKey", key)
    setApiKeyState(key)
    setConnectionStatus("connecting")

    // Simulate API connection check
    setTimeout(() => {
      setConnectionStatus("connected")
    }, 1000)
  }

  const clearApiKey = () => {
    localStorage.removeItem("apiKey")
    setApiKeyState(null)
    setConnectionStatus("disconnected")
  }

  return (
    <ApiConnectionContext.Provider
      value={{
        connectionStatus,
        apiKey,
        setApiKey,
        clearApiKey,
      }}
    >
      {children}
    </ApiConnectionContext.Provider>
  )
}

export const useApiConnection = () => useContext(ApiConnectionContext)

