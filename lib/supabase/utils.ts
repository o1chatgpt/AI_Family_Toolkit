import { supabase, supabaseClient } from "./client"

// Function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
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
}

// Function to execute raw SQL
export async function executeSQL(sql: string): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.rpc("execute_sql", { sql_query: sql })

    if (error) {
      console.error("Error executing SQL:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Error executing SQL:", error)
    return { success: false, error }
  }
}

// Function to create a stored procedure for executing SQL
export async function createExecuteSQLFunction(): Promise<{ success: boolean; error?: any }> {
  try {
    const sql = `
      CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
      RETURNS void AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `

    const { error } = await supabase.rpc("execute_sql", { sql_query: sql })

    if (error) {
      // If the function doesn't exist yet, try creating it directly
      const { error: directError } = await supabase.query(sql)

      if (directError) {
        console.error("Error creating execute_sql function:", directError)
        return { success: false, error: directError }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error creating execute_sql function:", error)
    return { success: false, error }
  }
}

// Function to get storage URL for a file
export function getStorageUrl(bucket: string, path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

// Function to upload a file to storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
): Promise<{
  success: boolean
  url?: string
  error?: any
}> {
  try {
    const { error } = await supabaseClient.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return { success: false, error }
    }

    const url = getStorageUrl(bucket, path)
    return { success: true, url }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { success: false, error }
  }
}

// Function to delete a file from storage
export async function deleteFile(
  bucket: string,
  path: string,
): Promise<{
  success: boolean
  error?: any
}> {
  try {
    const { error } = await supabaseClient.storage.from(bucket).remove([path])

    if (error) {
      console.error("Error deleting file:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { success: false, error }
  }
}

// Function to list files in a bucket
export async function listFiles(
  bucket: string,
  path = "",
): Promise<{
  success: boolean
  files?: any[]
  error?: any
}> {
  try {
    const { data, error } = await supabaseClient.storage.from(bucket).list(path)

    if (error) {
      console.error("Error listing files:", error)
      return { success: false, error }
    }

    return { success: true, files: data }
  } catch (error) {
    console.error("Error listing files:", error)
    return { success: false, error }
  }
}

// Function to get user ID
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

