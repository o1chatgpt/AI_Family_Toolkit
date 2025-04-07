"use client"

import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { Shield, ShieldOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AdminToggle() {
  const { isAdmin, toggleAdmin } = useAdmin()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleAdmin} className={isAdmin ? "text-amber-500" : ""}>
            {isAdmin ? <Shield className="h-5 w-5" /> : <ShieldOff className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isAdmin ? "Administrator Mode (Click to disable)" : "User Mode (Click to enable admin)"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

