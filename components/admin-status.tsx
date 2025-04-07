"use client"

import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { Shield, ShieldOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AdminStatus() {
  const { isAdmin, toggleAdmin } = useAdmin()

  return (
    <div className="flex items-center gap-2">
      {isAdmin ? (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300">
          <Shield className="h-3 w-3 mr-1" />
          Administrator Mode
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-300">
          <ShieldOff className="h-3 w-3 mr-1" />
          User Mode
        </Badge>
      )}
      <Button variant="ghost" size="sm" onClick={toggleAdmin}>
        {isAdmin ? "Switch to User Mode" : "Switch to Admin Mode"}
      </Button>
    </div>
  )
}

