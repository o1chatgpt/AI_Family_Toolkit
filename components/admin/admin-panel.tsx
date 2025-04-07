"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Shield, Users, Settings, Key, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminPanelProps {
  onBack?: () => void
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("users")
  const [adminApiKey, setAdminApiKey] = useState("")
  const router = useRouter()

  // Load admin API key from localStorage
  useEffect(() => {
    const savedAdminKey = localStorage.getItem("admin_api_key")
    if (savedAdminKey) {
      setAdminApiKey(savedAdminKey)
    }
  }, [])

  // Save admin API key to localStorage
  const saveAdminApiKey = () => {
    localStorage.setItem("admin_api_key", adminApiKey)
    alert("Admin API key saved successfully")
  }

  // Mock user data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user" },
  ]

  // Mock AI Family task data
  const tasks = [
    { id: 1, member: "Kara", task: "Generate image prompts for the marketing team", status: "completed" },
    { id: 2, member: "Stan", task: "Debug the authentication system", status: "in-progress" },
    { id: 3, member: "Sophia", task: "Schedule team meetings for next week", status: "pending" },
  ]

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium">
            Administrator
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="ai-family" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>AI Family Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Users</h3>
                  <Button>Add User</Button>
                </div>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="px-4 py-2">{user.name}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                user.role === "admin"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-family" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Family Task Management</CardTitle>
              <CardDescription>Manage tasks assigned to AI Family members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Tasks</h3>
                  <Button>Assign New Task</Button>
                </div>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">AI Member</th>
                        <th className="px-4 py-2 text-left">Task</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="border-b">
                          <td className="px-4 py-2">{task.member}</td>
                          <td className="px-4 py-2">{task.task}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : task.status === "in-progress"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure global settings for the AI Family Toolkit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input id="system-name" defaultValue="AI Family Toolkit" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-model">Default AI Model</Label>
                  <select
                    id="default-model"
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    defaultValue="gpt-3.5-turbo"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-prompt">Default System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    rows={4}
                    defaultValue="You are a helpful AI assistant. Provide accurate, informative responses to user queries."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <p className="text-sm text-gray-500">Enable detailed logging for troubleshooting</p>
                  </div>
                  <Switch id="debug-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-signup">Allow New Signups</Label>
                    <p className="text-sm text-gray-500">Allow new users to create accounts</p>
                  </div>
                  <Switch id="allow-signup" defaultChecked />
                </div>

                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>Manage API keys for the AI Family Toolkit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-api-key">Administrator API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="admin-api-key"
                      type="password"
                      value={adminApiKey}
                      onChange={(e) => setAdminApiKey(e.target.value)}
                      placeholder="sk-..."
                    />
                    <Button onClick={saveAdminApiKey}>Save</Button>
                  </div>
                  <p className="text-sm text-gray-500">This API key will be used for administrative functions</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">API Usage</h3>
                  <div className="border rounded-md p-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Total API Calls</p>
                        <p className="text-2xl font-bold">1,234</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">API Calls Today</p>
                        <p className="text-2xl font-bold">87</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Estimated Cost</p>
                        <p className="text-2xl font-bold">$12.45</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">API Limits</h3>
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">Rate Limit (calls per minute)</Label>
                    <Input id="rate-limit" type="number" defaultValue="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daily-limit">Daily Limit (calls per day)</Label>
                    <Input id="daily-limit" type="number" defaultValue="1000" />
                  </div>
                  <Button>Save Limits</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

