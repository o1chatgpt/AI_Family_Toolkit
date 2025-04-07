"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Play,
  Save,
  Share2,
  Download,
  Trash2,
  RefreshCw,
  Code,
  FileText,
  Settings,
  Users,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  Sparkles,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useApiConnection } from "@/components/api-connection-manager"
import { aiFamilyMembers } from "@/constants/ai-family"

// Define the code snippet type
interface CodeSnippet {
  id: string
  title: string
  description: string
  html: string
  css: string
  js: string
  createdAt: Date
  updatedAt: Date
  aiFamily?: string
  tags: string[]
}

// Define the task type
interface CodeTask {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  assignedTo: string
  createdAt: Date
  updatedAt: Date
  codeSnippetId?: string
}

export function CodeEditor() {
  // State for code content
  const [htmlCode, setHtmlCode] = useState<string>(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Code</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Start coding here...</p>
</body>
</html>`)
  const [cssCode, setCssCode] = useState<string>(`body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

h1 {
  color: #333;
}

p {
  color: #666;
}`)
  const [jsCode, setJsCode] = useState<string>(`// JavaScript code goes here
document.addEventListener('DOMContentLoaded', function() {
  console.log('Document loaded!');
  
  // Example: Change text color on click
  document.querySelector('h1').addEventListener('click', function() {
    this.style.color = '#' + Math.floor(Math.random()*16777215).toString(16);
  });
});`)

  // State for editor settings
  const [activeTab, setActiveTab] = useState<string>("html")
  const [autoRun, setAutoRun] = useState<boolean>(false)
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<number>(14)
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true)
  const [layout, setLayout] = useState<"horizontal" | "vertical">("horizontal")
  const [previewVisible, setPreviewVisible] = useState<boolean>(true)
  const [previewSize, setPreviewSize] = useState<"small" | "medium" | "large">("medium")
  const [selectedAIFamily, setSelectedAIFamily] = useState<string>("stan")

  // State for saved snippets and tasks
  const [savedSnippets, setSavedSnippets] = useState<CodeSnippet[]>([])
  const [codeTasks, setCodeTasks] = useState<CodeTask[]>([])
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null)
  const [snippetTitle, setSnippetTitle] = useState<string>("Untitled Snippet")
  const [snippetDescription, setSnippetDescription] = useState<string>("")
  const [snippetTags, setSnippetTags] = useState<string>("")

  // State for AI assistance
  const [aiPrompt, setAiPrompt] = useState<string>("")
  const [aiResponse, setAiResponse] = useState<string>("")
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false)
  const [aiHistory, setAiHistory] = useState<Array<{ prompt: string; response: string }>>([])

  // State for UI
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [showAiPanel, setShowAiPanel] = useState<boolean>(false)
  const [showTaskPanel, setShowTaskPanel] = useState<boolean>(false)
  const [showSnippetsPanel, setShowSnippetsPanel] = useState<boolean>(false)

  // Refs
  const previewIframeRef = useRef<HTMLIFrameElement>(null)
  const { apiKey, connectionStatus } = useApiConnection()

  // Effect to update preview
  useEffect(() => {
    if (autoRun) {
      updatePreview()
    }
  }, [htmlCode, cssCode, jsCode, autoRun])

  // Load saved snippets from localStorage on mount
  useEffect(() => {
    const savedSnippetsJson = localStorage.getItem("code_snippets")
    if (savedSnippetsJson) {
      try {
        const parsedSnippets = JSON.parse(savedSnippetsJson)
        setSavedSnippets(
          parsedSnippets.map((snippet: any) => ({
            ...snippet,
            createdAt: new Date(snippet.createdAt),
            updatedAt: new Date(snippet.updatedAt),
          })),
        )
      } catch (error) {
        console.error("Error loading saved snippets:", error)
      }
    }

    const savedTasksJson = localStorage.getItem("code_tasks")
    if (savedTasksJson) {
      try {
        const parsedTasks = JSON.parse(savedTasksJson)
        setCodeTasks(
          parsedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
          })),
        )
      } catch (error) {
        console.error("Error loading saved tasks:", error)
      }
    }
  }, [])

  // Function to update the preview
  const updatePreview = () => {
    if (previewIframeRef.current) {
      const iframe = previewIframeRef.current
      const document = iframe.contentDocument

      if (document) {
        document.open()
        document.write(`
          ${htmlCode}
          <style>${cssCode}</style>
          <script>${jsCode}</script>
        `)
        document.close()
      }
    }
  }

  // Function to run the code
  const runCode = () => {
    updatePreview()
  }

  // Function to save the current snippet
  const saveSnippet = () => {
    const now = new Date()
    const newSnippet: CodeSnippet = {
      id: currentSnippet?.id || `snippet_${Date.now()}`,
      title: snippetTitle || "Untitled Snippet",
      description: snippetDescription,
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      createdAt: currentSnippet?.createdAt || now,
      updatedAt: now,
      aiFamily: selectedAIFamily,
      tags: snippetTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    }

    if (currentSnippet) {
      // Update existing snippet
      setSavedSnippets((prev) => prev.map((s) => (s.id === currentSnippet.id ? newSnippet : s)))
    } else {
      // Add new snippet
      setSavedSnippets((prev) => [...prev, newSnippet])
    }

    setCurrentSnippet(newSnippet)

    // Save to localStorage
    localStorage.setItem(
      "code_snippets",
      JSON.stringify([...savedSnippets.filter((s) => s.id !== newSnippet.id), newSnippet]),
    )

    // Show success message
    alert("Snippet saved successfully!")
  }

  // Function to load a snippet
  const loadSnippet = (snippet: CodeSnippet) => {
    setHtmlCode(snippet.html)
    setCssCode(snippet.css)
    setJsCode(snippet.js)
    setSnippetTitle(snippet.title)
    setSnippetDescription(snippet.description)
    setSnippetTags(snippet.tags.join(", "))
    setCurrentSnippet(snippet)
    setSelectedAIFamily(snippet.aiFamily || "stan")

    if (autoRun) {
      updatePreview()
    }
  }

  // Function to create a new snippet
  const createNewSnippet = () => {
    setHtmlCode(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Code</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Start coding here...</p>
</body>
</html>`)
    setCssCode(`body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

h1 {
  color: #333;
}

p {
  color: #666;
}`)
    setJsCode(`// JavaScript code goes here
document.addEventListener('DOMContentLoaded', function() {
  console.log('Document loaded!');
  
  // Example: Change text color on click
  document.querySelector('h1').addEventListener('click', function() {
    this.style.color = '#' + Math.floor(Math.random()*16777215).toString(16);
  });
});`)
    setSnippetTitle("Untitled Snippet")
    setSnippetDescription("")
    setSnippetTags("")
    setCurrentSnippet(null)

    if (autoRun) {
      updatePreview()
    }
  }

  // Function to delete a snippet
  const deleteSnippet = (snippetId: string) => {
    if (confirm("Are you sure you want to delete this snippet?")) {
      setSavedSnippets((prev) => prev.filter((s) => s.id !== snippetId))

      // Update localStorage
      localStorage.setItem("code_snippets", JSON.stringify(savedSnippets.filter((s) => s.id !== snippetId)))

      // If the current snippet is deleted, create a new one
      if (currentSnippet && currentSnippet.id === snippetId) {
        createNewSnippet()
      }
    }
  }

  // Function to create a new task
  const createTask = () => {
    const newTask: CodeTask = {
      id: `task_${Date.now()}`,
      title: "New Code Task",
      description: "Describe the task here...",
      status: "pending",
      assignedTo: selectedAIFamily,
      createdAt: new Date(),
      updatedAt: new Date(),
      codeSnippetId: currentSnippet?.id,
    }

    setCodeTasks((prev) => [...prev, newTask])

    // Save to localStorage
    localStorage.setItem("code_tasks", JSON.stringify([...codeTasks, newTask]))
  }

  // Function to update a task
  const updateTask = (taskId: string, updates: Partial<CodeTask>) => {
    setCodeTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, ...updates, updatedAt: new Date() }
          return updatedTask
        }
        return task
      }),
    )

    // Update localStorage
    localStorage.setItem(
      "code_tasks",
      JSON.stringify(
        codeTasks.map((task) => (task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task)),
      ),
    )
  }

  // Function to delete a task
  const deleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setCodeTasks((prev) => prev.filter((task) => task.id !== taskId))

      // Update localStorage
      localStorage.setItem("code_tasks", JSON.stringify(codeTasks.filter((task) => task.id !== taskId)))
    }
  }

  // Function to get AI assistance
  const getAiAssistance = async () => {
    if (!apiKey || connectionStatus !== "connected" || !aiPrompt.trim()) {
      alert("Please connect your API key and enter a prompt.")
      return
    }

    setIsAiThinking(true)

    try {
      // Get the selected AI family member
      const aiMember = aiFamilyMembers.find((member) => member.id === selectedAIFamily) || aiFamilyMembers[0]

      // Prepare the context with the current code
      const context = `
HTML Code:
\`\`\`html
${htmlCode}
\`\`\`

CSS Code:
\`\`\`css
${cssCode}
\`\`\`

JavaScript Code:
\`\`\`javascript
${jsCode}
\`\`\`

User prompt: ${aiPrompt}
      `

      // Make API call to OpenAI
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are ${aiMember.name}, an AI assistant specializing in code. ${aiMember.description}. 
                        Provide helpful, concise code suggestions and explanations.`,
            },
            { role: "user", content: context },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      const aiResponseText = data.choices[0].message.content

      setAiResponse(aiResponseText)
      setAiHistory((prev) => [...prev, { prompt: aiPrompt, response: aiResponseText }])
      setAiPrompt("")
    } catch (error) {
      console.error("Error getting AI assistance:", error)
      setAiResponse("Sorry, I encountered an error while processing your request. Please try again.")
    } finally {
      setIsAiThinking(false)
    }
  }

  // Function to apply AI suggestion to code
  const applyAiSuggestion = (suggestion: string) => {
    // Extract code blocks from the AI response
    const htmlMatch = suggestion.match(/```html\n([\s\S]*?)\n```/)
    const cssMatch = suggestion.match(/```css\n([\s\S]*?)\n```/)
    const jsMatch = suggestion.match(/```javascript\n([\s\S]*?)\n```/) || suggestion.match(/```js\n([\s\S]*?)\n```/)

    if (htmlMatch && htmlMatch[1]) {
      setHtmlCode(htmlMatch[1])
    }

    if (cssMatch && cssMatch[1]) {
      setCssCode(cssMatch[1])
    }

    if (jsMatch && jsMatch[1]) {
      setJsCode(jsMatch[1])
    }

    if (autoRun) {
      updatePreview()
    }
  }

  // Function to export code as HTML file
  const exportAsHtml = () => {
    const fullCode = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${snippetTitle}</title>
  <style>
${cssCode}
  </style>
</head>
<body>
${htmlCode.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>.*<\/head>|<body>|<\/body>/gs, "")}
  <script>
${jsCode}
  </script>
</body>
</html>
    `.trim()

    const blob = new Blob([fullCode], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${snippetTitle.replace(/\s+/g, "-").toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Function to share code (generate shareable link)
  const shareCode = () => {
    // In a real app, this would create a shareable link
    // For now, we'll just copy the code to clipboard
    const fullCode = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${snippetTitle}</title>
  <style>
${cssCode}
  </style>
</head>
<body>
${htmlCode.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>.*<\/head>|<body>|<\/body>/gs, "")}
  <script>
${jsCode}
  </script>
</body>
</html>
    `.trim()

    navigator.clipboard.writeText(fullCode)
    alert("Code copied to clipboard! You can now share it.")
  }

  // Render the code editor
  return (
    <div className={cn("code-editor-container", darkMode && "dark")}>
      <div className="flex flex-col h-full">
        {/* Top toolbar */}
        <div className="flex items-center justify-between p-2 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Input
              value={snippetTitle}
              onChange={(e) => setSnippetTitle(e.target.value)}
              className="w-48 text-sm font-medium"
              placeholder="Snippet title"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={createNewSnippet}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Snippet</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={saveSnippet}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save Snippet</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" className="h-6" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={runCode}>
                    <Play className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Run Code</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-2">
              <Switch id="autorun" checked={autoRun} onCheckedChange={setAutoRun} size="sm" />
              <Label htmlFor="autorun" className="text-xs">
                Auto-run
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedAIFamily} onValueChange={setSelectedAIFamily}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select AI Assistant" />
              </SelectTrigger>
              <SelectContent>
                {aiFamilyMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {member.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAiPanel(!showAiPanel)}
                    className={showAiPanel ? "bg-blue-100 dark:bg-blue-900" : ""}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>AI Assistant</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowTaskPanel(!showTaskPanel)}
                    className={showTaskPanel ? "bg-blue-100 dark:bg-blue-900" : ""}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tasks</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSnippetsPanel(!showSnippetsPanel)}
                    className={showSnippetsPanel ? "bg-blue-100 dark:bg-blue-900" : ""}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Saved Snippets</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                    className={showSettings ? "bg-blue-100 dark:bg-blue-900" : ""}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={exportAsHtml}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export as HTML</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={shareCode}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share Code</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - Code editor */}
          <div
            className={cn(
              "flex flex-col",
              layout === "horizontal" ? "w-1/2 border-r dark:border-gray-700" : "h-1/2 border-b dark:border-gray-700",
              !previewVisible && "w-full h-full",
            )}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-2 justify-start">
                <TabsTrigger value="html" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>HTML</span>
                </TabsTrigger>
                <TabsTrigger value="css" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>CSS</span>
                </TabsTrigger>
                <TabsTrigger value="js" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>JavaScript</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="flex-1 p-0 m-0">
                <Textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className={cn(
                    "font-mono resize-none h-full rounded-none border-0 focus-visible:ring-0",
                    darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900",
                  )}
                  style={{ fontSize: `${fontSize}px` }}
                  placeholder="Enter HTML code here..."
                />
              </TabsContent>

              <TabsContent value="css" className="flex-1 p-0 m-0">
                <Textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className={cn(
                    "font-mono resize-none h-full rounded-none border-0 focus-visible:ring-0",
                    darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900",
                  )}
                  style={{ fontSize: `${fontSize}px` }}
                  placeholder="Enter CSS code here..."
                />
              </TabsContent>

              <TabsContent value="js" className="flex-1 p-0 m-0">
                <Textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className={cn(
                    "font-mono resize-none h-full rounded-none border-0 focus-visible:ring-0",
                    darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900",
                  )}
                  style={{ fontSize: `${fontSize}px` }}
                  placeholder="Enter JavaScript code here..."
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right panel - Preview */}
          {previewVisible && (
            <div
              className={cn(
                "flex flex-col",
                layout === "horizontal" ? "w-1/2" : "h-1/2",
                previewSize === "small" ? "w-1/3" : previewSize === "large" ? "w-2/3" : "w-1/2",
              )}
            >
              <div className="flex items-center justify-between p-2 border-b dark:border-gray-700">
                <h3 className="text-sm font-medium">Preview</h3>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setPreviewVisible(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Close Preview</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={updatePreview}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Refresh Preview</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Select
                    value={previewSize}
                    onValueChange={(value) => setPreviewSize(value as "small" | "medium" | "large")}
                  >
                    <SelectTrigger className="h-8 w-[100px]">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex-1 bg-white">
                <iframe
                  ref={previewIframeRef}
                  title="Code Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
        </div>

        {/* Side panels */}
        {showSettings && (
          <div className="absolute right-0 top-16 w-80 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-l-lg overflow-hidden z-10">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="font-medium">Settings</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-16rem)] p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-numbers">Show Line Numbers</Label>
                    <Switch id="line-numbers" checked={showLineNumbers} onCheckedChange={setShowLineNumbers} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="font-size"
                      type="number"
                      min={8}
                      max={24}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm">px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="layout">Editor Layout</Label>
                  <Select value={layout} onValueChange={(value) => setLayout(value as "horizontal" | "vertical")}>
                    <SelectTrigger id="layout">
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Horizontal Split</SelectItem>
                      <SelectItem value="vertical">Vertical Split</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="snippet-description">Snippet Description</Label>
                  <Textarea
                    id="snippet-description"
                    value={snippetDescription}
                    onChange={(e) => setSnippetDescription(e.target.value)}
                    placeholder="Add a description for this code snippet..."
                    className="h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="snippet-tags">Tags (comma separated)</Label>
                  <Input
                    id="snippet-tags"
                    value={snippetTags}
                    onChange={(e) => setSnippetTags(e.target.value)}
                    placeholder="html, css, animation, etc."
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        {showAiPanel && (
          <div className="absolute right-0 top-16 w-96 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-l-lg overflow-hidden z-10">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="font-medium">
                AI Assistant - {aiFamilyMembers.find((m) => m.id === selectedAIFamily)?.name || "Stan"}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAiPanel(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask for code help or suggestions..."
                  className="min-h-[80px] resize-none"
                />
                <Button
                  className="self-end"
                  onClick={getAiAssistance}
                  disabled={isAiThinking || !aiPrompt.trim() || connectionStatus !== "connected"}
                >
                  {isAiThinking ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-1" />
                  )}
                  {isAiThinking ? "Thinking..." : "Ask"}
                </Button>
              </div>

              {connectionStatus !== "connected" && (
                <div className="mt-2 text-xs text-amber-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Connect your API key in settings to use AI assistance</span>
                </div>
              )}
            </div>

            <ScrollArea className="h-[calc(100vh-24rem)]">
              {aiResponse && (
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Response</h4>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => applyAiSuggestion(aiResponse)}
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAiResponse("")}>
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                    {aiResponse}
                  </div>
                </div>
              )}

              {aiHistory.length > 0 && (
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-2">History</h4>
                  <div className="space-y-3">
                    {aiHistory.map((item, index) => (
                      <div key={index} className="text-xs border dark:border-gray-700 rounded-md overflow-hidden">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 font-medium">{item.prompt}</div>
                        <div className="p-2 max-h-32 overflow-y-auto">{item.response}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        {showTaskPanel && (
          <div className="absolute right-0 top-16 w-80 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-l-lg overflow-hidden z-10">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="font-medium">Code Tasks</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowTaskPanel(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 border-b dark:border-gray-700">
              <Button onClick={createTask} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Create New Task
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="p-4 space-y-3">
                {codeTasks.length === 0 ? (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                    <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No tasks yet. Create a task to get started.</p>
                  </div>
                ) : (
                  codeTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardHeader className="p-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm">{task.title}</CardTitle>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteTask(task.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{task.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Assigned to:</span>
                            <Select
                              value={task.assignedTo}
                              onValueChange={(value) => updateTask(task.id, { assignedTo: value })}
                            >
                              <SelectTrigger className="h-6 text-xs w-[100px]">
                                <SelectValue placeholder="Select member" />
                              </SelectTrigger>
                              <SelectContent>
                                {aiFamilyMembers.map((member) => (
                                  <SelectItem key={member.id} value={member.id}>
                                    {member.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Select
                            value={task.status}
                            onValueChange={(value) =>
                              updateTask(task.id, { status: value as "pending" | "in-progress" | "completed" })
                            }
                          >
                            <SelectTrigger className="h-6 text-xs w-[100px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {showSnippetsPanel && (
          <div className="absolute right-0 top-16 w-80 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-l-lg overflow-hidden z-10">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="font-medium">Saved Snippets</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSnippetsPanel(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4 space-y-3">
                {savedSnippets.length === 0 ? (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                    <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No saved snippets yet. Save your code to see it here.</p>
                  </div>
                ) : (
                  savedSnippets.map((snippet) => (
                    <Card key={snippet.id} className="overflow-hidden">
                      <CardHeader className="p-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm">{snippet.title}</CardTitle>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => loadSnippet(snippet)}
                            >
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => deleteSnippet(snippet.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        {snippet.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{snippet.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {snippet.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            {snippet.aiFamily &&
                              `AI: ${aiFamilyMembers.find((m) => m.id === snippet.aiFamily)?.name || "Stan"}`}
                          </span>
                          <span>{new Date(snippet.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}

