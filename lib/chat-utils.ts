import { supabase } from "./supabase-client"
import { getUserId } from "./user-utils"

export interface ChatSession {
  id: string
  title: string
  user_id: string
  ai_family_id: string
  is_bookmarked: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  content: string
  is_user: boolean
  created_at: string
}

/**
 * Create a new chat session
 */
export async function createChatSession(title: string, aiFamilyId: string): Promise<ChatSession> {
  try {
    const userId = await getUserId()

    if (!userId) throw new Error("User not authenticated")

    const newSession = {
      title,
      user_id: userId,
      ai_family_id: aiFamilyId,
      is_bookmarked: false,
    }

    const { data, error } = await supabase.from("chat_sessions").insert(newSession).select().single()

    if (error) throw error

    return data as ChatSession
  } catch (error) {
    console.error("Error creating chat session:", error)
    throw error
  }
}

/**
 * Get all chat sessions for the current user
 */
export async function getChatSessions(
  options: {
    aiFamilyId?: string
    isBookmarked?: boolean
    limit?: number
    page?: number
  } = {},
): Promise<ChatSession[]> {
  try {
    const userId = await getUserId()

    if (!userId) throw new Error("User not authenticated")

    let query = supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (options.aiFamilyId) {
      query = query.eq("ai_family_id", options.aiFamilyId)
    }

    if (options.isBookmarked !== undefined) {
      query = query.eq("is_bookmarked", options.isBookmarked)
    }

    if (options.limit) {
      query = query.limit(options.limit)

      if (options.page && options.page > 1) {
        query = query.range((options.page - 1) * options.limit, options.page * options.limit - 1)
      }
    }

    const { data, error } = await query

    if (error) throw error

    return data as ChatSession[]
  } catch (error) {
    console.error("Error getting chat sessions:", error)
    throw error
  }
}

/**
 * Get a specific chat session by ID
 */
export async function getChatSession(id: string): Promise<ChatSession> {
  try {
    const { data, error } = await supabase.from("chat_sessions").select("*").eq("id", id).single()

    if (error) throw error

    return data as ChatSession
  } catch (error) {
    console.error(`Error getting chat session ${id}:`, error)
    throw error
  }
}

/**
 * Update a chat session
 */
export async function updateChatSession(
  id: string,
  updates: Partial<Omit<ChatSession, "id" | "created_at" | "user_id">>,
): Promise<ChatSession> {
  try {
    // Add updated_at timestamp
    const updatedSession = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("chat_sessions").update(updatedSession).eq("id", id).select().single()

    if (error) throw error

    return data as ChatSession
  } catch (error) {
    console.error(`Error updating chat session ${id}:`, error)
    throw error
  }
}

/**
 * Delete a chat session
 */
export async function deleteChatSession(id: string): Promise<void> {
  try {
    // Delete all messages in the session first
    const { error: messagesError } = await supabase.from("chat_messages").delete().eq("session_id", id)

    if (messagesError) throw messagesError

    // Then delete the session
    const { error } = await supabase.from("chat_sessions").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error(`Error deleting chat session ${id}:`, error)
    throw error
  }
}

/**
 * Toggle bookmark status for a chat session
 */
export async function toggleChatSessionBookmark(id: string): Promise<boolean> {
  try {
    // Get current bookmark status
    const { data: sessionData, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("is_bookmarked")
      .eq("id", id)
      .single()

    if (sessionError) throw sessionError

    const newBookmarkStatus = !sessionData.is_bookmarked

    // Update bookmark status
    const { error } = await supabase
      .from("chat_sessions")
      .update({
        is_bookmarked: newBookmarkStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) throw error

    return newBookmarkStatus
  } catch (error) {
    console.error(`Error toggling bookmark for chat session ${id}:`, error)
    throw error
  }
}

/**
 * Add a message to a chat session
 */
export async function addChatMessage(sessionId: string, content: string, isUser: boolean): Promise<ChatMessage> {
  try {
    const newMessage = {
      session_id: sessionId,
      content,
      is_user: isUser,
    }

    const { data, error } = await supabase.from("chat_messages").insert(newMessage).select().single()

    if (error) throw error

    // Update the session's updated_at timestamp
    await updateChatSession(sessionId, {})

    return data as ChatMessage
  } catch (error) {
    console.error(`Error adding message to chat session ${sessionId}:`, error)
    throw error
  }
}

/**
 * Get all messages for a chat session
 */
export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (error) throw error

    return data as ChatMessage[]
  } catch (error) {
    console.error(`Error getting messages for chat session ${sessionId}:`, error)
    throw error
  }
}

/**
 * Delete a chat message
 */
export async function deleteChatMessage(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error(`Error deleting chat message ${id}:`, error)
    throw error
  }
}

/**
 * Get chat statistics
 */
export async function getChatStatistics(): Promise<{
  totalSessions: number
  totalMessages: number
  averageMessagesPerSession: number
  bookmarkedSessions: number
  sessionsByAIFamily: Record<string, number>
}> {
  try {
    const userId = await getUserId()

    if (!userId) throw new Error("User not authenticated")

    // Get sessions data
    const { data: sessions, error: sessionsError } = await supabase
      .from("chat_sessions")
      .select("id, ai_family_id, is_bookmarked")
      .eq("user_id", userId)

    if (sessionsError) throw sessionsError

    const totalSessions = sessions.length
    const bookmarkedSessions = sessions.filter((s) => s.is_bookmarked).length

    const sessionsByAIFamily: Record<string, number> = {}
    sessions.forEach((session) => {
      sessionsByAIFamily[session.ai_family_id] = (sessionsByAIFamily[session.ai_family_id] || 0) + 1
    })

    // Get total messages count
    const { count: totalMessages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .in(
        "session_id",
        sessions.map((s) => s.id),
      )

    if (messagesError) throw messagesError

    const averageMessagesPerSession = totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0

    return {
      totalSessions,
      totalMessages: totalMessages || 0,
      averageMessagesPerSession,
      bookmarkedSessions,
      sessionsByAIFamily,
    }
  } catch (error) {
    console.error("Error getting chat statistics:", error)
    throw error
  }
}

