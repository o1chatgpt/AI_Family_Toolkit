import { AIFamilyPageLayout } from "@/components/ai-family-page-layout"
import { aiFamilyMembers } from "@/constants/ai-family"

export default function KaraPage() {
  const member = aiFamilyMembers.find((m) => m.id === "kara")!

  // Sample data
  const tasks = [
    {
      id: "1",
      title: "Create product showcase images",
      description: "Generate 5 product showcase images for the new smartphone lineup",
      dueDate: "2023-08-15",
      priority: "high" as const,
      completed: false,
    },
    {
      id: "2",
      title: "Design social media graphics",
      description: "Create a set of social media graphics for the summer campaign",
      dueDate: "2023-08-20",
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "3",
      title: "Update brand style guide",
      description: "Update the visual elements in the brand style guide",
      dueDate: "2023-08-10",
      priority: "low" as const,
      completed: true,
    },
  ]

  const prompts = [
    {
      id: "1",
      title: "Product on White Background",
      content:
        "Create a professional product image of [product] on a clean white background with soft shadows, showing all key features clearly.",
    },
    {
      id: "2",
      title: "Lifestyle Product Usage",
      content:
        "Generate an image of [product] being used by a [demographic] in a [setting] that conveys [emotion/benefit].",
    },
    {
      id: "3",
      title: "Brand Mood Board",
      content:
        "Create a mood board for [brand] that captures the essence of [brand values] using [color palette] and imagery that evokes [emotions/feelings].",
    },
  ]

  const references = [
    {
      id: "1",
      title: "Brand Guidelines",
      type: "document",
      content: "Official brand guidelines including color codes, typography, and visual elements.",
    },
    {
      id: "2",
      title: "Product Photography Tips",
      type: "note",
      content: "Collection of tips and best practices for product photography and image composition.",
    },
    {
      id: "3",
      title: "Design Inspiration Board",
      type: "link",
      content: "Pinterest board with design inspiration and reference images.",
    },
  ]

  return <AIFamilyPageLayout member={member} tasks={tasks} prompts={prompts} references={references} />
}

