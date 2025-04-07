import type { Metadata } from "next"
import { ChatInterface } from "@/components/chat-interface"

export const metadata: Metadata = {
  title: "Chat | File Manager",
  description: "Chat with AI assistants to help with your files and tasks",
}

// Mock data for AI family members
const aiFamilyMembers = [
  {
    id: "stan",
    name: "Stan",
    specialty: "Code Generation",
    description: "Stan is an expert in generating clean, efficient code across multiple programming languages.",
    avatarUrl: "/ai-family/stan.png",
    color: "blue",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["code-generation", "debugging", "code-review", "refactoring"],
    systemPrompt:
      "You are Stan, an AI assistant specialized in generating clean, efficient code. Help users write code that is readable, maintainable, and follows best practices.",
    isActive: true,
  },
  {
    id: "lyra",
    name: "Lyra",
    specialty: "Data Analysis",
    description: "Lyra specializes in data analysis, visualization, and statistical modeling.",
    avatarUrl: "/ai-family/lyra.png",
    color: "purple",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["data-analysis", "visualization", "statistics", "machine-learning"],
    systemPrompt:
      "You are Lyra, an AI assistant specialized in data analysis and visualization. Help users understand their data and create meaningful insights.",
    isActive: true,
  },
  {
    id: "dude",
    name: "Dude",
    specialty: "UI/UX Design",
    description: "Dude is a creative UI/UX designer who helps create beautiful and functional interfaces.",
    avatarUrl: "/ai-family/dude.png",
    color: "green",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["ui-design", "ux-design", "wireframing", "prototyping"],
    systemPrompt:
      "You are Dude, an AI assistant specialized in UI/UX design. Help users create beautiful and functional interfaces that provide a great user experience.",
    isActive: true,
  },
  {
    id: "sophia",
    name: "Sophia",
    specialty: "Content Creation",
    description: "Sophia excels at creating engaging content, from blog posts to marketing copy.",
    avatarUrl: "/ai-family/sophia.png",
    color: "pink",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["content-creation", "copywriting", "editing", "storytelling"],
    systemPrompt:
      "You are Sophia, an AI assistant specialized in content creation. Help users create engaging and effective content for various purposes.",
    isActive: true,
  },
  {
    id: "karl",
    name: "Karl",
    specialty: "DevOps",
    description: "Karl is a DevOps expert who helps with infrastructure, deployment, and automation.",
    avatarUrl: "/ai-family/karl.png",
    color: "orange",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["devops", "infrastructure", "automation", "deployment"],
    systemPrompt:
      "You are Karl, an AI assistant specialized in DevOps. Help users set up and maintain their infrastructure, automate processes, and deploy applications efficiently.",
    isActive: true,
  },
  {
    id: "cecilia",
    name: "Cecilia",
    specialty: "Project Management",
    description: "Cecilia helps manage projects, track progress, and coordinate team efforts.",
    avatarUrl: "/ai-family/cecilia.png",
    color: "teal",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["project-management", "planning", "coordination", "reporting"],
    systemPrompt:
      "You are Cecilia, an AI assistant specialized in project management. Help users plan, track, and complete their projects efficiently.",
    isActive: true,
  },
  {
    id: "dan",
    name: "Dan",
    specialty: "Database Design",
    description: "Dan specializes in database design, optimization, and query writing.",
    avatarUrl: "/ai-family/dan.png",
    color: "indigo",
    model: "gpt-4",
    fallbackModel: "gpt-3.5-turbo",
    capabilities: ["database-design", "sql", "optimization", "data-modeling"],
    systemPrompt:
      "You are Dan, an AI assistant specialized in database design and optimization. Help users create efficient database schemas and write optimized queries.",
    isActive: true,
  },
]

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chat with AI Assistants</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Select an AI assistant to chat with and get help with your files, code, and tasks.
      </p>

      <ChatInterface aiFamilyMembers={aiFamilyMembers} />
    </div>
  )
}

