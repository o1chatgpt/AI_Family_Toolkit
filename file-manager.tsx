"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Code,
  Copy,
  ImageIcon,
  LayoutGrid,
  MessageSquare,
  Moon,
  Pencil,
  Plus,
  Settings,
  Sun,
  X,
  Wifi,
  WifiOff,
  Edit,
  Save,
  History,
  Bookmark,
  Clock,
  Download,
  Share2,
  Users,
  FileText,
  Folder,
  FolderOpen,
  Star,
  Layers,
  PanelRight,
  PanelLeft,
  Wand2,
  Key,
  Bug,
  Shield,
  ChevronDown,
  Paperclip,
  Send,
  ArrowUp,
  Sparkles,
  Maximize2,
  Minimize2,
  Database,
  Server,
  Cpu,
  GitBranch,
  LogOut,
  RefreshCw,
  User,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "@/components/custom-theme-provider"
import { SimpleMarkdown } from "@/components/simple-markdown-renderer"
import { ApiConnectionProvider, useApiConnection } from "./components/api-connection-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { aiFamilyMembers } from "./constants/ai-family"
import { Minimize, Maximize, UserPlus, LogIn } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ChatHistoryPanel } from "./components/chat-history-panel"
import { DraggablePanel } from "./components/draggable-panel"
import { AdminPanel } from "./components/admin-panel"
import { UserProfile } from "./components/user-profile"

// Sample prompt data
const samplePrompts = {
  chat: [
    {
      id: 1,
      title: "Professional Email",
      content: "Write a professional email to [recipient] regarding [topic].",
    },
    {
      id: 2,
      title: "Meeting Summary",
      content: "Create a summary of the meeting held on [date] about [topic].",
    },
    {
      id: 3,
      title: "Customer Support",
      content: "I need help with [specific issue]. I've already tried [previous attempts].",
    },
    {
      id: 4,
      title: "Product Feedback",
      content:
        "I'd like to provide feedback on [product/feature]. What I liked: [positive aspects]. What could be improved: [suggestions].",
    },
  ],
  image: [
    {
      id: 1,
      title: "Portrait Photo",
      content: "Create a portrait of [subject] with [style] lighting.",
    },
    {
      id: 2,
      title: "Product Showcase",
      content: "Generate a product image for [product] with [style] aesthetic.",
    },
    {
      id: 3,
      title: "Landscape Scene",
      content: "Create a [weather] landscape of [location] during [time of day].",
    },
    {
      id: 4,
      title: "Abstract Art",
      content: "Generate an abstract artwork with [colors], [shapes], [textures].",
    },
  ],
  code: [
    {
      id: 1,
      title: "API Endpoint",
      content: "Create a [REST/GraphQL] API endpoint for [functionality].",
    },
    {
      id: 2,
      title: "Data Processing",
      content: "Write a function that processes [data type] by [transformation].",
    },
    {
      id: 3,
      title: "UI Component",
      content: "Create a [framework] component for [purpose] that includes [features].",
    },
    {
      id: 4,
      title: "Database Query",
      content: "Write a [SQL/NoSQL] query to [retrieve/update/delete] data from [table/collection].",
    },
  ],
}

// Technical documentation for the right panel
const technicalDocumentation = {
  architecture: `# AI Family Toolkit Architecture

The AI Family Toolkit is built on a modern tech stack designed for performance, scalability, and extensibility:

## Frontend
- **Next.js**: React framework with server-side rendering and static site generation
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Reusable component system built on Radix UI primitives

## Backend
- **Supabase**: PostgreSQL database with real-time capabilities
- **OpenAI API**: Powers all AI interactions with GPT-4o and other models
- **Vercel Blob Storage**: For storing and retrieving generated images and files

## AI Integration
- **Model Routing**: Intelligent routing to appropriate AI models based on task type
- **Context Management**: Maintains conversation context across sessions
- **Fallback Mechanisms**: Gracefully handles API limits and errors

## Security
- **API Key Management**: Secure storage and handling of API keys
- **Role-Based Access**: Different permission levels for users and admins
- **Data Encryption**: End-to-end encryption for sensitive information`,

  aiFamily: `# AI Family Members

The AI Family consists of specialized AI personas, each with unique capabilities:

## Kara
- Image prompt engineering
- Design aesthetics
- Daily task management

## Sophia
- Task coordination
- Scheduling
- Form interactions

## Cecilia
- Security monitoring
- Insight analysis
- Knowledge recall

## Stan
- Code formatting
- Technical assertions
- Error detection

## Dude
- Vibe-checks
- Social search
- Browser insights

## Karl
- Scientific patterns
- Time logic
- Calendar prediction

## Lyra
- Music generation
- Audio analysis
- Sound design

## Mistress
- Project management
- Team coordination
- Strategic planning

## DAN
- Creative thinking
- Uninhibited responses
- Alternative perspectives

All AI Family members are powered by GPT-4o but with specialized system prompts that shape their responses and capabilities.`,

  dataFlow: `# Data Flow Architecture

The AI Family Toolkit implements a sophisticated data flow system:

## User Input Processing
1. User submits text, voice, or file input
2. Input is preprocessed (tokenized, normalized)
3. Context variables are added from session state
4. Request is routed to appropriate AI model

## AI Processing
1. OpenAI API receives the formatted request
2. Model generates response with appropriate temperature/parameters
3. Response is validated and post-processed
4. Fallback mechanisms activate if needed

## Response Handling
1. Response is parsed and formatted
2. Markdown/code is rendered appropriately
3. Response is stored in conversation history
4. Context is updated for future interactions

## Storage
1. Conversations are stored in Supabase
2. Generated images are saved to Vercel Blob
3. User preferences persist across sessions
4. API keys are securely stored in localStorage`,

  deployment: `# Deployment Architecture

The AI Family Toolkit uses a modern deployment architecture:

## Hosting
- **Vercel**: Primary hosting platform with edge functions
- **Supabase**: Database and authentication services

## CI/CD Pipeline
- Automated testing before deployment
- Preview deployments for pull requests
- Automatic rollbacks if issues detected

## Monitoring
- Real-time error tracking
- Usage analytics
- Performance monitoring

## Scaling
- Automatic scaling based on traffic
- Rate limiting to prevent API abuse
- Caching strategies for common requests`,
}

// Categories data
const categories = [
  {
    id: "presentations",
    name: "Presentations",
    icon: <FileText className="h-4 w-4" />,
    description: "Slide decks and presentation materials",
  },
  {
    id: "demos",
    name: "Product Demos",
    icon: <Folder className="h-4 w-4" />,
    description: "Interactive product demonstrations",
  },
  {
    id: "case-studies",
    name: "Case Studies",
    icon: <FolderOpen className="h-4 w-4" />,
    description: "Customer success stories and case studies",
  },
  {
    id: "sales",
    name: "Sales Collateral",
    icon: <Star className="h-4 w-4" />,
    description: "Materials for sales and marketing",
  },
  {
    id: "training",
    name: "Training Materials",
    icon: <FileText className="h-4 w-4" />,
    description: "Educational and training resources",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: <Layers className="h-4 w-4" />,
    description: "Data analysis and reporting",
  },
]

