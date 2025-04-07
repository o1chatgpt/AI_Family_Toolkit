"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Users,
  Shield,
  Sliders,
  FileText,
  BarChart,
  PlusCircle,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useApiConnection } from "@/components/api-connection-manager"

export default function AdminChatPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "templates" | "analytics" | "users">("settings")
  const [isEditing, setIsEditing] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant. Answer questions accurately and concisely. If you don't know something, say so rather than making up information.",
  )
  const { connectionStatus } = useApiConnection()

  // Mock chat templates
  const chatTemplates = [
    {
      id: 1,
      name: "Customer Support",
      prompt: "You are a customer support agent. Help users with their questions about our products and services.",
      isActive: true,
    },
    {
      id: 2,
      name: "Technical Assistant",
      prompt:
        "You are a technical assistant. Help users troubleshoot technical issues and provide step-by-step guidance.",
      isActive: true,
    },
    {
      id: 3,
      name: "Creative Writer",
      prompt:
        "You are a creative writing assistant. Help users brainstorm ideas, develop characters, and craft compelling narratives.",
      isActive: false,
    },
  ]

  // Mock chat users
  const chatUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", chats: 24, lastActive: "2023-10-15", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", chats: 12, lastActive: "2023-10-14", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", chats: 8, lastActive: "2023-10-10", status: "inactive" },
  ]

  // Mock analytics data
  const analyticsData = {
    totalChats: 1245,
    activeUsers: 87,
    averageSessionTime: "4m 32s",
    topQueries: [
      { query: "How to reset password", count: 42 },
      { query: "Product pricing", count: 38 },
      { query: "Technical support", count: 27 },
    ],
    dailyUsage: [
      { date: "Mon", chats: 120 },
      { date: "Tue", chats: 145 },
      { date: "Wed", chats: 132 },
      { date: "Thu", chats: 167 },
      { date: "Fri", chats: 143 },
      { date: "Sat", chats: 89 },
      { date: "Sun", chats: 76 },
    ],
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold flex items-center">
          <Shield className="mr-2 h-6 w-6" /> Chat Administration
        </h1>
        <Badge
          variant={connectionStatus === "connected" ? "default" : "outline"}
          className={connectionStatus === "connected" ? "bg-green-500 ml-2" : "bg-red-100 text-red-800 ml-2"}
        >
          {connectionStatus === "connected" ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : (
            <AlertCircle className="h-3 w-3 mr-1" />
          )}
          {connectionStatus === "connected" ? "API Connected" : "API Disconnected"}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Sliders className="h-5 w-5 mr-2" />
                  Chat Configuration
                </span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setIsEditing(false)}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Configure global chat settings and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-prompt">Default System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="min-h-[100px]"
                  disabled={!isEditing}
                />
                <p className="text-xs text-gray-500">This prompt sets the default behavior for all chat interactions</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Default Model</Label>
                  <Select disabled={!isEditing} defaultValue="gpt-4o">
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      defaultValue="0.7"
                      disabled={!isEditing}
                    />
                    <span className="text-sm text-gray-500">0.7</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Feature Controls</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="chat-history">Chat History</Label>
                      <p className="text-xs text-gray-500">Store chat history for users</p>
                    </div>
                    <Switch id="chat-history" defaultChecked disabled={!isEditing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="file-uploads">File Uploads</Label>
                      <p className="text-xs text-gray-500">Allow file uploads in chat</p>
                    </div>
                    <Switch id="file-uploads" defaultChecked disabled={!isEditing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="code-execution">Code Execution</Label>
                      <p className="text-xs text-gray-500">Allow code execution in chat</p>
                    </div>
                    <Switch id="code-execution" defaultChecked disabled={!isEditing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="voice-input">Voice Input</Label>
                      <p className="text-xs text-gray-500">Allow voice input in chat</p>
                    </div>
                    <Switch id="voice-input" defaultChecked disabled={!isEditing} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Content Moderation
              </CardTitle>
              <CardDescription>Configure content moderation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="content-filtering">Content Filtering</Label>
                  <p className="text-xs text-gray-500">Filter inappropriate content</p>
                </div>
                <Switch id="content-filtering" defaultChecked disabled={!isEditing} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profanity-filter">Profanity Filter</Label>
                  <p className="text-xs text-gray-500">Filter profanity in chat</p>
                </div>
                <Switch id="profanity-filter" defaultChecked disabled={!isEditing} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moderation-level">Moderation Level</Label>
                <Select disabled={!isEditing} defaultValue="medium">
                  <SelectTrigger id="moderation-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chat Templates</h2>
            <Button size="sm" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Add Template</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {chatTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center">
                      {template.name}
                      <Badge
                        variant={template.isActive ? "default" : "outline"}
                        className={template.isActive ? "ml-2 bg-green-500" : "ml-2 bg-gray-100 text-gray-800"}
                      >
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{template.prompt}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button size="sm">{template.isActive ? "Deactivate" : "Activate"}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500">Total Chats</p>
                  <p className="text-3xl font-bold">{analyticsData.totalChats}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500">Active Users</p>
                  <p className="text-3xl font-bold">{analyticsData.activeUsers}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500">Avg. Session Time</p>
                  <p className="text-3xl font-bold">{analyticsData.averageSessionTime}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500">API Usage</p>
                  <p className="text-3xl font-bold">78%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Chat Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end justify-between">
                  {analyticsData.dailyUsage.map((day) => (
                    <div key={day.date} className="flex flex-col items-center gap-2">
                      <div
                        className="w-10 bg-blue-500 rounded-t-md"
                        style={{ height: `${(day.chats / 200) * 100}%` }}
                      ></div>
                      <span className="text-xs">{day.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topQueries.map((query, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{query.query}</span>
                        <span className="font-medium">{query.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${(query.count / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chat Users</h2>
            <div className="flex gap-2">
              <Input placeholder="Search users..." className="w-64" />
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="border-b">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium text-sm">
                  <div>User</div>
                  <div>Email</div>
                  <div>Chats</div>
                  <div>Last Active</div>
                  <div>Status</div>
                </div>
              </div>
              {chatUsers.map((user) => (
                <div key={user.id} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                    <div>{user.chats}</div>
                    <div className="text-gray-500">{user.lastActive}</div>
                    <div>
                      <Badge
                        variant={user.status === "active" ? "default" : "outline"}
                        className={user.status === "active" ? "bg-green-500" : "bg-gray-100 text-gray-800"}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

