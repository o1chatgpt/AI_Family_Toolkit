"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Trash2, UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { AIFamilyMember } from "@/data/ai-family-members"

export default function AIFamilyAdminPage() {
  const [members, setMembers] = useState<AIFamilyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("members")
  const { toast } = useToast()
  const supabase = createClient()

  // New member form state
  const [newMember, setNewMember] = useState<Partial<AIFamilyMember>>({
    name: "",
    role: "",
    specialty: "",
    personality: "",
    description: "",
    avatarUrl: "",
    voiceId: "",
    status: "active",
  })

  // Fetch AI family members from database
  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("ai_family_members").select("*").order("name")

        if (error) throw error

        if (data) {
          setMembers(data as AIFamilyMember[])
        }
      } catch (error) {
        console.error("Error fetching AI family members:", error)
        toast({
          title: "Error",
          description: "Failed to load AI family members",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [toast, supabase])

  // Handle input change for new member form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewMember((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change for new member form
  const handleSelectChange = (name: string, value: string) => {
    setNewMember((prev) => ({ ...prev, [name]: value }))
  }

  // Add new AI family member
  const addMember = async () => {
    try {
      if (!newMember.name || !newMember.role || !newMember.specialty) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Generate an ID based on the name
      const id = newMember.name.toLowerCase().replace(/\s+/g, "-")

      const memberToAdd = {
        ...newMember,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { error } = await supabase.from("ai_family_members").insert([memberToAdd])

      if (error) throw error

      // Refresh the list
      const { data } = await supabase.from("ai_family_members").select("*").order("name")

      if (data) {
        setMembers(data as AIFamilyMember[])
      }

      // Reset form
      setNewMember({
        name: "",
        role: "",
        specialty: "",
        personality: "",
        description: "",
        avatarUrl: "",
        voiceId: "",
        status: "active",
      })

      toast({
        title: "Success",
        description: `${memberToAdd.name} has been added to your AI family`,
      })
    } catch (error) {
      console.error("Error adding AI family member:", error)
      toast({
        title: "Error",
        description: "Failed to add AI family member",
        variant: "destructive",
      })
    }
  }

  // Delete AI family member
  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase.from("ai_family_members").delete().eq("id", id)

      if (error) throw error

      // Update local state
      setMembers(members.filter((member) => member.id !== id))

      toast({
        title: "Success",
        description: "AI family member has been removed",
      })
    } catch (error) {
      console.error("Error deleting AI family member:", error)
      toast({
        title: "Error",
        description: "Failed to delete AI family member",
        variant: "destructive",
      })
    }
  }

  // Update AI family member
  const updateMember = async (member: AIFamilyMember) => {
    try {
      const { error } = await supabase
        .from("ai_family_members")
        .update({
          ...member,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", member.id)

      if (error) throw error

      // Update local state
      setMembers(members.map((m) => (m.id === member.id ? { ...member, updatedAt: new Date().toISOString() } : m)))

      toast({
        title: "Success",
        description: `${member.name} has been updated`,
      })
    } catch (error) {
      console.error("Error updating AI family member:", error)
      toast({
        title: "Error",
        description: "Failed to update AI family member",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Family Management</h1>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">AI Family Members</TabsTrigger>
          <TabsTrigger value="add">Add New Member</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          ) : members.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <p className="text-center text-muted-foreground mb-4">
                  You don't have any AI family members yet. Add your first one!
                </p>
                <Button onClick={() => setActiveTab("add")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add AI Family Member
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteMember(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Label>Specialty</Label>
                        <p className="text-sm">{member.specialty}</p>
                      </div>
                      <div>
                        <Label>Personality</Label>
                        <p className="text-sm">{member.personality}</p>
                      </div>
                      {member.description && (
                        <div>
                          <Label>Description</Label>
                          <p className="text-sm">{member.description}</p>
                        </div>
                      )}
                      {member.voiceId && (
                        <div>
                          <Label>Voice ID</Label>
                          <p className="text-sm">{member.voiceId}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {new Date(member.updatedAt).toLocaleDateString()}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New AI Family Member</CardTitle>
              <CardDescription>Create a new AI family member with a unique personality and role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newMember.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Sophia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    name="role"
                    value={newMember.role}
                    onChange={handleInputChange}
                    placeholder="e.g., Creative Director"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty *</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={newMember.specialty}
                    onChange={handleInputChange}
                    placeholder="e.g., Content Creation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personality">Personality</Label>
                  <Input
                    id="personality"
                    name="personality"
                    value={newMember.personality}
                    onChange={handleInputChange}
                    placeholder="e.g., Creative, Enthusiastic"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    value={newMember.avatarUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voiceId">Voice ID</Label>
                  <Input
                    id="voiceId"
                    name="voiceId"
                    value={newMember.voiceId}
                    onChange={handleInputChange}
                    placeholder="e.g., ElevenLabs Voice ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newMember.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newMember.description}
                  onChange={handleInputChange}
                  placeholder="Describe this AI family member's background and capabilities..."
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("members")}>
                Cancel
              </Button>
              <Button onClick={addMember}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