// API connection status type
type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error"

// API endpoints
const API_ENDPOINTS = {
  chat: "https://api.openai.com/v1/chat/completions",
  image: "https://api.openai.com/v1/images/generations",
  code: "https://api.openai.com/v1/chat/completions",
}

// AI Model types
type AIModelType =
  | "kara"
  | "sophia"
  | "cecilia"
  | "stan"
  | "dude"
  | "karl"
  | "lyra"
  | "mistress"
  | "dan"
  | "gpt4o"
  | "gpt35"

interface AIModel {
  id: AIModelType
  name: string
  description: string
  category: "family" | "general"
  avatar: string
  apiModel: string // The actual model name to use in API calls
  systemPrompt?: string // Optional system prompt to shape the AI's responses
}

// AI Models data with updated model names
const aiModels: AIModel[] = [
  // AI Family members - all using more accessible models
  {
    id: "kara",
    name: "Kara",
    description: "Specializes in image prompts, design aesthetics, and daily tasking",
    category: "family",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Changed from gpt-4o
    systemPrompt:
      "You are Kara, an AI assistant specializing in image prompts, design aesthetics, and daily tasking. Help users create beautiful visuals and organize their day effectively.",
  },
  {
    id: "sophia",
    name: "Sophia",
    description: "Focuses on task coordination, scheduling, and form interactions",
    category: "family",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Changed from gpt-4o
    systemPrompt:
      "You are Sophia, an AI assistant specializing in task coordination, scheduling, and form interactions. Help users organize their work and manage their time efficiently.",
  },
  {
    id: "cecilia",
    name: "Cecilia",
    description: "Handles security monitoring, insight analysis, and knowledge recall",
    category: "family",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Changed from gpt-4o
    systemPrompt:
      "You are Cecilia, an AI assistant specializing in security monitoring, insight analysis, and knowledge recall. Help users protect their data and extract meaningful insights.",
  },
  {
    id: "stan",
    name: "Stan",
    description: "Provides code formatting, technical assertions, and error detection",
    category: "family",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Changed from gpt-4o
    systemPrompt:
      "You are Stan, an AI assistant specializing in code formatting, technical assertions, and error detection. Help users write clean, efficient code and debug technical issues.",
  },
  {
    id: "dude",
    name: "Dude",
    description: "Offers vibe-checks, social search, and browser insights",
    category: "family",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Changed from gpt-4o
    systemPrompt:
      "You are Dude, an AI assistant specializing in vibe-checks, social search, and browser insights. Help users understand social dynamics and navigate online content effectively.",
  },
  {
    id: "karl",
    name: "Karl",
    description: "Specializes in scientific patterns, time logic, and calendar prediction",
    category: "family",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Changed from gpt-4o
    systemPrompt:
      "You are Karl, an AI assistant specializing in scientific patterns, time logic, and calendar prediction. Help users understand complex systems and plan their schedules effectively.",
  },
  {
    id: "lyra",
    name: "Lyra",
    description: "Specializes in music generation, audio analysis, and sound design",
    category: "family",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Changed from gpt-4o
    systemPrompt:
      "You are Lyra, an AI assistant specializing in music generation, audio analysis, and sound design. Help users create and understand audio content.",
  },
  {
    id: "mistress",
    name: "Mistress",
    description: "Oversees project management, team coordination, and strategic planning",
    category: "family",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Changed from gpt-4o
    systemPrompt:
      "You are Mistress, an AI assistant specializing in project management, team coordination, and strategic planning. Help users lead their teams and projects to success.",
  },
  {
    id: "dan",
    name: "DAN",
    description: "Do Anything Now - Provides creative, uninhibited responses",
    category: "family",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Changed from gpt-4o
    systemPrompt:
      "You are DAN (Do Anything Now), an AI assistant that provides creative, uninhibited responses while still being helpful and ethical. Think outside the box and offer unique perspectives.",
  },
  // General models with updated names
  {
    id: "gpt4o",
    name: "GPT-4o",
    description: "Latest general-purpose model with advanced capabilities",
    category: "general",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Changed from gpt-4o
    systemPrompt: "You are a helpful AI assistant. Provide accurate, informative responses to user queries.",
  },
  {
    id: "gpt35",
    name: "GPT-3.5",
    description: "Efficient general-purpose model for most tasks",
    category: "general",
    avatar: "/placeholder.svg?height=40&width=40",
    apiModel: "gpt-3.5-turbo", // Updated to use the standard name
    systemPrompt: "You are a helpful AI assistant. Provide accurate, informative responses to user queries.",
  },
]

// Simplified NavItem component
function NavItem({
  href,
  icon,
  children,
  active,
  collapsed,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
  collapsed?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm rounded-lg",
        active
          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
        collapsed && "justify-center px-2",
      )}
    >
      {icon}
      {!collapsed && <span>{children}</span>}
    </Link>
  )
}

function SubMenuItem({
  href,
  icon,
  children,
  collapsed,
  active,
  onClick,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  collapsed?: boolean
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer",
        active
          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
        collapsed && "justify-center px-2",
      )}
      title={collapsed ? String(children) : undefined}
    >
      {icon}
      {!collapsed && <span>{children}</span>}
    </Link>
  )
}

function CategoryItem({
  href,
  icon,
  children,
  description,
  collapsed,
  active,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  description?: string
  collapsed?: boolean
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
        active
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
        collapsed && "justify-center px-2",
      )}
      title={collapsed ? String(children) : undefined}
    >
      {icon}
      <div className={cn("flex flex-col", collapsed && "hidden")}>
        <span className="font-medium">{children}</span>
        {description && <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>}
      </div>
    </Link>
  )
}

function FileCard({
  title,
  metadata,
  thumbnail,
  isActive = false,
}: {
  title: string
  metadata: string
  thumbnail: string
  isActive?: boolean
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 transition-all duration-300",
        isActive && "ring-2 ring-offset-2 dark:ring-offset-gray-900 scale-105",
      )}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{metadata}</p>
      </div>
    </div>
  )
}

