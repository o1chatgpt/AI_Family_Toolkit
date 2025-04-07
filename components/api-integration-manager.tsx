"use client"

import { useState } from "react"
import { useSystem, type APIConnection } from "./system-core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  Database,
  Plus,
  Trash,
  Edit,
  Save,
  X,
  RefreshCw,
  Play,
  ExternalLink,
} from "lucide-react"

// Define props for the component
interface APIIntegrationManagerProps {
  onSelect?: (api: APIConnection) => void
  onConnect?: (api: APIConnection) => Promise<boolean>
}

// Define a default API connection structure
const DEFAULT_API_CONNECTION: APIConnection = {
  id: "",
  name: "New API Connection",
  endpoint: "https://",
  authType: "none",
  status: "disconnected",
  authData: {},
  metadata: {
    timeout: 30,
    maxRetries: 3,
    validateSSL: true,
  },
}

export function APIIntegrationManager({ onSelect, onConnect }: APIIntegrationManagerProps) {
  const { state, registerAPI, updateAPI, removeAPI, connectAPI } = useSystem()

  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedAPI, setSelectedAPI] = useState<APIConnection | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedAPI, setEditedAPI] = useState<Partial<APIConnection>>({})
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [connectionProgress, setConnectionProgress] = useState<number>(0)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Get APIs from the system state, with a fallback to an empty object
  const apiConnections = state?.apiConnections || {}

  // Get APIs as an array, with a fallback to an empty array
  const apis = Object.values(apiConnections)

  // Filter APIs based on search query and active tab
  const filteredAPIs = apis.filter((api) => {
    if (!api) return false

    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      (api.name && api.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (api.endpoint && api.endpoint.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "connected" && api.status === "connected") ||
      (activeTab === "disconnected" && api.status === "disconnected") ||
      (activeTab === "error" && api.status === "error")

    return matchesSearch && matchesTab
  })

  // Handle API selection
  const handleSelectAPI = (api: APIConnection) => {
    if (!api) return

    setSelectedAPI(api)
    setConnectionError(null)

    if (onSelect) {
      onSelect(api)
    }
  }

  // Handle API connection
  const handleConnectAPI = async (api: APIConnection) => {
    if (!api) return

    setIsConnecting(true)
    setConnectionProgress(0)
    setConnectionError(null)
    // setConnectionStatus("connecting") // This line was removed because setConnectionStatus does not exist

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setConnectionProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    try {
      // Use the system's connectAPI function or the provided onConnect function
      const success = onConnect ? await onConnect(api) : await connectAPI(api.id)

      clearInterval(progressInterval)
      setConnectionProgress(100)

      if (!success) {
        setConnectionError("Failed to connect to API")
      }
    } catch (error) {
      clearInterval(progressInterval)
      setConnectionProgress(100)
      setConnectionError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsConnecting(false)
    }
  }

  // Handle API editing
  const handleEditAPI = () => {
    if (!selectedAPI) return

    setEditedAPI({
      ...selectedAPI,
    })
    setIsEditing(true)
  }

  // Handle API saving
  const handleSaveAPI = () => {
    if (!selectedAPI || !editedAPI) return

    // Update the API in the system
    updateAPI(selectedAPI.id, editedAPI)

    // Update the local state
    setSelectedAPI({
      ...selectedAPI,
      ...editedAPI,
    })

    setIsEditing(false)
  }

  // Handle API deletion
  const handleDeleteAPI = () => {
    if (!selectedAPI) return

    // Remove the API from the system
    removeAPI(selectedAPI.id)

    // Update the local state
    setSelectedAPI(null)
  }

  // Handle creating a new API
  const handleCreateAPI = () => {
    // Create a new API in the system
    const id = registerAPI(DEFAULT_API_CONNECTION)

    // Get the new API from the system
    const newAPI = state?.apiConnections?.[id] || { ...DEFAULT_API_CONNECTION, id }

    // Update the local state
    setSelectedAPI(newAPI)
    setEditedAPI(newAPI)
    setIsEditing(true)
  }

  // Get status indicator for API
  const getStatusIndicator = (status = "disconnected") => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case "connecting":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Wifi className="h-3 w-3 mr-1 animate-pulse" />
            Connecting
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            <WifiOff className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">API Integrations</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleCreateAPI} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New API</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="connected" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            <span>Connected</span>
          </TabsTrigger>
          <TabsTrigger value="disconnected" className="flex items-center gap-1">
            <WifiOff className="h-4 w-4" />
            <span>Disconnected</span>
          </TabsTrigger>
          <TabsTrigger value="error" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>Error</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-1 gap-4">
          {/* API list */}
          <div className="w-1/3 overflow-auto border rounded-md">
            {filteredAPIs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                <Database className="h-12 w-12 mb-2 opacity-20" />
                <p>No API connections found</p>
                <Button variant="outline" size="sm" onClick={handleCreateAPI} className="mt-4">
                  Create New API Connection
                </Button>
              </div>
            ) : (
              <ul className="divide-y">
                {filteredAPIs.map((api) => (
                  <li
                    key={api.id}
                    className={cn(
                      "p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
                      selectedAPI?.id === api.id && "bg-gray-100 dark:bg-gray-800",
                    )}
                    onClick={() => handleSelectAPI(api)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{api.name || "Unnamed API"}</span>
                      {getStatusIndicator(api.status)}
                    </div>
                    <div className="mt-1 text-sm text-gray-500 truncate">{api.endpoint || "No endpoint specified"}</div>
                    <div className="mt-1 text-xs text-gray-400">
                      Auth: {api.authType ? api.authType.charAt(0).toUpperCase() + api.authType.slice(1) : "None"}
                      {api.lastUsed && ` • Last used: ${new Date(api.lastUsed).toLocaleDateString()}`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* API details */}
          <div className="w-2/3 overflow-auto">
            {selectedAPI ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      {isEditing ? (
                        <Input
                          value={editedAPI.name || ""}
                          onChange={(e) =>
                            setEditedAPI({
                              ...editedAPI,
                              name: e.target.value,
                            })
                          }
                          className="font-bold text-lg"
                        />
                      ) : (
                        <CardTitle>{selectedAPI.name || "Unnamed API"}</CardTitle>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="sm" onClick={handleSaveAPI}>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={handleEditAPI}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConnectAPI(selectedAPI)}
                            disabled={isConnecting || selectedAPI.status === "connecting"}
                          >
                            <RefreshCw className={cn("h-4 w-4", isConnecting && "animate-spin")} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleDeleteAPI}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    {getStatusIndicator(selectedAPI.status)}
                    <span>•</span>
                    <span>{selectedAPI.endpoint || "No endpoint specified"}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {connectionError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Connection Error</AlertTitle>
                      <AlertDescription>{connectionError}</AlertDescription>
                    </Alert>
                  )}

                  {isConnecting && (
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span>Connecting to API...</span>
                        <span>{connectionProgress}%</span>
                      </div>
                      <Progress value={connectionProgress} className="h-1" />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label>Endpoint URL</Label>
                      {isEditing ? (
                        <Input
                          value={editedAPI.endpoint || ""}
                          onChange={(e) =>
                            setEditedAPI({
                              ...editedAPI,
                              endpoint: e.target.value,
                            })
                          }
                          placeholder="https://api.example.com/v1"
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                          {selectedAPI.endpoint || "No endpoint specified"}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Authentication Type</Label>
                      {isEditing ? (
                        <select
                          value={editedAPI.authType || "none"}
                          onChange={(e) =>
                            setEditedAPI({
                              ...editedAPI,
                              authType: e.target.value as any,
                            })
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="none">None</option>
                          <option value="apiKey">API Key</option>
                          <option value="bearer">Bearer Token</option>
                          <option value="oauth">OAuth</option>
                        </select>
                      ) : (
                        <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                          {selectedAPI.authType
                            ? selectedAPI.authType.charAt(0).toUpperCase() + selectedAPI.authType.slice(1)
                            : "None"}
                        </div>
                      )}
                    </div>

                    {((selectedAPI.authType && selectedAPI.authType !== "none") ||
                      (editedAPI.authType && editedAPI.authType !== "none")) && (
                      <div>
                        <Label>Authentication Data</Label>
                        {isEditing ? (
                          <div className="space-y-2">
                            {(editedAPI.authType === "apiKey" || editedAPI.authType === "bearer") && (
                              <div className="space-y-1">
                                <Label className="text-xs">
                                  {editedAPI.authType === "apiKey" ? "API Key" : "Bearer Token"}
                                </Label>
                                <Input
                                  type="password"
                                  value={(editedAPI.authData as any)?.token || ""}
                                  onChange={(e) =>
                                    setEditedAPI({
                                      ...editedAPI,
                                      authData: {
                                        ...editedAPI.authData,
                                        token: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder={editedAPI.authType === "apiKey" ? "Enter API key" : "Enter bearer token"}
                                />
                              </div>
                            )}

                            {editedAPI.authType === "apiKey" && (
                              <div className="space-y-1">
                                <Label className="text-xs">Header Name</Label>
                                <Input
                                  value={(editedAPI.authData as any)?.headerName || "X-API-Key"}
                                  onChange={(e) =>
                                    setEditedAPI({
                                      ...editedAPI,
                                      authData: {
                                        ...editedAPI.authData,
                                        headerName: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="X-API-Key"
                                />
                              </div>
                            )}

                            {editedAPI.authType === "oauth" && (
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">Client ID</Label>
                                  <Input
                                    value={(editedAPI.authData as any)?.clientId || ""}
                                    onChange={(e) =>
                                      setEditedAPI({
                                        ...editedAPI,
                                        authData: {
                                          ...editedAPI.authData,
                                          clientId: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Enter client ID"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <Label className="text-xs">Client Secret</Label>
                                  <Input
                                    type="password"
                                    value={(editedAPI.authData as any)?.clientSecret || ""}
                                    onChange={(e) =>
                                      setEditedAPI({
                                        ...editedAPI,
                                        authData: {
                                          ...editedAPI.authData,
                                          clientSecret: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Enter client secret"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <Label className="text-xs">Token URL</Label>
                                  <Input
                                    value={(editedAPI.authData as any)?.tokenUrl || ""}
                                    onChange={(e) =>
                                      setEditedAPI({
                                        ...editedAPI,
                                        authData: {
                                          ...editedAPI.authData,
                                          tokenUrl: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="https://example.com/oauth/token"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                            {selectedAPI.authData ? (
                              <div className="space-y-1">
                                {selectedAPI.authType === "apiKey" && (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">API Key</span>
                                      <span className="text-sm font-mono">
                                        {selectedAPI.authData.token ? "••••••••" : "Not set"}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">Header</span>
                                      <span className="text-sm font-mono">
                                        {selectedAPI.authData.headerName || "X-API-Key"}
                                      </span>
                                    </div>
                                  </>
                                )}

                                {selectedAPI.authType === "bearer" && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Bearer Token</span>
                                    <span className="text-sm font-mono">
                                      {selectedAPI.authData.token ? "••••••••" : "Not set"}
                                    </span>
                                  </div>
                                )}

                                {selectedAPI.authType === "oauth" && (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">Client ID</span>
                                      <span className="text-sm font-mono">
                                        {selectedAPI.authData.clientId ? "••••••••" : "Not set"}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">Client Secret</span>
                                      <span className="text-sm font-mono">
                                        {selectedAPI.authData.clientSecret ? "••••••••" : "Not set"}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">Token URL</span>
                                      <span className="text-sm font-mono">
                                        {selectedAPI.authData.tokenUrl || "Not set"}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No authentication data set</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {isEditing && (
                      <div>
                        <Label>Advanced Settings</Label>
                        <div className="p-3 border rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="timeout" className="text-sm">
                              Request Timeout (seconds)
                            </Label>
                            <Input
                              id="timeout"
                              type="number"
                              value={(editedAPI.metadata as any)?.timeout || 30}
                              onChange={(e) =>
                                setEditedAPI({
                                  ...editedAPI,
                                  metadata: {
                                    ...editedAPI.metadata,
                                    timeout: Number.parseInt(e.target.value),
                                  },
                                })
                              }
                              className="w-20 text-right"
                              min={1}
                              max={120}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="retries" className="text-sm">
                              Max Retries
                            </Label>
                            <Input
                              id="retries"
                              type="number"
                              value={(editedAPI.metadata as any)?.maxRetries || 3}
                              onChange={(e) =>
                                setEditedAPI({
                                  ...editedAPI,
                                  metadata: {
                                    ...editedAPI.metadata,
                                    maxRetries: Number.parseInt(e.target.value),
                                  },
                                })
                              }
                              className="w-20 text-right"
                              min={0}
                              max={10}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="validateSSL" className="text-sm">
                              Validate SSL Certificates
                            </Label>
                            <Switch
                              id="validateSSL"
                              checked={(editedAPI.metadata as any)?.validateSSL !== false}
                              onCheckedChange={(checked) =>
                                setEditedAPI({
                                  ...editedAPI,
                                  metadata: {
                                    ...editedAPI.metadata,
                                    validateSSL: checked,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {!isEditing && selectedAPI.status === "connected" && (
                      <div>
                        <Label>Quick Actions</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                              // Open the API endpoint in a new tab
                              if (selectedAPI.endpoint) {
                                window.open(selectedAPI.endpoint, "_blank")
                              }
                            }}
                            disabled={!selectedAPI.endpoint}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open API Docs
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                              // Test the API with a simple request
                              handleConnectAPI(selectedAPI)
                            }}
                          >
                            <Play className="h-4 w-4" />
                            Test Connection
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {!isEditing && (
                    <Button
                      onClick={() => handleConnectAPI(selectedAPI)}
                      disabled={isConnecting || selectedAPI.status === "connecting"}
                      className={cn(
                        "flex items-center gap-2",
                        selectedAPI.status === "connected" ? "bg-green-500 hover:bg-green-600" : "",
                      )}
                    >
                      {isConnecting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : selectedAPI.status === "connected" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Wifi className="h-4 w-4" />
                      )}
                      {selectedAPI.status === "connected" ? "Reconnect" : "Connect to API"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                <Database className="h-12 w-12 mb-2 opacity-20" />
                <p>Select an API connection to view details</p>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}

