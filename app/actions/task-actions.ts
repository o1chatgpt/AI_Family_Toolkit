"use server"

import { revalidatePath } from "next/cache"
import {
  getAllTasks,
  getTasksByAIFamilyMember,
  getTasksByStatus,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  approveTask,
  rejectTask,
  reassignTask,
} from "@/lib/task-utils"
import type { Task, TaskStatus, TaskPriority } from "@/types/task"
import { getUserId } from "@/lib/user-utils"

// Get all tasks
export async function getAllTasksAction(): Promise<{
  success: boolean
  data?: Task[]
  error?: string
}> {
  try {
    const tasks = await getAllTasks()
    return { success: true, data: tasks }
  } catch (error) {
    console.error("Error in getAllTasksAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Get tasks by AI Family member
export async function getTasksByAIFamilyMemberAction(
  memberId: string,
): Promise<{ success: boolean; data?: Task[]; error?: string }> {
  try {
    const tasks = await getTasksByAIFamilyMember(memberId)
    return { success: true, data: tasks }
  } catch (error) {
    console.error(`Error in getTasksByAIFamilyMemberAction for ${memberId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Get tasks by status
export async function getTasksByStatusAction(
  status: TaskStatus,
): Promise<{ success: boolean; data?: Task[]; error?: string }> {
  try {
    const tasks = await getTasksByStatus(status)
    return { success: true, data: tasks }
  } catch (error) {
    console.error(`Error in getTasksByStatusAction for ${status}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Get a single task by ID
export async function getTaskByIdAction(taskId: string): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const task = await getTaskById(taskId)

    if (!task) {
      return { success: false, error: `Task with ID ${taskId} not found` }
    }

    return { success: true, data: task }
  } catch (error) {
    console.error(`Error in getTaskByIdAction for ${taskId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Create a new task
export async function createTaskAction(formData: FormData): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    // Extract task data from form
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const assignedTo = formData.get("assignedTo") as string
    const priority = (formData.get("priority") as TaskPriority) || "medium"
    const dueDate = (formData.get("dueDate") as string) || undefined
    const requiresApproval = formData.get("requiresApproval") === "true"

    // Parse tags from JSON string if provided
    const tagsStr = formData.get("tags") as string
    const tags = tagsStr ? JSON.parse(tagsStr) : undefined

    // Create task
    const task = await createTask(title, description, assignedTo, priority, dueDate, requiresApproval, tags)

    if (!task) {
      return { success: false, error: "Failed to create task" }
    }

    revalidatePath("/admin/tasks")
    return { success: true, data: task }
  } catch (error) {
    console.error("Error in createTaskAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Update a task
export async function updateTaskAction(
  taskId: string,
  formData: FormData,
): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    // Extract task updates from form
    const updates: Partial<Task> = {}

    // Only include fields that are present in the form
    if (formData.has("title")) {
      updates.title = formData.get("title") as string
    }

    if (formData.has("description")) {
      updates.description = formData.get("description") as string
    }

    if (formData.has("status")) {
      updates.status = formData.get("status") as TaskStatus
    }

    if (formData.has("priority")) {
      updates.priority = formData.get("priority") as TaskPriority
    }

    if (formData.has("assignedTo")) {
      updates.assigned_to = formData.get("assignedTo") as string
    }

    if (formData.has("dueDate")) {
      updates.due_date = formData.get("dueDate") as string
    }

    if (formData.has("requiresApproval")) {
      updates.requires_approval = formData.get("requiresApproval") === "true"
    }

    if (formData.has("tags")) {
      const tagsStr = formData.get("tags") as string
      updates.tags = tagsStr ? JSON.parse(tagsStr) : []
    }

    // Update task
    const task = await updateTask(taskId, updates)

    if (!task) {
      return { success: false, error: "Failed to update task" }
    }

    revalidatePath("/admin/tasks")
    return { success: true, data: task }
  } catch (error) {
    console.error(`Error in updateTaskAction for ${taskId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Delete a task
export async function deleteTaskAction(taskId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const result = await deleteTask(taskId)

    if (!result) {
      return { success: false, error: "Failed to delete task" }
    }

    revalidatePath("/admin/tasks")
    return { success: true }
  } catch (error) {
    console.error(`Error in deleteTaskAction for ${taskId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Approve a task
export async function approveTaskAction(taskId: string): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const task = await approveTask(taskId)

    if (!task) {
      return { success: false, error: "Failed to approve task" }
    }

    revalidatePath("/admin/tasks")
    return { success: true, data: task }
  } catch (error) {
    console.error(`Error in approveTaskAction for ${taskId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Reject a task
export async function rejectTaskAction(
  taskId: string,
  reason: string,
): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const task = await rejectTask(taskId, reason)

    if (!task) {
      return { success: false, error: "Failed to reject task" }
    }

    revalidatePath("/admin/tasks")
    return { success: true, data: task }
  } catch (error) {
    console.error(`Error in rejectTaskAction for ${taskId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Reassign a task
export async function reassignTaskAction(
  taskId: string,
  newAssigneeId: string,
): Promise<{ success: boolean; data?: Task; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const task = await reassignTask(taskId, newAssigneeId)

    if (!task) {
      return { success: false, error: "Failed to reassign task" }
    }

    revalidatePath("/admin/tasks")
    return { success: true, data: task }
  } catch (error) {
    console.error(`Error in reassignTaskAction for ${taskId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

