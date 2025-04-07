"use server"

import { revalidatePath } from "next/cache"
import { uploadFile, deleteFile, listFiles, moveFile, createFolder, type FileType } from "@/lib/storage-utils"
import { getUserId } from "@/lib/user-utils"

// Upload a file
export async function uploadFileAction(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    const fileType = formData.get("fileType") as FileType
    if (!fileType) {
      return { success: false, error: "No file type provided" }
    }

    const folder = (formData.get("folder") as string) || ""
    const customFileName = (formData.get("customFileName") as string) || undefined

    const result = await uploadFile(file, fileType, folder, customFileName)

    if (!result) {
      return { success: false, error: "Failed to upload file" }
    }

    // Store file metadata in database if needed
    // ...

    revalidatePath("/files")
    return { success: true, data: result }
  } catch (error) {
    console.error("Error in uploadFileAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Delete a file
export async function deleteFileAction(
  path: string,
  fileType: FileType,
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const result = await deleteFile(path, fileType)

    if (!result) {
      return { success: false, error: "Failed to delete file" }
    }

    // Remove file metadata from database if needed
    // ...

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteFileAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// List files
export async function listFilesAction(
  fileType: FileType,
  folder = "",
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const files = await listFiles(fileType, folder)

    if (!files) {
      return { success: false, error: "Failed to list files" }
    }

    return { success: true, data: files }
  } catch (error) {
    console.error("Error in listFilesAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Move/rename a file
export async function moveFileAction(
  oldPath: string,
  newPath: string,
  fileType: FileType,
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const result = await moveFile(oldPath, newPath, fileType)

    if (!result) {
      return { success: false, error: "Failed to move file" }
    }

    // Update file metadata in database if needed
    // ...

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error in moveFileAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Create a folder
export async function createFolderAction(
  folderPath: string,
  fileType: FileType,
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const result = await createFolder(folderPath, fileType)

    if (!result) {
      return { success: false, error: "Failed to create folder" }
    }

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error in createFolderAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

