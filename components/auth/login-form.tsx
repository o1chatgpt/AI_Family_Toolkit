"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "@/next-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Key, LogIn } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertCircle } from "@/components/ui/alert"
import { useApiConnection } from "@/components/api-connection-manager"

interface LoginFormProps {
  onClose: () => void
  onLogin: (userData: { name: string; email: string; role: string }) => void
  onSignup: () => void
}

export function LoginForm({ onClose, onLogin, onSignup }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [activeTab, setActiveTab] = useState<"credentials" | "api">("credentials")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setApiKey: setGlobalApiKey, validateApiKey } = useApiConnection()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate form
      if (activeTab === "credentials" && (!email || !password)) {
        setError("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      if (activeTab === "api" && !apiKey) {
        setError("Please provide an API key")
        setIsLoading(false)
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would validate credentials with a backend
      if (activeTab === "credentials" && email === "admin" && password === "password") {
        // Simulate successful login
        setGlobalApiKey(apiKey)
        localStorage.setItem("user_name", "Admin User")
        localStorage.setItem("user_email", email)
        localStorage.setItem("user_role", "admin")
        localStorage.setItem("is_logged_in", "true")
        localStorage.setItem("openai_api_key", apiKey)
        onLogin({
          name: "Admin User",
          email,
          role: "admin",
        })
      } else if (activeTab === "api" && apiKey.startsWith("sk-")) {
        // Simulate API key validation
        const isValidKey = await validateApiKey(apiKey)
        if (isValidKey) {
          setGlobalApiKey(apiKey)
          localStorage.setItem("user_name", "API User")
          localStorage.setItem("user_email", "api@example.com")
          localStorage.setItem("user_role", "user")
          localStorage.setItem("is_logged_in", "true")
          localStorage.setItem("openai_api_key", apiKey)
          onLogin({
            name: "API User",
            email: "api@example.com",
            role: "user",
          })
        } else {
          setError("Invalid API key format")
        }
      } else {
        setError("Invalid credentials")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <LogIn className="h-5 w-5" /> Log In
            </CardTitle>
            <CardDescription>Access your AI Family Toolkit account</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "credentials" | "api")}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="credentials">Email & Password</TabsTrigger>
              <TabsTrigger value="api">API Key</TabsTrigger>
            </TabsList>

            <TabsContent value="credentials">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Username</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin"
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
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="api">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="flex items-center gap-2">
                    <Key className="h-4 w-4" /> OpenAI API Key
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    required
                  />
                  <p className="text-xs text-gray-500">Your API key is stored locally and never sent to our servers</p>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Validating..." : "Connect with API Key"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-center w-full">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={onSignup}>
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

