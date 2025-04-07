import { supabase } from "./supabase-client"
import type { Task, TaskStatus, TaskPriority } from "@/types/task"
import { getUserId } from "./user-utils"

// Get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase.from("ai_family_tasks").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tasks:", error)
      return []
    }

    return data as Task[]
  } catch (error) {
    console.error("Error in getAllTasks:", error)
    return []
  }
}

// Get tasks by AI Family member
export const getTasksByAIFamilyMember = async (memberId: string): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from("ai_family_tasks")
      .select("*")
      .eq("assigned_to", memberId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`Error fetching tasks for AI Family member ${memberId}:`, error)
      return []
    }

    return data as Task[]
  } catch (error) {
    console.error(`Error in getTasksByAIFamilyMember for ${memberId}:`, error)
    return []
  }
}

// Get tasks by status
export const getTasksByStatus = async (status: TaskStatus): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from("ai_family_tasks")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`Error fetching tasks with status ${status}:`, error)
      return []
    }

    return data as Task[]
  } catch (error) {
    console.error(`Error in getTasksByStatus for ${status}:`, error)
    return []
  }
}

// Get a single task by ID
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const { data, error } = await supabase.from("ai_family_tasks").select("*").eq("id", taskId).single()

    if (error) {
      console.error(`Error fetching task ${taskId}:`, error)
      return null
    }

    return data as Task
  } catch (error) {
    console.error(`Error in getTaskById for ${taskId}:`, error)
    return null
  }
}

// Create a new task
export const createTask = async (
  title: string,
  description: string,
  assignedTo: string,
  priority: TaskPriority = "medium",
  dueDate?: string,
  requiresApproval = true,
  tags?: string[],
): Promise<Task | null> => {
  try {
    const userId = await getUserId()

    if (!userId) {
      console.error("User not authenticated")
      return null
    }

    const newTask = {
      title,
      description,
      assigned_to: assignedTo,
      priority,
      due_date: dueDate || null,
      requires_approval: requiresApproval,
      created_by: userId,
      status: "pending" as TaskStatus,
      tags: tags ? JSON.stringify(tags) : null,
    }

    const { data, error } = await supabase.from("ai_family_tasks").insert(newTask).select()

    if (error) {
      console.error("Error creating task:", error)
      return null
    }

    return data[0] as Task
  } catch (error) {
    console.error("Error in createTask:", error)
    return null
  }
}

// Update a task
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task | null> => {
  try {
    // Prepare updates for database
    const taskUpdates: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    // Convert tags array to JSON string if present
    if (updates.tags) {
      taskUpdates.tags = JSON.stringify(updates.tags)
    }

    const { data, error } = await supabase.from("ai_family_tasks").update(taskUpdates).eq("id", taskId).select()

    if (error) {
      console.error(`Error updating task ${taskId}:`, error)
      return null
    }

    return data[0] as Task
  } catch (error) {
    console.error(`Error in updateTask for ${taskId}:`, error)
    return null
  }
}

// Delete a task
export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("ai_family_tasks").delete().eq("id", taskId)

    if (error) {
      console.error(`Error deleting task ${taskId}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in deleteTask for ${taskId}:`, error)
    return false
  }
}

// Approve a task
export const approveTask = async (taskId: string): Promise<Task | null> => {
  try {
    const userId = await getUserId()

    if (!userId) {
      console.error("User not authenticated")
      return null
    }

    const { data, error } = await supabase
      .from("ai_family_tasks")
      .update({
        status: "completed" as TaskStatus,
        approved_by: userId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()

    if (error) {
      console.error(`Error approving task ${taskId}:`, error)
      return null
    }

    return data[0] as Task
  } catch (error) {
    console.error(`Error in approveTask for ${taskId}:`, error)
    return null
  }
}

// Reject a task
export const rejectTask = async (taskId: string, reason: string): Promise<Task | null> => {
  try {
    const userId = await getUserId()

    if (!userId) {
      console.error("User not authenticated")
      return null
    }

    const { data, error } = await supabase
      .from("ai_family_tasks")
      .update({
        status: "rejected" as TaskStatus,
        rejection_reason: reason,
        rejected_by: userId,
        rejected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()

    if (error) {
      console.error(`Error rejecting task ${taskId}:`, error)
      return null
    }

    return data[0] as Task
  } catch (error) {
    console.error(`Error in rejectTask for ${taskId}:`, error)
    return null
  }
}

// Reassign a task
export const reassignTask = async (taskId: string, newAssigneeId: string): Promise<Task | null> => {
  try {
    const userId = await getUserId()

    if (!userId) {
      console.error("User not authenticated")
      return null
    }

    const { data, error } = await supabase
      .from("ai_family_tasks")
      .update({
        assigned_to: newAssigneeId,
        status: "pending" as TaskStatus,
        reassigned_at: new Date().toISOString(),
        reassigned_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()

    if (error) {
      console.error(`Error reassigning task ${taskId}:`, error)
      return null
    }

    return data[0] as Task
  } catch (error) {
    console.error(`Error in reassignTask for ${taskId}:`, error)
    return null
  }
}

