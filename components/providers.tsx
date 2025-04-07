"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AdminProvider, useAdmin } from "../contexts/admin-context"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AdminProvider>{children}</AdminProvider>
    </ThemeProvider>
  )
}

export { AdminProvider, useAdmin }

