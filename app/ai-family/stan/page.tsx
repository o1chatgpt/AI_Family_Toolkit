import { AIFamilyPageLayout } from "@/components/ai-family-page-layout"
import { aiFamilyMembers } from "@/constants/ai-family"

export default function StanPage() {
  const member = aiFamilyMembers.find((m) => m.id === "stan")!

  // Sample data
  const tasks = [
    {
      id: "1",
      title: "Code review",
      description: "Review the authentication module code for security issues",
      dueDate: "2023-08-15",
      priority: "high" as const,
      completed: false,
    },
    {
      id: "2",
      title: "Refactor database queries",
      description: "Optimize and refactor database queries for better performance",
      dueDate: "2023-08-22",
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "3",
      title: "Fix UI rendering bug",
      description: "Investigate and fix the UI rendering bug in the dashboard",
      dueDate: "2023-08-10",
      priority: "low" as const,
      completed: true,
    },
  ]

  const prompts = [
    {
      id: "1",
      title: "Code Optimization",
      content:
        "Optimize this [language] code for [performance/readability/maintainability] while ensuring it still [functionality requirements].",
    },
    {
      id: "2",
      title: "Bug Fix",
      content:
        "Debug this code that's causing [issue description]. The expected behavior is [expected behavior] but it's currently [actual behavior].",
    },
    {
      id: "3",
      title: "Code Documentation",
      content:
        "Generate comprehensive documentation for this [language] code including function descriptions, parameter explanations, and usage examples.",
    },
  ]

  const references = [
    {
      id: "1",
      title: "Coding Standards",
      type: "document",
      content: "Official coding standards and style guides for different programming languages used in our projects.",
    },
    {
      id: "2",
      title: "Performance Optimization Techniques",
      type: "note",
      content: "Collection of techniques for optimizing code performance across different languages and frameworks.",
    },
    {
      id: "3",
      title: "Debugging Tools",
      type: "link",
      content: "List of recommended debugging tools and profilers with setup instructions.",
    },
  ]

  return <AIFamilyPageLayout member={member} tasks={tasks} prompts={prompts} references={references} />
}

