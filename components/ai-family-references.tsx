"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Users, Brain, Sparkles, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface AIFamilyMember {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  specialties: string[]
  connectionString: string
}

interface AIFamilyReferencesProps {
  onClose: () => void
  aiFamily: AIFamilyMember[]
  onSelectMember: (memberId: string) => void
}

export function AIFamilyReferences({ onClose, aiFamily, onSelectMember }: AIFamilyReferencesProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "capabilities" | "connections">("overview")
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

  const handleSelectMember = (memberId: string) => {
    setSelectedMember(memberId)
    onSelectMember(memberId)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5" /> AI Family References
            </CardTitle>
            <CardDescription>Explore the capabilities of each AI Family member</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "overview" | "capabilities" | "connections")}
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiFamily.map((member) => (
                  <Card
                    key={member.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedMember === member.id ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => handleSelectMember(member.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {member.icon}
                        <span>{member.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{member.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {member.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="capabilities">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        <span>Knowledge Domains</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          <span>Creative Writing & Content Generation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          <span>Code & Technical Documentation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          <span>Visual Design & Image Generation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          <span>Data Analysis & Visualization</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          <span>Research & Knowledge Synthesis</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <span>Special Abilities</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                          <span>Multi-modal Understanding (Text, Images, Code)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                          <span>Context-aware Responses</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                          <span>Task Coordination & Delegation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                          <span>Personalized Learning & Adaptation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                          <span>Cross-domain Knowledge Integration</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Capability Matrix</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              AI Member
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Text
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Image
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Code
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Data
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Planning
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {aiFamily.map((member) => (
                            <tr key={member.id}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{member.name}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {member.id === "kara" ||
                                member.id === "sophia" ||
                                member.id === "cecilia" ||
                                member.id === "mistress"
                                  ? "★★★"
                                  : "★★☆"}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {member.id === "kara" || member.id === "lyra"
                                  ? "★★★"
                                  : member.id === "dude"
                                    ? "★★☆"
                                    : "★☆☆"}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {member.id === "stan" ? "★★★" : member.id === "karl" ? "★★☆" : "★☆☆"}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {member.id === "karl" || member.id === "cecilia"
                                  ? "★★★"
                                  : member.id === "stan"
                                    ? "★★☆"
                                    : "★☆☆"}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {member.id === "mistress" || member.id === "sophia"
                                  ? "★★★"
                                  : member.id === "karl"
                                    ? "★★☆"
                                    : "★☆☆"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="connections">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Connection Strings</CardTitle>
                    <CardDescription>API connection details for each AI Family member</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              AI Member
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Base Model
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Connection String
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {aiFamily.map((member) => (
                            <tr key={member.id}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{member.name}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">GPT-4o</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-mono text-xs">
                                {member.connectionString}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Active
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Integration Options</CardTitle>
                    <CardDescription>Ways to connect and integrate with AI Family members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-2">API Integration</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Connect directly via REST API endpoints
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          View API Docs
                        </Button>
                      </div>

                      <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-2">SDK Integration</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Use our client libraries for seamless integration
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          View SDK Docs
                        </Button>
                      </div>

                      <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-2">Webhook Integration</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Receive real-time updates via webhooks
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Configure Webhooks
                        </Button>
                      </div>

                      <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-2">Custom Integration</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Build custom integrations for specific needs
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {selectedMember && <Button onClick={() => onSelectMember(selectedMember)}>Use Selected AI</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}

