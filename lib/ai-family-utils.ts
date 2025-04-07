import { supabase } from "./supabase-client"
import { type AIFamilyMember, AI_FAMILY_MEMBERS } from "@/types/ai-family"
import { uploadFile } from "./storage-utils"

// Get all AI Family members
export const getAllAIFamilyMembers = async (): Promise<AIFamilyMember[]> => {
  try {
    const { data, error } = await supabase.from("ai_family_members").select("*").order("name")

    if (error) {
      console.error("Error fetching AI Family members:", error)
      return AI_FAMILY_MEMBERS
    }

    if (!data || data.length === 0) {
      // If no data in database, seed with default members
      await seedDefaultAIFamilyMembers()
      return AI_FAMILY_MEMBERS
    }

    // Map database fields to our AIFamilyMember interface
    return data.map((member) => ({
      id: member.member_id,
      name: member.name,
      specialty: member.specialty,
      description: member.description,
      avatarUrl: member.avatar_url,
      color: member.color,
      model: member.model,
      fallbackModel: member.fallback_model,
      capabilities: member.capabilities
        ? typeof member.capabilities === "string"
          ? JSON.parse(member.capabilities)
          : member.capabilities
        : [],
      systemPrompt: member.system_prompt,
      isActive: true,
    }))
  } catch (error) {
    console.error("Error in getAllAIFamilyMembers:", error)
    return AI_FAMILY_MEMBERS
  }
}

// Get a single AI Family member by ID
export const getAIFamilyMemberById = async (memberId: string): Promise<AIFamilyMember | null> => {
  try {
    const { data, error } = await supabase.from("ai_family_members").select("*").eq("member_id", memberId).single()

    if (error) {
      console.error(`Error fetching AI Family member ${memberId}:`, error)

      // Try to find in default members
      const defaultMember = AI_FAMILY_MEMBERS.find((m) => m.id === memberId)
      if (defaultMember) {
        return defaultMember
      }

      return null
    }

    // Map database fields to our AIFamilyMember interface
    return {
      id: data.member_id,
      name: data.name,
      specialty: data.specialty,
      description: data.description,
      avatarUrl: data.avatar_url,
      color: data.color,
      model: data.model,
      fallbackModel: data.fallback_model,
      capabilities: data.capabilities
        ? typeof data.capabilities === "string"
          ? JSON.parse(data.capabilities)
          : data.capabilities
        : [],
      systemPrompt: data.system_prompt,
      isActive: true,
    }
  } catch (error) {
    console.error(`Error in getAIFamilyMemberById for ${memberId}:`, error)

    // Try to find in default members
    const defaultMember = AI_FAMILY_MEMBERS.find((m) => m.id === memberId)
    if (defaultMember) {
      return defaultMember
    }

    return null
  }
}

// Create or update an AI Family member
export const upsertAIFamilyMember = async (
  member: AIFamilyMember,
  avatarFile?: File,
): Promise<AIFamilyMember | null> => {
  try {
    // Upload avatar if provided
    let avatarUrl = member.avatarUrl
    if (avatarFile) {
      const uploadResult = await uploadFile(
        avatarFile,
        "avatar",
        "ai-family",
        `${member.id}-${Date.now()}.${avatarFile.name.split(".").pop()}`,
      )

      if (uploadResult) {
        avatarUrl = uploadResult.url
      }
    }

    // Prepare data for database
    const memberData = {
      member_id: member.id,
      name: member.name,
      specialty: member.specialty,
      description: member.description,
      avatar_url: avatarUrl,
      color: member.color || "blue",
      model: member.model,
      fallback_model: member.fallbackModel,
      capabilities: JSON.stringify(member.capabilities),
      system_prompt: member.systemPrompt || "",
      updated_at: new Date().toISOString(),
    }

    // Insert or update in database
    const { error } = await supabase.from("ai_family_members").upsert(memberData, { onConflict: "member_id" })

    if (error) {
      console.error("Error upserting AI Family member:", error)
      return null
    }

    // Return the updated member
    return {
      ...member,
      avatarUrl,
    }
  } catch (error) {
    console.error("Error in upsertAIFamilyMember:", error)
    return null
  }
}

// Delete an AI Family member
export const deleteAIFamilyMember = async (memberId: string): Promise<boolean> => {
  try {
    // Check if this is a default member
    const isDefaultMember = AI_FAMILY_MEMBERS.some((m) => m.id === memberId)
    if (isDefaultMember) {
      console.error("Cannot delete a default AI Family member")
      return false
    }

    const { error } = await supabase.from("ai_family_members").delete().eq("member_id", memberId)

    if (error) {
      console.error(`Error deleting AI Family member ${memberId}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in deleteAIFamilyMember for ${memberId}:`, error)
    return false
  }
}

// Seed database with default AI Family members
export const seedDefaultAIFamilyMembers = async (): Promise<boolean> => {
  try {
    for (const member of AI_FAMILY_MEMBERS) {
      await supabase.from("ai_family_members").upsert(
        {
          member_id: member.id,
          name: member.name,
          specialty: member.specialty,
          description: member.description,
          avatar_url: member.avatarUrl || `/ai-family/${member.id}.png`,
          color: member.color || "blue",
          model: member.model,
          fallback_model: member.fallbackModel,
          capabilities: JSON.stringify(member.capabilities),
          system_prompt: member.systemPrompt || "",
        },
        { onConflict: "member_id" },
      )
    }

    console.log("Default AI Family members seeded successfully")
    return true
  } catch (error) {
    console.error("Error seeding default AI Family members:", error)
    return false
  }
}

