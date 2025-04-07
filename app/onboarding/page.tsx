"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"
import { useForm } from "react-hook-form"

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [industry, setIndustry] = useState("")
  const [primaryUse, setPrimaryUse] = useState("")
  const [aiExperience, setAiExperience] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const industries = ["Technology", "Healthcare", "Finance", "Education", "Marketing", "Other"]

  const primaryUses = ["Content Creation", "Data Analysis", "Code Generation", "Project Management", "Other"]

  const aiExperienceLevels = ["Beginner", "Intermediate", "Advanced"]

  const { handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    if (!name.trim() || !industry || !primaryUse || !aiExperience) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Store onboarding data in localStorage
    localStorage.setItem("user_name", name.trim())
    localStorage.setItem("user_industry", industry)
    localStorage.setItem("user_primary_use", primaryUse)
    localStorage.setItem("user_ai_experience", aiExperience)

    toast({
      title: "Welcome!",
      description: "Thanks for providing your information. Let's get started!",
    })

    // Redirect to the dashboard
    router.push("/")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to AI Family Toolkit!</CardTitle>
            <CardDescription>Help us personalize your experience by answering a few questions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry} required>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-use">Primary Use Case</Label>
                <Select value={primaryUse} onValueChange={setPrimaryUse} required>
                  <SelectTrigger id="primary-use">
                    <SelectValue placeholder="Select your primary use case" />
                  </SelectTrigger>
                  <SelectContent>
                    {primaryUses.map((useCase) => (
                      <SelectItem key={useCase} value={useCase}>
                        {useCase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-experience">AI Experience</Label>
                <Select value={aiExperience} onValueChange={setAiExperience} required>
                  <SelectTrigger id="ai-experience">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiExperienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Get Started"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

