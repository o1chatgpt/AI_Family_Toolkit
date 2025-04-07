"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { type AIFamilyMember, AI_FAMILY_MEMBERS } from "@/types/ai-family"
import type { Task, TaskStatus } from "@/types/task"
import { supabase } from "@/lib/supabase-client"
import { getUserId } from "@/lib/user-utils"
import { Users, Settings, FileText, RefreshCw } from "lucide-react"
import { AdminStatus } from "@/components/admin-status"
import { AIFamilyList } from "@/components/ai-family-list"
import { TaskList } from "@/components/task-list"

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [aiMembers, setAiMembers] = useState<AIFamilyMember[]>([])
  const [selectedMember, setSelectedMember] = useState<AIFamilyMember | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [taskFilter, setTaskFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isSaving, setIsSaving] = useState(false)

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userId = await getUserId()
        if (!userId) {
          router.push("/login")
          return
        }

        const { data, error } = await supabase.from("users").select("is_admin").eq("id", userId).single()

        if (error) throw error

        if (data && data.is_admin) {
          setIsAdmin(true)
          // Load AI members from database
          loadAiMembers()
          // Load tasks
          loadTasks()
        } else {
          toast({
            title: "Access Denied",
            description: "You need administrator privileges to access this page.",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  // Load AI Family members from database
  const loadAiMembers = async () => {
    try {
      const { data, error } = await supabase.from("ai_family_members").select("*").order("name")

      if (error) throw error

      if (data && data.length > 0) {
        setAiMembers(data as AIFamilyMember[])
      } else {
        // If no data in database, use the default AI Family members
        // In a real app, you would seed the database with these defaults
        setAiMembers(AI_FAMILY_MEMBERS)

        // Save default members to database
        for (const member of AI_FAMILY_MEMBERS) {
          await supabase.from("ai_family_members").upsert({
            id: member.id,
            name: member.name,
            specialty: member.specialty,
            description: member.description,
            avatarUrl: member.avatarUrl || `/ai-family/${member.id}.png`,
            color: member.color || "blue",
            model: member.model,
            fallbackModel: member.fallbackModel,
            capabilities: member.capabilities,
            systemPrompt: member.systemPrompt || "",
          })
        }
      }
    } catch (error) {
      console.error("Error loading AI Family members:", error)
      toast({
        title: "Error",
        description: "Failed to load AI Family members. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Load tasks from database
  const loadTasks = async () => {
    try {
      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

      if (error) throw error

      if (data) {
        setTasks(data as Task[])
        setFilteredTasks(data as Task[])
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload image to Supabase storage
  const uploadImage = async () => {
    if (!imageFile || !selectedMember) return null

    try {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${selectedMember.id}-${Date.now()}.${fileExt}`
      const filePath = `ai-family/${fileName}`

      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, imageFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage.from("images").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      return null
    }
  }

  // Save AI Family member changes
  const saveMember = async () => {
    if (!selectedMember) return

    setIsSaving(true)

    try {
      // Upload image if there's a new one
      let avatarUrl = selectedMember.avatarUrl
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) {
          avatarUrl = uploadedUrl
        }
      }

      // Update member with new data
      const updatedMember = {
        ...selectedMember,
        avatarUrl,
      }

      // Save to database
      const { error } = await supabase.from("ai_family_members").upsert(updatedMember)

      if (error) throw error

      // Update local state
      setAiMembers((prev) => prev.map((m) => (m.id === updatedMember.id ? updatedMember : m)))

      setSelectedMember(updatedMember)
      setEditMode(false)
      setImageFile(null)
      setImagePreview(null)

      toast({
        title: "Success",
        description: `${updatedMember.name}'s profile has been updated.`,
      })
    } catch (error) {
      console.error("Error saving AI Family member:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle task approval
  const approveTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          status: "completed",
          approved_by: await getUserId(),
          approved_at: new Date().toISOString(),
        })
        .eq("id", taskId)

      if (error) throw error

      // Update local state
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: "completed" as TaskStatus } : t)))

      // Update filtered tasks
      applyFilters()

      toast({
        title: "Task Approved",
        description: "The task has been approved and marked as completed.",
      })
    } catch (error) {
      console.error("Error approving task:", error)
      toast({
        title: "Error",
        description: "Failed to approve task. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle task rejection
  const rejectTask = async (taskId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          status: "rejected",
          rejection_reason: reason,
          rejected_by: await getUserId(),
          rejected_at: new Date().toISOString(),
        })
        .eq("id", taskId)

      if (error) throw error

      // Update local state
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: "rejected" as TaskStatus } : t)))

      // Update filtered tasks
      applyFilters()

      toast({
        title: "Task Rejected",
        description: "The task has been rejected and sent back for revision.",
      })
    } catch (error) {
      console.error("Error rejecting task:", error)
      toast({
        title: "Error",
        description: "Failed to reject task. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle task reassignment
  const reassignTask = async (taskId: string, newAssigneeId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          assigned_to: newAssigneeId,
          status: "pending",
          reassigned_at: new Date().toISOString(),
          reassigned_by: await getUserId(),
        })
        .eq("id", taskId)

      if (error) throw error

      // Update local state
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                assigned_to: newAssigneeId,
                status: "pending" as TaskStatus,
              }
            : t,
        ),
      )

      // Update filtered tasks
      applyFilters()

      toast({
        title: "Task Reassigned",
        description: `The task has been reassigned to ${aiMembers.find((m) => m.id === newAssigneeId)?.name || "another AI Family member"}.`,
      })
    } catch (error) {
      console.error("Error reassigning task:", error)
      toast({
        title: "Error",
        description: "Failed to reassign task. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Apply filters to tasks
  const applyFilters = () => {
    let filtered = [...tasks]

    // Filter by AI Family member
    if (taskFilter !== "all") {
      filtered = filtered.filter((task) => task.assigned_to === taskFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    setFilteredTasks(filtered)
  }

  // Effect to apply filters when filter values change
  useEffect(() => {
    applyFilters()
  }, [taskFilter, statusFilter, tasks])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading administrative panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need administrator privileges to access this page.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage AI Family members, tasks, and system settings</p>
        </div>
        <AdminStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              AI Family Members
            </CardTitle>
            <CardDescription>Manage AI family members and their profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <AIFamilyList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Tasks
            </CardTitle>
            <CardDescription>View and manage tasks assigned to AI family members</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </CardTitle>
            <CardDescription>Configure global settings for the AI Family Toolkit</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Configure system settings here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

