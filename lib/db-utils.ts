import { supabase } from "./supabase/client"

// Function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", tableName)
      .eq("table_schema", "public")

    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error)
      return false
    }

    return data && data.length > 0
  } catch (error) {
    console.error(`Error in tableExists for ${tableName}:`, error)
    return false
  }
}

// Function to create the AI Family members table
export async function createAIFamilyMembersTable(): Promise<boolean> {
  try {
    const { error } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS ai_family_members (
        id SERIAL PRIMARY KEY,
        member_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        specialty TEXT,
        description TEXT,
        avatar_url TEXT,
        color TEXT,
        model TEXT,
        fallback_model TEXT,
        capabilities JSONB,
        system_prompt TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    if (error) {
      console.error("Error creating AI Family members table:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in createAIFamilyMembersTable:", error)
    return false
  }
}

// Function to create the tasks table
export async function createTasksTable(): Promise<boolean> {
  try {
    const { error } = await supabase.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS ai_family_tasks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        description TEXT,
        assigned_to TEXT NOT NULL,
        priority TEXT DEFAULT 'medium',
        due_date TIMESTAMP WITH TIME ZONE,
        requires_approval BOOLEAN DEFAULT TRUE,
        created_by TEXT,
        status TEXT DEFAULT 'pending',
        tags JSONB,
        approved_by TEXT,
        approved_at TIMESTAMP WITH TIME ZONE,
        rejected_by TEXT,
        rejected_at TIMESTAMP WITH TIME ZONE,
        rejection_reason TEXT,
        reassigned_by TEXT,
        reassigned_at TIMESTAMP WITH TIME ZONE,
        is_sample BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    if (error) {
      console.error("Error creating tasks table:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in createTasksTable:", error)
    return false
  }
}

// Function to create the files table
export async function createFilesTable(): Promise<boolean> {
  try {
    const { error } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS files (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        type TEXT NOT NULL,
        size BIGINT,
        storage_path TEXT NOT NULL,
        url TEXT,
        user_id TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(path, name, user_id)
      )
    `)

    if (error) {
      console.error("Error creating files table:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in createFilesTable:", error)
    return false
  }
}

// Function to create the folders table
export async function createFoldersTable(): Promise<boolean> {
  try {
    const { error } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS folders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        user_id TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(path, name, user_id)
      )
    `)

    if (error) {
      console.error("Error creating folders table:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in createFoldersTable:", error)
    return false
  }
}

// Function to create all required tables
export async function createAllTables(): Promise<boolean> {
  try {
    const aiFamily = await createAIFamilyMembersTable()
    const tasks = await createTasksTable()
    const files = await createFilesTable()
    const folders = await createFoldersTable()

    return aiFamily && tasks && files && folders
  } catch (error) {
    console.error("Error in createAllTables:", error)
    return false
  }
}

