import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, Settings, BarChart, MessageSquare, Code, Home } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-800">
        <div className="p-4 border-b dark:border-gray-800">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="p-4 space-y-1">
          <AdminNavLink href="/admin" icon={<Home className="mr-2 h-4 w-4" />}>
            Dashboard
          </AdminNavLink>
          <AdminNavLink href="/admin/ai-family" icon={<Users className="mr-2 h-4 w-4" />}>
            AI Family
          </AdminNavLink>
          <AdminNavLink href="/admin/chats" icon={<MessageSquare className="mr-2 h-4 w-4" />}>
            Chats
          </AdminNavLink>
          <AdminNavLink href="/admin/code-snippets" icon={<Code className="mr-2 h-4 w-4" />}>
            Code Snippets
          </AdminNavLink>
          <AdminNavLink href="/admin/analytics" icon={<BarChart className="mr-2 h-4 w-4" />}>
            Analytics
          </AdminNavLink>
          <AdminNavLink href="/admin/settings" icon={<Settings className="mr-2 h-4 w-4" />}>
            Settings
          </AdminNavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b dark:border-gray-800 flex items-center px-6">
          <h2 className="text-lg font-medium">Admin Panel</h2>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

interface AdminNavLinkProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}

function AdminNavLink({ href, icon, children }: AdminNavLinkProps) {
  // In a real app, you would check if the current path matches the href
  const isActive = false

  return (
    <Link href={href} passHref>
      <Button variant="ghost" className={cn("w-full justify-start", isActive && "bg-gray-100 dark:bg-gray-800")}>
        {icon}
        {children}
      </Button>
    </Link>
  )
}

export default AdminLayout

