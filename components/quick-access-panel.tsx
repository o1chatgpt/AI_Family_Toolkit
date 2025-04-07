"use client"

import { useState } from "react"
import { DraggablePanel } from "@/components/draggable-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  BookmarkPlus,
  Clock,
  Star,
  FileText,
  Image,
  MessageSquare,
  Presentation,
  BarChart,
  Plus,
  X,
} from "lucide-react"

interface QuickAccessPanelProps {
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export function QuickAccessPanel({ isOpen = true, onOpenChange }: QuickAccessPanelProps) {
  const [activeTab, setActiveTab] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for recent items
  const recentItems = [
    {
      id: "1",
      title: "Project Proposal",
      type: "document",
      icon: <FileText className="h-4 w-4" />,
      date: "2 hours ago",
      path: "/documents/project-proposal",
    },
    {
      id: "2",
      title: "Marketing Campaign",
      type: "presentation",
      icon: <Presentation className="h-4 w-4" />,
      date: "Yesterday",
      path: "/presentations/marketing-campaign",
    },
    {
      id: "3",
      title: "Q2 Analytics",
      type: "analytics",
      icon: <BarChart className="h-4 w-4" />,
      date: "3 days ago",
      path: "/analytics/q2-analytics",
    },
    {
      id: "4",
      title: "Product Mockup",
      type: "image",
      icon: <Image className="h-4 w-4" />,
      date: "Last week",
      path: "/images/product-mockup",
    },
    {
      id: "5",
      title: "Chat with Max",
      type: "chat",
      icon: <MessageSquare className="h-4 w-4" />,
      date: "Last week",
      path: "/chat?ai=max",
    },
  ]

  // Mock data for bookmarks
  const bookmarks = [
    {
      id: "1",
      title: "Project Timeline",
      type: "document",
      icon: <FileText className="h-4 w-4" />,
      date: "Bookmarked 3 days ago",
      path: "/documents/project-timeline",
    },
    {
      id: "2",
      title: "Team Meeting Notes",
      type: "document",
      icon: <FileText className="h-4 w-4" />,
      date: "Bookmarked 1 week ago",
      path: "/documents/team-meeting-notes",
    },
    {
      id: "3",
      title: "Brand Guidelines",
      type: "presentation",
      icon: <Presentation className="h-4 w-4" />,
      date: "Bookmarked 2 weeks ago",
      path: "/presentations/brand-guidelines",
    },
  ]

  // Mock data for AI Family
  const aiFamily = [
    {
      id: "stan",
      name: "Stan",
      specialty: "Strategic Thinking",
      avatarUrl: "/ai-family/stan.png",
      color: "blue",
      lastChat: "2 hours ago",
    },
    {
      id: "max",
      name: "Max",
      specialty: "Code & Development",
      avatarUrl: "/ai-family/max.png",
      color: "green",
      lastChat: "Yesterday",
    },
    {
      id: "luna",
      name: "Luna",
      specialty: "Creative Content",
      avatarUrl: "/ai-family/luna.png",
      color: "purple",
      lastChat: "3 days ago",
    },
    {
      id: "data",
      name: "Data",
      specialty: "Analytics & Research",
      avatarUrl: "/ai-family/data.png",
      color: "cyan",
      lastChat: "Last week",
    },
    {
      id: "nova",
      name: "Nova",
      specialty: "Business & Marketing",
      avatarUrl: "/ai-family/nova.png",
      color: "amber",
      lastChat: "2 weeks ago",
    },
  ]

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DraggablePanel isOpen={isOpen} onOpenChange={onOpenChange} className="border-l">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-2">Quick Access</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files, chats, and more..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b px-4">
            <TabsList className="h-12">
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Recent</span>
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Bookmarks</span>
              </TabsTrigger>
              <TabsTrigger value="ai-family" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>AI Family</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <TabsContent value="recent" className="p-0 m-0 h-full">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Recent Items</h3>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    View All
                  </Button>
                </div>
                <div className="space-y-2">
                  {recentItems.map((item) => (
                    <a key={item.id} href={item.path} className="block">
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                              {item.icon}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{item.title}</h4>
                              <p className="text-xs text-muted-foreground">{item.type}</p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">{item.date}</div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start h-auto py-3">
                    <Plus className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="text-sm font-medium">New Document</div>
                      <div className="text-xs text-muted-foreground">Create a blank document</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3">
                    <Plus className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="text-sm font-medium">New Chat</div>
                      <div className="text-xs text-muted-foreground">Start a conversation</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3">
                    <Plus className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Generate Image</div>
                      <div className="text-xs text-muted-foreground">Create AI imagery</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3">
                    <Plus className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="text-sm font-medium">New Task</div>
                      <div className="text-xs text-muted-foreground">Assign work to AI</div>
                    </div>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookmarks" className="p-0 m-0 h-full">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Bookmarked Items</h3>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Manage Bookmarks
                  </Button>
                </div>
                {bookmarks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <BookmarkPlus className="h-8 w-8 text-muted-foreground mb-2" />
                    <h4 className="text-sm font-medium">No bookmarks yet</h4>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">Bookmark important items for quick access</p>
                    <Button variant="outline" size="sm">
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Add Bookmark
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookmarks.map((item) => (
                      <a key={item.id} href={item.path} className="block">
                        <Card className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                {item.icon}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">{item.title}</h4>
                                <p className="text-xs text-muted-foreground">{item.type}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <X className="h-3 w-3" />
                            </Button>
                          </CardContent>
                        </Card>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai-family" className="p-0 m-0 h-full">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">AI Family Members</h3>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    View All
                  </Button>
                </div>
                <div className="space-y-2">
                  {aiFamily.map((member) => (
                    <a key={member.id} href={`/chat?ai=${member.id}`} className="block">
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage src={member.avatarUrl} alt={member.name} />
                              <AvatarFallback className={`bg-${member.color}-100 text-${member.color}-700 text-xs`}>
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="text-sm font-medium">{member.name}</h4>
                              <p className="text-xs text-muted-foreground">{member.specialty}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {member.lastChat}
                          </Badge>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Active Tasks</h3>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    View All
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Research Competitors</h4>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        In Progress
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Analyze top 5 competitors in the market and prepare a summary report.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/ai-family/data.png" alt="Data" />
                          <AvatarFallback className="bg-cyan-100 text-cyan-700 text-xs">D</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">Data</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Due tomorrow</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Draft Email Campaign</h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        In Progress
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Create email templates for the upcoming product launch.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/ai-family/luna.png" alt="Luna" />
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">L</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">Luna</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Due in 3 days</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </DraggablePanel>
  )
}

