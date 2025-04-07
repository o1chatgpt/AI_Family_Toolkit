export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  isAdmin?: boolean
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme?: "light" | "dark" | "system"
  fontSize?: number
  defaultAIFamily?: string
  notifications?: boolean
  language?: string
}

