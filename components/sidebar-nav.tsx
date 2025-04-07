"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Brain,
  ChevronDown,
  Code,
  FileText,
  Home,
  ImageIcon,
  MessageSquare,
  Settings,
  Sparkles,
  Users,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    aiFamily: true,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Sample AI Family data
  const aiFamilyMembers = [
    { id: "stan", name: "Stan", specialty: "General assistance", avatar: "👨‍💼" },
    { id: "cody", name: "Cody", specialty: "Programming", avatar: "👨‍💻" },
    { id: "imogen", name: "Imogen", specialty: "Image creation", avatar: "👩‍🎨" },
    { id: "data", name: "Data", specialty: "Data analysis", avatar: "📊" },
    { id: "writer", name: "Writer", specialty: "Content creation", avatar: "✍️" },
  ]

  return (
    <ScrollArea className="h-full py-2">
      <div className={cn("flex flex-col gap-1 px-2", className)} {...props}>
        <Button variant={pathname === "/" ? "secondary" : "ghost"} size="sm" className="justify-start" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>

        <Button variant={pathname === "/files" ? "secondary" : "ghost"} size="sm" className="justify-start" asChild>
          <Link href="/files">
            <FileText className="h-4 w-4 mr-2" />
            Files
          </Link>
        </Button>

        <Button variant={pathname === "/chat" ? "secondary" : "ghost"} size="sm" className="justify-start" asChild>
          <Link href="/chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Link>
        </Button>

        <Button variant={pathname === "/image" ? "secondary" : "ghost"} size="sm" className="justify-start" asChild>
          <Link href="/image">
            <ImageIcon className="h-4 w-4 mr-2" />
            Image
          </Link>
        </Button>

        <Button variant={pathname === "/code" ? "secondary" : "ghost"} size="sm" className="justify-start" asChild>
          <Link href="/code">
            <Code className="h-4 w-4 mr-2" />
            Code
          </Link>
        </Button>

        <Collapsible open={openSections.aiFamily} onOpenChange={() => toggleSection("aiFamily")} className="mt-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="justify-between w-full font-medium">
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Family
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.aiFamily ? "transform rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-1">
            <div className="flex flex-col gap-1">
              <Button
                variant={pathname === "/ai-family" ? "secondary" : "ghost"}
                size="sm"
                className="justify-start"
                asChild
              >
                <Link href="/ai-family">
                  <Sparkles className="h-4 w-4 mr-2" />
                  All Members
                </Link>
              </Button>

              {aiFamilyMembers.map((member) => (
                <Button
                  key={member.id}
                  variant={pathname === `/ai-family/${member.id}` ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <Link href={`/ai-family/${member.id}`}>
                    <span className="mr-2">{member.avatar}</span>
                    {member.name}
                  </Link>
                </Button>
              ))}
              <Link
                href="/ai-family/return"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                  pathname === "/ai-family/return" ? "bg-muted font-medium text-primary" : "text-muted-foreground",
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                Return Home
              </Link>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button
          variant={pathname === "/users" ? "secondary" : "ghost"}
          size="sm"
          className="justify-start mt-2"
          asChild
        >
          <Link href="/users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </Link>
        </Button>

        <Button variant={pathname === "/settings" ? "secondary" : "ghost"} size="sm" className="justify-start" asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </Button>
      </div>
    </ScrollArea>
  )
}

