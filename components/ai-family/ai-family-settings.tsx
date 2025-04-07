"use client"

import { useState } from "react"
import { AI_FAMILY_MEMBERS } from "@/constants/ai-family"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AIFamilyTaskManager } from "./ai-family-task-manager"
import { AIFamilyWorkflowSettings } from "./ai-family-workflow-settings"
import { AIFamilyVoiceSettings } from "./ai-family-voice-settings"

export function AIFamilySettings() {
  const [selectedMemberId, setSelectedMemberId] = useState(AI_FAMILY_MEMBERS[0]?.id || "")
  const [activeMembers, setActiveMembers] = useState<string[]>(
    AI_FAMILY_MEMBERS.filter((m) => m.isActive).map((m) => m.id),
  )

  const selectedMember = AI_FAMILY_MEMBERS.find((m) => m.id === selectedMemberId)

  const toggleMemberActive = (memberId: string) => {
    setActiveMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>AI Family Members</CardTitle>
          <CardDescription>Select a member to configure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {AI_FAMILY_MEMBERS.map((member) => {
              const isActive = activeMembers.includes(member.id)

              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                    selectedMemberId === member.id ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedMemberId(member.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => toggleMemberActive(member.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        {selectedMember ? (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedMember.avatarUrl} alt={selectedMember.name} />
                    <AvatarFallback>{selectedMember.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedMember.name}</CardTitle>
                    <CardDescription>{selectedMember.role}</CardDescription>
                  </div>
                </div>
                <Badge variant={activeMembers.includes(selectedMember.id) ? "default" : "outline"}>
                  {activeMembers.includes(selectedMember.id) ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tasks">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="workflows">Workflows</TabsTrigger>
                  <TabsTrigger value="voice">Voice</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks">
                  <AIFamilyTaskManager memberId={selectedMember.id} />
                </TabsContent>

                <TabsContent value="workflows">
                  <AIFamilyWorkflowSettings memberId={selectedMember.id} />
                </TabsContent>

                <TabsContent value="voice">
                  <AIFamilyVoiceSettings
                    memberId={selectedMember.id}
                    voiceId={selectedMember.voiceId || ""}
                    voiceService={selectedMember.voiceService || ""}
                  />
                </TabsContent>

                <TabsContent value="advanced">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Model Configuration</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primary-model">Primary Model</Label>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{selectedMember.model}</Badge>
                            <Button variant="outline" size="sm">
                              Change
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fallback-model">Fallback Model</Label>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{selectedMember.fallbackModel}</Badge>
                            <Button variant="outline" size="sm">
                              Change
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">System Prompt</h3>
                      <div className="p-3 bg-muted rounded-md">
                        <pre className="text-sm whitespace-pre-wrap">{selectedMember.systemPrompt}</pre>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        Edit System Prompt
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
                      <div className="p-4 border border-destructive/20 rounded-md bg-destructive/5">
                        <h4 className="font-medium text-destructive">Reset AI Family Member</h4>
                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                          This will reset all settings, tasks, and workflows for this AI family member to their default
                          values.
                        </p>
                        <Button variant="destructive" size="sm">
                          Reset {selectedMember.name}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Select an AI family member to configure</p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

