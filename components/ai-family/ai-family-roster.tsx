"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AI_FAMILY_MEMBERS } from "@/constants/ai-family"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { AIFamilyMemberDetails } from "./ai-family-member-details"

export function AIFamilyRoster() {
  const [selectedMember, setSelectedMember] = useState(null)

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AI_FAMILY_MEMBERS.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  {member.avatarUrl ? (
                    <Image
                      src={member.avatarUrl || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Specialties:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.specialties?.map((specialty, index) => (
                    <Badge key={index} variant="outline">
                      {specialty}
                    </Badge>
                  )) || <Badge variant="outline">{member.specialty}</Badge>}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Voice:</p>
                <p className="text-sm">
                  {member.voiceService || "Default"} - {member.voiceId || "Default"}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedMember(member)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  {selectedMember && <AIFamilyMemberDetails member={selectedMember} />}
                </DialogContent>
              </Dialog>
              <Link href={`/ai-family/chat/${member.id}`}>
                <Button>Chat</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

