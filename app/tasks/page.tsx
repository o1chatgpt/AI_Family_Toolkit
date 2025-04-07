"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TaskAssignmentForm } from "@/components/task-assignment-form"
import { AI_FAMILY_MEMBERS } from "@/types/ai-family"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase/client"
import { CheckCircle, Clock, AlertCircle, Plus, Trash2 } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  ai_family_id: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  due_date?: string
  created_at: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()
  const supabase = useSupabase()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from("ai_tasks").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error loading tasks:", error)
          return
        }

        if (data) {
          setTasks(data as Task[])
        }
      } else {
        // Demo data if no Supabase connection
        setTasks([
          {
            id: "1",
            title: "Research market trends for Q3",
            description: "Analyze recent market data and identify emerging trends for Q3 planning",
            ai_family_id: "nova",
            priority: "high",
            status: "in-progress",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Debug authentication flow",
            description: "Fix issues with the user authentication process in the mobile app",
            ai_family_id: "max",
            priority: "urgent",
            status: "pending",
            due_date: new Date(Date.now() + 86400000).toISOString(),
            created_at: new Date().toISOString(),
          },
          {
            id: "3",
            title: "Create content calendar for social media",
            description: "Develop a content calendar for the next month's social media posts",
            ai_family_id: "luna",
            priority: "medium",
            status: "completed",
            created_at: new Date(Date.now() - 172800000).toISOString(),
          },
        ])
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  }

  const handleTaskAssigned = (taskId: string) => {
    loadTasks()
  }

  const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
    try {
      // Update local state first for immediate feedback
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)))

      // Update in Supabase
      if (supabase) {
        const { error } = await supabase.from("ai_tasks").update({ status }).eq("id", taskId)

        if (error) {
          console.error("Error updating task status:", error)
          toast({
            title: "Error",
            description: "Failed to update task status",
            variant: "destructive",
          })

          // Revert local state if there was an error
          setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: task.status } : task)))
        } else {
          toast({
            title: "Task updated",
            description: `Task status changed to ${status}`,
          })
        }
      }
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      // Update local state first for immediate feedback
      setTasks((prev) => prev.filter((task) => task.id !== taskId))

      // Delete from Supabase
      if (supabase) {
        const { error } = await supabase.from("ai_tasks").delete().eq("id", taskId)

        if (error) {
          console.error("Error deleting task:", error)
          toast({
            title: "Error",
            description: "Failed to delete task",
            variant: "destructive",
          })

          // Reload tasks if there was an error
          loadTasks()
        } else {
          toast({
            title: "Task deleted",
            description: "Task has been deleted successfully",
          })
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "cancelled":
        return <Trash2 className="h-4 w-4 text-gray-500" />
      case "pending":
      default:
        return <AlertCircle className="h-4 w-4 text-amber-500" />
    }
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "high":
        return (
          <Badge variant="default" className="bg-orange-500">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="default" className="bg-blue-500">
            Medium
          </Badge>
        )
      case "low":
      default:
        return <Badge variant="outline">Low</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const filteredTasks = activeTab === "all" ? tasks : tasks.filter((task) => task.status === activeTab)

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task Assignment Form */}
        <div className="md:col-span-1">
          <TaskAssignmentForm onTaskAssigned={handleTaskAssigned} />
        </div>

        {/* Task List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>AI Family Tasks</CardTitle>
              <CardDescription>Manage and track tasks assigned to AI Family members</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                  <ScrollArea className="h-[calc(100vh-16rem)]">
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No tasks found</p>
                        <p className="text-sm">Assign a new task to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredTasks.map((task) => {
                          const aiFamily = AI_FAMILY_MEMBERS.find((ai) => ai.id === task.ai_family_id)
                          return (
                            <div key={task.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(task.status)}
                                    <h3 className="font-medium">{task.title}</h3>
                                  </div>
                                  <div className="ml-2">{getPriorityBadge(task.priority)}</div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {task.description && (
                                <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className={`h-6 w-6 bg-${aiFamily?.color || "gray"}-100`}>
                                    <AvatarImage src={aiFamily?.avatarUrl} />
                                    <AvatarFallback className={`bg-${aiFamily?.color || "gray"}-100`}>
                                      {aiFamily?.name?.[0] || "A"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{aiFamily?.name}</span>
                                </div>

                                <div className="flex items-center gap-4">
                                  {task.due_date && (
                                    <span className="text-xs text-muted-foreground">
                                      Due: {formatDate(task.due_date)}
                                    </span>
                                  )}

                                  <Select
                                    value={task.status}
                                    onValueChange={(value) =>
                                      updateTaskStatus(
                                        task.id,
                                        value as "pending" | "in-progress" | "completed" | "cancelled",
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-8 w-[130px]">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="in-progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

