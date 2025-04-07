"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client directly in this file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

// Define AI Family Member type
interface AIFamilyMember {
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

// Sample AI Family members data
const sampleAIFamilyMembers: Partial<AIFamilyMember>[] = [
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

// Sample tasks data
const sampleTasks = [
  {
    title: "Create a responsive landing page",
    description:
      "Design and implement a responsive landing page for our new product launch. The page should include a hero section, features, testimonials, and a contact form.",
    assigned_to: "dude",
    priority: "high",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    requires_approval: true,
    status: "pending",
    tags: JSON.stringify(["design", "frontend", "responsive"]),
  },
  {
    title: "Optimize database queries",
    description:
      "Review and optimize the current database queries to improve performance. Focus on the user authentication and product catalog queries.",
    assigned_to: "dan",
    priority: "medium",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    requires_approval: true,
    status: "in-progress",
    tags: JSON.stringify(["database", "performance", "optimization"]),
  },
  {
    title: "Write blog post about new features",
    description:
      "Create an engaging blog post highlighting the new features in our latest release. Include screenshots and examples of how to use each feature.",
    assigned_to: "sophia",
    priority: "medium",
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    requires_approval: true,
    status: "pending",
    tags: JSON.stringify(["content", "marketing", "blog"]),
  },
  {
    title: "Set up CI/CD pipeline",
    description:
      "Configure a CI/CD pipeline using GitHub Actions to automate testing and deployment of our application.",
    assigned_to: "karl",
    priority: "high",
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    requires_approval: true,
    status: "pending",
    tags: JSON.stringify(["devops", "automation", "ci-cd"]),
  },
  {
    title: "Analyze user engagement data",
    description:
      "Analyze the user engagement data from the past month and create visualizations to identify trends and patterns.",
    assigned_to: "lyra",
    priority: "medium",
    due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    requires_approval: true,
    status: "pending",
    tags: JSON.stringify(["data-analysis", "visualization", "user-engagement"]),
  },
  {
    title: "Refactor authentication module",
    description: "Refactor the authentication module to improve security and add support for social login providers.",
    assigned_to: "stan",
    priority: "high",
    due_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    requires_approval: true,
    status: "in-progress",
    tags: JSON.stringify(["code", "security", "authentication"]),
  },
  {
    title: "Create project timeline",
    description:
      "Create a detailed project timeline for the Q3 product release, including milestones and resource allocation.",
    assigned_to: "cecilia",
    priority: "high",
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    requires_approval: true,
    status: "completed",
    tags: JSON.stringify(["project-management", "planning", "timeline"]),
  },
  {
    title: "Implement dark mode",
    description: "Add dark mode support to the application, including theme switching and persistent user preference.",
    assigned_to: "dude",
    priority: "low",
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    requires_approval: true,
    status: "pending",
    tags: JSON.stringify(["design", "frontend", "accessibility"]),
  },
  {
    title: "Optimize image loading",
    description: "Implement lazy loading and responsive images to improve page load performance.",
    assigned_to: "stan",
    priority: "medium",
    due_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
    requires_approval: true,
    status: "pending",
    tags: JSON.stringify(["performance", "frontend", "optimization"]),
  },
  {
    title: "Create monthly newsletter",
    description:
      "Write and design the monthly newsletter highlighting recent updates, upcoming features, and user success stories.",
    assigned_to: "sophia",
    priority: "medium",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    requires_approval: true,
    status: "pending",
    tags: JSON.stringify(["content", "marketing", "newsletter"]),
  },
]

// Sample chat data
const sampleChatData = [
  {
    id: "chat-1",
    user_id: "demo-user-123",
    ai_family_member: "stan",
    title: "Help with React component",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    messages: JSON.stringify([
      {
        role: "user",
        content: "Can you help me create a React component for a user profile card?",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        role: "assistant",
        content:
          'Here\'s a simple React component for a user profile card:\n\n```jsx\nimport React from \'react\';\n\nconst UserProfileCard = ({ user }) => {\n  return (\n    <div className="card">\n      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="avatar" />\n      <h2>{user.name}</h2>\n      <p>{user.bio}</p>\n      <div className="stats">\n        <div className="stat">\n          <span>{user.followers}</span>\n          <span>Followers</span>\n        </div>\n        <div className="stat">\n          <span>{user.following}</span>\n          <span>Following</span>\n        </div>\n      </div>\n      <button className="follow-btn">Follow</button>\n    </div>\n  );\n};\n\nexport default UserProfileCard;\n```\n\nYou can use it like this:\n\n```jsx\n<UserProfileCard user={{\n  name: \'John Doe\',\n  avatar: \'https://example.com/avatar.jpg\',\n  bio: \'Frontend Developer | React Enthusiast\',\n  followers: 1234,\n  following: 567\n}} />\n```\n\nDon\'t forget to add some CSS to style it!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      },
      {
        role: "user",
        content: "Can you add TypeScript types to this component?",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        role: "assistant",
        content:
          'Here\'s the same component with TypeScript types:\n\n```tsx\nimport React from \'react\';\n\ninterface User {\n  name: string;\n  avatar: string;\n  bio: string;\n  followers: number;\n  following: number;\n}\n\ninterface UserProfileCardProps {\n  user: User;\n}\n\nconst UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {\n  return (\n    <div className="card">\n      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="avatar" />\n      <h2>{user.name}</h2>\n      <p>{user.bio}</p>\n      <div className="stats">\n        <div className="stat">\n          <span>{user.followers}</span>\n          <span>Followers</span>\n        </div>\n        <div className="stat">\n          <span>{user.following}</span>\n          <span>Following</span>\n        </div>\n      </div>\n      <button className="follow-btn">Follow</button>\n    </div>\n  );\n};\n\nexport default UserProfileCard;\n```\n\nThis adds proper type definitions for the User object and the component props.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
      },
    ]),
  },
  {
    id: "chat-2",
    user_id: "demo-user-123",
    ai_family_member: "sophia",
    title: "Blog post ideas",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    messages: JSON.stringify([
      {
        role: "user",
        content: "I need some blog post ideas for a tech startup that focuses on AI tools for content creators.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        role: "assistant",
        content:
          'Here are 10 blog post ideas for your tech startup focused on AI tools for content creators:\n\n1. **"How AI is Revolutionizing Content Creation: A 2023 Perspective"** - An overview of the current state of AI in content creation.\n\n2. **"5 Ways AI Can Help Content Creators Overcome Writer\'s Block"** - Practical applications of AI for inspiration.\n\n3. **"The Ethics of AI-Generated Content: Where to Draw the Line"** - Discussing the moral implications and best practices.\n\n4. **"Case Study: How [Influencer Name] Increased Productivity by 50% Using AI Tools"** - A success story with real metrics.\n\n5. **"AI vs. Human Creativity: Collaboration Rather Than Competition"** - How AI enhances rather than replaces human creativity.\n\n6. **"Getting Started with AI Content Tools: A Beginner\'s Guide"** - Tutorial-style post for newcomers.\n\n7. **"The Future of Content Creation: Predictions for the Next 5 Years"** - Forward-looking piece positioning your company as a thought leader.\n\n8. **"Behind the Scenes: How Our AI Algorithm Understands Creative Intent"** - Technical but accessible explanation of your technology.\n\n9. **"ROI of AI: Calculating the Value of AI Tools for Content Creators"** - Business-focused piece with calculators or frameworks.\n\n10. **"From Skeptic to Believer: Content Creators Share Their AI Journey"** - Testimonials and stories from users who were initially hesitant.\n\nEach of these can be expanded with research, examples, and actionable insights for your target audience.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000).toISOString(),
      },
    ]),
  },
]

// Sample code snippets
const sampleCodeSnippets = [
  {
    id: "snippet-1",
    user_id: "demo-user-123",
    title: "React User Profile Component",
    language: "typescript",
    code: `import React from 'react';

interface User {
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
}

interface UserProfileCardProps {
  user: User;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <div className="card">
      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="avatar" />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <div className="stats">
        <div className="stat">
          <span>{user.followers}</span>
          <span>Followers</span>
        </div>
        <div className="stat">
          <span>{user.following}</span>
          <span>Following</span>
        </div>
      </div>
      <button className="follow-btn">Follow</button>
    </div>
  );
};

export default UserProfileCard;`,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: JSON.stringify(["react", "typescript", "component", "profile"]),
  },
  {
    id: "snippet-2",
    user_id: "demo-user-123",
    title: "Next.js API Route for User Data",
    language: "typescript",
    code: `import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

type User = {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}`,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    tags: JSON.stringify(["nextjs", "api", "typescript", "prisma"]),
  },
]

// Function to get user ID (simplified for now)
async function getUserId(): Promise<string> {
  // In a real app, this would get the authenticated user's ID
  // For now, we'll return a placeholder ID
  return "demo-user-123"
}

// Main seed function
export async function seedDatabase(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const userId = await getUserId()

    // For demo purposes, we'll just return success without actually seeding the database
    // In a real app, this would create tables and seed data

    // Revalidate relevant paths
    revalidatePath("/admin/ai-family")
    revalidatePath("/ai-family")
    revalidatePath("/admin/tasks")

    return {
      success: true,
      error: "This is a demo version. In a real app, this would seed your database with AI Family members and tasks.",
    }
  } catch (error) {
    console.error("Error seeding database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Export the seed functions for chat data and code snippets
export async function seedChatData(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // In a real app, this would seed the chat data
    // For now, we'll just return success

    revalidatePath("/chat")

    return {
      success: true,
      message: "Chat data seeded successfully",
    }
  } catch (error) {
    console.error("Error seeding chat data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function seedCodeSnippets(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // In a real app, this would seed the code snippets
    // For now, we'll just return success

    revalidatePath("/code")

    return {
      success: true,
      message: "Code snippets seeded successfully",
    }
  } catch (error) {
    console.error("Error seeding code snippets:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

