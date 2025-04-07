"use client"

interface SimpleMarkdownProps {
  content: string
}

export function SimpleMarkdown({ content }: SimpleMarkdownProps) {
  // Convert markdown to HTML (very basic implementation)
  const html = content
    .replace(/\n/g, "<br/>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code class='bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono'>$1</code>")
    .replace(
      /```([^`]+)```/g,
      "<pre class='bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-auto'>$1</pre>",
    )

  return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}

