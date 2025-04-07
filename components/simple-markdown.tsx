"use client"
import { cn } from "@/lib/utils"

interface SimpleMarkdownProps {
  content: string
  className?: string
}

export function SimpleMarkdown({ content, className }: SimpleMarkdownProps) {
  // Process the markdown content
  const processedContent = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-5 mb-3">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    // Code blocks
    .replace(
      /```([\s\S]*?)```/gim,
      '<pre class="bg-gray-800 text-gray-100 p-2 rounded my-2 overflow-x-auto"><code>$1</code></pre>',
    )
    // Inline code
    .replace(/`(.*?)`/gim, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</code>')
    // Lists
    .replace(/^\s*-\s(.*$)/gim, '<li class="ml-4">$1</li>')
    // Links
    .replace(
      /\[([^\]]+)\]$$([^)]+)$$/gim,
      '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    // Paragraphs
    .replace(/^\s*(\n)?([^\n]+)/gim, (match, newline, content) => (newline ? `<p class="mb-2">${content}</p>` : match))
    // Line breaks
    .replace(/\n/gim, "<br />")

  return <div className={cn("markdown-content", className)} dangerouslySetInnerHTML={{ __html: processedContent }} />
}

