export type TaskStatus = "pending" | "in-progress" | "completed" | "rejected"
export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: string
  title: string
  description: string
  ai_family_id: string
  priority: TaskPriority
  status: TaskStatus
  due_date?: string
  created_at: string
  updated_at?: string
  assigned_to?: string
  requires_approval?: boolean
  approved_by?: string
  approved_at?: string
  rejected_by?: string
  rejected_at?: string
  rejection_reason?: string
  reassigned_by?: string
  reassigned_at?: string
  tags?: string
}

