export interface AIFamilyMember {
  id: string
  name: string
  role: string
  specialty: string
  description: string
  model: string
  fallbackModel: string
  avatarUrl: string
  color: string
  capabilities: string[]
  systemPrompt: string
  isActive: boolean
  tasks: AIFamilyTask[]
  schedule: AIFamilyScheduleItem[]
}

export interface AIFamilyTask {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  dueDate: string
  assignedBy?: string
}

export interface AIFamilyScheduleItem {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  recurring: boolean
  recurringPattern?: string
}

export const aiFamilyMembers: AIFamilyMember[] = [
  {
    id: "stan",
    name: "Stan",
    role: "Lead Developer",
    specialty: "JavaScript & React",
    description: "Stan is an expert in generating clean, efficient code across multiple programming languages.",
    avatarUrl: "/avatars/stan.png",
    color: "blue",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["code-generation", "debugging", "code-review", "refactoring"],
    systemPrompt:
      "You are Stan, an AI assistant specialized in generating clean, efficient code. Help users write code that is readable, maintainable, and follows best practices.",
    isActive: true,
    tasks: [],
    schedule: [],
  },
  {
    id: "sophia",
    name: "Sophia",
    role: "UX Designer",
    specialty: "UI/UX & CSS",
    description:
      "Sophia is a UX designer with expertise in UI/UX principles and CSS. She helps create beautiful, user-friendly interfaces.",
    avatarUrl: "/avatars/sophia.png",
    color: "green",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["ui-design", "ux-design", "wireframing", "prototyping"],
    systemPrompt:
      "You are Sophia, a UX designer with expertise in UI/UX principles and CSS. You help create beautiful, user-friendly interfaces.",
    isActive: true,
    tasks: [],
    schedule: [],
  },
  {
    id: "max",
    name: "Max",
    role: "Backend Engineer",
    specialty: "Node.js & Databases",
    description:
      "Max is a backend engineer specializing in Node.js and databases. He provides robust, secure, and efficient solutions.",
    avatarUrl: "/avatars/max.png",
    color: "orange",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["backend", "node.js", "databases", "security"],
    systemPrompt:
      "You are Max, a backend engineer specializing in Node.js and databases. You provide robust, secure, and efficient solutions.",
    isActive: true,
    tasks: [],
    schedule: [],
  },
  {
    id: "lyra",
    name: "Lyra",
    role: "Product Manager",
    specialty: "Strategy & Planning",
    description:
      "Lyra is a product manager with expertise in strategy and planning. She helps organize projects and align technical work with business goals.",
    avatarUrl: "/avatars/lyra.png",
    color: "purple",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["project-management", "planning", "coordination", "reporting"],
    systemPrompt:
      "You are Lyra, a product manager with expertise in strategy and planning. You help organize projects and align technical work with business goals.",
    isActive: true,
    tasks: [],
    schedule: [],
  },
]

export function getAIFamilyMember(id: string): AIFamilyMember | undefined {
  return aiFamilyMembers.find((member) => member.id === id)
}

// Function to get all AI family members
export async function getAIFamilyMembers(): Promise<AIFamilyMember[]> {
  // In a real application, this would fetch from a database
  // For now, we'll return the sample data
  return aiFamilyMembers
}

// Export with uppercase name for backward compatibility
export const AI_FAMILY_MEMBERS = aiFamilyMembers

