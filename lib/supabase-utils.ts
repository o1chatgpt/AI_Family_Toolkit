"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a Supabase client with the service role key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to get the current user ID
export async function getUserId(): Promise<string> {
  try {
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

