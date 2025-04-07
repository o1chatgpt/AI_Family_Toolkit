"use client"

import { Badge } from "@/components/ui/badge"

// components/task-list.tsx
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed" | "cancelled"
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Create marketing content for new product",
      description:
        "Develop engaging marketing materials including social media posts, email templates, and blog content for the upcoming product launch.",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      status: "in-progress",
    },
    {
      id: "2",
      title: "Design product landing page",
      description:
        "Create a visually appealing and conversion-optimized landing page for the new product. Include hero section, features, testimonials, and call-to-action elements.",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      status: "pending",
    },
    {
      id: "3",
      title: "Optimize database queries",
      description:
        "Review and optimize the current database queries to improve performance. Focus on the user authentication and product catalog queries.",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "medium",
      status: "completed",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{task.title}</CardTitle>
                <CardDescription>Due: {new Date(task.dueDate).toLocaleDateString()}</CardDescription>
              </div>
              <Badge variant="outline">{task.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <p className="text-sm">{task.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

