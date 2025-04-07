"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useApiConnection } from "@/components/api-connection-manager"
import { Lock, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const apiConnection = useApiConnection()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Check if username is "admin"
      if (email !== "admin") {
        setError("Invalid username. Use 'admin' for this demo.")
        setIsLoading(false)
        return
      }

      // Validate the API key using the function from context
      const isValidKey = await apiConnection.validateApiKey(apiKey)

      if (!isValidKey) {
        setError("Invalid API key format. It should start with 'sk-' and be at least 20 characters.")
        setIsLoading(false)
        return
      }

      // If validation passes, set the API key in the context
      apiConnection.setApiKey(apiKey)

      // Store user role in localStorage
      localStorage.setItem("user_role", "admin")
      localStorage.setItem("is_authenticated", "true")

      // Redirect to dashboard or home page
      router.push("/")
      router.refresh()
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input id="email" placeholder="admin" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">Your API key is stored locally and never sent to our servers.</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-center text-gray-500">
            For demo purposes, use &quot;admin&quot; as the username and any string starting with &quot;sk-&quot; as the
            API key.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

