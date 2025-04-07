import { supabase } from "./supabase/client"
import { v4 as uuidv4 } from "uuid"
import { getUserId } from "./user-utils"

export interface Folder {
  id: string
  name: string
  path: string
  user_id: string
  created_at: string
  updated_at: string
  is_favorite: boolean
  is_public: boolean
}

// Create a new folder
export async function createFolder(name: string, path = "/", isPublic = false): Promise<Folder | null> {
  try {
    const userId = await getUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Normalize path to ensure it ends with a slash
    const normalizedPath = path.endsWith("/") ? path : `${path}/`

    // Check if folder already exists
    const { data: existingFolder, error: checkError } = await supabase
      .from("folders")
      .select("*")
      .eq("name", name)
      .eq("path", normalizedPath)
      .eq("user_id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      console.error("Error checking if folder exists:", checkError)
      throw checkError
    }

    if (existingFolder) {
      return existingFolder as Folder
    }

    // Create folder in database
    const { data, error } = await supabase
      .from("folders")
      .insert({
        id: uuidv4(),
        name,
        path: normalizedPath,
        user_id: userId,
        is_public: isPublic,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating folder:", error)
      throw error
    }

    return data as Folder
  } catch (error) {
    console.error("Error in createFolder:", error)
    return null
  }
}

// Get folder by ID
export async function getFolderById(folderId: string): Promise<Folder | null> {
  try {
    const { data, error } = await supabase.from("folders").select("*").eq("id", folderId).single()

    if (error) {
      console.error("Error getting folder by ID:", error)
      return null
    }

    return data as Folder
  } catch (error) {
    console.error("Error in getFolderById:", error)
    return null
  }
}

// List folders in a path
export async function listFolders(
  path = "/",
  options: { sortBy?: string; sortOrder?: "asc" | "desc" } = {},
): Promise<Folder[]> {
  try {
    const userId = await getUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Normalize path to ensure it ends with a slash
    const normalizedPath = path.endsWith("/") ? path : `${path}/`

    let query = supabase.from("folders").select("*").eq("path", normalizedPath).eq("user_id", userId)

    // Apply sorting if specified
    if (options.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortOrder === "asc" })
    } else {
      query = query.order("name", { ascending: true })
    }

    const { data, error } = await query

    if (error) {
      console.error("Error listing folders:", error)
      return []
    }

    return data as Folder[]
  } catch (error) {
    console.error("Error in listFolders:", error)
    return []
  }
}

// Update folder
export async function updateFolder(folderId: string, updates: Partial<Folder>): Promise<Folder | null> {
  try {
    const userId = await getUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Get current folder to check ownership
    const { data: currentFolder, error: getError } = await supabase
      .from("folders")
      .select("*")
      .eq("id", folderId)
      .single()

    if (getError) {
      console.error("Error getting folder for update:", getError)
      return null
    }

    if (currentFolder.user_id !== userId) {
      throw new Error("You do not have permission to update this folder")
    }

    // Update folder
    const { data, error } = await supabase
      .from("folders")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", folderId)
      .select()
      .single()

    if (error) {
      console.error("Error updating folder:", error)
      return null
    }

    return data as Folder
  } catch (error) {
    console.error("Error in updateFolder:", error)
    return null
  }
}

// Delete folder
export async function deleteFolder(folderId: string): Promise<boolean> {
  try {
    const userId = await getUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Get current folder to check ownership
    const { data: currentFolder, error: getError } = await supabase
      .from("folders")
      .select("*")
      .eq("id", folderId)
      .single()

    if (getError) {
      console.error("Error getting folder for deletion:", getError)
      return false
    }

    if (currentFolder.user_id !== userId) {
      throw new Error("You do not have permission to delete this folder")
    }

    // Delete folder
    const { error } = await supabase.from("folders").delete().eq("id", folderId)

    if (error) {
      console.error("Error deleting folder:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteFolder:", error)
    return false
  }
}

// Move folder
export async function moveFolder(folderId: string, newPath: string): Promise<Folder | null> {
  try {
    const userId = await getUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Normalize path to ensure it ends with a slash
    const normalizedPath = newPath.endsWith("/") ? newPath : `${newPath}/`

    // Get current folder to check ownership and get name
    const { data: currentFolder, error: getError } = await supabase
      .from("folders")
      .select("*")
      .eq("id", folderId)
      .single()

    if (getError) {
      console.error("Error getting folder for move:", getError)
      return null
    }

    if (currentFolder.user_id !== userId) {
      throw new Error("You do not have permission to move this folder")
    }

    // Check if a folder with the same name already exists at the destination
    const { data: existingFolder, error: checkError } = await supabase
      .from("folders")
      .select("*")
      .eq("name", currentFolder.name)
      .eq("path", normalizedPath)
      .eq("user_id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      console.error("Error checking if folder exists at destination:", checkError)
      throw checkError
    }

    if (existingFolder) {
      throw new Error("A folder with the same name already exists at the destination")
    }

    // Move folder
    const { data, error } = await supabase
      .from("folders")
      .update({
        path: normalizedPath,
        updated_at: new Date().toISOString(),
      })
      .eq("id", folderId)
      .select()
      .single()

    if (error) {
      console.error("Error moving folder:", error)
      return null
    }

    return data as Folder
  } catch (error) {
    console.error("Error in moveFolder:", error)
    return null
  }
}

// Rename folder
export async function renameFolder(folderId: string, newName: string): Promise<Folder | null> {
  try {
    const userId = await getUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Get current folder to check ownership and path
    const { data: currentFolder, error: getError } = await supabase
      .from("folders")
      .select("*")
      .eq("id", folderId)
      .single()

    if (getError) {
      console.error("Error getting folder for rename:", getError)
      return null
    }

    if (currentFolder.user_id !== userId) {
      throw new Error("You do not have permission to rename this folder")
    }

    // Check if a folder with the new name already exists at the same path
    const { data: existingFolder, error: checkError } = await supabase
      .from("folders")
      .select("*")
      .eq("name", newName)
      .eq("path", currentFolder.path)
      .eq("user_id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      console.error("Error checking if folder exists with new name:", checkError)
      throw checkError
    }

    if (existingFolder) {
      throw new Error("A folder with the same name already exists")
    }

    // Rename folder
    const { data, error } = await supabase
      .from("folders")
      .update({
        name: newName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", folderId)
      .select()
      .single()

    if (error) {
      console.error("Error renaming folder:", error)
      return null
    }

    return data as Folder
  } catch (error) {
    console.error("Error in renameFolder:", error)
    return null
  }
}

