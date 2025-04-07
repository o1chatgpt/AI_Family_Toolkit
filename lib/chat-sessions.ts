import { supabase } from "./supabase"
import { getUserId } from "./user"

export async function createChatSession(title: string) {
  const userId = await getUserId()
  if (!userId) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert([
      {
        title: title,
        user_id: userId,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating chat session:", error)
    throw new Error("Failed to create chat session")
  }

  return data
}

