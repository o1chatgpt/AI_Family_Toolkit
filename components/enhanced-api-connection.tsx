"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Key, AlertCircle, CheckCircle, RefreshCw, Settings } from "lucide-react"
import { useApiConnection } from "@/components/api-connection-provider"
import { cn } from "@/lib/utils"

interface EnhancedApiConnectionProps {
  showStatus?: boolean
  showSettings?: boolean
  className?: string
}

export function EnhancedApiConnection({
  showStatus = true,
  showSettings = true,
  className,
}: EnhancedApiConnectionProps) {
  const { apiKey, setApiKey, connectionStatus, testConnection } = useApiConnection()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newApiKey, setNewApiKey] = useState("")
  const [activeTab, setActiveTab] = useState("openai")
  const [isTesting, setIsTesting] = useState(false)

  // Initialize new API key with current API key
  useEffect(() => {
    if (apiKey) {
      setNewApiKey(apiKey)
    }
  }, [apiKey, isDialogOpen])

  // Handle API key save
  const handleSaveApiKey = async () => {
    setApiKey(newApiKey)
    setIsTesting(true)
    await testConnection(newApiKey)
    setIsTesting(false)
    setIsDialogOpen(false)
  }

  // Get status badge
  const getStatusBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      case "disconnected":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Checking...
          </Badge>
        )
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showStatus && getStatusBadge()}

      {showSettings && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Key className="h-3 w-3" />
              <span>API Settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>API Connection Settings</DialogTitle>
              <DialogDescription>Configure your API keys to enable AI features.</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="openai" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="openai">OpenAI</TabsTrigger>
                <TabsTrigger value="elevenlabs">ElevenLabs</TabsTrigger>
              </TabsList>

              <TabsContent value="openai" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                  <Input
                    id="openai-api-key"
                    type="password"
                    placeholder="sk-..."
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key is stored locally and never sent to our servers.
                  </p>
                </div>

                <Alert variant="outline" className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-700" />
                  <AlertTitle className="text-blue-700">OpenAI API Key Required</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    An OpenAI API key is required for AI chat, image generation, and other AI features. You can get an
                    API key from the{" "}
                    <a
                      href="https://platform.openai.com/account/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      OpenAI dashboard
                    </a>
                    .
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="elevenlabs" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="elevenlabs-api-key">ElevenLabs API Key</Label>
                  <Input
                    id="elevenlabs-api-key"
                    type="password"
                    placeholder="Enter your ElevenLabs API key"
                    value=""
                    onChange={() => {}}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Used for voice synthesis in chat and presentations.
                  </p>
                </div>

                <Alert variant="outline" className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-700" />
                  <AlertTitle className="text-blue-700">Voice Features</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    An ElevenLabs API key enables voice synthesis for AI responses. You can get an API key from the{" "}
                    <a
                      href="https://elevenlabs.io/app/api-key"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      ElevenLabs dashboard
                    </a>
                    .
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveApiKey} disabled={isTesting}>
                {isTesting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Save & Test"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {!showSettings && connectionStatus !== "connected" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDialogOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure API Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

