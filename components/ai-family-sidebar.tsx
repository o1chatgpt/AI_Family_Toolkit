"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "./ui/sidebar"
import { Button } from "./ui/button"
import { PlusCircle, User, Settings, Calendar, CheckSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "./ui/badge"
import { AI_FAMILY_MEMBERS } from "@/constants/ai-family"
import { cn } from "@/lib/utils"
import { useAIFamily } from "@/contexts/ai-family-provider"

export function AIFamilySidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<string>("members")
  const { state } = useAIFamily()
  const aiFamilyMembers = state?.entities ? Object.values(state.entities) : []

  // Extract the current AI Family member ID from the URL if we're on a member page
  const currentMemberId = pathname.startsWith("/ai-family/") ? pathname.split("/")[2] : null

  const handleMemberClick = (memberId: string) => {
    router.push(`/ai-family/${memberId}`)
  }

  const handleAddMember = () => {
    const isAdmin = localStorage.getItem("userRole") === "admin"

    if (isAdmin) {
      router.push("/admin/ai-family")
    } else {
      toast({
        title: "Permission Denied",
        description: "Only administrators can add new AI Family members.",
        variant: "destructive",
      })
    }
  }

  return (
    <Sidebar className="w-64 border-r">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">AI Family</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/ai-family/settings")}
          title="AI Family Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mx-2 mt-2">
          <TabsTrigger value="members" className="text-xs">
            <User className="h-3 w-3 mr-1" />
            Members
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">
            <CheckSquare className="h-3 w-3 mr-1" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-0">
          <div className="py-2">
            <div className="space-y-1">
              {aiFamilyMembers.map((member) => (
                <button
                  key={member.id}
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm transition-colors",
                    currentMemberId === member.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 hover:text-accent-foreground",
                  )}
                  onClick={() => handleMemberClick(member.id)}
                >
                  <span
                    className="flex items-center justify-center h-8 w-8 rounded-full mr-3"
                    style={{ backgroundColor: `${member.color}20` }}
                  >
                    <User className="h-4 w-4" style={{ color: member.color }} />
                  </span>
                  <div className="text-left">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.specialty}</div>
                  </div>
                  {member.isActive && (
                    <Badge
                      variant="outline"
                      className="ml-auto h-5 px-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-0">
          <div className="py-2">
            <div className="space-y-1">
              {aiFamilyMembers.flatMap((member) =>
                (member.tasks || []).map((task) => (
                  <button
                    key={task.id}
                    className="w-full flex items-center px-4 py-2 text-sm hover:bg-accent/50 hover:text-accent-foreground"
                    onClick={() => router.push(`/ai-family/${member.id}/tasks`)}
                  >
                    <span
                      className="flex items-center justify-center h-8 w-8 rounded-full mr-3"
                      style={{ backgroundColor: `${member.color}20` }}
                    >
                      <User className="h-4 w-4" style={{ color: member.color }} />
                    </span>
                    <div className="text-left">
                      <div className="font-medium">View Tasks</div>
                      <div className="text-xs text-muted-foreground">Assigned to: {member.name}</div>
                    </div>
                  </button>
                )),
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-0">
          <div className="py-2">
            <div className="space-y-1">
              {AI_FAMILY_MEMBERS.flatMap((member) =>
                (member.schedule || []).map((scheduleItem) => (
                  <button
                    key={scheduleItem.id}
                    className="w-full flex items-center px-4 py-2 text-sm hover:bg-accent/50 hover:text-accent-foreground"
                    onClick={() => router.push(`/ai-family/${member.id}/schedule/${scheduleItem.id}`)}
                  >
                    <span
                      className="flex items-center justify-center h-8 w-8 rounded-full mr-3"
                      style={{ backgroundColor: `${member.color}20` }}
                    >
                      <User className="h-4 w-4" style={{ color: member.color }} />
                    </span>
                    <div className="text-left">
                      <div className="font-medium">{scheduleItem.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(scheduleItem.startTime).toLocaleDateString()} • {member.name}
                      </div>
                    </div>
                    {scheduleItem.recurring && (
                      <Badge variant="outline" className="ml-auto h-5 px-1 text-xs">
                        Recurring
                      </Badge>
                    )}
                  </button>
                )),
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-auto p-4 border-t">
        <Button variant="outline" className="w-full" onClick={() => router.push("/admin/ai-family")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>
    </Sidebar>
  )
}

