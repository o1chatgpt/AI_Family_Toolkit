import { getSupabaseClient } from "./supabase/client"

// Mock user data for development
const mockUsers = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export type User = {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  avatar: string
}

// Function to get the current user
export async function getCurrentUser(): Promise<User | null> {
  // For development, return a mock user
  // In production, this would fetch from Supabase
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      console.warn("Supabase client not available, using mock data")
      return mockUsers[0]
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.warn("No authenticated user, using mock data")
      return mockUsers[0]
    }

    // Get user profile from database
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (!profile) {
      console.warn("No user profile found, using mock data")
      return mockUsers[0]
    }

    return {
      id: user.id,
      name: profile.full_name || user.email?.split("@")[0] || "User",
      email: user.email || "",
      role: profile.role || "user",
      avatar: profile.avatar_url || "/placeholder.svg?height=40&width=40",
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    // Fallback to mock user for development
    return mockUsers[0]
  }
}

// Function to check if the current user is an admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "admin"
}

// Function to get user ID
export async function getUserId(): Promise<string> {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return "demo-user-123" // Fallback ID for development
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return "demo-user-123" // Fallback ID for development
    }

    return user.id
  } catch (error) {
    console.error("Error getting user ID:", error)
    return "demo-user-123" // Fallback ID for development
  }
}

