"use client"

import type React from "react"

import { Providers } from "@/components/providers"
import { TopNavigation } from "@/components/top-navigation"
import { DockableSidebar } from "@/components/dockable-sidebar"
import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { DebugFooterPanel } from "@/components/debug-footer-panel"
import { QuickAccessPanel } from "@/components/quick-access-panel"
import { useToast } from "@/components/ui/use-toast"
import { StorageInitializer } from "@/components/storage-initializer"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 1024px)")
  const { toast } = useToast()

  useEffect(() => {
    // Check for saved sidebar state in localStorage
    const savedSidebarState = localStorage.getItem("sidebar:state")
    if (savedSidebarState) {
      setIsSidebarOpen(savedSidebarState === "expanded")
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigation onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <DockableSidebar collapsed={!isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <Providers>
            <div className="flex flex-col h-full">
              <div className="flex-1">{children}</div>
              <QuickAccessPanel />
              <DebugFooterPanel />
            </div>
          </Providers>
        </main>
      </div>
      <StorageInitializer />
    </div>
  )
}

