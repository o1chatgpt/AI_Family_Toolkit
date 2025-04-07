import { AIFamilyPageLayout } from "@/components/ai-family-page-layout"
import { aiFamilyMembers } from "@/constants/ai-family"

export default function MistressPage() {
  const member = aiFamilyMembers.find((m) => m.id === "mistress")!

  // Sample data
  const tasks = [
    {
      id: "1",
      title: "Project timeline review",
      description: "Review and optimize the Q3 project timeline",
      dueDate: "2023-08-10",
      priority: "high" as const,
      completed: false,
    },
    {
      id: "2",
      title: "Team performance evaluation",
      description: "Evaluate team performance metrics and provide recommendations",
      dueDate: "2023-08-22",
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "3",
      title: "Resource allocation plan",
      description: "Create a resource allocation plan for the upcoming product launch",
      dueDate: "2023-08-15",
      priority: "high" as const,
      completed: true,
    },
  ]

  const prompts = [
    {
      id: "1",
      title: "Project Status Report",
      content:
        "Generate a comprehensive status report for [project] covering progress on [key milestones], current blockers, and recommendations for [specific challenges].",
    },
    {
      id: "2",
      title: "Team Assignment Matrix",
      content:
        "Create a team assignment matrix that optimally allocates [team members] to [tasks] based on their [skills/experience] and [availability].",
    },
    {
      id: "3",
      title: "Strategic Planning Document",
      content:
        "Develop a strategic planning document for [initiative] that outlines [objectives], key performance indicators, and implementation timeline.",
    },
  ]

  const references = [
    {
      id: "1",
      title: "Project Management Handbook",
      type: "document",
      content: "Comprehensive guide to project management methodologies, tools, and best practices.",
    },
    {
      id: "2",
      title: "Team Capability Matrix",
      type: "document",
      content: "Matrix showing team members' skills, experience levels, and areas of expertise.",
    },
    {
      id: "3",
      title: "Strategic Planning Templates",
      type: "link",
      content: "Collection of strategic planning templates and frameworks for different business contexts.",
    },
  ]

  return <AIFamilyPageLayout member={member} tasks={tasks} prompts={prompts} references={references} />
}

