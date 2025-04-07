"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useApiConnection } from "./api-connection-manager"
import {
  AlertCircle,
  Bug,
  CheckCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Key,
  ExternalLink,
  X,
  Code,
  Database,
  Clock,
} from "lucide-react"

// Debug panel component
export function DebugPanel({
  lastRequest,
  lastResponse,
  lastError,
  onClose,
}: {
  lastRequest: any
  lastResponse: any
  lastError: any
  onClose: () => void
}) {
  const { apiKey, connectionStatus, validateApiKey, reconnect } = useApiConnection()
  const [activeTab, setActiveTab] = useState("connection")
  const [isReconnecting, setIsReconnecting] = useState(false)

  // Handle reconnection
  const handleReconnect = async () => {
    setIsReconnecting(true)
    try {
      await reconnect()
    } finally {
      setIsReconnecting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Bug className="h-5 w-5" />
            API Debug Panel
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="connection" className="flex items-center gap-1">
              <Wifi className="h-4 w-4" />
              <span>Connection</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              <span>Requests</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Models</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Connection Status</span>
                  <ConnectionStatusBadge status={connectionStatus} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium mb-2">API Key</h4>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md flex-1 font-mono text-xs overflow-x-auto">
                      {apiKey ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 4)}` : "No API key set"}
                    </div>
                    <div className={cn("h-3 w-3 rounded-full", apiKey ? "bg-green-500" : "bg-red-500")}></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleReconnect}
                    disabled={isReconnecting || !apiKey}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className={cn("h-4 w-4", isReconnecting && "animate-spin")} />
                    <span>{isReconnecting ? "Reconnecting..." : "Reconnect"}</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => window.open("https://platform.openai.com/account/api-keys", "_blank")}
                    className="flex items-center gap-1"
                  >
                    <Key className="h-4 w-4" />
                    <span>Manage API Keys</span>
                  </Button>
                </div>

                {connectionStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>Connection troubleshooting:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Verify your API key is correct and has not expired</li>
                          <li>Check your internet connection</li>
                          <li>Ensure you have sufficient credits in your OpenAI account</li>
                          <li>Try the reconnect button above</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Last connected</span>
                    </div>
                    <span className="text-sm">
                      {localStorage.getItem("api_last_connected")
                        ? new Date(localStorage.getItem("api_last_connected") as string).toLocaleString()
                        : "Never"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-gray-500" />
                      <span>Auto-connect</span>
                    </div>
                    <Badge variant="outline">
                      {localStorage.getItem("api_auto_connect") === "true" ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="p-3 border rounded-md">
              <h4 className="font-medium mb-2">Last Request</h4>
              <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-xs overflow-x-auto max-h-40">
                {lastRequest ? JSON.stringify(lastRequest, null, 2) : "No request sent yet"}
              </pre>
            </div>

            <div className="p-3 border rounded-md">
              <h4 className="font-medium mb-2">Last Response</h4>
              <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-xs overflow-x-auto max-h-40">
                {lastResponse ? JSON.stringify(lastResponse, null, 2) : "No response received yet"}
              </pre>
            </div>

            {lastError && (
              <div className="p-3 border border-red-300 dark:border-red-800 rounded-md bg-red-50 dark:bg-red-900/20">
                <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">Last Error</h4>
                <pre className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-xs overflow-x-auto max-h-40 text-red-800 dark:text-red-200">
                  {JSON.stringify(lastError, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Models</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      // Fetch available models if connected
                      if (connectionStatus === "connected" && apiKey) {
                        fetch("https://api.openai.com/v1/models", {
                          headers: {
                            Authorization: `Bearer ${apiKey}`,
                            "Content-Type": "application/json",
                          },
                        })
                          .then((response) => response.json())
                          .then((data) => {
                            // Display models in a modal
                            alert(`Available models: ${data.data.map((model: any) => model.id).join(", ")}`)
                          })
                          .catch((error) => {
                            console.error("Error fetching models:", error)
                            alert("Failed to fetch models. See console for details.")
                          })
                      } else {
                        alert("Please connect to the API first")
                      }
                    }}
                    className="w-full"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Fetch Available Models
                  </Button>

                  <p className="text-sm text-gray-500 mt-2">
                    OpenAI regularly updates their available models. Click the button above to fetch the latest models
                    available with your API key.
                  </p>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Common Models</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="p-2 border rounded-md">
                        <div className="font-medium">gpt-4o</div>
                        <div className="text-xs text-gray-500">Latest GPT-4 model with improved capabilities</div>
                      </div>
                      <div className="p-2 border rounded-md">
                        <div className="font-medium">gpt-4-turbo</div>
                        <div className="text-xs text-gray-500">Optimized for speed and performance</div>
                      </div>
                      <div className="p-2 border rounded-md">
                        <div className="font-medium">gpt-3.5-turbo</div>
                        <div className="text-xs text-gray-500">Cost-effective model for most tasks</div>
                      </div>
                      <div className="p-2 border rounded-md">
                        <div className="font-medium">dall-e-3</div>
                        <div className="text-xs text-gray-500">Image generation model</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => window.open("https://platform.openai.com/docs/models", "_blank")}
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span>OpenAI Models Documentation</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Connection status badge component
function ConnectionStatusBadge({ status }: { status: "disconnected" | "connecting" | "connected" | "error" }) {
  const statusConfig = {
    disconnected: {
      icon: <WifiOff className="h-4 w-4" />,
      text: "Disconnected",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    },
    connecting: {
      icon: <Wifi className="h-4 w-4 animate-pulse" />,
      text: "Connecting...",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200",
    },
    connected: {
      icon: <CheckCircle className="h-4 w-4" />,
      text: "Connected",
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    },
    error: {
      icon: <AlertCircle className="h-4 w-4" />,
      text: "Connection Error",
      color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge className={cn("flex items-center gap-1", config.color)}>
      {config.icon}
      <span>{config.text}</span>
    </Badge>
  )
}

