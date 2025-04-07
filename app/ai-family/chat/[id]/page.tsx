import { notFound } from "next/navigation"
import { AI_FAMILY_MEMBERS } from "@/constants/ai-family"
import { AIFamilyChat } from "@/components/ai-family/ai-family-chat"

interface AIFamilyChatPageProps {
  params: {
    id: string
  }
}

export default function AIFamilyChatPage({ params }: AIFamilyChatPageProps) {
  const member = AI_FAMILY_MEMBERS.find((m) => m.id === params.id)

  if (!member) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Chat with {member.name}</h1>
      <AIFamilyChat member={member} />
    </div>
  )
}

