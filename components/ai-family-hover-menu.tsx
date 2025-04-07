"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Sparkles, ChevronRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

// Sample AI family members data
const AI_FAMILY_MEMBERS = [
  {
    id: "kara",
    name: "Kara",
    role: "Image & Design",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    color: "purple",
  },
  {
    id: "sophia",
    name: "Sophia",
    role: "Task Coordination",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    color: "blue",
  },
  {
    id: "stan",
    name: "Stan",
    role: "Code & Technical",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    color: "green",
  },
  {
    id: "dude",
    name: "Dude",
    role: "Social & Insights",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    color: "orange",
  },
  {
    id: "karl",
    name: "Karl",
    role: "Science & Logic",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    color: "cyan",
  },
  {
    id: "lyra",
    name: "Lyra",
    role: "Music & Audio",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    color: "pink",
  },
]

export function AIFamilyHoverMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Button
        variant="ghost"
        className={cn("flex items-center gap-2 px-3 py-2 w-full justify-start", isOpen && "bg-accent")}
      >
        <Sparkles className="h-5 w-5" />
        <span>AI Family</span>
        <ChevronRight className={cn("ml-auto h-4 w-4 transition-transform", isOpen && "rotate-90")} />
      </Button>

      {isOpen && (
        <Card className="absolute left-full top-0 ml-1 w-64 z-50 shadow-lg">
          <CardContent className="p-2">
            <div className="space-y-1">
              <Link href="/ai-family" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  All AI Family Members
                </Button>
              </Link>

              <div className="pt-2 pb-1">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1">Family Members</div>
                {AI_FAMILY_MEMBERS.map((member) => (
                  <Link key={member.id} href={`/ai-family/${member.id}`} className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback className={`bg-${member.color}-100 text-${member.color}-500`}>
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm">{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.role}</span>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

