import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, FileText, ListTodo, MessageSquare } from "lucide-react"
import type { AIFamilyMember } from "../constants/ai-family"
import Image from "next/image"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  completed: boolean
}

interface Reference {
  id: string
  title: string
  type: "document" | "link" | "note"
  content: string
}

interface AIFamilyPageProps {
  member?: AIFamilyMember
  name?: string
  description?: string
  capabilities?: string[]
  useCases?: string[]
  systemPrompt?: string
  modelName?: string
  avatar?: string
  tasks?: Task[]
  prompts?: Array<{ id: string; title: string; content: string }>
  references?: Reference[]
}

export function AIFamilyPageLayout({
  member,
  name,
  description,
  capabilities,
  useCases,
  systemPrompt,
  modelName,
  avatar,
  tasks = [],
  prompts = [],
  references = [],
}: AIFamilyPageProps) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
  }

  // Use either member properties or direct props
  const displayName = member?.name || name || ""
  const displayModel = member?.model || modelName || ""
  const displayAvatar = member?.avatar || avatar || "/placeholder.svg"
  const displayFocus = member?.focus || capabilities || []
  const displayPersonality = member?.personality || description || ""
  const displayActions = member?.actions || useCases || []

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary">
          <Image src={displayAvatar || "/placeholder.svg"} alt={displayName} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{displayName}</h1>
          <p className="text-gray-500 dark:text-gray-400">{displayModel}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {member ? "Personality" : "Description"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{displayPersonality}</p>
            {systemPrompt && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">
                <p className="font-semibold mb-1">System Prompt:</p>
                <p className="text-gray-700 dark:text-gray-300">{systemPrompt}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {member ? "Focus Areas" : "Capabilities"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {displayFocus.map((focus, index) => (
                <Badge key={index} variant="secondary">
                  {focus}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {member ? "Actions" : "Use Cases"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {displayActions.map((action, index) => (
                <Badge key={index} variant="outline">
                  {action}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="prompts" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Prompts
          </TabsTrigger>
          <TabsTrigger value="references" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            References
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className={task.completed ? "opacity-70" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className={task.completed ? "line-through" : ""}>{task.title}</CardTitle>
                      <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.dueDate}
                    </div>
                    <Button variant="outline" size="sm">
                      {task.completed ? "Reopen" : "Complete"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks assigned yet.</p>
              <Button variant="outline" className="mt-4">
                Create New Task
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          {prompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prompts.map((prompt) => (
                <Card key={prompt.id}>
                  <CardHeader>
                    <CardTitle>{prompt.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{prompt.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Use Prompt
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No prompts available yet.</p>
              <Button variant="outline" className="mt-4">
                Create New Prompt
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="references" className="space-y-4">
          {references.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {references.map((reference) => (
                <Card key={reference.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{reference.title}</CardTitle>
                      <Badge variant="outline">{reference.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{reference.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No references available yet.</p>
              <Button variant="outline" className="mt-4">
                Add Reference
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

