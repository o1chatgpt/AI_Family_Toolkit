import { supabase } from "./supabase"

export async function createChatMessage(sessionId: string, sender: string, text: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert([
      {
        session_id: sessionId,
        sender: sender,
        text: text,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating chat message:", error)
    throw new Error("Failed to create chat message")
  }

  return data
}

