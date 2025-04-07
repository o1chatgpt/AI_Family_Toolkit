"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Users, Shield, Settings, Key, UserPlus, FileText } from "lucide-react"

interface AdminPanelProps {
  onClose: () => void
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("users")
  const [siteName, setSiteName] = useState("AI Family Toolkit")
  const [domain, setDomain] = useState("aifamily.example.com")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [defaultModel, setDefaultModel] = useState("gpt-4o")
  const [openaiKey, setOpenaiKey] = useState("sk-••••••••••••••••••••••")
  const [elevenlabsKey, setElevenlabsKey] = useState("••••••••••••••••••••••")
  const [supabaseKey, setSupabaseKey] = useState("••••••••••••••••••••••")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5" /> Administration Panel
            </CardTitle>
            <CardDescription>Manage users, settings, and system configuration</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-1">
                <Key className="h-4 w-4" />
                <span>API Keys</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Logs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">User Management</h3>
                <Button size="sm" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Add User</span>
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <div className="grid grid-cols-4 font-medium pb-2 border-b">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Status</div>
                </div>
                <div className="space-y-2 mt-2">
                  {[
                    { name: "Admin User", email: "admin@example.com", role: "Administrator", status: "Active" },
                    { name: "Test User", email: "test@example.com", role: "User", status: "Active" },
                    { name: "Demo Account", email: "demo@example.com", role: "Guest", status: "Inactive" },
                  ].map((user, index) => (
                    <div key={index} className="grid grid-cols-4 py-2 border-b">
                      <div>{user.name}</div>
                      <div>{user.email}</div>
                      <div>{user.role}</div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            user.status === "Active" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        {user.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <h3 className="text-lg font-medium">System Settings</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                  </div>
                  <p className="text-sm text-gray-500">
                    When enabled, the site will display a maintenance message to all non-admin users.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <Switch id="debug-mode" checked={debugMode} onCheckedChange={setDebugMode} />
                  </div>
                  <p className="text-sm text-gray-500">
                    Enable detailed error messages and logging for troubleshooting.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-model">Default AI Model</Label>
                  <Select value={defaultModel} onValueChange={setDefaultModel}>
                    <SelectTrigger id="default-model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <h3 className="text-lg font-medium">API Key Management</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="openai-key"
                      type="password"
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline">Update</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="elevenlabs-key">ElevenLabs API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="elevenlabs-key"
                      type="password"
                      value={elevenlabsKey}
                      onChange={(e) => setElevenlabsKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline">Update</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabase-key">Supabase API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="supabase-key"
                      type="password"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline">Update</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">System Logs</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </div>

              <div className="border rounded-md p-2 bg-gray-50 dark:bg-gray-900 h-[400px] overflow-auto font-mono text-xs">
                <div className="space-y-1">
                  {[
                    "[2023-07-15 10:15:32] [INFO] System started",
                    "[2023-07-15 10:15:35] [INFO] Database connection established",
                    "[2023-07-15 10:16:02] [INFO] User admin@example.com logged in",
                    "[2023-07-15 10:18:45] [WARNING] Rate limit reached for API key",
                    "[2023-07-15 10:20:11] [ERROR] Failed to connect to external service",
                    "[2023-07-15 10:22:30] [INFO] Configuration updated",
                    "[2023-07-15 10:25:18] [INFO] New user registered: test@example.com",
                    "[2023-07-15 10:30:42] [INFO] Backup completed successfully",
                  ].map((log, index) => (
                    <div key={index} className="py-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

