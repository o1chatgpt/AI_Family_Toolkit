import { AIFamilyPageLayout } from "@/components/ai-family-page-layout"
import { aiFamilyMembers } from "@/constants/ai-family"

export default function LyraPage() {
  const member = aiFamilyMembers.find((m) => m.id === "lyra")!

  // Sample data
  const tasks = [
    {
      id: "1",
      title: "Create background music",
      description: "Compose ambient background music for the product demo video",
      dueDate: "2023-08-18",
      priority: "high" as const,
      completed: false,
    },
    {
      id: "2",
      title: "Generate sound effects",
      description: "Create a set of UI sound effects for the mobile app",
      dueDate: "2023-08-25",
      priority: "medium" as const,
      completed: false,
    },
    {
      id: "3",
      title: "Audio analysis of competitor",
      description: "Analyze the audio branding of our top 3 competitors",
      dueDate: "2023-08-12",
      priority: "low" as const,
      completed: true,
    },
  ]

  const prompts = [
    {
      id: "1",
      title: "Ambient Music Track",
      content:
        "Create a [mood] ambient music track with [instruments] that evokes a sense of [emotion]. The track should be [length] minutes long and suitable for [purpose].",
    },
    {
      id: "2",
      title: "UI Sound Effects",
      content:
        "Generate a set of [style] UI sound effects for [actions] that are cohesive and align with our [brand personality].",
    },
    {
      id: "3",
      title: "Voice Over Processing",
      content:
        "Process this voice recording to sound more [quality] by adjusting [parameters] while maintaining natural speech patterns.",
    },
  ]

  const references = [
    {
      id: "1",
      title: "Audio Brand Guidelines",
      type: "document",
      content:
        "Official audio branding guidelines including sound characteristics, musical elements, and voice guidelines.",
    },
    {
      id: "2",
      title: "Sound Design Resources",
      type: "note",
      content: "Collection of resources for sound design including sample libraries and processing techniques.",
    },
    {
      id: "3",
      title: "Music Reference Playlist",
      type: "link",
      content: "Spotify playlist with reference tracks for different moods and styles.",
    },
  ]

  return <AIFamilyPageLayout member={member} tasks={tasks} prompts={prompts} references={references} />
}

