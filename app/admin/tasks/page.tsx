"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { type AIFamilyMember, AI_FAMILY_MEMBERS } from "@/types/ai-family"
import type { Task, TaskStatus } from "@/types/task"
import { supabase } from "@/lib/supabase-client"
import { getUserId } from "@/lib/user-utils"
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  PlusCircle,
  RefreshCw,
  ArrowUpDown,
  Calendar,
  Clock,
} from "lucide-react"

export default function TaskManagementPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [aiMembers, setAiMembers] = useState<AIFamilyMember[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [taskFilter, setTaskFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userId = await getUserId()
        if (!userId) {
          router.push("/login")
          return
        }

        // In a real app, you would check if the user is an admin
        // For now, we'll assume the user is an admin
        setIsAdmin(true)

        // Load AI members
        loadAiMembers()

        // Load tasks
        loadTasks()
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
      } else {
        // If no data in database, use the default AI Family members
        setAiMembers(AI_FAMILY_MEMBERS)
      }
    } catch (error) {
      console.error("Error in loadAiMembers:", error)
      // Fallback to default members
      setAiMembers(AI_FAMILY_MEMBERS)
    }
  }

  // Load tasks from database
  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_family_tasks")
        .select("*")
        .order("created_at", { ascending: false })

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

  // Handle task approval
  const approveTask = async (taskId: string) => {
    try {
      const userId = await getUserId()

      const { error } = await supabase
        .from("ai_family_tasks")
        .update({
          status: "completed",
          approved_by: userId,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
      const userId = await getUserId()

      const { error } = await supabase
        .from("ai_family_tasks")
        .update({
          status: "rejected",
          rejection_reason: reason,
          rejected_by: userId,
          rejected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)

      if (error) throw error

      // Update local state
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "rejected" as TaskStatus, rejection_reason: reason } : t)),
      )

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
      const userId = await getUserId()

      const { error } = await supabase
        .from("ai_family_tasks")
        .update({
          assigned_to: newAssigneeId,
          status: "pending",
          reassigned_at: new Date().toISOString(),
          reassigned_by: userId,
          updated_at: new Date().toISOString(),
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

  // View task details
  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setShowTaskDetails(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading task management...</p>
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
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">Manage tasks assigned to AI Family members</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/ai-family")}>
            <Users className="h-4 w-4 mr-2" />
            AI Family
          </Button>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task Filters */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Task Filters</CardTitle>
            <CardDescription>Filter tasks by AI Family member and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-filter">Filter by AI Family Member</Label>
              <Select value={taskFilter} onValueChange={setTaskFilter}>
                <SelectTrigger id="ai-filter">
                  <SelectValue placeholder="Select AI Family Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {aiMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Task Statistics</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {tasks.filter((t) => t.status === "completed").length}
                  </p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {tasks.filter((t) => t.status === "in-progress").length}
                  </p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {tasks.filter((t) => t.status === "pending").length}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <Button className="w-full" onClick={() => router.push("/tasks/create")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Task
            </Button>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={loadTasks}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </div>
            </div>
            <CardDescription>Review, approve, and manage tasks assigned to AI Family members</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                    <p className="text-sm text-muted-foreground">
                      {taskFilter !== "all" || statusFilter !== "all"
                        ? "Try changing your filters to see more tasks."
                        : "Create a new task to get started."}
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const assignedMember = aiMembers.find((m) => m.id === task.assigned_to)
                    return (
                      <Card key={task.id} className="overflow-hidden">
                        <CardHeader
                          className={`p-4 ${
                            task.status === "completed"
                              ? "bg-green-50 dark:bg-green-950/20"
                              : task.status === "in-progress"
                                ? "bg-amber-50 dark:bg-amber-950/20"
                                : task.status === "rejected"
                                  ? "bg-red-50 dark:bg-red-950/20"
                                  : "bg-blue-50 dark:bg-blue-950/20"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{task.title}</CardTitle>
                              <CardDescription>
                                Created {new Date(task.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                task.status === "completed"
                                  ? "success"
                                  : task.status === "in-progress"
                                    ? "warning"
                                    : task.status === "rejected"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {task.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-4">
                          <div className="space-y-4">
                            <p className="text-sm">{task.description}</p>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Assigned to:</Label>
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={assignedMember?.avatarUrl} alt={assignedMember?.name} />
                                    <AvatarFallback
                                      className={`text-xs bg-${assignedMember?.color || "blue"}-100 text-${assignedMember?.color || "blue"}-700`}
                                    >
                                      {assignedMember?.name.substring(0, 2) || "AI"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{assignedMember?.name || "Unknown"}</span>
                                </div>
                              </div>

                              <Separator orientation="vertical" className="h-6" />

                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Priority:</Label>
                                <Badge
                                  variant={
                                    task.priority === "high"
                                      ? "destructive"
                                      : task.priority === "medium"
                                        ? "warning"
                                        : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {task.priority}
                                </Badge>
                              </div>

                              {task.due_date && (
                                <>
                                  <Separator orientation="vertical" className="h-6" />

                                  <div className="flex items-center gap-2">
                                    <Label className="text-xs">Due:</Label>
                                    <span className="text-sm">{new Date(task.due_date).toLocaleDateString()}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            {task.status === "in-progress" && (
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => viewTaskDetails(task)}>
                                    View Details
                                  </Button>

                                  <Select
                                    onValueChange={(value) => {
                                      if (value !== task.assigned_to) {
                                        reassignTask(task.id, value)
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="h-8 w-[140px]">
                                      <SelectValue placeholder="Reassign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {aiMembers.map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                          {member.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => {
                                      const reason = prompt("Please provide a reason for rejection:")
                                      if (reason) {
                                        rejectTask(task.id, reason)
                                      }
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>

                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => approveTask(task.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                </div>
                              </div>
                            )}

                            {task.status === "pending" && (
                              <div className="flex items-center justify-between mt-4">
                                <Button variant="outline" size="sm" onClick={() => viewTaskDetails(task)}>
                                  View Details
                                </Button>

                                <Select
                                  onValueChange={(value) => {
                                    if (value !== task.assigned_to) {
                                      reassignTask(task.id, value)
                                    }
                                  }}
                                >
                                  <SelectTrigger className="h-8 w-[140px]">
                                    <SelectValue placeholder="Reassign" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {aiMembers.map((member) => (
                                      <SelectItem key={member.id} value={member.id}>
                                        {member.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {(task.status === "completed" || task.status === "rejected") && (
                              <Button variant="outline" size="sm" onClick={() => viewTaskDetails(task)}>
                                View Details
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader
              className={`${
                selectedTask.status === "completed"
                  ? "bg-green-50 dark:bg-green-950/20"
                  : selectedTask.status === "in-progress"
                    ? "bg-amber-50 dark:bg-amber-950/20"
                    : selectedTask.status === "rejected"
                      ? "bg-red-50 dark:bg-red-950/20"
                      : "bg-blue-50 dark:bg-blue-950/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedTask.title}</CardTitle>
                  <CardDescription>Task ID: {selectedTask.id}</CardDescription>
                </div>
                <Badge
                  variant={
                    selectedTask.status === "completed"
                      ? "success"
                      : selectedTask.status === "in-progress"
                        ? "warning"
                        : selectedTask.status === "rejected"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {selectedTask.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="max-h-[50vh]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <p className="text-sm">{selectedTask.description}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Assigned To</h3>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={aiMembers.find((m) => m.id === selectedTask.assigned_to)?.avatarUrl}
                            alt={aiMembers.find((m) => m.id === selectedTask.assigned_to)?.name}
                          />
                          <AvatarFallback>
                            {aiMembers.find((m) => m.id === selectedTask.assigned_to)?.name.substring(0, 2) || "AI"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{aiMembers.find((m) => m.id === selectedTask.assigned_to)?.name || "Unknown"}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Priority</h3>
                      <Badge
                        variant={
                          selectedTask.priority === "high"
                            ? "destructive"
                            : selectedTask.priority === "medium"
                              ? "warning"
                              : "outline"
                        }
                      >
                        {selectedTask.priority}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Created</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(selectedTask.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {selectedTask.due_date && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Due Date</h3>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(selectedTask.due_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedTask.status === "rejected" && selectedTask.rejection_reason && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium mb-2">Rejection Reason</h3>
                        <p className="text-sm p-3 bg-red-50 dark:bg-red-950/20 rounded-md">
                          {selectedTask.rejection_reason}
                        </p>
                      </div>
                    </>
                  )}

                  {selectedTask.reassigned_at && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium mb-2">Reassignment History</h3>
                        <p className="text-sm">
                          This task was reassigned on {new Date(selectedTask.reassigned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-6 pt-0">
              {selectedTask.status === "in-progress" && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      const reason = prompt("Please provide a reason for rejection:")
                      if (reason) {
                        rejectTask(selectedTask.id, reason)
                        setShowTaskDetails(false)
                      }
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>

                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      approveTask(selectedTask.id)
                      setShowTaskDetails(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}

              <Button variant="outline" onClick={() => setShowTaskDetails(false)}>
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

