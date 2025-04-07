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

// Bucket names
export const BUCKETS = {
  IMAGES: "image-generations",
  DOCUMENTS: "documents",
  CODE_SNIPPETS: "code-snippets",
  CHAT_ATTACHMENTS: "chat-attachments",
}

// Initialize storage buckets
export async function initializeStorage() {
  try {
    // Create buckets if they don't exist
    for (const bucket of Object.values(BUCKETS)) {
      const { data: existingBucket } = await supabase.storage.getBucket(bucket)

      if (!existingBucket) {
        await supabase.storage.createBucket(bucket, {
          public: false,
          fileSizeLimit: 10485760, // 10MB
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error initializing storage:", error)
    return { success: false, error }
  }
}

// Upload a file to a specific bucket
export async function uploadFile(bucketName: string, filePath: string, file: File | Blob, contentType?: string) {
  try {
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
      contentType,
      upsert: true,
    })

    if (error) throw error

    // Get public URL if needed
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath)

    return {
      success: true,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
    }
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}:`, error)
    return { success: false, error }
  }
}

// Download a file from a specific bucket
export async function downloadFile(bucketName: string, filePath: string) {
  try {
    const { data, error } = await supabase.storage.from(bucketName).download(filePath)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error(`Error downloading file from ${bucketName}:`, error)
    return { success: false, error }
  }
}

// List files in a bucket or folder
export async function listFiles(bucketName: string, folderPath?: string) {
  try {
    const { data, error } = await supabase.storage.from(bucketName).list(folderPath || "")

    if (error) throw error

    return { success: true, files: data }
  } catch (error) {
    console.error(`Error listing files in ${bucketName}:`, error)
    return { success: false, error }
  }
}

// Delete a file from a specific bucket
export async function deleteFile(bucketName: string, filePath: string) {
  try {
    const { error } = await supabase.storage.from(bucketName).remove([filePath])

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error(`Error deleting file from ${bucketName}:`, error)
    return { success: false, error }
  }
}

// Get a signed URL for temporary access to a file
export async function getSignedUrl(
  bucketName: string,
  filePath: string,
  expiresIn = 60, // seconds
) {
  try {
    const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(filePath, expiresIn)

    if (error) throw error

    return { success: true, signedUrl: data.signedUrl }
  } catch (error) {
    console.error(`Error getting signed URL for ${bucketName}/${filePath}:`, error)
    return { success: false, error }
  }
}

