"use client"

import { useState } from "react"
import type { AIFamilyTask } from "@/constants/ai-family"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, CheckCircle2, Clock, PlusCircle } from "lucide-react"

interface AIFamilyTaskManagerProps {
  memberId: string
}

const taskFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().min(1, {
    message: "Due date is required.",
  }),
})

export function AIFamilyTaskManager({ memberId }: AIFamilyTaskManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tasks, setTasks] = useState<AIFamilyTask[]>([
    {
      id: "1",
      title: "Generate website mockups",
      description: "Create mockups for the new landing page design",
      priority: "high",
      status: "in-progress",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    },
    {
      id: "2",
      title: "Review user feedback",
      description: "Analyze user feedback from the latest survey",
      priority: "medium",
      status: "pending",
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    },
  ])

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: new Date().toISOString().split("T")[0],
    },
  })

  const onSubmit = (values: z.infer<typeof taskFormSchema>) => {
    const newTask: AIFamilyTask = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description,
      priority: values.priority,
      status: "pending",
      dueDate: new Date(values.dueDate).toISOString(),
    }

    setTasks([...tasks, newTask])
    form.reset()
    setIsDialogOpen(false)
  }

  const updateTaskStatus = (taskId: string, newStatus: AIFamilyTask["status"]) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tasks</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task for this AI family member</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Task description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            <Input type="date" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">Add Task</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <Badge
                    variant={
                      task.priority === "urgent"
                        ? "destructive"
                        : task.priority === "high"
                          ? "default"
                          : task.priority === "medium"
                            ? "secondary"
                            : "outline"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{task.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Badge
                  variant={
                    task.status === "completed"
                      ? "default"
                      : task.status === "in-progress"
                        ? "secondary"
                        : task.status === "cancelled"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {task.status}
                </Badge>

                <div className="flex gap-2">
                  {task.status !== "completed" && (
                    <Button variant="outline" size="sm" onClick={() => updateTaskStatus(task.id, "completed")}>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateTaskStatus(task.id, task.status === "in-progress" ? "pending" : "in-progress")}
                  >
                    {task.status === "in-progress" ? "Pause" : "Start"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted rounded-md">
          <p className="text-muted-foreground">No tasks assigned</p>
          <p className="text-sm text-muted-foreground mt-1">Add a task to get started</p>
        </div>
      )}
    </div>
  )
}

