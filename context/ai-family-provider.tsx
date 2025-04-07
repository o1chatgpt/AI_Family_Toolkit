"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

// Define the AI Family member type
interface AIFamilyMember {
  id: string
  name: string
  specialty: string
  description: string
  model: string
  icon?: string
}

// Sample AI Family members
const defaultAIFamilyMembers: AIFamilyMember[] = [
  {
    id: "stan",
    name: "Stan",
    specialty: "General Assistant",
    description: "Your helpful AI assistant for general tasks",
    model: "gpt-4o-mini-2024-07-18",
    icon: "Bot",
  },
  {
    id: "cody",
    name: "Cody",
    specialty: "Code Expert",
    description: "Specialized in programming and development",
    model: "gpt-4o-mini-2024-07-18",
    icon: "Code",
  },
  {
    id: "designer",
    name: "Designer",
    specialty: "Design Expert",
    description: "Specialized in UI/UX and visual design",
    model: "gpt-4o-mini-2024-07-18",
    icon: "Palette",
  },
  {
    id: "writer",
    name: "Writer",
    specialty: "Content Creation",
    description: "Specialized in writing and content creation",
    model: "gpt-4o-mini-2024-07-18",
    icon: "FileText",
  },
]

// Define the context type
interface AIFamilyContextType {
  aiFamilyMembers: AIFamilyMember[]
  selectedMember: AIFamilyMember | null
  selectMember: (id: string) => void
  addMember: (member: AIFamilyMember) => void
  updateMember: (id: string, updates: Partial<AIFamilyMember>) => void
  removeMember: (id: string) => void
}

// Create the context
const AIFamilyContext = createContext<AIFamilyContextType>({
  aiFamilyMembers: defaultAIFamilyMembers,
  selectedMember: null,
  selectMember: () => {},
  addMember: () => {},
  updateMember: () => {},
  removeMember: () => {},
})

// Provider component
export function AIFamilyProvider({ children }: { children: React.ReactNode }) {
  const [aiFamilyMembers, setAIFamilyMembers] = useState<AIFamilyMember[]>(defaultAIFamilyMembers)
  const [selectedMember, setSelectedMember] = useState<AIFamilyMember | null>(null)

  // Select a member by ID
  const selectMember = (id: string) => {
    const member = aiFamilyMembers.find((m) => m.id === id) || null
    setSelectedMember(member)
  }

  // Add a new member
  const addMember = (member: AIFamilyMember) => {
    setAIFamilyMembers((prev) => [...prev, member])
  }

  // Update an existing member
  const updateMember = (id: string, updates: Partial<AIFamilyMember>) => {
    setAIFamilyMembers((prev) => prev.map((member) => (member.id === id ? { ...member, ...updates } : member)))
  }

  // Remove a member
  const removeMember = (id: string) => {
    setAIFamilyMembers((prev) => prev.filter((member) => member.id !== id))
  }

  return (
    <AIFamilyContext.Provider
      value={{
        aiFamilyMembers,
        selectedMember,
        selectMember,
        addMember,
        updateMember,
        removeMember,
      }}
    >
      {children}
    </AIFamilyContext.Provider>
  )
}

// Hook to use the AI Family context
export const useAIFamily = () => {
  const context = useContext(AIFamilyContext)
  if (context === undefined) {
    throw new Error("useAIFamily must be used within an AIFamilyProvider")
  }
  return context
}

