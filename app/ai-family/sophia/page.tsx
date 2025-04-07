import { AIFamilyPageLayout } from "@/components/ai-family-page-layout"
import { aiFamilyMembers } from "@/constants/ai-family"

export default function SophiaPage() {
  const member = aiFamilyMembers.find((m) => m.id === "sophia")!

  // Sample data
  const tasks = [
    {
      id: "1",
      title: "Schedule team meetings",
      description: "Organize weekly team meetings for Q3",
      dueDate: "2023-08-12",
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "2",
      title: "Create project timeline",
      description: "Develop a detailed timeline for the marketing campaign",
      dueDate: "2023-08-20",
      priority: "high" as const,
      completed: false,
    },
    {
      id: "3",
      title: "Update task tracking system",
      description: "Update the task tracking system with new features",
      dueDate: "2023-08-08",
      priority: "low" as const,
      completed: true,
    },
  ]

  const prompts = [
    {
      id: "1",
      title: "Meeting Agenda",
      content:
        "Create a detailed agenda for a [duration] [meeting type] meeting with [participants] focusing on [topics].",
    },
    {
      id: "2",
      title: "Project Schedule",
      content:
        "Generate a comprehensive project schedule for [project] with milestones, dependencies, and resource allocations.",
    },
    {
      id: "3",
      title: "Task Prioritization",
      content: "Help prioritize these tasks based on [criteria] and suggest an optimal execution order.",
    },
  ]

  const references = [
    {
      id: "1",
      title: "Meeting Templates",
      type: "document",
      content: "Collection of meeting templates for different types of meetings and team sizes.",
    },
    {
      id: "2",
      title: "Project Management Guide",
      type: "note",
      content: "Best practices for project scheduling, task management, and team coordination.",
    },
    {
      id: "3",
      title: "Productivity Tools",
      type: "link",
      content: "List of recommended productivity and scheduling tools with integration guides.",
    },
  ]

  return <AIFamilyPageLayout member={member} tasks={tasks} prompts={prompts} references={references} />
}

