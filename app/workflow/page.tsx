"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CheckSquare,
  Calendar,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  ArrowUpDown,
  Search,
} from "lucide-react"
import { AI_FAMILY_MEMBERS } from "@/data/ai-family-members"
import { useToast } from "@/hooks/use-toast"

// Task type definition
interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  dueDate: string
  createdAt: string
  createdBy: string
}

// Workflow type definition
interface Workflow {
  id: string
  title: string
  description: string
  tasks: string[] // Task IDs
  status: "active" | "completed" | "archived"
  createdAt: string
  createdBy: string
}

export default function WorkflowPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("tasks")
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Create marketing content for new product",
      description:
        "Develop engaging marketing materials including social media posts, email templates, and blog content for the upcoming product launch.",
      assignedTo: "sophia",
      priority: "high",
      status: "in-progress",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "admin",
    },
    {
      id: "task-2",
      title: "Design product landing page",
      description:
        "Create a visually appealing and conversion-optimized landing page for the new product. Include hero section, features, testimonials, and call-to-action elements.",
      assignedTo: "dude",
      priority: "high",
      status: "pending",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "admin",
    },
    {
      id: "task-3",
      title: "Optimize database queries",
      description:
        "Review and optimize the current database queries to improve performance. Focus on the user authentication and product catalog queries.",
      assignedTo: "dan",
      priority: "medium",
      status: "completed",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "admin",
    },
  ])

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "workflow-1",
      title: "Product Launch Campaign",
      description: "Comprehensive workflow for planning and executing the Q2 product launch",
      tasks: ["task-1", "task-2"],
      status: "active",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "admin",
    },
  ])

  const [taskFilter, setTaskFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("dueDate")
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [showNewWorkflowForm, setShowNewWorkflowForm] = useState(false)

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskAssignee, setNewTaskAssignee] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")

  // New workflow form state
  const [newWorkflowTitle, setNewWorkflowTitle] = useState("")
  const [newWorkflowDescription, setNewWorkflowDescription] = useState("")
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  // Filter tasks based on filter and search
  const filteredTasks = tasks.filter((task) => {
    // Filter by status
    if (taskFilter !== "all" && task.status !== taskFilter) {
      return false
    }

    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    } else if (sortBy === "status") {
      const statusOrder = { "in-progress": 0, pending: 1, completed: 2, cancelled: 3 }
      return statusOrder[a.status] - statusOrder[b.status]
    }
    return 0
  })

  // Handle creating a new task
  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !newTaskAssignee || !newTaskDueDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDescription,
      assignedTo: newTaskAssignee,
      priority: newTaskPriority,
      status: "pending",
      dueDate: new Date(newTaskDueDate).toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: "admin", // In a real app, this would be the current user
    }

    setTasks((prev) => [...prev, newTask])

    // Reset form
    setNewTaskTitle("")
    setNewTaskDescription("")
    setNewTaskAssignee("")
    setNewTaskPriority("medium")
    setNewTaskDueDate("")
    setShowNewTaskForm(false)

    toast({
      title: "Task created",
      description: "The task has been created successfully.",
    })
  }

  // Handle creating a new workflow
  const handleCreateWorkflow = () => {
    if (!newWorkflowTitle.trim() || selectedTasks.length === 0) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select at least one task.",
        variant: "destructive",
      })
      return
    }

    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      title: newWorkflowTitle,
      description: newWorkflowDescription,
      tasks: selectedTasks,
      status: "active",
      createdAt: new Date().toISOString(),
      createdBy: "admin", // In a real app, this would be the current user
    }

    setWorkflows((prev) => [...prev, newWorkflow])

    // Reset form
    setNewWorkflowTitle("")
    setNewWorkflowDescription("")
    setSelectedTasks([])
    setShowNewWorkflowForm(false)

    toast({
      title: "Workflow created",
      description: "The workflow has been created successfully.",
    })
  }

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

    toast({
      title: "Task updated",
      description: `Task status changed to ${newStatus}.`,
    })
  }

  // Get AI Family member by ID
  const getMemberById = (id: string) => {
    return AI_FAMILY_MEMBERS.find((member) => member.id === id)
  }

  // Get status badge class
  const getStatusBadgeClass = (status: Task["status"]) => {
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

  // Get priority badge class
  const getPriorityBadgeClass = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <MainNav />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workflow Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tasks" className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Workflows</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Team</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[250px]"
                />
              </div>

              <Select value={taskFilter} onValueChange={setTaskFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setShowNewTaskForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>

          {showNewTaskForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New Task</CardTitle>
                <CardDescription>Assign a task to an AI Family member</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Task Title</Label>
                      <Input
                        id="task-title"
                        placeholder="Enter task title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-assignee">Assign To</Label>
                      <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                        <SelectTrigger id="task-assignee">
                          <SelectValue placeholder="Select AI Family member" />
                        </SelectTrigger>
                        <SelectContent>
                          {AI_FAMILY_MEMBERS.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} - {member.specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      placeholder="Enter task description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-priority">Priority</Label>
                      <Select
                        value={newTaskPriority}
                        onValueChange={(value) => setNewTaskPriority(value as "low" | "medium" | "high")}
                      >
                        <SelectTrigger id="task-priority">
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
                      <Label htmlFor="task-due-date">Due Date</Label>
                      <Input
                        id="task-due-date"
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewTaskForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task) => {
                const member = getMemberById(task.assignedTo)
                return (
                  <Card key={task.id} className="overflow-hidden">
                    <div
                      className={`h-1 ${
                        task.status === "completed"
                          ? "bg-green-500"
                          : task.status === "in-progress"
                            ? "bg-blue-500"
                            : task.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }`}
                    ></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{task.title}</CardTitle>
                        <Badge variant="outline" className={getStatusBadgeClass(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                          <Badge variant="outline" className={getPriorityBadgeClass(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{task.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {member && (
                            <>
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{member.name}</span>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {task.status !== "completed" && task.status !== "cancelled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleTaskStatusChange(task.id, "completed")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          {task.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTaskStatusChange(task.id, "in-progress")}
                            >
                              Start
                            </Button>
                          )}
                          {task.status !== "cancelled" && task.status !== "completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleTaskStatusChange(task.id, "cancelled")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">No Tasks Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No tasks match your search criteria."
                    : taskFilter !== "all"
                      ? `No ${taskFilter} tasks found.`
                      : "You don't have any tasks yet."}
                </p>
                <Button className="mt-4" onClick={() => setShowNewTaskForm(true)}>
                  Create Your First Task
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="workflows">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Workflows</h2>
            <Button onClick={() => setShowNewWorkflowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>

          {showNewWorkflowForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New Workflow</CardTitle>
                <CardDescription>Group related tasks into a workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow-title">Workflow Title</Label>
                    <Input
                      id="workflow-title"
                      placeholder="Enter workflow title"
                      value={newWorkflowTitle}
                      onChange={(e) => setNewWorkflowTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workflow-description">Description</Label>
                    <Textarea
                      id="workflow-description"
                      placeholder="Enter workflow description"
                      value={newWorkflowDescription}
                      onChange={(e) => setNewWorkflowDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Select Tasks</Label>
                    <div className="border rounded-md p-4 space-y-2 max-h-[200px] overflow-y-auto">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`task-${task.id}`}
                            checked={selectedTasks.includes(task.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTasks((prev) => [...prev, task.id])
                              } else {
                                setSelectedTasks((prev) => prev.filter((id) => id !== task.id))
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <label htmlFor={`task-${task.id}`} className="text-sm flex-1">
                            {task.title}
                          </label>
                          <Badge variant="outline" className={getStatusBadgeClass(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      ))}
                      {tasks.length === 0 && (
                        <p className="text-sm text-muted-foreground">No tasks available. Create tasks first.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewWorkflowForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {workflows.length > 0 ? (
              workflows.map((workflow) => {
                const workflowTasks = tasks.filter((task) => workflow.tasks.includes(task.id))
                const completedTasks = workflowTasks.filter((task) => task.status === "completed").length
                const progress =
                  workflowTasks.length > 0 ? Math.round((completedTasks / workflowTasks.length) * 100) : 0

                return (
                  <Card key={workflow.id}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{workflow.title}</CardTitle>
                          <CardDescription>{workflow.description}</CardDescription>
                        </div>
                        <Badge variant={workflow.status === "active" ? "default" : "outline"}>{workflow.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Tasks ({workflowTasks.length})</h3>
                          <div className="space-y-2">
                            {workflowTasks.map((task) => {
                              const member = getMemberById(task.assignedTo)
                              return (
                                <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                                  <div className="flex items-center gap-2">
                                    {task.status === "completed" ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : task.status === "in-progress" ? (
                                      <Clock className="h-4 w-4 text-blue-500" />
                                    ) : task.status === "cancelled" ? (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    )}
                                    <span className="text-sm">{task.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {member && (
                                      <div className="flex items-center gap-1">
                                        <Avatar className="h-5 w-5">
                                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs">{member.name}</span>
                                      </div>
                                    )}
                                    <Badge variant="outline" className={getStatusBadgeClass(task.status)}>
                                      {task.status}
                                    </Badge>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">No Workflows Found</h3>
                <p className="text-muted-foreground">You don't have any workflows yet.</p>
                <Button className="mt-4" onClick={() => setShowNewWorkflowForm(true)}>
                  Create Your First Workflow
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">AI Family Team</h2>
            <p className="text-muted-foreground">
              Your AI Family team members are specialized assistants that can help with various tasks. Assign tasks to
              them based on their specialties for optimal results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_FAMILY_MEMBERS.map((member) => {
              const memberTasks = tasks.filter((task) => task.assignedTo === member.id)
              const activeTasks = memberTasks.filter(
                (task) => task.status === "pending" || task.status === "in-progress",
              ).length

              return (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2" style={{ borderColor: member.color }}>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{member.name}</CardTitle>
                        <CardDescription>{member.specialty}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Active Tasks:</span>
                        <span>{activeTasks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed Tasks:</span>
                        <span>{memberTasks.filter((task) => task.status === "completed").length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Tasks:</span>
                        <span>{memberTasks.length}</span>
                      </div>

                      <div className="pt-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setNewTaskAssignee(member.id)
                            setShowNewTaskForm(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Assign Task
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

