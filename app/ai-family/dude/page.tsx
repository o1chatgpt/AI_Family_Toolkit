import { AIFamilyPageLayout } from "@/components/ai-family-page-layout"
import { aiFamilyMembers } from "@/constants/ai-family"

export default function DudePage() {
  const member = aiFamilyMembers.find((m) => m.id === "dude")!

  // Sample data
  const tasks = [
    {
      id: "1",
      title: "Social media trend analysis",
      description: "Analyze current social media trends relevant to our industry",
      dueDate: "2023-08-20",
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "2",
      title: "Competitor social presence",
      description: "Research and report on competitors' social media presence",
      dueDate: "2023-08-25",
      priority: "low" as const,
      completed: false,
    },
    {
      id: "3",
      title: "Content engagement report",
      description: "Create a report on engagement metrics for recent content",
      dueDate: "2023-08-12",
      priority: "high" as const,
      completed: true,
    },
  ]

  const prompts = [
    {
      id: "1",
      title: "Social Media Post",
      content:
        "Create a [platform] post about [topic] that's engaging, on-brand, and includes [hashtags/elements] to maximize reach.",
    },
    {
      id: "2",
      title: "Trend Analysis",
      content:
        "Analyze current trends in [industry/topic] and suggest how we can leverage them for our [marketing/content] strategy.",
    },
    {
      id: "3",
      title: "Engagement Strategy",
      content:
        "Develop an engagement strategy for our [platform] account that will help us increase [metrics] among [target audience].",
    },
  ]

  const references = [
    {
      id: "1",
      title: "Social Media Playbook",
      type: "document",
      content: "Comprehensive guide to our social media strategy, voice, and content guidelines.",
    },
    {
      id: "2",
      title: "Trending Topics",
      type: "link",
      content: "Real-time dashboard of trending topics and hashtags relevant to our industry.",
    },
    {
      id: "3",
      title: "Audience Insights",
      type: "note",
      content: "Detailed insights about our audience demographics, preferences, and engagement patterns.",
    },
  ]

  return <AIFamilyPageLayout member={member} tasks={tasks} prompts={prompts} references={references} />
}

