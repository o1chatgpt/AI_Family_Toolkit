"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Plus, Bot, Trash2, Edit, Save, MessageSquare, Image, Code, FileText, Sparkles } from "lucide-react"
import { aiFamilyMembers as initialAiFamilyMembers } from "@/constants/ai-family"

export default function AiManagementPage() {
  const [aiFamilyMembers, setAiFamilyMembers] = useState(initialAiFamilyMembers)
  const [selectedMember, setSelectedMember] = useState(aiFamilyMembers[0])
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isEditingMember, setIsEditingMember] = useState(false)

  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    specialty: "",
    description: "",
    model: "gpt-4o-mini-2024-07-18",
    avatar: "",
    isActive: true,
  })

  const aiModels = [
    { id: "gpt-4o-mini-2024-07-18", name: "GPT-4o Mini" },
    { id: "gpt-3.5-turbo-0125", name: "GPT-3.5 Turbo" },
    { id: "claude-3-opus", name: "Claude 3 Opus" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
    { id: "claude-3-haiku", name: "Claude 3 Haiku" },
    { id: "llama-3-70b", name: "Llama 3 70B" },
  ]

  const specialties = [
    "Content Creation",
    "Research",
    "Technical Writing",
    "Creative Writing",
    "Data Analysis",
    "Code Generation",
    "Image Generation",
    "Customer Support",
    "Marketing",
    "Sales",
    "Education",
    "Legal",
  ]

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role) return

    const member = {
      id: `ai-${aiFamilyMembers.length + 1}`,
      ...newMember,
    }

    setAiFamilyMembers([...aiFamilyMembers, member])
    setNewMember({
      name: "",
      role: "",
      specialty: "",
      description: "",
      model: "gpt-4o-mini-2024-07-18",
      avatar: "",
      isActive: true,
    })
    setIsAddingMember(false)
  }

  const handleUpdateMember = () => {
    setAiFamilyMembers(aiFamilyMembers.map((member) => (member.id === selectedMember.id ? selectedMember : member)))
    setIsEditingMember(false)
  }

  const handleDeleteMember = (id) => {
    setAiFamilyMembers(aiFamilyMembers.filter((member) => member.id !== id))
    if (selectedMember.id === id && aiFamilyMembers.length > 1) {
      setSelectedMember(aiFamilyMembers.find((member) => member.id !== id))
    }
  }

  const handleToggleMemberStatus = (member) => {
    const updatedMember = {
      ...member,
      isActive: !member.isActive,
    }

    setAiFamilyMembers(aiFamilyMembers.map((m) => (m.id === member.id ? updatedMember : m)))

    if (selectedMember.id === member.id) {
      setSelectedMember(updatedMember)
    }
  }

  const getAiModelName = (modelId) => {
    return aiModels.find((model) => model.id === modelId)?.name || modelId
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">AI Family Management</h1>
          <p className="text-muted-foreground">Manage AI Family members, their roles, and capabilities</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
          </Button>
          <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New AI Family Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New AI Family Member</DialogTitle>
                <DialogDescription>Add a new AI Family member with specific capabilities</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Stan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    placeholder="Content Creator"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select
                    value={newMember.specialty}
                    onValueChange={(value) => setNewMember({ ...newMember, specialty: value })}
                  >
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Select a specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Select
                    value={newMember.model}
                    onValueChange={(value) => setNewMember({ ...newMember, model: value })}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select an AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {aiModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMember.description}
                    onChange={(e) => setNewMember({ ...newMember, description: e.target.value })}
                    placeholder="Describe this AI Family member's capabilities"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={newMember.avatar}
                    onChange={(e) => setNewMember({ ...newMember, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.png"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>Create AI Family Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>AI Family Members</CardTitle>
              <CardDescription>Select a member to view or edit</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {aiFamilyMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedMember?.id === member.id ? "bg-secondary border-primary" : "hover:bg-secondary/50"
                      }`}
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {member.avatar ? (
                            <img
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Bot className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{member.name}</div>
                            <div
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                member.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {member.isActive ? "Active" : "Inactive"}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                          <p className="text-xs mt-1">{member.specialty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedMember ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {selectedMember.avatar ? (
                        <img
                          src={selectedMember.avatar || "/placeholder.svg"}
                          alt={selectedMember.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Bot className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <CardTitle>{selectedMember.name}</CardTitle>
                      <CardDescription>{selectedMember.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setIsEditingMember(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedMember.isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleMemberStatus(selectedMember)}
                    >
                      {selectedMember.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteMember(selectedMember.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                    <TabsTrigger value="usage">Usage Stats</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-name">Name</Label>
                        <Input
                          id="member-name"
                          value={selectedMember.name}
                          onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                          disabled={!isEditingMember}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-role">Role</Label>
                        <Input
                          id="member-role"
                          value={selectedMember.role}
                          onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })}
                          disabled={!isEditingMember}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-specialty">Specialty</Label>
                        <Select
                          value={selectedMember.specialty}
                          onValueChange={(value) => setSelectedMember({ ...selectedMember, specialty: value })}
                          disabled={!isEditingMember}
                        >
                          <SelectTrigger id="member-specialty">
                            <SelectValue placeholder="Select a specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {specialties.map((specialty) => (
                              <SelectItem key={specialty} value={specialty}>
                                {specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-model">AI Model</Label>
                        <Select
                          value={selectedMember.model}
                          onValueChange={(value) => setSelectedMember({ ...selectedMember, model: value })}
                          disabled={!isEditingMember}
                        >
                          <SelectTrigger id="member-model">
                            <SelectValue placeholder="Select an AI model" />
                          </SelectTrigger>
                          <SelectContent>
                            {aiModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-description">Description</Label>
                        <Textarea
                          id="member-description"
                          value={selectedMember.description}
                          onChange={(e) => setSelectedMember({ ...selectedMember, description: e.target.value })}
                          disabled={!isEditingMember}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-avatar">Avatar URL</Label>
                        <Input
                          id="member-avatar"
                          value={selectedMember.avatar}
                          onChange={(e) => setSelectedMember({ ...selectedMember, avatar: e.target.value })}
                          disabled={!isEditingMember}
                        />
                      </div>

                      {isEditingMember && (
                        <Button onClick={handleUpdateMember} className="w-full">
                          <Save className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="capabilities" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4" />
                            <h4 className="font-medium">Chat Capabilities</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="chat-enabled">Enabled</Label>
                              <Switch id="chat-enabled" checked={true} disabled={!isEditingMember} />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="chat-memory">Memory</Label>
                              <Switch id="chat-memory" checked={true} disabled={!isEditingMember} />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="chat-voice">Voice Support</Label>
                              <Switch id="chat-voice" checked={true} disabled={!isEditingMember} />
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Image className="h-4 w-4" />
                            <h4 className="font-medium">Image Capabilities</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="image-enabled">Enabled</Label>
                              <Switch
                                id="image-enabled"
                                checked={selectedMember.specialty === "Image Generation"}
                                disabled={!isEditingMember}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="image-generation">Generation</Label>
                              <Switch
                                id="image-generation"
                                checked={selectedMember.specialty === "Image Generation"}
                                disabled={!isEditingMember}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="image-editing">Editing</Label>
                              <Switch
                                id="image-editing"
                                checked={selectedMember.specialty === "Image Generation"}
                                disabled={!isEditingMember}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4" />
                            <h4 className="font-medium">Code Capabilities</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="code-enabled">Enabled</Label>
                              <Switch
                                id="code-enabled"
                                checked={
                                  selectedMember.specialty === "Code Generation" ||
                                  selectedMember.specialty === "Technical Writing"
                                }
                                disabled={!isEditingMember}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="code-generation">Generation</Label>
                              <Switch
                                id="code-generation"
                                checked={selectedMember.specialty === "Code Generation"}
                                disabled={!isEditingMember}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="code-explanation">Explanation</Label>
                              <Switch
                                id="code-explanation"
                                checked={selectedMember.specialty === "Technical Writing"}
                                disabled={!isEditingMember}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4" />
                            <h4 className="font-medium">Content Capabilities</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="content-enabled">Enabled</Label>
                              <Switch
                                id="content-enabled"
                                checked={
                                  selectedMember.specialty === "Content Creation" ||
                                  selectedMember.specialty === "Creative Writing"
                                }
                                disabled={!isEditingMember}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="content-creation">Creation</Label>
                              <Switch
                                id="content-creation"
                                checked={selectedMember.specialty === "Content Creation"}
                                disabled={!isEditingMember}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="content-editing">Editing</Label>
                              <Switch
                                id="content-editing"
                                checked={selectedMember.specialty === "Content Creation"}
                                disabled={!isEditingMember}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4" />
                          <h4 className="font-medium">Special Capabilities</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="special-research">Research</Label>
                            <Switch
                              id="special-research"
                              checked={selectedMember.specialty === "Research"}
                              disabled={!isEditingMember}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="special-data">Data Analysis</Label>
                            <Switch
                              id="special-data"
                              checked={selectedMember.specialty === "Data Analysis"}
                              disabled={!isEditingMember}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="special-marketing">Marketing</Label>
                            <Switch
                              id="special-marketing"
                              checked={selectedMember.specialty === "Marketing"}
                              disabled={!isEditingMember}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="special-sales">Sales</Label>
                            <Switch
                              id="special-sales"
                              checked={selectedMember.specialty === "Sales"}
                              disabled={!isEditingMember}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="special-education">Education</Label>
                            <Switch
                              id="special-education"
                              checked={selectedMember.specialty === "Education"}
                              disabled={!isEditingMember}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="special-legal">Legal</Label>
                            <Switch
                              id="special-legal"
                              checked={selectedMember.specialty === "Legal"}
                              disabled={!isEditingMember}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="usage" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Total Conversations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">124</div>
                            <p className="text-xs text-muted-foreground">+8% from last month</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Total Messages</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">1,842</div>
                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Average Response Time</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">1.2s</div>
                            <p className="text-xs text-muted-foreground">-0.3s from last month</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Usage Over Time</CardTitle>
                          <CardDescription>Message volume and response times</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] flex items-center justify-center border rounded-md bg-gray-50 dark:bg-gray-800">
                            <div className="text-center">
                              <p className="text-sm font-medium">Usage Chart</p>
                              <p className="text-xs text-muted-foreground">
                                Detailed usage statistics would be displayed here
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Top Interactions</CardTitle>
                          <CardDescription>Most common user interactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>Chat Conversations</span>
                              </div>
                              <span className="font-medium">42%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Content Creation</span>
                              </div>
                              <span className="font-medium">28%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center gap-2">
                                <Code className="h-4 w-4" />
                                <span>Code Generation</span>
                              </div>
                              <span className="font-medium">18%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center gap-2">
                                <Image className="h-4 w-4" />
                                <span>Image Generation</span>
                              </div>
                              <span className="font-medium">12%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No AI Family Member Selected</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Select an AI Family member from the list or create a new one to get started.
                </p>
                <Button onClick={() => setIsAddingMember(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create New AI Family Member
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

