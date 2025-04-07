"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
  Upload,
  MessageSquare,
  Image,
  BarChart,
  Video,
  Presentation,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define the primary navigation items for the sidebar
const primaryNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Create",
    href: "/create",
    icon: Plus,
  },
  {
    title: "Upload",
    href: "/upload",
    icon: Upload,
  },
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Image",
    href: "/image",
    icon: Image,
  },
]

// Define the secondary navigation items for the sidebar
const secondaryNavItems = [
  {
    title: "Presentations",
    href: "/presentations",
    icon: Presentation,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
  },
  {
    title: "Demos",
    href: "/demos",
    icon: Video,
  },
  {
    title: "Case Studies",
    href: "/case-studies",
    icon: BookOpen,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: Briefcase,
  },
  {
    title: "Training",
    href: "/training",
    icon: GraduationCap,
  },
]

interface DockableSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function DockableSidebar({ collapsed, onToggle }: DockableSidebarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={cn(
        "h-full border-r transition-all duration-300 ease-in-out bg-background",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && <span className="text-lg font-semibold">AI Family</span>}
        <Button variant="ghost" size="icon" onClick={onToggle} className="ml-auto">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className={cn("mb-2 px-4 text-xs font-semibold tracking-tight", collapsed && "sr-only")}>
              Main Navigation
            </h2>
            <div className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon
                return collapsed ? (
                  <TooltipProvider key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-md",
                            pathname === item.href
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="sr-only">{item.title}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="px-3 py-2">
            <h2 className={cn("mb-2 px-4 text-xs font-semibold tracking-tight", collapsed && "sr-only")}>
              Content Management
            </h2>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon
                return collapsed ? (
                  <TooltipProvider key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-md",
                            pathname === item.href
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="sr-only">{item.title}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="px-3 py-2">
            <div className="space-y-1">
              {collapsed ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/ai-family"
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-md",
                          pathname === "/ai-family"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Sparkles className="h-5 w-5" />
                        <span className="sr-only">AI Family</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">AI Family</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Link
                  href="/ai-family"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    pathname === "/ai-family"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Sparkles className="h-5 w-5" />
                  AI Family
                </Link>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

