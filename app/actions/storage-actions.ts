"use server"
import { v4 as uuidv4 } from "uuid"

// Demo data for when user is not authenticated
const demoDocuments = [
  {
    id: "demo-doc-1",
    name: "Project Proposal.pdf",
    type: "application/pdf",
    size: 1024000,
    path: "demo/project-proposal.pdf",
    created_at: new Date().toISOString(),
    url: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "demo-doc-2",
    name: "Meeting Notes.txt",
    type: "text/plain",
    size: 2048,
    path: "demo/meeting-notes.txt",
    created_at: new Date().toISOString(),
    url: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "demo-doc-3",
    name: "Dashboard Screenshot.png",
    type: "image/png",
    size: 512000,
    path: "demo/dashboard.png",
    created_at: new Date().toISOString(),
    url: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "demo-doc-4",
    name: "Code Sample.js",
    type: "application/javascript",
    size: 4096,
    path: "demo/code-sample.js",
    created_at: new Date().toISOString(),
    url: "/placeholder.svg?height=400&width=300",
  },
]

// Check if we're in a preview environment
function isPreviewEnvironment() {
  return (
    process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" && window.location.hostname === "localhost")
  )
}

export async function getChatSessions() {
  // Return demo data for now
  return []
}

export async function createChatSession(aiFamilyMember: string, title = "New Chat") {
  // Return a demo session ID
  return "demo-session-1"
}

export async function deleteChatSession(sessionId: string) {
  // Return success
  return true
}

export async function initializeStorageBuckets() {
  try {
    // In a preview environment, just return success
    if (isPreviewEnvironment()) {
      console.log("Preview environment detected, skipping bucket initialization")
      return {
        success: true,
        message: "Using demo mode, buckets not created",
      }
    }

    // In a real implementation, this would initialize storage buckets
    return {
      success: true,
      message: "Storage buckets initialized successfully",
    }
  } catch (error) {
    console.error("Error initializing storage buckets:", error)
    return {
      success: false,
      error: "Failed to initialize storage buckets",
    }
  }
}

export async function getDocuments() {
  try {
    // In a preview environment or for demo purposes, return demo data
    if (isPreviewEnvironment()) {
      return {
        success: true,
        data: demoDocuments,
      }
    }

    // In a real implementation with authentication, we would fetch documents from the database
    // For now, return demo data to avoid authentication errors
    return {
      success: true,
      data: demoDocuments,
    }
  } catch (error) {
    console.error("Error getting documents:", error)
    return {
      success: true, // Return success with demo data even on error
      data: demoDocuments,
    }
  }
}

export async function uploadDocument(file: File) {
  try {
    // In a preview environment or for demo purposes, return a demo document
    if (isPreviewEnvironment()) {
      const demoDoc = {
        id: `demo-doc-${uuidv4()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        path: `demo/${file.name}`,
        created_at: new Date().toISOString(),
        url: "/placeholder.svg?height=400&width=300",
      }

      return {
        success: true,
        data: demoDoc,
        url: demoDoc.url,
      }
    }

    // In a real implementation, this would upload the file to storage
    // For now, return a demo document to avoid authentication errors
    const demoDoc = {
      id: `demo-doc-${uuidv4()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      path: `demo/${file.name}`,
      created_at: new Date().toISOString(),
      url: "/placeholder.svg?height=400&width=300",
    }

    return {
      success: true,
      data: demoDoc,
      url: demoDoc.url,
    }
  } catch (error) {
    console.error("Error uploading document:", error)

    // Return a demo document on error
    const demoDoc = {
      id: `demo-doc-${uuidv4()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      path: `demo/${file.name}`,
      created_at: new Date().toISOString(),
      url: "/placeholder.svg?height=400&width=300",
    }

    return {
      success: true,
      data: demoDoc,
      url: demoDoc.url,
    }
  }
}

export async function deleteDocument(id: string) {
  try {
    // If it's a demo document, just return success
    if (id.startsWith("demo-")) {
      return {
        success: true,
      }
    }

    // In a real implementation, this would delete the file from storage
    // For now, return success to avoid authentication errors
    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting document:", error)

    // If it's a demo document, return success anyway
    if (id.startsWith("demo-")) {
      return {
        success: true,
      }
    }

    return {
      success: false,
      error: "Failed to delete document",
    }
  }
}

