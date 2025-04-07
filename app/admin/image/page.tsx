"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ImageIcon,
  Settings,
  Users,
  Shield,
  Sliders,
  FileText,
  PlusCircle,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { useApiConnection } from "@/components/api-connection-manager"
import NextImage from "next/image"

export default function AdminImagePage() {
  const [activeTab, setActiveTab] = useState<"settings" | "templates" | "gallery" | "users">("settings")
  const [isEditing, setIsEditing] = useState(false)
  const { connectionStatus } = useApiConnection()

  // Mock image templates
  const imageTemplates = [
    {
      id: 1,
      name: "Portrait Photo",
      prompt:
        "Create a portrait of [subject] with [style] lighting, [background] background, showing [emotion/expression], [camera angle], [time of day].",
      isActive: true,
      thumbnail: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Product Showcase",
      prompt:
        "Generate a product image for [product] with [style] aesthetic, on a [background] background, highlighting [key features], with [lighting] lighting.",
      isActive: true,
      thumbnail: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Landscape Scene",
      prompt:
        "Create a [weather] landscape of [location] during [time of day], featuring [key elements], with [mood/atmosphere], in [artistic style].",
      isActive: false,
      thumbnail: "/placeholder.svg?height=200&width=200",
    },
  ]

  // Mock image users
  const imageUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", images: 24, lastActive: "2023-10-15", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", images: 12, lastActive: "2023-10-14", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", images: 8, lastActive: "2023-10-10", status: "inactive" },
  ]

  // Mock gallery images
  const galleryImages = [
    {
      id: 1,
      title: "Mountain Landscape",
      creator: "John Doe",
      created: "2023-10-15",
      url: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      title: "Portrait of Woman",
      creator: "Jane Smith",
      created: "2023-10-14",
      url: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      title: "Abstract Art",
      creator: "Bob Johnson",
      created: "2023-10-10",
      url: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      title: "Futuristic City",
      creator: "John Doe",
      created: "2023-10-08",
      url: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 5,
      title: "Nature Scene",
      creator: "Jane Smith",
      created: "2023-10-05",
      url: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 6,
      title: "Product Showcase",
      creator: "Bob Johnson",
      created: "2023-10-03",
      url: "/placeholder.svg?height=300&width=300",
    },
  ]

  // Mock analytics data
  const analyticsData = {
    totalImages: 845,
    activeUsers: 62,
    averageGenerationTime: "3.2s",
    topStyles: [
      { style: "Photorealistic", count: 245 },
      { style: "Digital Art", count: 187 },
      { style: "Anime", count: 124 },
    ],
    dailyUsage: [
      { date: "Mon", images: 85 },
      { date: "Tue", images: 102 },
      { date: "Wed", images: 93 },
      { date: "Thu", images: 120 },
      { date: "Fri", images: 98 },
      { date: "Sat", images: 65 },
      { date: "Sun", images: 52 },
    ],
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold flex items-center">
          <Shield className="mr-2 h-6 w-6" /> Image Administration
        </h1>
        <Badge
          variant={connectionStatus === "connected" ? "default" : "outline"}
          className={connectionStatus === "connected" ? "bg-green-500 ml-2" : "bg-red-100 text-red-800 ml-2"}
        >
          {connectionStatus === "connected" ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : (
            <AlertCircle className="h-3 w-3 mr-1" />
          )}
          {connectionStatus === "connected" ? "API Connected" : "API Disconnected"}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            <span>Gallery</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Sliders className="h-5 w-5 mr-2" />
                  Image Generation Configuration
                </span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setIsEditing(false)}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Configure global image generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Default Model</Label>
                  <Select disabled={!isEditing} defaultValue="dall-e-3">
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                      <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                      <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-size">Default Size</Label>
                  <Select disabled={!isEditing} defaultValue="1024x1024">
                    <SelectTrigger id="default-size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="256x256">Small (256x256)</SelectItem>
                      <SelectItem value="512x512">Medium (512x512)</SelectItem>
                      <SelectItem value="1024x1024">Large (1024x1024)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="default-style">Default Style</Label>
                <Select disabled={!isEditing} defaultValue="photorealistic">
                  <SelectTrigger id="default-style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photorealistic">Photorealistic</SelectItem>
                    <SelectItem value="digital-art">Digital Art</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="oil-painting">Oil Painting</SelectItem>
                    <SelectItem value="watercolor">Watercolor</SelectItem>
                    <SelectItem value="sketch">Sketch</SelectItem>
                    <SelectItem value="3d-render">3D Render</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Feature Controls</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-resolution">High Resolution</Label>
                      <p className="text-xs text-gray-500">Allow high resolution image generation</p>
                    </div>
                    <Switch id="high-resolution" defaultChecked disabled={!isEditing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="image-variations">Image Variations</Label>
                      <p className="text-xs text-gray-500">Allow generating variations of images</p>
                    </div>
                    <Switch id="image-variations" defaultChecked disabled={!isEditing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="image-editing">Image Editing</Label>
                      <p className="text-xs text-gray-500">Allow editing of generated images</p>
                    </div>
                    <Switch id="image-editing" defaultChecked disabled={!isEditing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="image-upload">Image Upload</Label>
                      <p className="text-xs text-gray-500">Allow users to upload reference images</p>
                    </div>
                    <Switch id="image-upload" defaultChecked disabled={!isEditing} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Content Moderation
              </CardTitle>
              <CardDescription>Configure content moderation settings for image generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="content-filtering">Content Filtering</Label>
                  <p className="text-xs text-gray-500">Filter inappropriate content</p>
                </div>
                <Switch id="content-filtering" defaultChecked disabled={!isEditing} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="nsfw-filter">NSFW Filter</Label>
                  <p className="text-xs text-gray-500">Filter NSFW content</p>
                </div>
                <Switch id="nsfw-filter" defaultChecked disabled={!isEditing} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moderation-level">Moderation Level</Label>
                <Select disabled={!isEditing} defaultValue="medium">
                  <SelectTrigger id="moderation-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blocked-terms">Blocked Terms</Label>
                <Textarea
                  id="blocked-terms"
                  placeholder="Enter terms to block, one per line"
                  className="min-h-[100px]"
                  disabled={!isEditing}
                  defaultValue="violence\nweapons\nillegal activities"
                />
                <p className="text-xs text-gray-500">These terms will be blocked from image generation prompts</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Image Templates</h2>
            <Button size="sm" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Add Template</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <NextImage
                    src={template.thumbnail || "/placeholder.svg"}
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={template.isActive ? "default" : "outline"}
                      className={template.isActive ? "bg-green-500" : "bg-gray-100 text-gray-800"}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{template.name}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{template.prompt}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button size="sm">{template.isActive ? "Deactivate" : "Activate"}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Image Gallery</h2>
            <div className="flex gap-2">
              <Input placeholder="Search images..." className="w-64" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="jane">Jane Smith</SelectItem>
                  <SelectItem value="bob">Bob Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <NextImage src={image.url || "/placeholder.svg"} alt={image.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <p className="text-white font-medium">{image.title}</p>
                      <p className="text-white/70 text-xs">By: {image.creator}</p>
                      <p className="text-white/70 text-xs">Created: {image.created}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Image Generation Users</h2>
            <div className="flex gap-2">
              <Input placeholder="Search users..." className="w-64" />
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="border-b">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium text-sm">
                  <div>User</div>
                  <div>Email</div>
                  <div>Images</div>
                  <div>Last Active</div>
                  <div>Status</div>
                </div>
              </div>
              {imageUsers.map((user) => (
                <div key={user.id} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                    <div>{user.images}</div>
                    <div className="text-gray-500">{user.lastActive}</div>
                    <div>
                      <Badge
                        variant={user.status === "active" ? "default" : "outline"}
                        className={user.status === "active" ? "bg-green-500" : "bg-gray-100 text-gray-800"}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

