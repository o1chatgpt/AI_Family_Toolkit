"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AdminContextType = {
  isAdmin: boolean
  setAdmin: (value: boolean) => void
  toggleAdmin: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  // Initialize with default value for server-side rendering
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Only access localStorage on the client side
    const storedAdminState = localStorage.getItem("isAdmin")
    if (storedAdminState === "true") {
      setIsAdmin(true)
    }
  }, [])

  const setAdmin = (value: boolean) => {
    setIsAdmin(value)
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      localStorage.setItem("isAdmin", value.toString())
    }
  }

  const toggleAdmin = () => {
    const newValue = !isAdmin
    setIsAdmin(newValue)
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      localStorage.setItem("isAdmin", newValue.toString())
    }
  }

  return <AdminContext.Provider value={{ isAdmin, setAdmin, toggleAdmin }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}

