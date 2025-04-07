"use server"

import { revalidatePath } from "next/cache"
import {
  getAllAIFamilyMembers,
  getAIFamilyMemberById,
  upsertAIFamilyMember,
  deleteAIFamilyMember,
  seedDefaultAIFamilyMembers,
} from "@/lib/ai-family-utils"
import type { AIFamilyMember } from "@/types/ai-family"
import { getUserId } from "@/lib/user-utils"

// Get all AI Family members
export async function getAllAIFamilyMembersAction(): Promise<{
  success: boolean
  data?: AIFamilyMember[]
  error?: string
}> {
  try {
    const members = await getAllAIFamilyMembers()
    return { success: true, data: members }
  } catch (error) {
    console.error("Error in getAllAIFamilyMembersAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Get a single AI Family member by ID
export async function getAIFamilyMemberByIdAction(memberId: string): Promise<{
  success: boolean
  data?: AIFamilyMember
  error?: string
}> {
  try {
    const member = await getAIFamilyMemberById(memberId)

    if (!member) {
      return { success: false, error: `AI Family member with ID ${memberId} not found` }
    }

    return { success: true, data: member }
  } catch (error) {
    console.error(`Error in getAIFamilyMemberByIdAction for ${memberId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Create or update an AI Family member
export async function upsertAIFamilyMemberAction(
  formData: FormData,
): Promise<{ success: boolean; data?: AIFamilyMember; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    // Extract member data from form
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const specialty = formData.get("specialty") as string
    const description = formData.get("description") as string
    const avatarUrl = formData.get("avatarUrl") as string
    const color = formData.get("color") as string
    const model = formData.get("model") as string
    const fallbackModel = formData.get("fallbackModel") as string
    const systemPrompt = formData.get("systemPrompt") as string

    // Parse capabilities from JSON string
    const capabilitiesStr = formData.get("capabilities") as string
    const capabilities = capabilitiesStr ? JSON.parse(capabilitiesStr) : []

    // Get avatar file if provided
    const avatarFile = (formData.get("avatar") as File) || undefined

    // Create member object
    const member: AIFamilyMember = {
      id,
      name,
      specialty,
      description,
      avatarUrl,
      color,
      model,
      fallbackModel,
      capabilities,
      systemPrompt,
      isActive: true,
    }

    // Upsert member
    const result = await upsertAIFamilyMember(member, avatarFile)

    if (!result) {
      return { success: false, error: "Failed to create/update AI Family member" }
    }

    revalidatePath("/admin/ai-family")
    revalidatePath("/ai-family")
    return { success: true, data: result }
  } catch (error) {
    console.error("Error in upsertAIFamilyMemberAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Delete an AI Family member
export async function deleteAIFamilyMemberAction(memberId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const result = await deleteAIFamilyMember(memberId)

    if (!result) {
      return { success: false, error: "Failed to delete AI Family member" }
    }

    revalidatePath("/admin/ai-family")
    revalidatePath("/ai-family")
    return { success: true }
  } catch (error) {
    console.error(`Error in deleteAIFamilyMemberAction for ${memberId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Seed default AI Family members
export async function seedDefaultAIFamilyMembersAction(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const result = await seedDefaultAIFamilyMembers()

    if (!result) {
      return { success: false, error: "Failed to seed default AI Family members" }
    }

    revalidatePath("/admin/ai-family")
    revalidatePath("/ai-family")
    return { success: true }
  } catch (error) {
    console.error("Error in seedDefaultAIFamilyMembersAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

