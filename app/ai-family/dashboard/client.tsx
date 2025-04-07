import { AIFamilyPageLayout } from "@/components/ai-family-page-layout"
import { aiFamilyMembers } from "@/constants/ai-family"

export default function DashboardClient() {
  const member = aiFamilyMembers.find((m) => m.id === "dashboard")!

  // Sample data
  const tasks = [
    {
      id: "1",
      title: "Review AI Family performance",
      description: "Analyze usage statistics and identify areas for improvement",
      dueDate: "2023-10-27",
      priority: "high" as const,
      completed: false,
    },
    {
      id: "2",
      title: "Update documentation",
      description: "Update the documentation for the AI Family Toolkit",
      dueDate: "2023-10-30",
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "3",
      title: "Plan next release",
      description: "Plan the features and timeline for the next release of the AI Family Toolkit",
      dueDate: "2023-11-03",
      priority: "high" as const,
      completed: true,
    },
  ]

  const prompts = [
    {
      id: "1",
      title: "AI Family Performance Report",
      content:
        "Generate a report on the performance of the AI Family Toolkit, including usage statistics, error rates, and response times.",
    },
    {
      id: "2",
      title: "Documentation Update",
      content: "Generate updated documentation for the AI Family Toolkit, including new features and improvements.",
    },
    {
      id: "3",
      title: "Release Plan",
      content:
        "Generate a detailed release plan for the next version of the AI Family Toolkit, including features, timelines, and resource allocation.",
    },
  ]

  const references = [
    {
      id: "1",
      title: "AI Family Toolkit Architecture",
      type: "document",
      content: "Detailed documentation of the AI Family Toolkit architecture.",
    },
    {
      id: "2",
      title: "API Documentation",
      type: "link",
      content: "Link to the API documentation for the AI Family Toolkit.",
    },
    {
      id: "3",
      title: "Best Practices",
      type: "note",
      content: "Collection of best practices for using the AI Family Toolkit.",
    },
  ]

  return <AIFamilyPageLayout member={member} tasks={tasks} prompts={prompts} references={references} />
}

