"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AIFamilySidebar } from "@/components/ai-family-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAIFamilyMember, type AIFamilyMember } from "@/data/ai-family-members"
import { ArrowLeft, Calendar, Repeat } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function AddScheduleEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [member, setMember] = useState<AIFamilyMember | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringPattern, setRecurringPattern] = useState<string>("weekly")

  useEffect(() => {
    // Get member data
    const memberData = getAIFamilyMember(params.id)
    if (memberData) {
      setMember(memberData)

      // Set default date to tomorrow
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 1)
      setDate(defaultDate.toISOString().split("T")[0])

      // Set default times
      const defaultStartTime = new Date()
      defaultStartTime.setHours(9, 0, 0)
      setStartTime(defaultStartTime.toTimeString().slice(0, 5))

      const defaultEndTime = new Date()
      defaultEndTime.setHours(10, 0, 0)
      setEndTime(defaultEndTime.toTimeString().slice(0, 5))
    } else {
      toast({
        title: "Member not found",
        description: "The requested AI Family member could not be found.",
        variant: "destructive",
      })
      router.push("/ai-family")
    }
  }, [params.id, router, toast])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for the event.",
        variant: "destructive",
      })
      return
    }

    if (!date || !startTime || !endTime) {
      toast({
        title: "Missing date or time",
        description: "Please provide a date and time for the event.",
        variant: "destructive",
      })
      return
    }

    // Validate that end time is after start time
    if (startTime >= endTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save to the database
    toast({
      title: "Event Scheduled",
      description: `Event "${title}" has been scheduled for ${member?.name}.`,
    })

    // Navigate back to the member page
    router.push(`/ai-family/${params.id}?tab=schedule`)
  }

  if (!member) {
    return (
      <div className="flex h-screen">
        <AIFamilySidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AIFamilySidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/ai-family/${member.id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Schedule Event for {member.name}</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border-2" style={{ borderColor: member.color }}>
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>New Event for {member.name}</CardTitle>
                  <CardDescription>{member.specialty}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter event description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recurring" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Repeat className="h-4 w-4" />
                        Recurring Event
                      </div>
                    </Label>
                    <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                  </div>

                  {isRecurring && (
                    <div className="space-y-2">
                      <Label htmlFor="recurringPattern">Recurrence Pattern</Label>
                      <Select value={recurringPattern} onValueChange={setRecurringPattern}>
                        <SelectTrigger id="recurringPattern">
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => router.push(`/ai-family/${member.id}`)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Event
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

