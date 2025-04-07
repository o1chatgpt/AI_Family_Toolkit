"use client"

import { CardFooter } from "@/components/ui/card"

// components/ai-family-list.tsx
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AI_FAMILY_MEMBERS } from "@/constants/ai-family"

export function AIFamilyList() {
  const [aiFamilyMembers, setAiFamilyMembers] = useState(AI_FAMILY_MEMBERS)

  return (
    <div className="space-y-4">
      {aiFamilyMembers.map((member) => (
        <Card key={member.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription>{member.specialty}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button asChild variant="outline" size="sm">
              <Link href={`/ai-family/${member.id}`}>View Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

