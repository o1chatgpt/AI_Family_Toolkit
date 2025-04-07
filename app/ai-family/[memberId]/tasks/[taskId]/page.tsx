"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AIFamilySidebar } from "@/components/ai-family-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAIFamilyMember, type AIFamilyMember, type AIFamilyTask } from "@/data/ai-family-members"
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Edit, MessageSquare, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

export default function TaskDetailPage({ params }: { params: { id: string; taskId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [member, setMember] = useState<AIFamilyMember | null>(null)
  const [task, setTask] = useState<AIFamilyTask | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin
    setIsAdmin(localStorage.getItem("userRole") === "admin")

    // Get member data
    const memberData = getAIFamilyMember(params.id)
    if (memberData) {
      setMember(memberData)

      // Find the task
      const taskData = memberData.tasks.find((t) => t.id === params.taskId)
      if (taskData) {
        setTask(taskData)
      } else {
        toast({
          title: "Task not found",
          description: "The requested task could not be found.",
          variant: "destructive",
        })
        router.push(`/ai-family/${params.id}`)
      }
    } else {
      toast({
        title: "Member not found",
        description: "The requested AI Family member could not be found.",
        variant: "destructive",
      })
      router.push("/ai-family")
    }
  }, [params.id, params.taskId, router, toast])

  if (!member || !task) {
    return (
      <div className="flex h-screen">
        <AIFamilySidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading task details...</p>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return ""
    }
  }

  const getProgressValue = (status: string) => {
    switch (status) {
      case "completed":
        return 100
      case "in-progress":
        return 50
      case "pending":
        return 0
      case "cancelled":
        return 0
      default:
        return 0
    }
  }

  const handleStatusChange = (newStatus: "pending" | "in-progress" | "completed" | "cancelled") => {
    toast({
      title: "Status Updated",
      description: `Task status changed to ${newStatus}.`,
    })

    // In a real app, this would update the database
    setTask({
      ...task,
      status: newStatus,
    })
  }

  return (
    <div className="flex h-screen">
      <AIFamilySidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/ai-family/${member.id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Task Details</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <div className={`h-2 ${getStatusColor(task.status)}`}></div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{task.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </CardDescription>
                </div>
                <Badge variant="outline" className={getStatusBadgeClass(task.status)}>
                  {task.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p>{task.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Progress</h3>
                <Progress value={getProgressValue(task.status)} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge variant="outline" className="ml-2">
                      {task.priority}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-2">{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assigned to:</span>
                    <span className="ml-2">{member.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assigned by:</span>
                    <span className="ml-2">{task.assignedBy || "System"}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/ai-family/${member.id}/tasks/${task.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </Button>

                <Button onClick={() => router.push(`/ai-family/${member.id}/chat?task=${task.id}`)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discuss Task
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2" style={{ borderColor: member.color }}>
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.specialty}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => router.push(`/ai-family/${member.id}`)}
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Status Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={task.status === "pending"}
                  onClick={() => handleStatusChange("pending")}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Mark as Pending
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={task.status === "in-progress"}
                  onClick={() => handleStatusChange("in-progress")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as In Progress
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-green-600"
                  disabled={task.status === "completed"}
                  onClick={() => handleStatusChange("completed")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600"
                  disabled={task.status === "cancelled"}
                  onClick={() => handleStatusChange("cancelled")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark as Cancelled
                </Button>
              </CardContent>
            </Card>

            {isAdmin && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      toast({
                        title: "Task Reassigned",
                        description: "You can now select a new AI Family member for this task.",
                      })
                      router.push(`/ai-family/${member.id}/tasks/${task.id}/reassign`)
                    }}
                  >
                    Reassign Task
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
                        toast({
                          title: "Task Deleted",
                          description: "The task has been deleted successfully.",
                        })
                        router.push(`/ai-family/${member.id}`)
                      }
                    }}
                  >
                    Delete Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

