"use client"

import { ApiConnectionProvider } from "@/components/api-connection-manager"
import { CodeEditor } from "@/components/code-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Plus, Bookmark, History, Settings, Copy } from "lucide-react"
import { DateTimeDisplay } from "@/components/date-time-display"
import Link from "next/link"
import { useState } from "react"

export default function CodePage() {
  const [showEditor, setShowEditor] = useState(false)
  const [activeTab, setActiveTab] = useState("templates")

  // Sample code prompts
  const codePrompts = [
    {
      id: 1,
      title: "API Endpoint",
      content:
        "Create a [REST/GraphQL] API endpoint for [functionality] that handles [HTTP method] requests. Include error handling, input validation, and appropriate response formats.",
      category: "backend",
      language: "JavaScript",
    },
    {
      id: 2,
      title: "Data Processing",
      content:
        "Write a function that processes [data type] by [transformation]. It should handle edge cases like [edge cases] and optimize for [performance/readability].",
      category: "utility",
      language: "Python",
    },
    {
      id: 3,
      title: "UI Component",
      content:
        "Create a [framework] component for [purpose] that includes [features]. It should be responsive, accessible, and handle states like [states].",
      category: "frontend",
      language: "TypeScript",
    },
    {
      id: 4,
      title: "Database Query",
      content:
        "Write a [SQL/NoSQL] query to [retrieve/update/delete] data from [table/collection] where [conditions]. Include [joins/aggregations] and optimize for performance.",
      category: "database",
      language: "SQL",
    },
    {
      id: 5,
      title: "Authentication Flow",
      content:
        "Implement a secure authentication flow using [method] that includes user registration, login, password reset, and session management.",
      category: "security",
      language: "JavaScript",
    },
    {
      id: 6,
      title: "Testing Suite",
      content:
        "Create a comprehensive test suite for [functionality] using [testing framework]. Include unit tests, integration tests, and mocks for external dependencies.",
      category: "testing",
      language: "TypeScript",
    },
  ]

  // Group prompts by category
  const categories = [...new Set(codePrompts.map((prompt) => prompt.category))]

  if (showEditor) {
    return (
      <ApiConnectionProvider>
        <div className="h-[calc(100vh-4rem)]">
          <CodeEditor />
        </div>
      </ApiConnectionProvider>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Dashboard
          </Link>
          <span className="text-gray-500">/</span>
          <h1 className="text-2xl font-bold flex items-center">
            <Code className="mr-2 h-6 w-6" /> AI Family Code Editor
          </h1>
        </div>
        <DateTimeDisplay />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Code Tools</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button size="sm" className="flex items-center gap-1" onClick={() => setShowEditor(true)}>
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
          <Button size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Assign Task</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="ai-family">AI Family</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="mb-4">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {codePrompts
                    .filter((prompt) => prompt.category === category)
                    .map((prompt) => (
                      <Card key={prompt.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle>{prompt.title}</CardTitle>
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {prompt.language}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{prompt.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Copy className="h-4 w-4" />
                            <span>Copy</span>
                          </Button>
                          <Button size="sm" onClick={() => setShowEditor(true)}>
                            Generate
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowEditor(true)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center h-48">
                <Plus className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">Create New Project</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                  Start a new HTML, CSS, and JavaScript project
                </p>
              </CardContent>
            </Card>

            {/* Sample saved projects - in a real app, these would come from the database */}
            <Card
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowEditor(true)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Interactive Form</CardTitle>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">HTML/CSS/JS</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  A responsive form with client-side validation and interactive elements.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-gray-500">
                <span>Last edited: 2 days ago</span>
                <span>Stan</span>
              </CardFooter>
            </Card>

            <Card
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowEditor(true)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Data Visualization</CardTitle>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">HTML/CSS/JS</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  Interactive charts and graphs for data visualization using D3.js.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-gray-500">
                <span>Last edited: 1 week ago</span>
                <span>Kara</span>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-family" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Stan's Code Formatter</CardTitle>
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">
                    Stan
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  Let Stan help you format and optimize your code for readability and performance.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button size="sm" onClick={() => setShowEditor(true)}>
                  Open Tool
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Cecilia's Security Checker</CardTitle>
                  <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-2 py-1 rounded">
                    Cecilia
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  Analyze your code for security vulnerabilities and get recommendations for improvements.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button size="sm" onClick={() => setShowEditor(true)}>
                  Open Tool
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Karl's Algorithm Optimizer</CardTitle>
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded">
                    Karl
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  Optimize your algorithms and data structures for better performance and efficiency.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button size="sm" onClick={() => setShowEditor(true)}>
                  Open Tool
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

