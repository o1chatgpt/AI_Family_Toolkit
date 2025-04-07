import { createClient } from "@supabase/supabase-js"

// Create a singleton Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// This client should only be used in server components or server actions
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
})

// Types for our database entities
export type ChatSession = {
  id: string
  user_id: string
  title: string
  ai_model: string
  created_at?: string
  updated_at?: string
}

export type ChatMessage = {
  id?: string
  session_id: string
  role: "user" | "assistant" | "system"
  content: string
  files?: any[]
  model?: string
  timestamp: string
  created_at?: string
}

export type ImageGeneration = {
  id?: string
  user_id: string
  prompt: string
  negative_prompt?: string
  model: string
  width: number
  height: number
  steps?: number
  image_path?: string
  status: "pending" | "processing" | "completed" | "failed"
  created_at?: string
}

export type CodeSnippet = {
  id?: string
  user_id: string
  title: string
  description?: string
  html_code?: string
  css_code?: string
  js_code?: string
  tags?: string[]
  ai_family?: string
  created_at?: string
  updated_at?: string
}

export type FileDocument = {
  id?: string
  user_id: string
  name: string
  type: string
  size: number
  path: string
  created_at?: string
}

// CRUD operations for chat sessions
export const chatSessionsService = {
  async create(session: Omit<ChatSession, "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("chat_sessions").insert([session]).select()

    if (error) throw error
    return data[0]
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("chat_sessions").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<ChatSession>) {
    const { data, error } = await supabase
      .from("chat_sessions")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()

    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase.from("chat_sessions").delete().eq("id", id)

    if (error) throw error
    return true
  },
}

// CRUD operations for chat messages
export const chatMessagesService = {
  async create(message: Omit<ChatMessage, "id" | "created_at">) {
    const { data, error } = await supabase.from("chat_messages").insert([message]).select()

    if (error) throw error
    return data[0]
  },

  async getBySessionId(sessionId: string) {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("timestamp", { ascending: true })

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id)

    if (error) throw error
    return true
  },

  async deleteBySessionId(sessionId: string) {
    const { error } = await supabase.from("chat_messages").delete().eq("session_id", sessionId)

    if (error) throw error
    return true
  },
}

// CRUD operations for image generations
export const imageGenerationsService = {
  async create(imageGen: Omit<ImageGeneration, "id" | "created_at">) {
    const { data, error } = await supabase.from("image_generations").insert([imageGen]).select()

    if (error) throw error
    return data[0]
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("image_generations").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("image_generations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<ImageGeneration>) {
    const { data, error } = await supabase.from("image_generations").update(updates).eq("id", id).select()

    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase.from("image_generations").delete().eq("id", id)

    if (error) throw error
    return true
  },
}

// CRUD operations for code snippets
export const codeSnippetsService = {
  async create(snippet: Omit<CodeSnippet, "id" | "created_at" | "updated_at">) {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("code_snippets")
      .insert([{ ...snippet, created_at: now, updated_at: now }])
      .select()

    if (error) throw error
    return data[0]
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("code_snippets").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("code_snippets")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<CodeSnippet>) {
    const { data, error } = await supabase
      .from("code_snippets")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()

    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase.from("code_snippets").delete().eq("id", id)

    if (error) throw error
    return true
  },
}

// CRUD operations for file documents
export const fileDocumentsService = {
  async create(document: Omit<FileDocument, "id" | "created_at">) {
    const { data, error } = await supabase.from("file_documents").insert([document]).select()

    if (error) throw error
    return data[0]
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("file_documents").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("file_documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("file_documents").delete().eq("id", id)

    if (error) throw error
    return true
  },
}

