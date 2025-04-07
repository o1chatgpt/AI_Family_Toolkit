"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function OnboardingSummaryPage() {
  const router = useRouter()
  // Initialize with default values for server-side rendering
  const [userData, setUserData] = useState({
    name: "User",
    industry: "Unknown",
    primaryUse: "Unknown",
    aiExperience: "Unknown",
  })

  // Only access localStorage on the client side
  useEffect(() => {
    // This code only runs in the browser after component mount
    setUserData({
      name: localStorage.getItem("user_name") || "User",
      industry: localStorage.getItem("user_industry") || "Unknown",
      primaryUse: localStorage.getItem("user_primary_use") || "Unknown",
      aiExperience: localStorage.getItem("user_ai_experience") || "Unknown",
    })
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Summary</CardTitle>
            <CardDescription>Review your information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Thank you, {userData.name}! Here's a summary of your information:</p>
            <p>Industry: {userData.industry}</p>
            <p>Primary Use Case: {userData.primaryUse}</p>
            <p>AI Experience: {userData.aiExperience}</p>
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

