"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Keyboard, Settings, Sliders, Workflow, MessageSquare, Wand2 } from "lucide-react"

interface WorkflowSettingsProps {
  onClose?: () => void
  onSave?: (settings: any) => void
}

export function WorkflowSettings({ onClose, onSave }: WorkflowSettingsProps) {
  const [activeTab, setActiveTab] = React.useState("general")
  const [settings, setSettings] = React.useState({
    general: {
      autoExpandPrompts: true,
      showKeyboardShortcuts: true,
      enableAutoSave: true,
      confirmBeforeDelete: true,
      defaultCategory: "chat",
    },
    api: {
      validateOnConnect: true,
      showDebugInfo: false,
      retryOnFailure: true,
      maxRetries: 3,
      timeout: 30,
    },
    keyboard: {
      add: "A",
      enhance: "E",
      edit: "Ctrl+E",
      apply: "Enter",
      generate: "G",
      save: "Ctrl+S",
      delete: "Delete",
      help: "?",
    },
    chat: {
      autoExpandChat: true,
      clearInputAfterSend: true,
      showTimestamps: false,
      enableMarkdown: true,
      enableCodeHighlighting: true,
    },
    prompts: {
      chatPromptPrefix: "",
      imagePromptPrefix: "Generate an image of ",
      codePromptPrefix: "Write code for ",
      savePromptHistory: true,
      maxPromptHistory: 50,
      suggestImprovements: true,
    },
  })

  const handleChange = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(settings)
    }

    if (typeof onClose === "function") {
      onClose()
    }
  }

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose()
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Workflow Settings
        </CardTitle>
        <CardDescription>Customize your workflow experience and keyboard shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-1">
              <Workflow className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="keyboard" className="flex items-center gap-1">
              <Keyboard className="h-4 w-4" />
              <span className="hidden sm:inline">Shortcuts</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-1">
              <Wand2 className="h-4 w-4" />
              <span className="hidden sm:inline">Prompts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoExpandPrompts" className="flex items-center gap-2">
                    Auto-expand prompts
                    <span className="text-xs text-gray-500">Automatically expand prompt details</span>
                  </Label>
                  <Switch
                    id="autoExpandPrompts"
                    checked={settings.general.autoExpandPrompts}
                    onCheckedChange={(checked) => handleChange("general", "autoExpandPrompts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showKeyboardShortcuts" className="flex items-center gap-2">
                    Show keyboard shortcuts
                    <span className="text-xs text-gray-500">Display available shortcuts in the UI</span>
                  </Label>
                  <Switch
                    id="showKeyboardShortcuts"
                    checked={settings.general.showKeyboardShortcuts}
                    onCheckedChange={(checked) => handleChange("general", "showKeyboardShortcuts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enableAutoSave" className="flex items-center gap-2">
                    Enable auto-save
                    <span className="text-xs text-gray-500">Automatically save changes to prompts</span>
                  </Label>
                  <Switch
                    id="enableAutoSave"
                    checked={settings.general.enableAutoSave}
                    onCheckedChange={(checked) => handleChange("general", "enableAutoSave", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confirmBeforeDelete" className="flex items-center gap-2">
                    Confirm before delete
                    <span className="text-xs text-gray-500">Show confirmation dialog before deleting</span>
                  </Label>
                  <Switch
                    id="confirmBeforeDelete"
                    checked={settings.general.confirmBeforeDelete}
                    onCheckedChange={(checked) => handleChange("general", "confirmBeforeDelete", checked)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="defaultCategory">Default category</Label>
                  <select
                    id="defaultCategory"
                    value={settings.general.defaultCategory}
                    onChange={(e) => handleChange("general", "defaultCategory", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="chat">Chat Prompts</option>
                    <option value="image">Image Prompts</option>
                    <option value="code">Code Prompts</option>
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="validateOnConnect" className="flex items-center gap-2">
                    Validate on connect
                    <span className="text-xs text-gray-500">Validate API key when connecting</span>
                  </Label>
                  <Switch
                    id="validateOnConnect"
                    checked={settings.api.validateOnConnect}
                    onCheckedChange={(checked) => handleChange("api", "validateOnConnect", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showDebugInfo" className="flex items-center gap-2">
                    Show debug info
                    <span className="text-xs text-gray-500">Display API debug information</span>
                  </Label>
                  <Switch
                    id="showDebugInfo"
                    checked={settings.api.showDebugInfo}
                    onCheckedChange={(checked) => handleChange("api", "showDebugInfo", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="retryOnFailure" className="flex items-center gap-2">
                    Retry on failure
                    <span className="text-xs text-gray-500">Automatically retry failed API calls</span>
                  </Label>
                  <Switch
                    id="retryOnFailure"
                    checked={settings.api.retryOnFailure}
                    onCheckedChange={(checked) => handleChange("api", "retryOnFailure", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="maxRetries">Maximum retries</Label>
                  <Input
                    id="maxRetries"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.api.maxRetries}
                    onChange={(e) => handleChange("api", "maxRetries", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="timeout">Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    min="5"
                    max="120"
                    value={settings.api.timeout}
                    onChange={(e) => handleChange("api", "timeout", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="keyboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.keyboard).map(([action, key]) => (
                <div key={action} className="space-y-1">
                  <Label htmlFor={`keyboard-${action}`} className="flex items-center justify-between">
                    <span className="capitalize">{action}</span>
                    <Badge variant="outline" className="font-mono">
                      {key}
                    </Badge>
                  </Label>
                  <Input
                    id={`keyboard-${action}`}
                    value={key}
                    onChange={(e) => handleChange("keyboard", action, e.target.value)}
                    placeholder="Press key combination"
                  />
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Note: For key combinations, use format like "Ctrl+S" or "Shift+Enter"
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoExpandChat" className="flex items-center gap-2">
                    Auto-expand chat
                    <span className="text-xs text-gray-500">Automatically expand chat when sending a message</span>
                  </Label>
                  <Switch
                    id="autoExpandChat"
                    checked={settings.chat.autoExpandChat}
                    onCheckedChange={(checked) => handleChange("chat", "autoExpandChat", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="clearInputAfterSend" className="flex items-center gap-2">
                    Clear input after send
                    <span className="text-xs text-gray-500">Clear input field after sending a message</span>
                  </Label>
                  <Switch
                    id="clearInputAfterSend"
                    checked={settings.chat.clearInputAfterSend}
                    onCheckedChange={(checked) => handleChange("chat", "clearInputAfterSend", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showTimestamps" className="flex items-center gap-2">
                    Show timestamps
                    <span className="text-xs text-gray-500">Display timestamps for chat messages</span>
                  </Label>
                  <Switch
                    id="showTimestamps"
                    checked={settings.chat.showTimestamps}
                    onCheckedChange={(checked) => handleChange("chat", "showTimestamps", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enableMarkdown" className="flex items-center gap-2">
                    Enable markdown
                    <span className="text-xs text-gray-500">Render markdown in chat messages</span>
                  </Label>
                  <Switch
                    id="enableMarkdown"
                    checked={settings.chat.enableMarkdown}
                    onCheckedChange={(checked) => handleChange("chat", "enableMarkdown", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enableCodeHighlighting" className="flex items-center gap-2">
                    Code highlighting
                    <span className="text-xs text-gray-500">Highlight code blocks in chat</span>
                  </Label>
                  <Switch
                    id="enableCodeHighlighting"
                    checked={settings.chat.enableCodeHighlighting}
                    onCheckedChange={(checked) => handleChange("chat", "enableCodeHighlighting", checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="chatPromptPrefix">Chat prompt prefix</Label>
                  <Input
                    id="chatPromptPrefix"
                    value={settings.prompts.chatPromptPrefix}
                    onChange={(e) => handleChange("prompts", "chatPromptPrefix", e.target.value)}
                    placeholder="Optional prefix for chat prompts"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="imagePromptPrefix">Image prompt prefix</Label>
                  <Input
                    id="imagePromptPrefix"
                    value={settings.prompts.imagePromptPrefix}
                    onChange={(e) => handleChange("prompts", "imagePromptPrefix", e.target.value)}
                    placeholder="Optional prefix for image prompts"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="codePromptPrefix">Code prompt prefix</Label>
                  <Input
                    id="codePromptPrefix"
                    value={settings.prompts.codePromptPrefix}
                    onChange={(e) => handleChange("prompts", "codePromptPrefix", e.target.value)}
                    placeholder="Optional prefix for code prompts"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="savePromptHistory" className="flex items-center gap-2">
                    Save prompt history
                    <span className="text-xs text-gray-500">Keep history of used prompts</span>
                  </Label>
                  <Switch
                    id="savePromptHistory"
                    checked={settings.prompts.savePromptHistory}
                    onCheckedChange={(checked) => handleChange("prompts", "savePromptHistory", checked)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="maxPromptHistory">Max history items</Label>
                  <Input
                    id="maxPromptHistory"
                    type="number"
                    min="10"
                    max="200"
                    value={settings.prompts.maxPromptHistory}
                    onChange={(e) => handleChange("prompts", "maxPromptHistory", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="suggestImprovements" className="flex items-center gap-2">
                    Suggest improvements
                    <span className="text-xs text-gray-500">Suggest prompt improvements</span>
                  </Label>
                  <Switch
                    id="suggestImprovements"
                    checked={settings.prompts.suggestImprovements}
                    onCheckedChange={(checked) => handleChange("prompts", "suggestImprovements", checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

