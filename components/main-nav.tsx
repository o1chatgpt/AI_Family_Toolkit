"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "AI Family", href: "/ai-family" },
  { name: "Image Generation", href: "/ai-family/image-generation" },
  { name: "Files", href: "/files" },
  { name: "Code", href: "/code" },
  { name: "Workflow", href: "/workflow" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href || pathname.startsWith(`${item.href}/`) ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

