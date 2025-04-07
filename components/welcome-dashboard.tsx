"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApiConnection } from "@/components/api-connection-manager"
import { BarChart, Users, MessageSquare, Image, Code, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export function WelcomeDashboard() {
  const { connectionStatus } = useApiConnection()
  const [userName, setUserName] = useState("Admin")
  const [lastLogin, setLastLogin] = useState("")

  useEffect(() => {
    // Simulate getting user data
    const storedName = localStorage.getItem("user_name") || "Admin"
    setUserName(storedName)

    // Set last login time
    const now = new Date()
    setLastLogin(now.toLocaleString())
    localStorage.setItem("last_login", now.toISOString())
  }, [])

  const features = [
    {
      title: "File Management",
      description: "Upload, organize, and share your files securely",
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      path: "/files",
    },
    {
      title: "AI Chat",
      description: "Interact with our AI family members for assistance",
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      path: "/chat",
    },
    {
      title: "Image Generation",
      description: "Create stunning images with AI assistance",
      icon: <Image className="h-8 w-8 text-purple-500" />,
      path: "/image",
    },
    {
      title: "Code Assistant",
      description: "Get help with coding and development tasks",
      icon: <Code className="h-8 w-8 text-amber-500" />,
      path: "/code",
    },
    {
      title: "User Management",
      description: "Manage users and their permissions",
      icon: <Users className="h-8 w-8 text-red-500" />,
      path: "/users",
    },
    {
      title: "Analytics",
      description: "View usage statistics and insights",
      icon: <BarChart className="h-8 w-8 text-indigo-500" />,
      path: "/analytics",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">
            {connectionStatus === "connected"
              ? `You're connected and ready to go. Last login: ${lastLogin}`
              : "Please connect your API key to access all features."}
          </p>
        </div>

        {connectionStatus !== "connected" && (
          <Button asChild>
            <Link href="/auth">Connect API Key</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                {feature.icon}
                <Button variant="ghost" size="icon" asChild>
                  <Link href={feature.path}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href={feature.path}>Open {feature.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent interactions with the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="rounded-full bg-primary/10 p-2">
                  {i === 0 ? (
                    <MessageSquare className="h-4 w-4 text-primary" />
                  ) : i === 1 ? (
                    <Image className="h-4 w-4 text-primary" />
                  ) : (
                    <Code className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {i === 0
                      ? "Chat session with Emma"
                      : i === 1
                        ? "Generated new image"
                        : "Code assistance for HTML snippet"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {i === 0 ? "15 minutes ago" : i === 1 ? "2 hours ago" : "Yesterday at 4:30 PM"}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

