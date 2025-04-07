"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AIFamilySidebar } from "@/components/ai-family-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAIFamilyMember, type AIFamilyMember } from "@/data/ai-family-members"
import { ArrowLeft, CheckSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function AssignTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [member, setMember] = useState<AIFamilyMember | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [dueDate, setDueDate] = useState("")

  useEffect(() => {
    // Get member data
    const memberData = getAIFamilyMember(params.id)
    if (memberData) {
      setMember(memberData)

      // Set default due date to 7 days from now
      const defaultDueDate = new Date()
      defaultDueDate.setDate(defaultDueDate.getDate() + 7)
      setDueDate(defaultDueDate.toISOString().split("T")[0])
    } else {
      toast({
        title: "Member not found",
        description: "The requested AI Family member could not be found.",
        variant: "destructive",
      })
      router.push("/ai-family")
    }
  }, [params.id, router, toast])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for the task.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save to the database
    toast({
      title: "Task Assigned",
      description: `Task "${title}" has been assigned to ${member?.name}.`,
    })

    // Navigate back to the member page
    router.push(`/ai-family/${params.id}?tab=tasks`)
  }

  if (!member) {
    return (
      <div className="flex h-screen">
        <AIFamilySidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AIFamilySidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/ai-family/${member.id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Assign Task to {member.name}</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border-2" style={{ borderColor: member.color }}>
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>New Task for {member.name}</CardTitle>
                  <CardDescription>{member.specialty}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => router.push(`/ai-family/${member.id}`)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Assign Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

