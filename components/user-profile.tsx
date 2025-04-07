"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { User, Shield, LogOut, X } from "lucide-react"

interface UserProfileProps {
  onLogout: () => void
  onClose: () => void
}

export function UserProfile({ onLogout, onClose }: UserProfileProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"user" | "admin">("user")

  useEffect(() => {
    // Load user data from localStorage
    const userName = localStorage.getItem("user_name") || ""
    const userEmail = localStorage.getItem("user_email") || ""
    const userRole = (localStorage.getItem("user_role") as "user" | "admin") || "user"

    setName(userName)
    setEmail(userEmail)
    setRole(userRole)
  }, [])

  const saveProfile = () => {
    // Save updated profile to localStorage
    localStorage.setItem("user_name", name)
    localStorage.setItem("user_email", email)

    alert("Profile updated successfully")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Profile</CardTitle>
        <Button variant="outline" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{email}</p>
            <div className="flex items-center justify-center mt-1">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  role === "admin"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center gap-1"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                {role === "admin" && <Shield className="h-3 w-3" />}
                {role === "admin" ? "Administrator" : "User"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <Button onClick={saveProfile} className="w-full">
            Save Profile
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </CardFooter>
    </Card>
  )
}

