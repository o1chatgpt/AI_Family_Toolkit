"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  ChevronRight,
  ChevronLeft,
  Settings,
  MessageSquare,
  ImageIcon,
  Code,
  Users,
  Database,
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  PlusCircle,
  UserCog,
  ArrowRight,
  Layers,
  BarChart,
  Cpu,
} from "lucide-react"
import { useApiConnection } from "./api-connection-manager"
import { useRouter } from "next/navigation"

interface AdminRightPanelProps {
  isCollapsed: boolean
  toggleCollapse: () => void
}

export function AdminRightPanel({ isCollapsed, toggleCollapse }: AdminRightPanelProps) {
  const [activeTab, setActiveTab] = useState<"instructions" | "settings" | "users" | "api" | "navigation" | "admin">(
    "instructions",
  )
  const [customInstructions, setCustomInstructions] = useState({
    chat: "Provide detailed, accurate responses with examples when appropriate. Focus on clarity and helpfulness.",
    image:
      "Generate high-quality, creative images that match the description. Include details about lighting, perspective, and style.",
    code: "Write clean, well-commented code with proper error handling. Explain the code's functionality and any important considerations.",
  })
  const [editingInstructions, setEditingInstructions] = useState<"chat" | "image" | "code" | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const { apiKey, setApiKey, connectionStatus, validateApiKey } = useApiConnection()
  const [isValidating, setIsValidating] = useState(false)
  const [validationProgress, setValidationProgress] = useState(0)
  const [systemSettings, setSystemSettings] = useState({
    debugMode: false,
    allowSignup: true,
    defaultModel: "gpt-3.5-turbo",
    systemName: "AI Family Toolkit",
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  // Check if user is admin
  useEffect(() => {
    const userRole = localStorage.getItem("user_role")
    setIsAdmin(userRole === "admin")
  }, [])

  // Mock users data
  const users = [
    { id: 1, name: "Admin", email: "admin@example.com", role: "admin", lastLogin: "2023-10-15" },
    { id: 2, name: "John Doe", email: "john@example.com", role: "user", lastLogin: "2023-10-14" },
    { id: 3, name: "Jane Smith", email: "jane@example.com", role: "user", lastLogin: "2023-10-13" },
  ]

  // Mock delegation data
  const delegationTasks = [
    { id: 1, type: "chat", title: "Customer Support Bot", assignee: "John Doe", status: "active" },
    { id: 2, type: "image", title: "Product Catalog Images", assignee: "Jane Smith", status: "pending" },
    { id: 3, type: "code", title: "API Integration Scripts", assignee: "John Doe", status: "completed" },
  ]

  const handleCustomInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    if (editingInstructions) {
      setCustomInstructions((prev) => ({
        ...prev,
        [editingInstructions]: value,
      }))
    }
  }

  const handleInstructionsEdit = (type: "chat" | "image" | "code") => {
    setEditingInstructions(type)
  }

  const handleInstructionsSave = () => {
    // Save to localStorage
    localStorage.setItem("custom_instructions", JSON.stringify(customInstructions))
    setEditingInstructions(null)
  }

  const handleInstructionsCancel = () => {
    // Revert changes
    const savedInstructions = localStorage.getItem("custom_instructions")
    if (savedInstructions) {
      setCustomInstructions(JSON.parse(savedInstructions))
    }
    setEditingInstructions(null)
  }

  const handleValidateApiKey = async () => {
    setIsValidating(true)
    setValidationProgress(0)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setValidationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    try {
      const isValid = await validateApiKey(apiKey)
      clearInterval(progressInterval)
      setValidationProgress(100)

      if (isValid) {
        // Save API key to localStorage
        localStorage.setItem("openai_api_key", apiKey)
      }
    } catch (error) {
      clearInterval(progressInterval)
      setValidationProgress(0)
      console.error("Error validating API key:", error)
    } finally {
      setIsValidating(false)
    }
  }

  const handleSystemSettingChange = (setting: string, value: any) => {
    setSystemSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))

    // Save to localStorage
    localStorage.setItem(`system_${setting}`, JSON.stringify(value))
  }

  const handleNavigateTo = (path: string) => {
    router.push(path)
    toggleCollapse()
  }

  if (isCollapsed) {
    return (
      <div className="border-l dark:border-gray-800 h-full flex flex-col w-12">
        <div className="p-2 border-b dark:border-gray-800 flex justify-center">
          <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center py-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleCollapse()
              setActiveTab("instructions")
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleCollapse()
              setActiveTab("navigation")
            }}
          >
            <Layers className="h-4 w-4" />
          </Button>
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toggleCollapse()
                setActiveTab("admin")
              }}
            >
              <Shield className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleCollapse()
              setActiveTab("api")
            }}
          >
            <Key className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleCollapse()
              setActiveTab("users")
            }}
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleCollapse()
              setActiveTab("settings")
            }}
          >
            <Database className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-l dark:border-gray-800 h-full flex flex-col w-80">
      <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
        <h3 className="font-medium flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Admin Panel
        </h3>
        <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="instructions" className="text-xs">
              <Settings className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="navigation" className="text-xs">
              <Layers className="h-3 w-3" />
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="text-xs">
                <Shield className="h-3 w-3" />
              </TabsTrigger>
            )}
            <TabsTrigger value="api" className="text-xs">
              <Key className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs">
              <Users className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Database className="h-3 w-3" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Instructions Tab */}
        <TabsContent value="instructions" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat Instructions
                </h3>
                {editingInstructions === "chat" ? (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleInstructionsSave} className="h-6 w-6">
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleInstructionsCancel} className="h-6 w-6">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleInstructionsEdit("chat")}
                    className="h-6 w-6"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {editingInstructions === "chat" ? (
                <Textarea
                  value={customInstructions.chat}
                  onChange={handleCustomInstructionsChange}
                  className="min-h-[100px]"
                  placeholder="Enter custom instructions for chat..."
                />
              ) : (
                <div className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[80px]">
                  {customInstructions.chat || "No custom instructions set."}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Image Instructions
                </h3>
                {editingInstructions === "image" ? (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleInstructionsSave} className="h-6 w-6">
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleInstructionsCancel} className="h-6 w-6">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleInstructionsEdit("image")}
                    className="h-6 w-6"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {editingInstructions === "image" ? (
                <Textarea
                  value={customInstructions.image}
                  onChange={handleCustomInstructionsChange}
                  className="min-h-[100px]"
                  placeholder="Enter custom instructions for image generation..."
                />
              ) : (
                <div className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[80px]">
                  {customInstructions.image || "No custom instructions set."}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Code className="h-4 w-4 mr-1" />
                  Code Instructions
                </h3>
                {editingInstructions === "code" ? (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleInstructionsSave} className="h-6 w-6">
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleInstructionsCancel} className="h-6 w-6">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleInstructionsEdit("code")}
                    className="h-6 w-6"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {editingInstructions === "code" ? (
                <Textarea
                  value={customInstructions.code}
                  onChange={handleCustomInstructionsChange}
                  className="min-h-[100px]"
                  placeholder="Enter custom instructions for code generation..."
                />
              ) : (
                <div className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[80px]">
                  {customInstructions.code || "No custom instructions set."}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Quick Navigation</h3>

            <div className="grid grid-cols-1 gap-3">
              <Card
                className="overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => handleNavigateTo("/chat")}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Chat</h4>
                    <p className="text-xs text-gray-500">AI conversation assistant</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>

              <Card
                className="overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => handleNavigateTo("/image")}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                    <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Image Generation</h4>
                    <p className="text-xs text-gray-500">Create AI-powered images</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>

              <Card
                className="overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => handleNavigateTo("/code")}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                    <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Code Generation</h4>
                    <p className="text-xs text-gray-500">Generate and edit code</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>

              <Card
                className="overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => handleNavigateTo("/dashboard")}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    <BarChart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Dashboard</h4>
                    <p className="text-xs text-gray-500">Overview and analytics</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Admin Tab - Only visible to admin users */}
        {isAdmin && (
          <TabsContent value="admin" className="flex-1 overflow-auto p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Administrative Controls
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <Card className="overflow-hidden border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-900/30">
                      <CardTitle className="text-sm flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-blue-600" />
                        Chat Administration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Enable Chat Service</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Allow User Customization</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Log Conversations</span>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleNavigateTo("/admin/chat")}
                      >
                        Manage Chat
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="overflow-hidden border-purple-200 dark:border-purple-800">
                    <CardHeader className="pb-2 bg-purple-50 dark:bg-purple-900/30">
                      <CardTitle className="text-sm flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2 text-purple-600" />
                        Image Administration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Enable Image Generation</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Content Filtering</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Allow High Resolution</span>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleNavigateTo("/admin/image")}
                      >
                        Manage Images
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="overflow-hidden border-green-200 dark:border-green-800">
                    <CardHeader className="pb-2 bg-green-50 dark:bg-green-900/30">
                      <CardTitle className="text-sm flex items-center">
                        <Code className="h-4 w-4 mr-2 text-green-600" />
                        Code Administration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Enable Code Generation</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Allow Execution</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Sandbox Mode</span>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleNavigateTo("/admin/code")}
                      >
                        Manage Code
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <UserCog className="h-4 w-4 mr-1" />
                  Task Delegation
                </h3>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Delegated Tasks</CardTitle>
                    <CardDescription className="text-xs">Assign tasks to team members</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-t">
                      {delegationTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                          <div className="flex items-center gap-2">
                            {task.type === "chat" && <MessageSquare className="h-4 w-4 text-blue-500" />}
                            {task.type === "image" && <ImageIcon className="h-4 w-4 text-purple-500" />}
                            {task.type === "code" && <Code className="h-4 w-4 text-green-500" />}
                            <div>
                              <p className="text-sm font-medium">{task.title}</p>
                              <p className="text-xs text-gray-500">Assigned to: {task.assignee}</p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              task.status === "active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : task.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 flex justify-end">
                    <Button size="sm" className="text-xs">
                      <PlusCircle className="h-3 w-3 mr-1" />
                      New Task
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Cpu className="h-4 w-4 mr-1" />
                  System Status
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">API Usage</span>
                      <span className="text-lg font-bold">78%</span>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 h-1 rounded-full mt-1">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Storage</span>
                      <span className="text-lg font-bold">42%</span>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 h-1 rounded-full mt-1">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: "42%" }}></div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Active Users</span>
                      <span className="text-lg font-bold">24</span>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Error Rate</span>
                      <span className="text-lg font-bold">0.3%</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        )}

        {/* API Tab */}
        <TabsContent value="api" className="flex-1 overflow-auto p-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Key className="h-4 w-4 mr-2" />
                API Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant={connectionStatus === "connected" ? "default" : "outline"}
                  className={connectionStatus === "connected" ? "bg-green-500" : "bg-red-100 text-red-800"}
                >
                  {connectionStatus === "connected" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {connectionStatus === "connected" ? "Connected" : "Disconnected"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleValidateApiKey}
                  disabled={isValidating || !apiKey.trim()}
                >
                  {isValidating ? (
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3 mr-1" />
                  )}
                  Test
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="apiKey" className="text-xs">
                    OpenAI API Key
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="h-6 px-2 text-xs flex items-center gap-1"
                  >
                    {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="pr-10"
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>

              {isValidating && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Validating connection...</span>
                    <span>{validationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${validationProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">API Usage</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-xs text-gray-500">Total Requests</p>
                    <p className="text-lg font-bold">1,234</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-xs text-gray-500">Today</p>
                    <p className="text-lg font-bold">87</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">User Management</h3>
              <Button size="sm">Add User</Button>
            </div>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-2">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant="outline"
                          className={user.role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500">{user.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-name">System Name</Label>
              <Input
                id="system-name"
                value={systemSettings.systemName}
                onChange={(e) => handleSystemSettingChange("systemName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-model">Default AI Model</Label>
              <select
                id="default-model"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                value={systemSettings.defaultModel}
                onChange={(e) => handleSystemSettingChange("defaultModel", e.target.value)}
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debug-mode">Debug Mode</Label>
                <p className="text-xs text-gray-500">Enable detailed logging</p>
              </div>
              <Switch
                id="debug-mode"
                checked={systemSettings.debugMode}
                onCheckedChange={(checked) => handleSystemSettingChange("debugMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow-signup">Allow New Signups</Label>
                <p className="text-xs text-gray-500">Allow new users to create accounts</p>
              </div>
              <Switch
                id="allow-signup"
                checked={systemSettings.allowSignup}
                onCheckedChange={(checked) => handleSystemSettingChange("allowSignup", checked)}
              />
            </div>

            <Button className="w-full">Save Settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

