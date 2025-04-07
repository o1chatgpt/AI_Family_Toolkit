import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./client"
import { AdminProvider } from "@/contexts/admin-context"

export const metadata: Metadata = {
  title: "AI Family",
  description: "Your intelligent AI assistant family for various tasks",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AdminProvider>
          <ClientLayout children={children} />
        </AdminProvider>
      </body>
    </html>
  )
}



import './globals.css'