"use client"

import { Button } from "@/components/ui/button"
import type { Task } from "@/constants/ai-family"
import { CheckCircle, Circle, Loader2, Trash2 } from "lucide-react"

interface TaskProps {
  task: Task
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Task["status"]) => void
}

export function TaskComponent({ task, onDelete, onStatusChange }: TaskProps) {
  const handleStatusChange = () => {
    let newStatus: Task["status"]
    if (task.status === "open") {
      newStatus = "in progress"
    } else if (task.status === "in progress") {
      newStatus = "completed"
    } else {
      newStatus = "open"
    }
    onStatusChange(task.id, newStatus)
  }

  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleStatusChange}>
          {task.status === "open" && <Circle className="h-4 w-4" />}
          {task.status === "in progress" && <Loader2 className="h-4 w-4 animate-spin" />}
          {task.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
        </Button>
        <span className="text-sm">{task.description}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

