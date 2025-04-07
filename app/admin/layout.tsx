"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated) {
      router.push("/login")
    } else if (!isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Admin content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

