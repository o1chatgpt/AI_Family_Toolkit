"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AI_FAMILY_MEMBERS } from "@/constants/ai-family"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Settings, ImageIcon, PlusCircle } from "lucide-react"

export function AIFamilySidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="w-64 border-r h-screen">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Family</h2>
        <p className="text-sm text-muted-foreground">Manage your AI assistants</p>
      </div>

      <div className="p-4 border-b">
        <div className="space-y-1">
          <Link href="/ai-family">
            <Button
              variant={
                isActive("/ai-family") &&
                !pathname.includes("/chat/") &&
                !pathname.includes("/settings") &&
                !pathname.includes("/image-generation")
                  ? "default"
                  : "ghost"
              }
              className="w-full justify-start"
            >
              <Users className="h-4 w-4 mr-2" />
              AI Family Roster
            </Button>
          </Link>
          <Link href="/ai-family/image-generation">
            <Button
              variant={isActive("/ai-family/image-generation") ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Image Generation
            </Button>
          </Link>
          <Link href="/ai-family/settings">
            <Button variant={isActive("/ai-family/settings") ? "default" : "ghost"} className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Family Members</h3>
          <Link href="/ai-family?tab=add">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-1">
            {AI_FAMILY_MEMBERS.map((member) => (
              <Link key={member.id} href={`/ai-family/chat/${member.id}`}>
                <Button
                  variant={isActive(`/ai-family/chat/${member.id}`) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{member.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

