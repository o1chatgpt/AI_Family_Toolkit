"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { DialogTitle } from "@/components/ui/dialog"

import { DialogHeader } from "@/components/ui/dialog"

import Image from "next/image"
import type { AIFamilyMember } from "@/constants/ai-family"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AIFamilyMemberDetailsProps {
  member: AIFamilyMember
}

export function AIFamilyMemberDetails({ member }: AIFamilyMemberDetailsProps) {
  return (
    <div>
      <DialogHeader>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100">
            {member.avatarUrl ? (
              <Image src={member.avatarUrl || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                {member.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <DialogTitle className="text-2xl">{member.name}</DialogTitle>
            <DialogDescription>{member.role}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <Tabs defaultValue="info" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-gray-500 mt-1">{member.description}</p>
            </div>

            <div>
              <h3 className="font-medium">Specialties</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {member.specialties?.map((specialty, index) => (
                  <Badge key={index} variant="outline">
                    {specialty}
                  </Badge>
                )) || <Badge variant="outline">{member.specialty}</Badge>}
              </div>
            </div>

            <div>
              <h3 className="font-medium">Voice Configuration</h3>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="text-sm text-gray-500">Service:</p>
                  <p className="text-sm">{member.voiceService || "Default"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Voice ID:</p>
                  <p className="text-sm">{member.voiceId || "Default"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Model Configuration</h3>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="text-sm text-gray-500">Primary Model:</p>
                  <p className="text-sm">{member.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fallback Model:</p>
                  <p className="text-sm">{member.fallbackModel}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="capabilities" className="mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Capabilities</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {member.capabilities.map((capability, index) => (
                  <Badge key={index} variant="secondary">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium">Default Toolkit</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {member.default_toolkit?.map((tool, index) => (
                  <Badge key={index} variant="outline">
                    {tool}
                  </Badge>
                )) || <p className="text-sm text-gray-500">No default toolkit specified</p>}
              </div>
            </div>

            <div>
              <h3 className="font-medium">System Prompt</h3>
              <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                <pre className="whitespace-pre-wrap">{member.systemPrompt}</pre>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          {member.tasks && member.tasks.length > 0 ? (
            <div className="space-y-4">
              {member.tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    <CardDescription>Due: {new Date(task.dueDate).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          task.priority === "urgent"
                            ? "destructive"
                            : task.priority === "high"
                              ? "default"
                              : task.priority === "medium"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {task.priority}
                      </Badge>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "in-progress"
                              ? "secondary"
                              : task.status === "cancelled"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks assigned</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

