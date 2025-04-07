import { AIFamilyPageLayout } from "@/components/ai-family-page-layout"
import { aiFamilyMembers } from "@/constants/ai-family"

export default function KarlPage() {
  const member = aiFamilyMembers.find((m) => m.id === "karl")!

  // Sample data
  const tasks = [
    {
      id: "1",
      title: "Data pattern analysis",
      description: "Analyze user behavior patterns in the application",
      dueDate: "2023-08-18",
      priority: "high" as const,
      completed: false,
    },
    {
      id: "2",
      title: "Predictive model development",
      description: "Develop a predictive model for customer churn",
      dueDate: "2023-08-25",
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "3",
      title: "Research methodology review",
      description: "Review and improve the research methodology for the user study",
      dueDate: "2023-08-10",
      priority: "low" as const,
      completed: true,
    },
  ]

  const prompts = [
    {
      id: "1",
      title: "Data Analysis Report",
      content:
        "Analyze this [data set] to identify patterns related to [specific question] and provide insights on [business objective].",
    },
    {
      id: "2",
      title: "Experimental Design",
      content:
        "Design an experiment to test [hypothesis] with [constraints] that will provide statistically significant results.",
    },
    {
      id: "3",
      title: "Predictive Model",
      content:
        "Develop a predictive model for [outcome variable] based on [input variables] that optimizes for [performance metric].",
    },
  ]

  const references = [
    {
      id: "1",
      title: "Research Methodologies",
      type: "document",
      content: "Comprehensive guide to research methodologies, statistical analysis, and experimental design.",
    },
    {
      id: "2",
      title: "Data Analysis Tools",
      type: "link",
      content: "Collection of recommended data analysis tools and libraries with usage examples.",
    },
    {
      id: "3",
      title: "Scientific Literature Database",
      type: "note",
      content: "Access to scientific literature database with papers relevant to our research areas.",
    },
  ]

  return <AIFamilyPageLayout member={member} tasks={tasks} prompts={prompts} references={references} />
}

