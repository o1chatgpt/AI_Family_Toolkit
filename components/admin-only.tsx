"use client"

import { useAdmin } from "@/contexts/admin-context"
import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"

interface AdminOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AdminOnly({ children, fallback }: AdminOnlyProps) {
  const { isAdmin } = useAdmin()

  if (!isAdmin) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="p-4 border rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <p>This content is only available to administrators.</p>
      </div>
    )
  }

  return <>{children}</>
}

