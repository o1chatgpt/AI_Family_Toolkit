"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, UserPlus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useApiConnection } from "@/components/api-connection-manager"

interface SignupFormProps {
  onClose: () => void
  onSignup: (userData: { name: string; email: string; role: string }) => void
  onLogin: () => void
}

export function SignupForm({ onClose, onSignup, onLogin }: SignupFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { validateApiKey, setApiKey: setGlobalApiKey } = useApiConnection()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate form
      if (!name || !email || !password || !confirmPassword) {
        setError("Please fill in all required fields")
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (!acceptTerms) {
        setError("You must accept the terms and conditions")
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would create a user in the database
      // For now, we'll just store in localStorage
      if (!email.includes("@")) {
        setError("Please enter a valid email address.")
        setIsLoading(false)
        return
      }

      if (name.length < 2) {
        setError("Please enter a valid name.")
        setIsLoading(false)
        return
      }

      // Set the API key globally
      setGlobalApiKey(apiKey)

      // Store user info in localStorage
      localStorage.setItem("user_name", name)
      localStorage.setItem("user_email", email)
      localStorage.setItem("user_role", "user") // Default role for new users
      localStorage.setItem("is_logged_in", "true")
      localStorage.setItem("openai_api_key", apiKey)

      // Call the success callback if provided
      if (onSignup) {
        onSignup({
          name,
          email,
          role: "user",
        })
      } else {
        // Navigate to dashboard
        // router.push("/dashboard")
      }
    } catch (err) {
      console.error("Signup error:", err)
      setError("An error occurred during sign up. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Sign Up
            </CardTitle>
            <CardDescription>Create your AI Family Toolkit account</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key (Optional)</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <p className="text-xs text-gray-500">
                Your API key is used for authentication and to access OpenAI services
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm">
                I accept the terms and conditions
              </Label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-center w-full">
            Already have an account?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={onLogin}>
              Log in
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

