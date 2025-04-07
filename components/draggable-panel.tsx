"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DraggablePanelProps {
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  position?: "left" | "right"
  className?: string
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export function DraggablePanel({
  children,
  defaultWidth = 320,
  minWidth = 240,
  maxWidth = 480,
  position = "right",
  className,
  isOpen = true,
  onOpenChange,
}: DraggablePanelProps) {
  const [width, setWidth] = useState(defaultWidth)
  const [isDragging, setIsDragging] = useState(false)
  const [internalOpen, setInternalOpen] = useState(isOpen)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)

  // Sync internal open state with prop
  useEffect(() => {
    setInternalOpen(isOpen)
  }, [isOpen])

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)

    const startX = e.clientX
    const startWidth = width

    const handleDrag = (e: MouseEvent) => {
      if (!isDragging) return

      let newWidth
      if (position === "right") {
        newWidth = startWidth - (e.clientX - startX)
      } else {
        newWidth = startWidth + (e.clientX - startX)
      }

      // Clamp width between min and max
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      setWidth(newWidth)
    }

    const handleDragEnd = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleDrag)
      document.removeEventListener("mouseup", handleDragEnd)
    }

    document.addEventListener("mousemove", handleDrag)
    document.addEventListener("mouseup", handleDragEnd)
  }

  // Toggle panel open/closed
  const togglePanel = () => {
    const newOpenState = !internalOpen
    setInternalOpen(newOpenState)
    onOpenChange?.(newOpenState)
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed top-16 bottom-0 bg-background border-l z-30 transition-transform duration-300 ease-in-out",
        position === "right" ? "right-0 border-l" : "left-0 border-r",
        !internalOpen && (position === "right" ? "translate-x-full" : "-translate-x-full"),
        isDragging && "select-none",
        className,
      )}
      style={{ width: `${width}px` }}
    >
      {/* Drag handle */}
      <div
        ref={dragHandleRef}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-1 h-16 cursor-ew-resize hover:bg-primary/20 group",
          position === "right" ? "-left-0.5" : "-right-0.5",
        )}
        onMouseDown={handleDragStart}
      >
        <div className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100" />
      </div>

      {/* Toggle button */}
      <button
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-6 h-24 bg-background border rounded-md flex items-center justify-center",
          position === "right" ? "-left-3 border-l-0 rounded-l-none" : "-right-3 border-r-0 rounded-r-none",
        )}
        onClick={togglePanel}
      >
        <div
          className={cn("w-1 h-8 flex flex-col justify-between", position === "right" ? "items-start" : "items-end")}
        >
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
        </div>
      </button>

      {/* Panel content */}
      <div className="h-full overflow-auto">{children}</div>
    </div>
  )
}