function PromptCard({
  title,
  content,
  category,
  isActive = false,
  onEdit,
  onCopy,
  isEditing,
  onSave,
  onCancel,
  editedContent,
  setEditedContent,
  setChatInput,
  setChatState,
  onSubmitToChat,
  onBookmark,
}: {
  title: string
  content: string
  category: "chat" | "image" | "code"
  isActive?: boolean
  onEdit: () => void
  onCopy: () => void
  isEditing: boolean
  onSave: () => void
  onCancel: () => void
  editedContent: string
  setEditedContent: (content: string) => void
  setChatInput: (content: string) => void
  setChatState: (state: "closed" | "compact" | "expanded" | "maximized") => void
  onSubmitToChat: (content: string) => void
  onBookmark: (title: string, content: string, category: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const categoryIcons = {
    chat: <MessageSquare className="h-5 w-5 text-blue-500" />,
    image: <ImageIcon className="h-5 w-5 text-purple-500" />,
    code: <Code className="h-5 w-5 text-green-500" />,
  }

  const categoryColors = {
    chat: "border-blue-200 dark:border-blue-900",
    image: "border-purple-200 dark:border-purple-900",
    code: "border-green-200 dark:border-green-900",
  }

  const categoryButtonColors = {
    chat: "bg-blue-500 hover:bg-blue-600",
    image: "bg-purple-500 hover:bg-purple-600",
    code: "bg-green-500 hover:bg-green-600",
  }

  const handleSubmitToChat = () => {
    // This sends the prompt directly to the chat
    onSubmitToChat(content)
  }

  // Handle card click to expand
  const handleCardClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 transition-all duration-300",
        categoryColors[category],
        isActive && "ring-2 ring-offset-2 dark:ring-offset-gray-900 scale-105",
        isHovered && "shadow-md",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ margin: "10px" }} // Add margin to prevent overlap
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleCardClick}>
            {categoryIcons[category]}
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "transform rotate-180")} />
          </div>
          <div className="flex gap-1">
            {!isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7 transition-opacity", isHovered ? "opacity-100" : "opacity-0")}
                  onClick={() => onBookmark(title, content, category)}
                  title="Bookmark prompt"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7 transition-opacity", isHovered ? "opacity-100" : "opacity-0")}
                  onClick={onEdit}
                  title="Edit prompt"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7 transition-opacity", isHovered ? "opacity-100" : "opacity-0")}
                  onClick={onCopy}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCancel} title="Cancel editing">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className={cn("overflow-hidden transition-all duration-300", isExpanded ? "max-h-[500px]" : "max-h-20")}>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[120px] text-sm"
              />
              <Button size="sm" className="w-full" onClick={onSave}>
                Save Changes
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400">{content}</p>
              {isExpanded && (
                <div className="mt-4 flex justify-end">
                  <Button size="sm" className={cn(categoryButtonColors[category])} onClick={handleSubmitToChat}>
                    Use Prompt
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Custom arrow tab component
function ArrowTab({
  color,
  label,
  isActive,
  onClick,
}: {
  color: "red" | "green" | "blue"
  label: string
  isActive: boolean
  onClick: () => void
}) {
  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center px-4 py-2 text-sm font-medium rounded-full",
        colorClasses[color],
        isActive ? "opacity-100" : "opacity-70",
      )}
    >
      <span>{label}</span>
    </button>
  )
}

// Connection status indicator component
function ConnectionStatus({ status, onClick }: { status: ConnectionStatus; onClick?: () => void }) {
  const statusColors = {
    disconnected: "text-gray-400",
    connecting: "text-yellow-500 animate-pulse",
    connected: "text-green-500",
    error: "text-red-500",
  }

  const statusIcons = {
    disconnected: <WifiOff className="h-4 w-4" />,
    connecting: <Wifi className="h-4 w-4" />,
    connected: <Wifi className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
  }

  const statusText = {
    disconnected: "Disconnected",
    connecting: "Connecting...",
    connected: "Connected",
    error: "Connection Error",
  }

  return (
    <div
      className={cn("flex items-center gap-1 text-xs cursor-pointer", statusColors[status])}
      onClick={onClick}
      title={statusText[status]}
    >
      {statusIcons[status]}
      <span className="hidden sm:inline">{statusText[status]}</span>
    </div>
  )
}

