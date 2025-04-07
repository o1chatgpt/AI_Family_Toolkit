"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { type AIFamilyMember, AI_FAMILY_MEMBERS } from "@/types/ai-family"
import { supabase } from "@/lib/supabase-client"
import { getUserId } from "@/lib/user-utils"
import { Calendar, RefreshCw } from "lucide-react"

export default function CreateTaskPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [aiMembers, setAiMembers] = useState<AIFamilyMember[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState("")
  const [requiresApproval, setRequiresApproval] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const userId = await getUserId()
        if (!userId) {
          router.push("/login")
          return
        }

        // Load AI members
        await loadAiMembers()
      } catch (error) {
        console.error("Error initializing:", error)
        toast({
          title: "Error",
          description: "Failed to initialize. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  // Load AI Family members
  const loadAiMembers = async () => {
    try {
      const { data, error } = await supabase.from("ai_family_members").select("*")

      if (error) {
        console.error("Error loading AI Family members:", error)
        // If there's an error, use the default AI Family members
        setAiMembers(AI_FAMILY_MEMBERS)
        return
      }

      if (data && data.length > 0) {
        // Map database fields to our AIFamilyMember interface
        const mappedMembers = data.map((member) => ({
          id: member.member_id,
          name: member.name,
          specialty: member.specialty,
          description: member.description,
          avatarUrl: member.avatar_url,
          color: member.color,
          model: member.model,
          fallbackModel: member.fallback_model,
          capabilities: member.capabilities
            ? Array.isArray(member.capabilities)
              ? member.capabilities
              : JSON.parse(member.capabilities)
            : [],
          systemPrompt: member.system_prompt,
          isActive: true,
        }))
        setAiMembers(mappedMembers)

        // Set default assigned to first AI member
        if (mappedMembers.length > 0) {
          setAssignedTo(mappedMembers[0].id)
        }
      } else {
        // If no data in database, use the default AI Family members
        setAiMembers(AI_FAMILY_MEMBERS)

        // Set default assigned to first AI member
        if (AI_FAMILY_MEMBERS.length > 0) {
          setAssignedTo(AI_FAMILY_MEMBERS[0].id)
        }
      }
    } catch (error) {
      console.error("Error in loadAiMembers:", error)
      // Fallback to default members
      setAiMembers(AI_FAMILY_MEMBERS)

      // Set default assigned to first AI member
      if (AI_FAMILY_MEMBERS.length > 0) {
        setAssignedTo(AI_FAMILY_MEMBERS[0].id)
      }
    }
  }

  // Create a new task
  const createTask = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title.",
        variant: "destructive",
      })
      return
    }

    if (!assignedTo) {
      toast({
        title: "Error",
        description: "Please select an AI Family member to assign the task to.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const userId = await getUserId()

      if (!userId) {
        toast({
          title: "Authentication Error",
          description: "Please log in to create a task.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      const newTask = {
        title,
        description,
        assigned_to: assignedTo,
        priority,
        due_date: dueDate || null,
        requires_approval: requiresApproval,
        created_by: userId,
        status: "pending",
      }

      const { error } = await supabase.from("ai_family_tasks").insert(newTask)

      if (error) throw error

      toast({
        title: "Success",
        description: "Task created successfully!",
      })

      // Redirect to tasks page
      router.push("/admin/tasks")
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
          <p className="text-muted-foreground">Assign a new task to an AI Family member</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/tasks")}>
          Cancel
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>Fill in the details for the new task</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a clear, concise title for the task"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed instructions and requirements for the task"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned-to">Assign To</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger id="assigned-to">
                  <SelectValue placeholder="Select AI Family Member" />
                </SelectTrigger>
                <SelectContent>
                  {aiMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date (Optional)</Label>
              <div className="relative">
                <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="requires-approval"
                checked={requiresApproval}
                onCheckedChange={(checked) => setRequiresApproval(checked as boolean)}
              />
              <Label htmlFor="requires-approval">Requires approval when completed</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/tasks")}>
            Cancel
          </Button>
          <Button onClick={createTask} disabled={submitting}>
            {submitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

