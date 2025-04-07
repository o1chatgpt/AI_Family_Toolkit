"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AI_FAMILY_MEMBERS } from "@/types/ai-family"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { useSupabase } from "@/lib/supabase/client"

interface TaskAssignmentFormProps {
  onTaskAssigned?: (taskId: string) => void
  defaultAiFamilyId?: string
}

export function TaskAssignmentForm({ onTaskAssigned, defaultAiFamilyId }: TaskAssignmentFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedAI, setSelectedAI] = useState(defaultAiFamilyId || AI_FAMILY_MEMBERS[0].id)
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const supabase = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const taskId = uuidv4()

      // In a real app, this would save to your database
      // For now, we'll just simulate a successful save

      // Save to Supabase if connected
      if (supabase) {
        const { error } = await supabase.from("ai_tasks").insert({
          id: taskId,
          title,
          description,
          ai_family_id: selectedAI,
          priority,
          due_date: dueDate || null,
          status: "pending",
          created_at: new Date().toISOString(),
        })

        if (error) {
          console.error("Error creating task:", error)
          toast({
            title: "Error",
            description: "Failed to create task",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }
      }

      toast({
        title: "Task assigned",
        description: `Task "${title}" has been assigned to ${AI_FAMILY_MEMBERS.find((ai) => ai.id === selectedAI)?.name}`,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setPriority("medium")
      setDueDate("")

      if (onTaskAssigned) {
        onTaskAssigned(taskId)
      }
    } catch (error) {
      console.error("Error assigning task:", error)
      toast({
        title: "Error",
        description: "Failed to assign task",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Task to AI Family</CardTitle>
        <CardDescription>Create a task and assign it to an AI Family member</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ai-family">Assign to</Label>
              <Select value={selectedAI} onValueChange={setSelectedAI}>
                <SelectTrigger id="ai-family">
                  <SelectValue placeholder="Select AI Family member" />
                </SelectTrigger>
                <SelectContent>
                  {AI_FAMILY_MEMBERS.map((ai) => (
                    <SelectItem key={ai.id} value={ai.id}>
                      {ai.name} - {ai.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date (Optional)</Label>
            <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Assigning..." : "Assign Task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

