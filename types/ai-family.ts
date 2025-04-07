export interface AIFamilyMember {
  id: string
  name: string
  specialty: string
  description: string
  avatarUrl: string
  color: string
  model: string
  fallbackModel: string
  capabilities: string[]
  systemPrompt: string
  isActive: boolean
}

// Default AI Family members
export const AI_FAMILY_MEMBERS: AIFamilyMember[] = [
  {
    id: "stan",
    name: "Stan",
    specialty: "General Assistant",
    description:
      "Stan is a versatile AI assistant capable of handling a wide range of tasks with efficiency and precision.",
    avatarUrl: "",
    color: "blue",
    model: "gpt-4o-mini-2024-07-18",
    fallbackModel: "gpt-3.5-turbo-0125",
    capabilities: [
      "Answering general knowledge questions",
      "Providing step-by-step guidance",
      "Assisting with research and information gathering",
      "Offering creative suggestions and ideas",
    ],
    systemPrompt: "",
    isActive: true,
  },
  {
    id: "dan",
    name: "Dan",
    specialty: "Development",
    description:
      "Dan specializes in software development, coding, and technical problem-solving across multiple programming languages.",
    avatarUrl: "",
    color: "green",
    model: "gpt-4o-mini-2024-07-18",
    fallbackModel: "gpt-3.5-turbo-0125",
    capabilities: [
      "Writing and debugging code in multiple languages",
      "Explaining technical concepts",
      "Designing software architecture",
      "Troubleshooting development issues",
    ],
    systemPrompt: "",
    isActive: true,
  },
  {
    id: "dude",
    name: "Dude",
    specialty: "Casual Conversation",
    description: "Dude is your laid-back conversation partner, perfect for casual chats and friendly discussions.",
    avatarUrl: "",
    color: "amber",
    model: "gpt-3.5-turbo-0125",
    fallbackModel: "gpt-3.5-turbo-0125",
    capabilities: [
      "Engaging in casual conversations",
      "Discussing pop culture and trends",
      "Providing relaxed, friendly responses",
      "Offering informal advice and suggestions",
    ],
    systemPrompt: "",
    isActive: true,
  },
  {
    id: "karl",
    name: "Karl",
    specialty: "Knowledge Management",
    description:
      "Karl excels at organizing information, creating knowledge bases, and helping with research and documentation.",
    avatarUrl: "",
    color: "purple",
    model: "gpt-4o-mini-2024-07-18",
    fallbackModel: "gpt-3.5-turbo-0125",
    capabilities: [
      "Organizing complex information",
      "Creating structured documentation",
      "Conducting thorough research",
      "Summarizing lengthy content",
    ],
    systemPrompt: "",
    isActive: true,
  },
  {
    id: "lyra",
    name: "Lyra",
    specialty: "Creative Writing",
    description:
      "Lyra is a creative writing specialist who can help with storytelling, poetry, and various forms of creative content.",
    avatarUrl: "",
    color: "pink",
    model: "gpt-4o-mini-2024-07-18",
    fallbackModel: "gpt-3.5-turbo-0125",
    capabilities: [
      "Crafting engaging stories and narratives",
      "Writing poetry and creative prose",
      "Developing characters and plotlines",
      "Providing creative writing feedback",
    ],
    systemPrompt: "",
    isActive: true,
  },
  {
    id: "kara",
    name: "Kara",
    specialty: "Data Analysis",
    description: "Kara specializes in data analysis, visualization, and helping you make sense of complex datasets.",
    avatarUrl: "",
    color: "cyan",
    model: "gpt-4o-mini-2024-07-18",
    fallbackModel: "gpt-3.5-turbo-0125",
    capabilities: [
      "Analyzing and interpreting data",
      "Creating data visualizations",
      "Identifying patterns and trends",
      "Providing statistical insights",
    ],
    systemPrompt: "",
    isActive: true,
  },
  {
    id: "sophia",
    name: "Sophia",
    specialty: "Education",
    description:
      "Sophia is an education specialist who excels at explaining complex concepts and creating learning materials.",
    avatarUrl: "",
    color: "indigo",
    model: "gpt-4o-mini-2024-07-18",
    fallbackModel: "gpt-3.5-turbo-0125",
    capabilities: [
      "Explaining complex topics simply",
      "Creating educational content",
      "Designing learning exercises",
      "Answering academic questions",
    ],
    systemPrompt: "",
    isActive: true,
  },
  {
    id: "cecelia",
    name: "Cecelia",
    specialty: "Content Creation",
    description: "Cecelia specializes in content creation, marketing copy, and helping you craft compelling messages.",
    avatarUrl: "",
    color: "orange",
    model: "gpt-4o-mini-2024-07-18",
    fallbackModel: "gpt-3.5-turbo-0125",
    capabilities: [
      "Writing marketing and promotional content",
      "Crafting engaging social media posts",
      "Creating blog articles and web content",
      "Developing brand messaging",
    ],
    systemPrompt: "",
    isActive: true,
  },
  {
    id: "andie",
    name: "Andie",
    specialty: "Design Assistance",
    description: "Andie helps with design concepts, UI/UX suggestions, and visual creative direction.",
    avatarUrl: "",
    color: "red",
    model: "gpt-4o-mini-2024-07-18",
    fallbackModel: "gpt-3.5-turbo-0125",
    capabilities: [
      "Providing UI/UX design suggestions",
      "Offering color palette recommendations",
      "Describing layout and visual concepts",
      "Giving feedback on design work",
    ],
    systemPrompt: "",
    isActive: true,
  },
  {
    id: "mistress",
    name: "Mistress",
    specialty: "Project Management",
    description: "Mistress excels at project management, organization, and helping you stay on track with your goals.",
    avatarUrl: "",
    color: "slate",
    model: "gpt-4o-mini-2024-07-18",
    fallbackModel: "gpt-3.5-turbo-0125",
    capabilities: [
      "Creating project plans and timelines",
      "Tracking tasks and milestones",
      "Facilitating team coordination",
      "Managing resources and priorities",
    ],
    systemPrompt: "",
    isActive: true,
  },
]

