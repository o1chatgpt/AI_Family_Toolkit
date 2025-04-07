"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AIFamilySidebar } from "@/components/ai-family-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAIFamilyMember, type AIFamilyMember, type AIFamilyScheduleItem } from "@/data/ai-family-members"
import { ArrowLeft, Calendar, Clock, Edit, User, Repeat, CalendarDays, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

export default function ScheduleDetailPage({ params }: { params: { id: string; scheduleId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [member, setMember] = useState<AIFamilyMember | null>(null)
  const [scheduleItem, setScheduleItem] = useState<AIFamilyScheduleItem | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin
    setIsAdmin(localStorage.getItem("userRole") === "admin")

    // Get member data
    const memberData = getAIFamilyMember(params.id)
    if (memberData) {
      setMember(memberData)

      // Find the schedule item
      const scheduleData = memberData.schedule.find((s) => s.id === params.scheduleId)
      if (scheduleData) {
        setScheduleItem(scheduleData)
      } else {
        toast({
          title: "Schedule item not found",
          description: "The requested schedule item could not be found.",
          variant: "destructive",
        })
        router.push(`/ai-family/${params.id}`)
      }
    } else {
      toast({
        title: "Member not found",
        description: "The requested AI Family member could not be found.",
        variant: "destructive",
      })
      router.push("/ai-family")
    }
  }, [params.id, params.scheduleId, router, toast])

  if (!member || !scheduleItem) {
    return (
      <div className="flex h-screen">
        <AIFamilySidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading schedule details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Format date and time
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate duration in minutes
  const getDurationMinutes = () => {
    const start = new Date(scheduleItem.startTime).getTime()
    const end = new Date(scheduleItem.endTime).getTime()
    return Math.round((end - start) / (1000 * 60))
  }

  // Format duration as hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) {
      return `${mins} minutes`
    } else if (mins === 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`
    } else {
      return `${hours} hour${hours > 1 ? "s" : ""} ${mins} minute${mins > 1 ? "s" : ""}`
    }
  }

  return (
    <div className="flex h-screen">
      <AIFamilySidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/ai-family/${member.id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Schedule Details</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{scheduleItem.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(scheduleItem.startTime)}
                    </div>
                  </CardDescription>
                </div>
                {scheduleItem.recurring && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Repeat className="h-3 w-3" />
                    Recurring {scheduleItem.recurringPattern}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p>{scheduleItem.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Time Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Start Time</div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatTime(scheduleItem.startTime)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">End Time</div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatTime(scheduleItem.endTime)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Duration</div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatDuration(getDurationMinutes())}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Date</div>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatDate(scheduleItem.startTime)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {scheduleItem.recurring && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Recurrence</h3>
                    <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
                      <Repeat className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Recurring {scheduleItem.recurringPattern}</div>
                        <div className="text-sm text-muted-foreground">
                          This event repeats {scheduleItem.recurringPattern} at the same time.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/ai-family/${member.id}/schedule/${scheduleItem.id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>

                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel this event?")) {
                      toast({
                        title: "Event Cancelled",
                        description: "The event has been cancelled successfully.",
                      })
                      router.push(`/ai-family/${member.id}`)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Event
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2" style={{ borderColor: member.color }}>
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.specialty}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => router.push(`/ai-family/${member.id}`)}
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Add to Calendar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Added to Calendar",
                      description: "Event has been added to your calendar.",
                    })
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to My Calendar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Calendar Invite Sent",
                      description: "Calendar invite has been sent to your email.",
                    })
                  }}
                >
                  Send Calendar Invite
                </Button>
              </CardContent>
            </Card>

            {isAdmin && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      toast({
                        title: "Event Reassigned",
                        description: "You can now select a new AI Family member for this event.",
                      })
                      router.push(`/ai-family/${member.id}/schedule/${scheduleItem.id}/reassign`)
                    }}
                  >
                    Reassign Event
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
                        toast({
                          title: "Event Deleted",
                          description: "The event has been deleted successfully.",
                        })
                        router.push(`/ai-family/${member.id}`)
                      }
                    }}
                  >
                    Delete Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

