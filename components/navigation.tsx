"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { AdminToggle } from "@/components/admin-toggle"
import {
  Home,
  FileText,
  Code,
  Image,
  MessageSquare,
  Users,
  Presentation,
  Settings,
  BarChart,
  Calendar,
  CheckSquare,
  Volume2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AI_FAMILY_MEMBERS } from "@/data/ai-family-members"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  {
    name: "AI Family",
    href: "/ai-family",
    icon: Users,
    children: [
      { name: "Dashboard", href: "/ai-family/dashboard", icon: BarChart },
      { name: "All Tasks", href: "/ai-family/tasks", icon: CheckSquare },
      { name: "Schedule", href: "/ai-family/schedule", icon: Calendar },
      { name: "Settings", href: "/ai-family/settings", icon: Settings },
      { type: "separator" },
      ...AI_FAMILY_MEMBERS.map((member) => ({
        name: member.name,
        href: `/ai-family/${member.id}`,
        icon: Users,
      })),
    ],
  },
  { name: "Files", href: "/files", icon: FileText },
  { name: "Code", href: "/code", icon: Code },
  { name: "Images", href: "/images", icon: Image },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Presentations", href: "/presentations", icon: Presentation },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span className="font-bold">AI Family</span>
          </Link>
        </div>
        <nav className="flex-1 flex items-center space-x-1 md:space-x-2">
          {navItems.map((item) =>
            item.children ? (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-8",
                      pathname.startsWith(item.href) ? "bg-muted" : "hover:bg-transparent hover:underline",
                      "justify-start",
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>AI Family</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {item.children.map((child, index) =>
                    child.type === "separator" ? (
                      <DropdownMenuSeparator key={`sep-${index}`} />
                    ) : (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link href={child.href} className="flex items-center w-full">
                          <child.icon className="h-4 w-4 mr-2" />
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-8",
                  pathname === item.href ? "bg-muted" : "hover:bg-transparent hover:underline",
                  "justify-start",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              </Button>
            ),
          )}
          <Link href="/voice-chat" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
            <Volume2 className="h-4 w-4" />
            <span>Voice Chat</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-2">
          <AdminToggle />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