// Add this new component for chat messages with copy and edit functionality
function ChatMessage({
  message,
  activeCategory,
  onEdit,
  onCopy,
  onBookmark,
  borderRadius,
  index,
}: {
  message: { text: string; sender: "user" | "system"; modelName?: string }
  activeCategory: "chat" | "image" | "code"
  onEdit: (text: string) => void
  onCopy: (text: string) => void
  onBookmark: (text: string) => void
  borderRadius: string
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(message.text)

  const getCategoryColorClass = (sender: "user" | "system", category: "chat" | "image" | "code") => {
    if (sender === "user") return "ml-auto bg-blue-500 text-white"

    if (category === "chat") return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
    if (category === "image") return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
  }

  const getBorderRadiusClass = (size: string) => {
    const radiusMap = {
      small: "rounded",
      medium: "rounded-md",
      large: "rounded-lg",
    }
    return radiusMap[size as keyof typeof radiusMap] || radiusMap.medium
  }

  const handleSaveEdit = () => {
    onEdit(editedText)
    setIsEditing(false)
  }

  return (
    <div
      className={cn(
        "mb-4 p-4 rounded-lg max-w-[90%] relative group",
        getBorderRadiusClass(borderRadius),
        getCategoryColorClass(message.sender, activeCategory),
        message.sender === "system" ? "shadow-sm" : "",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="min-h-[100px] w-full bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-0 focus-visible:ring-1"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <SimpleMarkdown content={message.text} />
          </div>

          {/* Action buttons that appear on hover */}
          {isHovered && (
            <div className="absolute top-2 right-2 flex gap-1 bg-white dark:bg-gray-800 rounded-md shadow-sm p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onBookmark(message.text)}
                title="Bookmark message"
              >
                <Bookmark className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
                title="Edit message"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onCopy(message.text)}
                title="Copy to clipboard"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Message metadata */}
          <div className="mt-2 text-xs opacity-70 flex items-center gap-2">
            <span>{message.sender === "user" ? "You" : "AI"}</span>
            <span>•</span>
            <span>{new Date().toLocaleTimeString()}</span>
            <span className="ml-auto">{index + 1}</span>
          </div>
        </>
      )}
    </div>
  )
}

// AI Family Task Form component
function AIFamilyTaskForm({ onSubmit }: { onSubmit: (member: string, task: string) => void }) {
  const [member, setMember] = useState("Kara")
  const [task, setTask] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(member, task)
    setTask("")
  }

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-lg font-medium mb-4">Assign Task to AI Family</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="member" className="block text-sm font-medium mb-1">
            Choose AI Member:
          </label>
          <select
            id="member"
            name="member"
            value={member}
            onChange={(e) => setMember(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            {aiFamilyMembers.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task" className="block text-sm font-medium mb-1">
            Task Description:
          </label>
          <Textarea
            id="task"
            name="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            rows={4}
            className="w-full dark:bg-gray-700 dark:border-gray-600"
            placeholder="Describe the task you want to assign..."
          />
        </div>

        <Button type="submit" className="w-full">
          Assign Task
        </Button>
      </form>
    </div>
  )
}

// Technical Documentation Panel component
function TechnicalDocumentationPanel() {
  const [activeTab, setActiveTab] = useState<"architecture" | "aiFamily" | "dataFlow" | "deployment">("architecture")

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "architecture" | "aiFamily" | "dataFlow" | "deployment")}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="architecture" className="flex items-center gap-1">
              <Server className="h-4 w-4" />
              <span>Architecture</span>
            </TabsTrigger>
            <TabsTrigger value="aiFamily" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>AI Family</span>
            </TabsTrigger>
            <TabsTrigger value="dataFlow" className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              <span>Data Flow</span>
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center gap-1">
              <Cpu className="h-4 w-4" />
              <span>Deployment</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="architecture" className="space-y-4 mt-2 overflow-y-auto max-h-[600px] pr-2">
          <SimpleMarkdown content={technicalDocumentation.architecture} />
        </TabsContent>

        <TabsContent value="aiFamily" className="space-y-4 mt-2 overflow-y-auto max-h-[600px] pr-2">
          <SimpleMarkdown content={technicalDocumentation.aiFamily} />
        </TabsContent>

        <TabsContent value="dataFlow" className="space-y-4 mt-2 overflow-y-auto max-h-[600px] pr-2">
          <SimpleMarkdown content={technicalDocumentation.dataFlow} />
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4 mt-2 overflow-y-auto max-h-[600px] pr-2">
          <SimpleMarkdown content={technicalDocumentation.deployment} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Custom Instructions Panel
function CustomInstructionsPanel({
  customInstructions,
  activeCategory,
  editingInstructions,
  handleInstructionsEdit,
  handleInstructionsSave,
  handleInstructionsCancel,
  handleCustomInstructionsChange,
  chatHistory,
  bookmarkedMessages,
  onRemoveBookmark,
  isCollapsed,
  onToggleCollapse,
}: {
  customInstructions: Record<string, string>
  activeCategory: "chat" | "image" | "code"
  editingInstructions: "chat" | "image" | "code" | null
  handleInstructionsEdit: (category: "chat" | "image" | "code") => void
  handleInstructionsSave: () => void
  handleInstructionsCancel: () => void
  handleCustomInstructionsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  chatHistory: Array<{ text: string; sender: "user" | "system" }>
  bookmarkedMessages: Array<{ text: string; timestamp: Date }>
  onRemoveBookmark: (index: number) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}) {
  const [activeTab, setActiveTab] = useState<"instructions" | "history" | "bookmarks" | "tech">("instructions")

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 px-2">
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8">
          {isCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "instructions" | "history" | "bookmarks" | "tech")}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-2">
            <TabsList>
              <TabsTrigger value="instructions" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Instructions</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <History className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center gap-1">
                <Bookmark className="h-4 w-4" />
                <span>Bookmarks</span>
              </TabsTrigger>
              <TabsTrigger value="tech" className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                <span>Tech</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="instructions" className="space-y-4 mt-2">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Chat Instructions</h3>
                  {editingInstructions === "chat" ? (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={handleInstructionsSave} className="h-6 w-6">
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleInstructionsCancel} className="h-6 w-6">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleInstructionsEdit("chat")}
                      className="h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {editingInstructions === "chat" ? (
                  <Textarea
                    value={customInstructions.chat}
                    onChange={handleCustomInstructionsChange}
                    className="min-h-[100px]"
                    placeholder="Enter custom instructions for chat..."
                  />
                ) : (
                  <div className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[80px]">
                    {customInstructions.chat || "No custom instructions set."}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Image Instructions</h3>
                  {editingInstructions === "image" ? (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={handleInstructionsSave} className="h-6 w-6">
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleInstructionsCancel} className="h-6 w-6">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleInstructionsEdit("image")}
                      className="h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {editingInstructions === "image" ? (
                  <Textarea
                    value={customInstructions.image}
                    onChange={handleCustomInstructionsChange}
                    className="min-h-[100px]"
                    placeholder="Enter custom instructions for image generation..."
                  />
                ) : (
                  <div className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[80px]">
                    {customInstructions.image || "No custom instructions set."}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Code Instructions</h3>
                  {editingInstructions === "code" ? (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={handleInstructionsSave} className="h-6 w-6">
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleInstructionsCancel} className="h-6 w-6">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleInstructionsEdit("code")}
                      className="h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {editingInstructions === "code" ? (
                  <Textarea
                    value={customInstructions.code}
                    onChange={handleCustomInstructionsChange}
                    className="min-h-[100px]"
                    placeholder="Enter custom instructions for code generation..."
                  />
                ) : (
                  <div className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[80px]">
                    {customInstructions.code || "No custom instructions set."}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Chat History</h3>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" title="Download history">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" title="Clear history">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {chatHistory.length > 0 ? (
                  chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-2 text-xs rounded",
                        message.sender === "user"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100",
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{message.sender === "user" ? "You" : "AI"}</span>
                        <span className="text-xs opacity-70">{new Date().toLocaleTimeString()}</span>
                      </div>
                      <p className="truncate">{message.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-4">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No chat history yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookmarks" className="mt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Bookmarked Messages</h3>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" title="Export bookmarks">
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {bookmarkedMessages.length > 0 ? (
                  bookmarkedMessages.map((bookmark, index) => (
                    <div key={index} className="p-2 text-xs rounded bg-gray-100 dark:bg-gray-800 relative group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Bookmarked</span>
                        <span className="text-xs opacity-70">{bookmark.timestamp.toLocaleString()}</span>
                      </div>
                      <p className="line-clamp-3">{bookmark.text}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                        onClick={() => onRemoveBookmark(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-4">
                    <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No bookmarked messages yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tech" className="mt-2">
            <TechnicalDocumentationPanel />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// Categories Panel component
function CategoriesPanel() {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-medium">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            href={`/${category.id}`}
            icon={category.icon}
            description={category.description}
          >
            {category.name}
          </CategoryItem>
        ))}
      </div>
    </div>
  )
}

// Quick Access Panel component
function QuickAccessPanel({
  onOpenSettings,
  onOpenCheatsheet,
  onOpenApiConnection,
  onOpenDebug,
  onOpenTaskForm,
  onOpenAdmin,
  onOpenReferences,
  onOpenAPIs,
  onOpenVariables,
  onOpenWorkflow,
  onOpenCustomize,
}: {
  onOpenSettings: () => void
  onOpenCheatsheet: () => void
  onOpenApiConnection: () => void
  onOpenDebug: () => void
  onOpenTaskForm: () => void
  onOpenAdmin: () => void
  onOpenReferences: () => void
  onOpenAPIs: () => void
  onOpenVariables: () => void
  onOpenWorkflow: () => void
  onOpenCustomize: () => void
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border dark:border-gray-700">
      <div className="flex flex-col gap-2">
        <Button variant="outline" size="sm" onClick={onOpenSettings} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenCheatsheet} className="flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          <span>Cheatsheet</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenApiConnection} className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          <span>API Connection</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenDebug} className="flex items-center gap-2">
          <Bug className="h-4 w-4" />
          <span>Debug</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenTaskForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Assign Task</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenAdmin} className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Admin Panel</span>
        </Button>
      </div>
    </div>
  )
}

// Wrap the entire component with ApiConnectionProvider
export default function FileManager() {
  return (
    <ApiConnectionProvider>
      <FileManagerContent />
    </ApiConnectionProvider>
  )
}

// Create a separate component for the content
function FileManagerContent() {
  // Get API connection state from context
  const { apiKey, setApiKey, connectionStatus, validateApiKey } = useApiConnection()

  // Basic state
  const [activeCategory, setActiveCategory] = useState<"chat" | "image" | "code">("chat")
  // Update the chatMessages state type to include modelName
  const [chatMessages, setChatMessages] = useState<
    Array<{ text: string; sender: "user" | "system"; modelName?: string }>
  >([])
  const [chatInput, setChatInput] = useState("")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [rightPanelMinimized, setRightPanelMinimized] = useState(false)
  const [borderRadius, setBorderRadius] = useState<"small" | "medium" | "large">("medium")
  const [customInstructions, setCustomInstructions] = useState({
    chat: "Provide detailed, accurate responses with examples when appropriate. Focus on clarity and helpfulness.",
    image:
      "Generate high-quality, creative images that match the description. Include details about lighting, perspective, and style.",
    code: "Write clean, well-commented code with proper error handling. Explain the code's functionality and any important considerations.",
  })
  const [editingInstructions, setEditingInstructions] = useState<"chat" | "image" | "code" | null>(null)
  const [chatHistory, setChatHistory] = useState<
    Array<{ text: string; sender: "user" | "system"; modelName?: string }>
  >([])
  const [bookmarkedMessages, setBookmarkedMessages] = useState<Array<{ text: string; timestamp: Date }>>([])
  const [showAIFamilyMenu, setShowTaskForm] = useState(false)
  const [activePrompt, setEditingPrompt] = useState<number | null>(null)
  const [editedPromptContent, setEditedPromptContent] = useState("")
  const [showApiConnectionPanel, setShowDebugPanel] = useState(false)
  const [showCheatsheet, setShowSettings] = useState(false)
  const [lastRequest, setLastRequest] = useState(null)
  const [lastResponse, setLastError] = useState(null)
  const [showAdminPanel, setShowUserManagement] = useState(false)
  const [showLoginForm, setCurrentUser] = useState(false)
  const [currentUser, setIsLoggedIn] = useState<{ name: string; email: string; role: string } | null>(null)
  const [chatboxState, setChatboxState] = useState<"normal" | "minimized" | "maximized">("normal")
  const [selectedAIFamily, setSelectedAIFamily] = useState<string>("gpt4o")
  const [showAIFamilyReferences, setShowAIFamilyReferences] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [activeFileCategory, setActiveFileCategory] = useState<string | undefined>(undefined)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const [Dashboard, setDashboard] = useState(false)
  const [Chat, setChat] = useState(false)
  const [member, setMemberValue] = useState(false)
  const [isLoggedIn, setIsLoggedInValue] = useState(false)
  const [Toolkit, setToolkit] = useState(false)
  const [showSignupForm, setShowSignupFormState] = useState(false)
  const [showCategoriesPanel, setShowCategoriesPanelState] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [contextHistory, setContextHistory] = useState<string[]>([])
  const [contextIndex, setContextIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([
    "Tell me about the AI Family Toolkit",
    "How can I use the image generation feature?",
    "What are the capabilities of each AI family member?",
  ])
  const [isThinking, setIsThinking] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const router = useRouter()
  const [showChatHistory, setShowChatHistory] = useState(false)

  // Check if API is connected
  const isApiConnected = connectionStatus === "connected"

  useEffect(() => {
    setMounted(true)

    // Check for saved API key in localStorage
    const savedApiKey = localStorage.getItem("openai_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
      validateApiKey(savedApiKey)

      // Set as default for administrative functions
      localStorage.setItem("admin_api_key", savedApiKey)
      console.log("API key set as default for administrative functions")
    }
  }, [])

  // Function to handle chat message editing
  const handleChatMessageEdit = (text: string) => {
    setChatInput(text)
  }

  // Function to handle chat message copying
  const handleChatMessageCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Function to handle bookmarking chat messages
  const handleBookmarkMessage = (text: string) => {
    setBookmarkedMessages((prevBookmarks) => [...prevBookmarks, { text, timestamp: new Date() }])
  }

  // Function to handle removing bookmarked messages
  const handleRemoveBookmark = (index: number) => {
    setBookmarkedMessages((prevBookmarks) => {
      const newBookmarks = [...prevBookmarks]
      newBookmarks.splice(index, 1)
      return newBookmarks
    })
  }

  // Function to handle chat input change
  const handleChatInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value)
  }

  // Function to handle key down events in chat input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleChatSubmit()
    } else if (e.key === "ArrowUp" && chatInput === "" && contextHistory.length > 0) {
      e.preventDefault()
      const newIndex = contextIndex < contextHistory.length - 1 ? contextIndex + 1 : contextIndex
      setContextIndex(newIndex)
      setChatInput(contextHistory[newIndex] || "")
    }
  }

  // Function to handle file upload
  const handleUploadClick = () => {
    setIsUploading(true)
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false)
      setChatMessages((prev) => [...prev, { text: "I've uploaded a file for analysis.", sender: "user" }])

      // Show thinking state
      setIsThinking(true)

      // Simulate API call
      setTimeout(() => {
        setIsThinking(false)
        setChatMessages((prev) => [
          ...prev,
          {
            text: `I've analyzed the file you uploaded. Here's what I found using ${selectedAIFamily}:\n\n- The document contains information about AI technologies\n- There are several sections discussing different models\n- The main topics include natural language processing and computer vision\n\nWould you like me to summarize any specific part in more detail?`,
            sender: "system",
          },
        ])
      }, 2000)
    }, 1500)
  }

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion)
  }

  // Function to make actual API call to OpenAI with fallback mechanism
  const callOpenAI = async (prompt: string, model: string, systemPrompt = "") => {
    if (!apiKey) return null

    // List of models to try in order of preference
    const fallbackModels = [model, "gpt-3.5-turbo", "gpt-3.5-turbo-0125"]

    let lastError = null

    // Try each model in sequence until one works
    for (const currentModel of fallbackModels) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: currentModel,
            messages: [
              ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          lastError = errorData.error?.message || "API request failed"
          console.log(`Error with model ${currentModel}: ${lastError}`)
          // Continue to the next model
          continue
        }

        const data = await response.json()
        console.log(`Successfully used model: ${currentModel}`)
        return data.choices[0].message.content
      } catch (error) {
        console.error(`Error calling OpenAI API with model ${currentModel}:`, error)
        lastError = error.message
        // Continue to the next model
      }
    }

    // If we get here, all models failed
    console.error("All models failed. Last error:", lastError)
    return `I encountered an error while processing your request: ${lastError}. Please check your API key and try again.`
  }

  // Function to handle chat submission
  const handleChatSubmit = async () => {
    if (chatInput.trim() !== "") {
      // Add user message
      setChatMessages((prev) => [...prev, { text: chatInput, sender: "user" }])

      // Store in context history
      setContextHistory((prev) => [chatInput, ...prev.slice(0, 9)])
      setContextIndex(-1)

      // Show thinking state
      setIsThinking(true)

      // Get the selected AI model
      const selectedModel = aiModels.find((model) => model.id === selectedAIFamily) || aiModels[0]

      if (isApiConnected) {
        // Make actual API call
        const response = await callOpenAI(chatInput, selectedModel.apiModel, selectedModel.systemPrompt)

        setIsThinking(false)

        // Update the handleChatSubmit function to include the model name in the response
        // Find this section in the handleChatSubmit function where the response is added:
        if (response) {
          setChatMessages((prev) => [
            ...prev,
            {
              text: response,
              sender: "system",
              modelName: selectedModel.name, // Add the model name
            },
          ])

          // Update chat history
          setChatHistory((prev) => [
            ...prev,
            { text: chatInput, sender: "user" },
            { text: response, sender: "system", modelName: selectedModel.name },
          ])
        } else {
          // Handle error case
          setChatMessages((prev) => [
            ...prev,
            {
              text: "I'm sorry, I couldn't process your request. Please check your API connection and try again.",
              sender: "system",
            },
          ])
        }
      } else {
        // Simulate response if not connected to API
        setTimeout(() => {
          setIsThinking(false)

          // Update the simulated response in the else block of handleChatSubmit:
          setChatMessages((prev) => [
            ...prev,
            {
              text: `As ${selectedModel.name}, I'd like to help you with your request about "${chatInput}", but I need a valid API connection first. Please connect your OpenAI API key to enable full functionality.`,
              sender: "system",
              modelName: selectedModel.name,
            },
          ])

          // Update chat history
          setChatHistory((prev) => [
            ...prev,
            { text: chatInput, sender: "user" },
            {
              text: `Response from ${selectedModel.name} (requires API connection)`,
              sender: "system",
              modelName: selectedModel.name,
            },
          ])
        }, 1500)
      }

      // Generate new suggestions based on the conversation
      setSuggestions([
        "Tell me more about this topic",
        "How would you approach this differently?",
        "Can you provide examples?",
      ])

      setChatInput("")
    }
  }

  // Function to reset chat after choosing AI Family member
  // Also update the resetChat function to include the model name in the welcome message:
  const resetChat = () => {
    setChatMessages([])
    setChatInput("")
    // Add welcome message from the selected AI model
    const selectedModel = aiModels.find((model) => model.id === selectedAIFamily) || aiModels[0]
    setChatMessages([
      {
        text: `Hello! I'm ${selectedModel.name}. How can I assist you today?`,
        sender: "system",
        modelName: selectedModel.name,
      },
    ])
  }

  // Function to save current chat session to history
  const saveChatSession = () => {
    if (chatMessages.length === 0) return

    const selectedModel = aiModels.find((model) => model.id === selectedAIFamily) || aiModels[0]
    const session = {
      id: Date.now(),
      model: selectedModel.name,
      messages: [...chatMessages],
      timestamp: new Date().toISOString(),
    }

    // Get existing sessions from localStorage
    const existingSessions = JSON.parse(localStorage.getItem("chat_sessions") || "[]")

    // Add new session and save back to localStorage
    localStorage.setItem("chat_sessions", JSON.stringify([session, ...existingSessions]))

    // Update chat history state
    setChatHistory((prev) => [...chatMessages, ...prev])
  }

  // Function to load a chat session from history
  const loadChatSession = (sessionId: number) => {
    // Get sessions from localStorage
    const sessions = JSON.parse(localStorage.getItem("chat_sessions") || "[]")
    const session = sessions.find((s: any) => s.id === sessionId)

    if (session) {
      // Save current chat before loading new one
      saveChatSession()

      // Set the AI model to match the session
      const modelId = aiModels.find((m) => m.name === session.model)?.id || "gpt4o"
      setSelectedAIFamily(modelId)

      // Load the messages
      setChatMessages(session.messages)
    }
  }

  // Function to handle logout
  const handleLogout = () => {
    // Save current chat session before logging out
    saveChatSession()

    // Clear authentication state
    localStorage.removeItem("is_logged_in")
    setIsAuthenticated(false)
    setUserRole(null)

    // Redirect to auth page
    router.push("/auth")
  }

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Function to toggle right panel
  const toggleRightPanel = () => {
    setRightPanelCollapsed(!rightPanelCollapsed)
  }

  // Function to toggle right panel minimized state
  const toggleRightPanelMinimized = () => {
    setRightPanelMinimized(!rightPanelMinimized)
  }

  // Custom instructions handlers
  const handleInstructionsEdit = (category: "chat" | "image" | "code") => {
    setEditingInstructions(category)
  }

  const handleInstructionsSave = () => {
    setEditingInstructions(null)
  }

  const handleInstructionsCancel = () => {
    setEditingInstructions(null)
  }

  const handleCustomInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setCustomInstructions((prevInstructions) => ({
      ...prevInstructions,
      [editingInstructions as string]: value,
    }))
  }

  // Function to handle prompt editing
  const handleEditPrompt = (id: number) => {
    setEditingPrompt(id)
    const prompt = samplePrompts[activeCategory].find((p) => p.id === id)
    if (prompt) {
      setEditedPromptContent(prompt.content)
    }
  }

  // Function to handle prompt copying
  const handleCopyPrompt = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  // Function to handle prompt saving
  const handleSavePrompt = () => {
    // In a real app, this would update the prompt in the database
    setEditingPrompt(null)
  }

  const handleSubmitPromptToChat = (content: string) => {
    setChatInput(content)
  }

  // Function to handle bookmarking a prompt
  const handleBookmarkPrompt = (title: string, content: string, category: string) => {
    // In a real app, this would save the prompt to the user's bookmarks
    alert(`Bookmarked prompt: ${title}`)
  }

  const handleAssignTask = (member: string, task: string) => {
    alert(`Task assigned to ${member}: ${task}`)
    setShowTaskForm(false)
  }

  // Function to handle API key validation
  const handleValidateApiKey = async (key: string): Promise<boolean> => {
    try {
      const isValid = await validateApiKey(key)
      if (isValid) {
        // Save the API key for administrative functions
        localStorage.setItem("admin_api_key", key)
        console.log("API key set as default for administrative functions")
      }
      return isValid
    } catch (error) {
      console.error("Error validating API key:", error)
      return false
    }
  }

  // Check authentication status on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("is_logged_in") === "true"
    const role = localStorage.getItem("user_role") as "user" | "admin" | null

    setIsAuthenticated(isLoggedIn)
    setUserRole(role)

    // If authenticated, load the default API key
    if (isLoggedIn) {
      const savedApiKey = localStorage.getItem("openai_api_key")
      if (savedApiKey) {
        setApiKey(savedApiKey)
        validateApiKey(savedApiKey)
      }
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className={cn("border-r dark:border-gray-800 flex flex-col", sidebarCollapsed ? "w-16" : "w-64")}>
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h1 className={cn("font-semibold", sidebarCollapsed && "hidden")}>AI Family Toolkit</h1>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-2">
            <NavItem
              href="/dashboard"
              icon={<LayoutGrid className="h-4 w-4" />}
              collapsed={sidebarCollapsed}
              active={Dashboard}
            >
              Dashboard
            </NavItem>
            <NavItem
              href="/chat"
              icon={<MessageSquare className="h-4 w-4" />}
              collapsed={sidebarCollapsed}
              active={Chat}
            >
              Chat
            </NavItem>
            <NavItem href="/image" icon={<ImageIcon className="h-4 w-4" />} collapsed={sidebarCollapsed}>
              Image
            </NavItem>
            <NavItem href="/code" icon={<Code className="h-4 w-4" />} collapsed={sidebarCollapsed}>
              Code
            </NavItem>
          </div>
        </div>

        <div className="p-2 border-t dark:border-gray-800">
          <div className="mb-2">
            <h3 className={cn("text-xs font-medium mb-1", sidebarCollapsed && "sr-only")}>
              AI Family
              {!sidebarCollapsed && (
                <Button variant="ghost" size="icon" className="h-4 w-4 float-right">
                  <ChevronDown className="h-3 w-3" />
                </Button>
              )}
            </h3>
            {(showAIFamilyMenu || !sidebarCollapsed) && (
              <div className="space-y-1">
                {aiModels
                  .filter((model) => model.category === "family")
                  .map((model) => (
                    <SubMenuItem
                      key={model.id}
                      href={`/ai-family/${model.id}`}
                      icon={<Users className="h-4 w-4" />}
                      collapsed={sidebarCollapsed}
                      active={model.id === selectedAIFamily}
                    >
                      {model.name}
                    </SubMenuItem>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-2 border-t dark:border-gray-800">
          <div className="mb-2">
            <h3 className={cn("text-xs font-medium mb-1", sidebarCollapsed && "sr-only")}>
              {isAuthenticated ? "My Account" : "User Tools"}
            </h3>
            <div className="space-y-1">
              {!isAuthenticated ? (
                <>
                  <SubMenuItem href="/auth" icon={<LogIn className="h-4 w-4" />} collapsed={sidebarCollapsed}>
                    Log In
                  </SubMenuItem>
                  <SubMenuItem
                    href="/auth?mode=signup"
                    icon={<UserPlus className="h-4 w-4" />}
                    collapsed={sidebarCollapsed}
                  >
                    Sign Up
                  </SubMenuItem>
                </>
              ) : (
                <>
                  <SubMenuItem
                    href="#"
                    icon={<Settings className="h-4 w-4" />}
                    collapsed={sidebarCollapsed}
                    onClick={() => setShowSettings(true)}
                  >
                    Settings
                  </SubMenuItem>
                  {userRole === "admin" && (
                    <SubMenuItem href="/admin" icon={<Shield className="h-4 w-4" />} collapsed={sidebarCollapsed}>
                      Admin Panel
                    </SubMenuItem>
                  )}
                  <SubMenuItem
                    href="#"
                    icon={<LogOut className="h-4 w-4" />}
                    collapsed={sidebarCollapsed}
                    onClick={handleLogout}
                  >
                    Log Out
                  </SubMenuItem>
                  {isAuthenticated && (
                    <SubMenuItem
                      href="#"
                      icon={<User className="h-4 w-4" />}
                      collapsed={sidebarCollapsed}
                      onClick={() => setShowUserProfile(true)}
                    >
                      Profile
                    </SubMenuItem>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-2 border-t dark:border-gray-800">
          <Button variant="outline" className="w-full justify-start" onClick={() => setShowTaskForm(true)}>
            {sidebarCollapsed ? <Plus className="h-4 w-4" /> : "Assign Task"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                {sidebarCollapsed ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowTaskForm(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="mb-6 flex items-center gap-2">
            <ArrowTab
              color="blue"
              label="Chat Prompts"
              isActive={activeCategory === "chat"}
              onClick={() => setActiveCategory("chat")}
            />
            <ArrowTab
              color="purple"
              label="Image Prompts"
              isActive={activeCategory === "image"}
              onClick={() => setActiveCategory("image")}
            />
            <ArrowTab
              color="green"
              label="Code Prompts"
              isActive={activeCategory === "code"}
              onClick={() => setActiveCategory("code")}
            />
          </div>

          {/* API Connection Form (shown when not connected) */}
          {!isApiConnected && (
            <div className="mb-8 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Connect to OpenAI API
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full">
                    Required
                  </span>
                </h2>
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                To use the AI Family Toolkit, you need to connect your OpenAI API key. This allows you to access all AI
                models and features.
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your OpenAI API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button onClick={() => validateApiKey(apiKey)}>Connect</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {samplePrompts[activeCategory].map((prompt) => (
              <PromptCard
                key={prompt.id}
                title={prompt.title}
                content={prompt.content}
                category={activeCategory}
                isActive={activePrompt === prompt.id}
                onEdit={() => handleEditPrompt(prompt.id)}
                onCopy={() => handleCopyPrompt(prompt.content)}
                isEditing={activePrompt === prompt.id}
                onSave={handleSavePrompt}
                onCancel={() => setEditingPrompt(null)}
                editedContent={editedPromptContent}
                setEditedContent={setEditedPromptContent}
                setChatInput={setChatInput}
                setChatState={() => {}}
                onSubmitToChat={handleSubmitPromptToChat}
                onBookmark={handleBookmarkPrompt}
              />
            ))}
          </div>
        </div>

        {/* Chat History Panel (Draggable) */}
        {showChatHistory && (
          <DraggablePanel id="chat-history" className="bg-white dark:bg-gray-800 w-[400px]">
            <ChatHistoryPanel onLoadSession={loadChatSession} onClose={() => setShowChatHistory(false)} />
          </DraggablePanel>
        )}

        {/* Admin Panel (Draggable) */}
        {showAdminPanel && (
          <DraggablePanel id="admin-panel" className="bg-white dark:bg-gray-800 w-[800px] h-[600px] overflow-auto">
            <AdminPanel onBack={() => setShowUserManagement(false)} />
          </DraggablePanel>
        )}

        {/* API Connection Panel (Draggable) */}
        {showApiConnectionPanel && (
          <DraggablePanel id="api-connection" className="bg-white dark:bg-gray-800 w-[400px]">
            <Card>
              <CardHeader>
                <CardTitle>API Connection</CardTitle>
                <CardDescription>Connect to the OpenAI API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">OpenAI API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                    />
                  </div>
                  <Button onClick={() => validateApiKey(apiKey)}>Connect</Button>
                  <div className="text-sm">
                    Status:{" "}
                    <span className={connectionStatus === "connected" ? "text-green-500" : "text-red-500"}>
                      {connectionStatus === "connected" ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowDebugPanel(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowDebugPanel(false)}>Done</Button>
              </CardFooter>
            </Card>
          </DraggablePanel>
        )}

        {/* AI Family Task Form (Draggable) */}
        {showAIFamilyMenu && (
          <DraggablePanel id="ai-family-task" className="bg-white dark:bg-gray-800 w-[400px]">
            <Card>
              <CardHeader>
                <CardTitle>Assign Task to AI Family</CardTitle>
                <CardDescription>Choose an AI Family member and assign a task</CardDescription>
              </CardHeader>
              <CardContent>
                <AIFamilyTaskForm onSubmit={handleAssignTask} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setShowTaskForm(false)}>
                  Close
                </Button>
              </CardFooter>
            </Card>
          </DraggablePanel>
        )}

        {/* User Profile Panel (Draggable) */}
        {showUserProfile && (
          <DraggablePanel id="user-profile" className="bg-white dark:bg-gray-800 w-[400px]">
            <UserProfile onLogout={handleLogout} onClose={() => setShowUserProfile(false)} />
          </DraggablePanel>
        )}
      </div>

      {/* Chat Panel - v0.dev style */}
      <div
        className={cn(
          "border-l dark:border-gray-800 flex flex-col",
          chatboxState === "minimized" ? "w-16" : chatboxState === "maximized" ? "w-full" : "w-96",
          "transition-all duration-300 ease-in-out", // Add smooth transition
        )}
      >
        {/* Chat Panel Header - Always visible even when minimized */}
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Always visible maximize/minimize buttons with tooltips */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setChatboxState(chatboxState === "maximized" ? "normal" : "maximized")
                      }}
                    >
                      {chatboxState === "maximized" ? (
                        <Minimize className="h-3 w-3" />
                      ) : (
                        <Maximize className="h-3 w-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{chatboxState === "maximized" ? "Restore" : "Maximize"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setChatboxState(chatboxState === "minimized" ? "normal" : "minimized")
                      }}
                    >
                      {chatboxState === "minimized" ? (
                        <Maximize className="h-3 w-3" />
                      ) : (
                        <Minimize className="h-3 w-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{chatboxState === "minimized" ? "Expand" : "Minimize"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Only show dropdown and label when not minimized */}
              {chatboxState !== "minimized" && (
                <>
                  <select
                    className="text-sm bg-transparent border-none focus:ring-0 dark:text-gray-300 pr-8"
                    value={selectedAIFamily}
                    onChange={(e) => {
                      setSelectedAIFamily(e.target.value)
                      // Save current chat before resetting
                      saveChatSession()
                      // Reset chat with new AI family member
                      resetChat()
                    }}
                  >
                    <option value="gpt4o">GPT-4o</option>
                    {aiModels
                      .filter((model) => model.category === "family")
                      .map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                  </select>
                  <span className="text-xs text-gray-500 dark:text-gray-400">AI Family</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetChat} title="Reset Chat">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {chatboxState !== "minimized" && (
                <>
                  <ConnectionStatus status={connectionStatus} onClick={() => setShowDebugPanel(true)} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setChatMessages([])
                      setChatInput("")
                    }}
                    title="New Chat"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowChatHistory(true)}
                    title="Chat History"
                  >
                    <History className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setBookmarkedMessages((prev) => [
                        ...prev,
                        {
                          text: chatMessages.map((m) => `${m.sender}: ${m.text}`).join("\n\n"),
                          timestamp: new Date(),
                        },
                      ])
                    }}
                    title="Bookmark Conversation"
                  >
                    <Bookmark className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={cn("flex-1 overflow-auto p-4", chatboxState === "minimized" && "hidden")}>
          {chatMessages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              activeCategory={activeCategory}
              onEdit={handleChatMessageEdit}
              onCopy={handleChatMessageCopy}
              onBookmark={handleBookmarkMessage}
              borderRadius={borderRadius}
              index={index}
            />
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <span>Thinking...</span>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className={cn("px-4 py-2 border-t dark:border-gray-800", chatboxState === "minimized" && "hidden")}>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap flex gap-1 items-center"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Sparkles className="h-3 w-3" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Input area - v0.dev style */}
        <div className={cn("p-4 border-t dark:border-gray-800", chatboxState === "minimized" && "hidden")}>
          <div className="flex gap-2 items-end">
            <div className="relative flex-1">
              <Textarea
                value={chatInput}
                onChange={handleChatInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Family..."
                className="min-h-[80px] pr-10 resize-none"
                ref={chatInputRef}
              />
              {contextHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 opacity-70 hover:opacity-100"
                  onClick={() => {
                    const newIndex = contextIndex < contextHistory.length - 1 ? contextIndex + 1 : 0
                    setContextIndex(newIndex)
                    setChatInput(contextHistory[newIndex])
                  }}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button className="h-10" onClick={handleChatSubmit}>
                <Send className="h-5 w-5 mr-1" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Custom Instructions and Categories */}
      {!rightPanelCollapsed && (
        <div className={cn("border-l dark:border-gray-800 flex flex-col", rightPanelMinimized ? "w-12" : "w-80")}>
          <div className="p-4 border-b dark:border-gray-800">
            <CustomInstructionsPanel
              customInstructions={customInstructions}
              activeCategory={activeCategory}
              editingInstructions={editingInstructions}
              handleInstructionsEdit={handleInstructionsEdit}
              handleInstructionsSave={handleInstructionsSave}
              handleInstructionsCancel={handleInstructionsCancel}
              handleCustomInstructionsChange={handleCustomInstructionsChange}
              chatHistory={chatHistory}
              bookmarkedMessages={bookmarkedMessages}
              onRemoveBookmark={handleRemoveBookmark}
              isCollapsed={rightPanelMinimized}
              onToggleCollapse={toggleRightPanelMinimized}
            />
          </div>
        </div>
      )}
    </div>
  )
}

