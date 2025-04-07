import { supabase } from "./supabase"
import { getUserId } from "./user"

export async function createBucket(name: string) {
  const userId = await getUserId()
  if (!userId) {
    throw new Error("User not authenticated")
  }

  const bucketId = name.toLowerCase().replace(/ /g, "-")

  const { data, error } = await supabase
    .from("buckets")
    .insert([
      {
        id: bucketId,
        name: name,
        owner: userId,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating bucket:", error)
    throw new Error("Failed to create bucket")
  }

  return data
}

