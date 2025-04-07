"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Code,
  Settings,
  Users,
  Shield,
  Sliders,
  FileText,
  PlusCircle,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { useApiConnection } from "@/components/api-connection-manager"

export default function AdminCodePage() {
  const [activeTab, setActiveTab] = useState<"settings" | "templates" | "snippets" | "users">("settings")
  const [isEditing, setIsEditing] = useState(false)
  const { connectionStatus } = useApiConnection()

  // Mock code templates
  const codeTemplates = [
    {
      id: 1,
      name: "React Component",
      language: "typescript",
      description: "Basic React functional component template",
      isActive: true,
    },
    {
      id: 2,
      name: "API Route",
      language: "typescript",
      description: "Next.js API route handler template",
      isActive: true,
    },
    { id: 3, name: "Database Query", language: "sql", description: "SQL database query template", isActive: false },
  ]

  // Mock code users
  const codeUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", snippets: 24, lastActive: "2023-10-15", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", snippets: 12, lastActive: "2023-10-14", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", snippets: 8, lastActive: "2023-10-10", status: "inactive" },
  ]

  // Mock code snippets
  const codeSnippets = [
    {
      id: 1,
      title: "React Button Component",
      language: "typescript",
      creator: "John Doe",
      created: "2023-10-15",
      code: `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};`,
    },
    {
      id: 2,
      title: "Next.js API Route",
      language: "typescript",
      creator: "Jane Smith",
      created: "2023-10-14",
      code: `import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello World!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}`,
    },
    {
      id: 3,
      title: "Database Query",
      language: "sql",
      creator: "Bob Johnson",
      created: "2023-10-10",
      code: `SELECT 
  users.id, 
  users.name, 
  users.email,
  COUNT(orders.id) as total_orders
FROM 
  users
LEFT JOIN 
  orders ON users.id = orders.user_id
WHERE 
  users.status = 'active'
GROUP BY 
  users.id
HAVING 
  COUNT(orders.id) > 5
ORDER BY 
  total_orders DESC
LIMIT 10;`,
    },
  ]

  // Mock analytics data
  const analyticsData = {
    totalSnippets: 645,
    activeUsers: 42,
    averageGenerationTime: "2.8s",
    topLanguages: [
      { language: "TypeScript", count: 245 },
      { language: "JavaScript", count: 187 },
      { language: "Python", count: 124 },
    ],
    dailyUsage: [
      { date: "Mon", snippets: 65 },
      { date: "Tue", snippets: 82 },
      { date: "Wed", snippets: 73 },
      { date: "Thu", snippets: 90 },
      { date: "Fri", snippets: 78 },
      { date: "Sat", snippets: 45 },
      { date: "Sun", snippets: 32 },
    ],
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold flex items-center">
          <Shield className="mr-2 h-6 w-6" /> Code Administration
        </h1>
        <Badge
          variant={connectionStatus === "connected" ? "default" : "outline"}
          className={connectionStatus === "connected" ? "bg-green-500 ml-2" : "bg-red-100 text-red-800 ml-2"}
        >
          {connectionStatus === "connected" ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : (
            <AlertCircle className="h-3 w-3 mr-1" />
          )}
          {connectionStatus === "connected" ? "API Connected" : "API Disconnected"}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="snippets" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>Snippets</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Sliders className="h-5 w-5 mr-2" />
                  Code Generation Configuration
                </span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setIsEditing(false)}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Configure global code generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Default Model</Label>
                  <Select disabled={!isEditing} defaultValue="gpt-4o">
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="codellama">CodeLlama</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-language">Default Language</Label>
                  <Select disabled={!isEditing} defaultValue="typescript">
                    <SelectTrigger id="default-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="system-prompt">Code Generation System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value="You are an expert programmer. Write clean, efficient, and well-documented code. Follow best practices for the language you're using. Include helpful comments to explain complex logic."
                  onChange={() => {}}
                  className="min-h-[100px]"
                  disabled={!isEditing}
                />
                <p className="text-xs text-gray-500">This prompt guides the AI when generating code</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Feature Controls</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="code-execution">Code Execution</Label>
                      <p className="text-xs text-gray-500">Allow code execution in sandbox</p>
                    </div>
                    <Switch id="code-execution" defaultChecked disabled={!isEditing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="code-completion">Code Completion</Label>
                      <p className="text-xs text-gray-500">Enable code completion suggestions</p>
                    </div>
                    <Switch id="code-completion" defaultChecked disabled={!isEditing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="code-explanation">Code Explanation</Label>
                      <p className="text-xs text-gray-500">Generate explanations for code snippets</p>
                    </div>
                    <Switch id="code-explanation" defaultChecked disabled={!isEditing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="database-access">Database Access</Label>
                      <p className="text-xs text-gray-500">Allow database queries in sandbox</p>
                    </div>
                    <Switch id="database-access" defaultChecked={false} disabled={!isEditing} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security settings for code generation and execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sandbox-mode">Sandbox Mode</Label>
                  <p className="text-xs text-gray-500">Run code in isolated environment</p>
                </div>
                <Switch id="sandbox-mode" defaultChecked disabled={!isEditing} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="resource-limits">Resource Limits</Label>
                  <p className="text-xs text-gray-500">Limit CPU and memory usage</p>
                </div>
                <Switch id="resource-limits" defaultChecked disabled={!isEditing} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="execution-timeout">Execution Timeout (seconds)</Label>
                <Input id="execution-timeout" type="number" min="1" max="60" defaultValue="10" disabled={!isEditing} />
                <p className="text-xs text-gray-500">Maximum time allowed for code execution</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blocked-imports">Blocked Imports/Packages</Label>
                <Textarea
                  id="blocked-imports"
                  placeholder="Enter packages to block, one per line"
                  className="min-h-[100px]"
                  disabled={!isEditing}
                  defaultValue="os\nsys\nsubprocess\nrequests\nfs\npath"
                />
                <p className="text-xs text-gray-500">These packages will be blocked from importing in code execution</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Code Templates</h2>
            <Button size="sm" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Add Template</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {codeTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-xs text-gray-500">{template.language}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{template.description}</p>
                  <div className="mt-2">
                    <Badge
                      variant={template.isActive ? "default" : "outline"}
                      className={template.isActive ? "bg-green-500" : "bg-gray-100 text-gray-800"}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Code
                  </Button>
                  <Button size="sm">{template.isActive ? "Deactivate" : "Activate"}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Snippets Tab */}
        <TabsContent value="snippets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Code Snippets</h2>
            <div className="flex gap-2">
              <Input placeholder="Search snippets..." className="w-64" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {codeSnippets.map((snippet) => (
              <Card key={snippet.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{snippet.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{snippet.language}</Badge>
                        <p className="text-xs text-gray-500">By: {snippet.creator}</p>
                        <p className="text-xs text-gray-500">Created: {snippet.created}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                    <pre className="text-sm font-mono">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Run
                  </Button>
                  <Button size="sm">Copy</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Code Generation Users</h2>
            <div className="flex gap-2">
              <Input placeholder="Search users..." className="w-64" />
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="border-b">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium text-sm">
                  <div>User</div>
                  <div>Email</div>
                  <div>Snippets</div>
                  <div>Last Active</div>
                  <div>Status</div>
                </div>
              </div>
              {codeUsers.map((user) => (
                <div key={user.id} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                    <div>{user.snippets}</div>
                    <div className="text-gray-500">{user.lastActive}</div>
                    <div>
                      <Badge
                        variant={user.status === "active" ? "default" : "outline"}
                        className={user.status === "active" ? "bg-green-500" : "bg-gray-100 text-gray-800"}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

