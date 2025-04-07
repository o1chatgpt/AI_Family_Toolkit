"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  description?: string
}

interface CollapsibleCategoriesProps {
  categories: Category[]
  onSelectCategory: (category: Category) => void
  activeCategory?: string
}

export function CollapsibleCategories({ categories, onSelectCategory, activeCategory }: CollapsibleCategoriesProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="space-y-2">
      <div
        className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-medium flex items-center gap-2">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          Categories
        </h3>
        <span className="text-xs text-gray-500">{categories.length}</span>
      </div>

      <div
        className={cn(
          "space-y-1 transition-all duration-300 overflow-hidden",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer",
              activeCategory === category.id
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
            )}
            onClick={() => onSelectCategory(category)}
          >
            {category.icon}
            <div className="flex flex-col">
              <span className="font-medium">{category.name}</span>
              {category.description && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{category.description}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

