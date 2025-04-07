"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  ChevronRight,
  ChevronLeft,
  Settings,
  MessageSquare,
  ImageIcon,
  Code,
  Shield,
  Sliders,
  Sparkles,
  Zap,
  RefreshCw,
  PlusCircle,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Lock,
  BarChart,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Database,
  Cpu,
  X,
} from "lucide-react"
import { useApiConnection } from "./api-connection-manager"
import type { AIFamilyMember } from "@/constants/ai-family"

interface AIFamilyAdminPanelProps {
  member: AIFamilyMember
  isCollapsed: boolean
  toggleCollapse: () => void
}

export function AIFamilyAdminPanel({ member, isCollapsed, toggleCollapse }: AIFamilyAdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "capabilities" | "tasks" | "analytics" | "settings">("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [editedMember, setEditedMember] = useState<AIFamilyMember>(member)
  const [systemPromptVisible, setSystemPromptVisible] = useState(false)

  // Initialize API connection values
  const [apiKey, setApiKey] = useState("")
  const [connectionStatus, setConnectionStatus] = useState("disconnected")

  // Use the hook unconditionally
  const apiConnection = useApiConnection()

  // Update state based on the hook's return values
  useEffect(() => {
    setApiKey(apiConnection.apiKey)
    setConnectionStatus(apiConnection.connectionStatus)
  }, [apiConnection.apiKey, apiConnection.connectionStatus])

  const [usageData, setUsageData] = useState({
    totalCalls: Math.floor(Math.random() * 1000) + 100,
    successRate: Math.floor(Math.random() * 20) + 80,
    averageResponseTime: Math.floor(Math.random() * 500) + 500,
    tokensUsed: Math.floor(Math.random() * 100000) + 10000,
  })

  // Mock tasks data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Customer Support",
      description: "Handle customer inquiries",
      status: "active",
      priority: "high",
      dueDate: "2023-11-15",
    },
    {
      id: 2,
      title: "Content Creation",
      description: "Generate blog posts",
      status: "pending",
      priority: "medium",
      dueDate: "2023-11-20",
    },
    {
      id: 3,
      title: "Data Analysis",
      description: "Analyze user feedback",
      status: "completed",
      priority: "low",
      dueDate: "2023-11-10",
    },
  ])

  // Mock capabilities data
  const [capabilities, setCapabilities] = useState([
    { id: 1, name: "Response Quality", value: 85, isEnabled: true },
    { id: 2, name: "Creativity Level", value: 70, isEnabled: true },
    { id: 3, name: "Technical Accuracy", value: 90, isEnabled: true },
    { id: 4, name: "Contextual Understanding", value: 80, isEnabled: true },
  ])

  // Mock analytics data
  const analyticsData = {
    dailyUsage: [10, 15, 25, 30, 20, 35, 40],
    topPrompts: [
      { text: "Explain how to implement authentication", count: 42 },
      { text: "Generate a landing page design", count: 38 },
      { text: "Write a blog post about AI", count: 27 },
    ],
    userSatisfaction: 4.7,
    errorRate: 2.3,
  }

  // Update edited member when member prop changes
  useEffect(() => {
    setEditedMember(member)
  }, [member])

  const handleSaveProfile = () => {
    // In a real app, this would save to a database
    console.log("Saving profile:", editedMember)
    setIsEditing(false)
    // For demo purposes, we'll just log the changes
    alert(`Profile for ${editedMember.name} updated successfully!`)
  }

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: "New Task",
      description: "Task description",
      status: "pending",
      priority: "medium",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }
    setTasks([...tasks, newTask])
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleUpdateTaskStatus = (id: number, status: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)))
  }

  const handleUpdateCapability = (id: number, value: number) => {
    setCapabilities(capabilities.map((cap) => (cap.id === id ? { ...cap, value } : cap)))
  }

  const handleToggleCapability = (id: number) => {
    setCapabilities(capabilities.map((cap) => (cap.id === id ? { ...cap, isEnabled: !cap.isEnabled } : cap)))
  }

  // If the panel is collapsed, show a minimal version
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
              setActiveTab("profile")
            }}
          >
            <Shield className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleCollapse()
              setActiveTab("capabilities")
            }}
          >
            <Sliders className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleCollapse()
              setActiveTab("tasks")
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleCollapse()
              setActiveTab("analytics")
            }}
          >
            <BarChart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleCollapse()
              setActiveTab("settings")
            }}
          >
            <Settings className="h-4 w-4" />
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
          {member.name} Admin Panel
        </h3>
        <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="profile" className="text-xs">
              <Shield className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="capabilities" className="text-xs">
              <Sliders className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs">
              <FileText className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              <BarChart className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="h-3 w-3" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Profile Tab */}
        <TabsContent value="profile" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">AI Profile</h3>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveProfile}>
                    Save
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ai-name">Name</Label>
                    <Input
                      id="ai-name"
                      value={editedMember.name}
                      onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ai-model">Model</Label>
                    <Select
                      value={editedMember.model}
                      onValueChange={(value) => setEditedMember({ ...editedMember, model: value })}
                    >
                      <SelectTrigger id="ai-model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ai-personality">Personality</Label>
                    <Textarea
                      id="ai-personality"
                      value={editedMember.personality}
                      onChange={(e) => setEditedMember({ ...editedMember, personality: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-system-prompt">System Prompt</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSystemPromptVisible(!systemPromptVisible)}
                        className="h-6 px-2 text-xs flex items-center gap-1"
                      >
                        {systemPromptVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Textarea
                      id="ai-system-prompt"
                      value={editedMember.systemPrompt}
                      onChange={(e) => setEditedMember({ ...editedMember, systemPrompt: e.target.value })}
                      className="min-h-[120px]"
                      type={systemPromptVisible ? "text" : "password"}
                    />
                    <p className="text-xs text-gray-500">
                      The system prompt defines the AI's behavior and capabilities.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Focus Areas</Label>
                    <div className="flex flex-wrap gap-2">
                      {editedMember.focus.map((focus, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1"
                        >
                          <span className="text-xs">{focus}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4"
                            onClick={() => {
                              const newFocus = [...editedMember.focus]
                              newFocus.splice(index, 1)
                              setEditedMember({ ...editedMember, focus: newFocus })
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-6"
                        onClick={() => {
                          const newFocus = prompt("Enter new focus area")
                          if (newFocus) {
                            setEditedMember({
                              ...editedMember,
                              focus: [...editedMember.focus, newFocus],
                            })
                          }
                        }}
                      >
                        <PlusCircle className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <Badge>{member.model}</Badge>
                    </div>
                    <CardDescription>{member.personality}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Focus Areas</h4>
                        <div className="flex flex-wrap gap-1">
                          {member.focus.map((focus, index) => (
                            <Badge key={index} variant="secondary">
                              {focus}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Actions</h4>
                        <div className="flex flex-wrap gap-1">
                          {member.actions.map((action, index) => (
                            <Badge key={index} variant="outline">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1 flex items-center justify-between">
                          <span>System Prompt</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSystemPromptVisible(!systemPromptVisible)}
                            className="h-6 px-2 text-xs flex items-center gap-1"
                          >
                            {systemPromptVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                        </h4>
                        {systemPromptVisible ? (
                          <p className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">{member.systemPrompt}</p>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Lock className="h-3 w-3" />
                            <span>System prompt is hidden</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full flex justify-between items-center text-xs text-gray-500">
                      <span>ID: {member.id}</span>
                      <span>Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Administrative Controls</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="justify-start">
                  <Lock className="h-3 w-3 mr-1" />
                  Reset Permissions
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync with API
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <Database className="h-3 w-3 mr-1" />
                  Export Config
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <Cpu className="h-3 w-3 mr-1" />
                  Fine-tune Model
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Capabilities Tab */}
        <TabsContent value="capabilities" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">AI Capabilities</h3>
              <Button size="sm" variant="outline">
                <PlusCircle className="h-3 w-3 mr-1" />
                Add Capability
              </Button>
            </div>

            <div className="space-y-4">
              {capabilities.map((capability) => (
                <div key={capability.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{capability.name}</Label>
                    <Switch
                      checked={capability.isEnabled}
                      onCheckedChange={() => handleToggleCapability(capability.id)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[capability.value]}
                      min={0}
                      max={100}
                      step={1}
                      disabled={!capability.isEnabled}
                      onValueChange={(value) => handleUpdateCapability(capability.id, value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm w-8 text-right">{capability.value}%</span>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Advanced Settings</h3>

              <div className="space-y-2">
                <Label htmlFor="temperature" className="text-sm">
                  Temperature
                </Label>
                <div className="flex items-center gap-2">
                  <Slider id="temperature" value={[0.7]} min={0} max={2} step={0.1} className="flex-1" />
                  <span className="text-sm w-8 text-right">0.7</span>
                </div>
                <p className="text-xs text-gray-500">
                  Controls randomness: Lower values are more deterministic, higher values more creative.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens" className="text-sm">
                  Max Tokens
                </Label>
                <div className="flex items-center gap-2">
                  <Input id="max-tokens" type="number" defaultValue={2048} className="w-24" />
                  <span className="text-xs text-gray-500">Maximum length of generated responses</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency-penalty" className="text-sm">
                  Frequency Penalty
                </Label>
                <div className="flex items-center gap-2">
                  <Slider id="frequency-penalty" value={[0.5]} min={-2} max={2} step={0.1} className="flex-1" />
                  <span className="text-sm w-8 text-right">0.5</span>
                </div>
                <p className="text-xs text-gray-500">Reduces repetition of token sequences.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="presence-penalty" className="text-sm">
                  Presence Penalty
                </Label>
                <div className="flex items-center gap-2">
                  <Slider id="presence-penalty" value={[0.0]} min={-2} max={2} step={0.1} className="flex-1" />
                  <span className="text-sm w-8 text-right">0.0</span>
                </div>
                <p className="text-xs text-gray-500">Increases likelihood of discussing new topics.</p>
              </div>
            </div>

            <Button className="w-full">Save Capability Settings</Button>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">AI Tasks</h3>
              <Button size="sm" onClick={handleAddTask}>
                <PlusCircle className="h-3 w-3 mr-1" />
                Add Task
              </Button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm">{task.title}</CardTitle>
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
                    <CardDescription className="text-xs">{task.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {task.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span>Priority: {task.priority}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between">
                    <Select value={task.status} onValueChange={(value) => handleUpdateTaskStatus(task.id, value)}>
                      <SelectTrigger className="h-7 text-xs w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Task Templates</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button size="sm" variant="outline" className="justify-start">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Content Generation
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Image Description
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <Code className="h-3 w-3 mr-1" />
                  Code Review
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Performance Analytics</h3>
              <Select defaultValue="7days">
                <SelectTrigger className="h-8 text-xs w-[100px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7days">7 days</SelectItem>
                  <SelectItem value="30days">30 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Total API Calls</span>
                  <span className="text-lg font-bold">{usageData.totalCalls}</span>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Success Rate</span>
                  <span className="text-lg font-bold">{usageData.successRate}%</span>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Avg Response Time</span>
                  <span className="text-lg font-bold">{usageData.averageResponseTime}ms</span>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Tokens Used</span>
                  <span className="text-lg font-bold">{usageData.tokensUsed}</span>
                </div>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Daily Usage</h3>
              <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-md p-2 flex items-end justify-between">
                {analyticsData.dailyUsage.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="bg-blue-500 w-6 rounded-t-sm"
                      style={{ height: `${(value / Math.max(...analyticsData.dailyUsage)) * 100}px` }}
                    ></div>
                    <span className="text-xs mt-1">{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Last 7 days</span>
                <span>Total: {analyticsData.dailyUsage.reduce((a, b) => a + b, 0)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Top Prompts</h3>
              <div className="space-y-2">
                {analyticsData.topPrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <span className="text-xs truncate max-w-[180px]">{prompt.text}</span>
                    <Badge variant="secondary">{prompt.count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">User Satisfaction</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold mr-1">{analyticsData.userSatisfaction}</span>
                    <div className="flex text-yellow-500">
                      <Sparkles className="h-4 w-4" />
                      <Sparkles className="h-4 w-4" />
                      <Sparkles className="h-4 w-4" />
                      <Sparkles className="h-4 w-4" />
                      <Sparkles className="h-4 w-4 opacity-70" />
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Error Rate</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold mr-1">{analyticsData.errorRate}%</span>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-1 rounded-full mt-1">
                      <div
                        className="bg-red-500 h-full rounded-full"
                        style={{ width: `${analyticsData.errorRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Button className="w-full">
              <FileText className="h-4 w-4 mr-1" />
              Export Analytics Report
            </Button>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">AI Settings</h3>
              <Badge variant={connectionStatus === "connected" ? "default" : "destructive"}>
                {connectionStatus === "connected" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {connectionStatus === "connected" ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-active">Active Status</Label>
                  <p className="text-xs text-gray-500">Enable or disable this AI</p>
                </div>
                <Switch id="ai-active" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-public">Public Access</Label>
                  <p className="text-xs text-gray-500">Allow all users to access</p>
                </div>
                <Switch id="ai-public" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-logging">Response Logging</Label>
                  <p className="text-xs text-gray-500">Save all interactions</p>
                </div>
                <Switch id="ai-logging" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-content-filter">Content Filtering</Label>
                  <p className="text-xs text-gray-500">Filter inappropriate content</p>
                </div>
                <Switch id="ai-content-filter" defaultChecked />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Access Control</h3>

              <div className="space-y-2">
                <Label htmlFor="access-level" className="text-sm">
                  Access Level
                </Label>
                <Select defaultValue="all">
                  <SelectTrigger id="access-level">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="registered">Registered Users</SelectItem>
                    <SelectItem value="admin">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate-limit" className="text-sm">
                  Rate Limit (requests per minute)
                </Label>
                <Input id="rate-limit" type="number" defaultValue={60} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token-limit" className="text-sm">
                  Token Limit (per user/day)
                </Label>
                <Input id="token-limit" type="number" defaultValue={100000} />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Danger Zone</h3>

              <Button variant="destructive" size="sm" className="w-full">
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset AI to Default Settings
              </Button>

              <Button variant="destructive" size="sm" className="w-full">
                <Lock className="h-3 w-3 mr-1" />
                Revoke All Access Tokens
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

