"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart,
  FileText,
  Home,
  Image,
  LayoutDashboard,
  MessageSquare,
  PenTool,
  Plus,
  Settings,
  Upload,
  Users,
  Video,
  Presentation,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-provider"
import { AI_FAMILY_MEMBERS } from "@/types/ai-family"
// Add the import for AIFamilySidebar
import { AIFamilySidebar } from "@/components/ai-family-sidebar"

// Define the sidebar links
const sidebarLinks = [
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
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "AI Family",
    icon: Sparkles,
    items: [
      {
        title: "Overview",
        href: "/ai-family",
        icon: Users,
      },
      {
        title: "Chat",
        href: "/chat",
        icon: MessageSquare,
      },
      ...AI_FAMILY_MEMBERS.map((member) => ({
        title: member.name,
        href: `/chat?ai=${member.id}`,
        icon: () => <div className={`w-2 h-2 rounded-full bg-${member.color}-400`} />,
      })),
    ],
  },
]

// Define the AI Family links
const aiFamilyLinks = [
  {
    title: "Stan - Strategy",
    href: "/ai-family/stan",
    icon: LayoutDashboard,
  },
  {
    title: "Wendy - Writing",
    href: "/ai-family/wendy",
    icon: FileText,
  },
  {
    title: "Desi - Design",
    href: "/ai-family/desi",
    icon: PenTool,
  },
  {
    title: "Cody - Code",
    href: "/ai-family/cody",
    icon: FileText,
  },
  {
    title: "Mia - Marketing",
    href: "/ai-family/mia",
    icon: BarChart,
  },
  {
    title: "Tina - Training",
    href: "/ai-family/tina",
    icon: Users,
  },
  {
    title: "All AI Family",
    href: "/ai-family",
    icon: Sparkles,
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  return (
    <div className={cn("h-full w-full px-2 py-6", className)} {...props}>
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-1 p-2">
          {sidebarLinks.map((link) => {
            if (link.items) {
              return (
                <div key={link.title}>
                  <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight">{link.title}</h3>
                  {link.items.map((item: any) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.href}
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full justify-start",
                          pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                        )}
                        asChild
                      >
                        <Link href={item.href}>
                          {typeof Icon === "function" ? (
                            <Icon className="mr-2 h-4 w-4" />
                          ) : (
                            <Icon className="mr-2 h-4 w-4" />
                          )}
                          {item.title}
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              )
            }
            const Icon = link.icon
            return (
              <Button
                key={link.href}
                variant={pathname === link.href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  pathname === link.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                )}
                asChild
              >
                <Link href={link.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {link.title}
                </Link>
              </Button>
            )
          })}
        </div>

        {isAuthenticated && (
          <>
            <Separator className="my-4" />
            <h2 className="mb-2 px-6 text-lg font-semibold tracking-tight">AI Family</h2>
            <div className="py-2">
              <AIFamilySidebar />
            </div>

            <Separator className="my-2" />
            <div className="space-y-1 p-2">
              {aiFamilyLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Button
                    key={link.href}
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      pathname === link.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                    )}
                    asChild
                  >
                    <Link href={link.href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {link.title}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  )
}

