import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { AIFamilyMember } from "@/types/ai-family"
import type { User } from "@/types/user"
import { MessageSquare, Crown, UserIcon } from "lucide-react"
import type { ReactNode } from "react"

interface ChatMessageProps {
  content: string
  sender: "user" | "ai"
  timestamp: Date
  aiFamilyMember?: AIFamilyMember
  user?: User
  isAdmin?: boolean
}

export function ChatMessage({ content, sender, timestamp, aiFamilyMember, user, isAdmin = false }: ChatMessageProps) {
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(timestamp)

  // Get the appropriate icon based on the AI Family member's specialty
  const getAIFamilyIcon = (specialty?: string): ReactNode => {
    switch (specialty?.toLowerCase()) {
      case "code":
      case "programming":
      case "development":
        return <code className="text-xs">{"</>"}</code>
      case "creative":
      case "writing":
      case "content":
        return <span className="text-xs">✏️</span>
      case "data":
      case "analytics":
        return <span className="text-xs">📊</span>
      case "research":
      case "academic":
        return <span className="text-xs">🔍</span>
      case "business":
      case "marketing":
        return <span className="text-xs">💼</span>
      default:
        return <MessageSquare className="h-3 w-3" />
    }
  }

  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        sender === "user" ? "bg-muted/50" : "bg-background",
        isAdmin && sender === "user" && "bg-amber-50 dark:bg-amber-950/20",
      )}
    >
      <Avatar className={cn("h-8 w-8", sender === "ai" && aiFamilyMember?.color && `bg-${aiFamilyMember.color}-100`)}>
        {sender === "user" ? (
          <>
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className={cn(isAdmin ? "bg-amber-200" : "bg-primary/10")}>
              {isAdmin ? <Crown className="h-4 w-4 text-amber-600" /> : <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src={aiFamilyMember?.avatarUrl} />
            <AvatarFallback className={cn("bg-primary/10", aiFamilyMember?.color && `bg-${aiFamilyMember.color}-100`)}>
              {getAIFamilyIcon(aiFamilyMember?.specialty)}
            </AvatarFallback>
          </>
        )}
      </Avatar>
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {sender === "user"
              ? isAdmin
                ? "Administrator"
                : user?.name || "User"
              : aiFamilyMember?.name || "AI Assistant"}
          </span>
          {sender === "ai" && aiFamilyMember?.specialty && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{aiFamilyMember.specialty}</span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{formattedTime}</span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
      </div>
    </div>
  )
}

