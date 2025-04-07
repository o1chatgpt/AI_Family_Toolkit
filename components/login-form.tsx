"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { useApiConnection } from "@/components/api-connection-manager"
import { AlertCircle, LogIn, Key, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-provider" // Import the useAuth hook
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoginFormProps {
  onClose: () => void
  onSignup: () => void
}

export function LoginForm({ onClose, onSignup }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [activeTab, setActiveTab] = useState<"credentials" | "api">("credentials")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setApiKey: setGlobalApiKey, validateApiKey } = useApiConnection()
  const { signIn } = useAuth() // Use the signIn function from the AuthProvider

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
      const isValidKey = await validateApiKey(apiKey)

      if (!isValidKey) {
        setError("Invalid API key format. It should start with 'sk-' and be at least 20 characters.")
        setIsLoading(false)
        return
      }

      // If validation passes, set the API key in the context
      setGlobalApiKey(apiKey)

      // Sign in the user using the useAuth hook
      await signIn(email, password)

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
                    {error}
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

