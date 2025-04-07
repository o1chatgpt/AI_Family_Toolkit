"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Bell, Search, Menu, Moon, Sun, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/custom-theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TopNavigationProps {
  onMenuToggle: () => void
}

export function TopNavigation({ onMenuToggle }: TopNavigationProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <div className="h-16 border-b flex items-center justify-between px-4 bg-background">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg">
            AI Family Toolkit
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/ai-family"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/ai-family" || pathname.startsWith("/ai-family/")
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              AI Family
            </Link>
            <Link
              href="/settings"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/settings" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 w-full max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full pl-8 bg-background" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

