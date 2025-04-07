"use client"

import { useState } from "react"
import { useSystem, type ContextVariable } from "./system-core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Database, User, Layers, Clock, Search, Plus, X, Edit, Save, Trash, Copy, Check, Code } from "lucide-react"

// Define props for the component
interface ContextVariableManagerProps {
  onSelect?: (variable: ContextVariable) => void
  onApply?: (variable: ContextVariable) => void
}

export function ContextVariableManager({ onSelect, onApply }: ContextVariableManagerProps) {
  const { state, setContextVariable, removeContextVariable } = useSystem()

  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedVariable, setSelectedVariable] = useState<ContextVariable | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedVariable, setEditedVariable] = useState<Partial<ContextVariable>>({})
  const [copied, setCopied] = useState<boolean>(false)

  // Get variables from the system state
  const variables = Object.values(state.contextVariables)

  // Filter variables based on search query and active tab
  const filteredVariables = variables.filter((variable) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof variable.value === "string" && variable.value.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filter by tab
    const matchesTab = activeTab === "all" || variable.scope === activeTab

    return matchesSearch && matchesTab
  })

  // Handle variable selection
  const handleSelectVariable = (variable: ContextVariable) => {
    setSelectedVariable(variable)
    setCopied(false)

    if (onSelect) {
      onSelect(variable)
    }
  }

  // Handle variable application
  const handleApplyVariable = (variable: ContextVariable) => {
    if (onApply) {
      onApply(variable)
    }
  }

  // Handle variable editing
  const handleEditVariable = () => {
    if (!selectedVariable) return

    setEditedVariable({
      ...selectedVariable,
    })
    setIsEditing(true)
  }

  // Handle variable saving
  const handleSaveVariable = () => {
    if (!selectedVariable || !editedVariable) return

    // Update the variable in the system
    setContextVariable({
      key: editedVariable.key || selectedVariable.key,
      value: editedVariable.value !== undefined ? editedVariable.value : selectedVariable.value,
      scope: editedVariable.scope || selectedVariable.scope,
      type: editedVariable.type || selectedVariable.type,
      metadata: {
        ...selectedVariable.metadata,
        ...editedVariable.metadata,
      },
    })

    // Update the local state
    setSelectedVariable({
      ...selectedVariable,
      ...editedVariable,
    })

    setIsEditing(false)
  }

  // Handle variable deletion
  const handleDeleteVariable = () => {
    if (!selectedVariable) return

    // Remove the variable from the system
    removeContextVariable(selectedVariable.key)

    // Update the local state
    setSelectedVariable(null)
  }

  // Handle creating a new variable
  const handleCreateVariable = () => {
    // Create a new variable
    const newVariable: ContextVariable = {
      key: "new.variable",
      value: "",
      scope: "global",
      type: "string",
      metadata: {},
    }

    // Add the variable to the system
    setContextVariable(newVariable)

    // Update the local state
    setSelectedVariable(newVariable)
    setEditedVariable(newVariable)
    setIsEditing(true)
  }

  // Handle copying variable reference
  const handleCopyReference = () => {
    if (!selectedVariable) return

    // Copy the variable reference to clipboard
    navigator.clipboard.writeText(`{${selectedVariable.key}}`)

    // Show copied indicator
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get icon for variable scope
  const getIconForScope = (scope: string) => {
    switch (scope) {
      case "global":
        return <Database className="h-4 w-4 text-blue-500" />
      case "user":
        return <User className="h-4 w-4 text-green-500" />
      case "project":
        return <Layers className="h-4 w-4 text-purple-500" />
      case "session":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <Database className="h-4 w-4 text-gray-500" />
    }
  }

  // Format variable value for display
  const formatValueForDisplay = (value: any, type: string) => {
    if (value === undefined || value === null) {
      return <span className="text-gray-400">null</span>
    }

    switch (type) {
      case "string":
        return <span className="text-green-600 dark:text-green-400">"{value}"</span>
      case "number":
        return <span className="text-blue-600 dark:text-blue-400">{value}</span>
      case "boolean":
        return <span className="text-purple-600 dark:text-purple-400">{value.toString()}</span>
      case "object":
      case "array":
        try {
          return <pre className="text-xs overflow-auto">{JSON.stringify(value, null, 2)}</pre>
        } catch (e) {
          return <span className="text-red-600 dark:text-red-400">[Complex Object]</span>
        }
      default:
        return <span>{String(value)}</span>
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Context Variables</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search variables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleCreateVariable} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>Global</span>
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>User</span>
          </TabsTrigger>
          <TabsTrigger value="project" className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            <span>Project</span>
          </TabsTrigger>
          <TabsTrigger value="session" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Session</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-1 gap-4">
          {/* Variables list */}
          <div className="w-1/3 overflow-auto border rounded-md">
            {filteredVariables.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                <Database className="h-12 w-12 mb-2 opacity-20" />
                <p>No variables found</p>
                <Button variant="outline" size="sm" onClick={handleCreateVariable} className="mt-4">
                  Create New Variable
                </Button>
              </div>
            ) : (
              <ul className="divide-y">
                {filteredVariables.map((variable) => (
                  <li
                    key={variable.key}
                    className={cn(
                      "p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
                      selectedVariable?.key === variable.key && "bg-gray-100 dark:bg-gray-800",
                    )}
                    onClick={() => handleSelectVariable(variable)}
                  >
                    <div className="flex items-center gap-2">
                      {getIconForScope(variable.scope)}
                      <span className="font-medium font-mono">{variable.key}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 truncate">
                      {typeof variable.value === "string"
                        ? variable.value.substring(0, 50) + (variable.value.length > 50 ? "..." : "")
                        : JSON.stringify(variable.value).substring(0, 50) +
                          (JSON.stringify(variable.value).length > 50 ? "..." : "")}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {variable.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {variable.scope}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Variable details */}
          <div className="w-2/3 overflow-auto">
            {selectedVariable ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getIconForScope(selectedVariable.scope)}
                      {isEditing ? (
                        <Input
                          value={editedVariable.key || ""}
                          onChange={(e) =>
                            setEditedVariable({
                              ...editedVariable,
                              key: e.target.value,
                            })
                          }
                          className="font-bold text-lg font-mono"
                        />
                      ) : (
                        <CardTitle className="font-mono">{selectedVariable.key}</CardTitle>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="sm" onClick={handleSaveVariable}>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={handleEditVariable}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleCopyReference}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleDeleteVariable}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Type: {selectedVariable.type} • Scope: {selectedVariable.scope}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Value</Label>
                      {isEditing ? (
                        <>
                          {selectedVariable.type === "string" && (
                            <Input
                              value={editedVariable.value !== undefined ? String(editedVariable.value) : ""}
                              onChange={(e) =>
                                setEditedVariable({
                                  ...editedVariable,
                                  value: e.target.value,
                                })
                              }
                            />
                          )}

                          {selectedVariable.type === "number" && (
                            <Input
                              type="number"
                              value={editedVariable.value !== undefined ? Number(editedVariable.value) : 0}
                              onChange={(e) =>
                                setEditedVariable({
                                  ...editedVariable,
                                  value: Number.parseFloat(e.target.value),
                                })
                              }
                            />
                          )}

                          {selectedVariable.type === "boolean" && (
                            <select
                              value={editedVariable.value !== undefined ? String(editedVariable.value) : "false"}
                              onChange={(e) =>
                                setEditedVariable({
                                  ...editedVariable,
                                  value: e.target.value === "true",
                                })
                              }
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          )}

                          {(selectedVariable.type === "object" || selectedVariable.type === "array") && (
                            <textarea
                              value={
                                editedVariable.value !== undefined
                                  ? JSON.stringify(editedVariable.value, null, 2)
                                  : JSON.stringify(selectedVariable.value, null, 2)
                              }
                              onChange={(e) => {
                                try {
                                  const parsed = JSON.parse(e.target.value)
                                  setEditedVariable({
                                    ...editedVariable,
                                    value: parsed,
                                  })
                                } catch (error) {
                                  // Invalid JSON, but still update the text
                                  setEditedVariable({
                                    ...editedVariable,
                                    value: e.target.value,
                                  })
                                }
                              }}
                              className="w-full min-h-[200px] p-2 border rounded-md font-mono text-sm"
                            />
                          )}
                        </>
                      ) : (
                        <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800 min-h-[100px]">
                          {formatValueForDisplay(selectedVariable.value, selectedVariable.type)}
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div>
                        <Label>Type</Label>
                        <select
                          value={editedVariable.type || selectedVariable.type}
                          onChange={(e) =>
                            setEditedVariable({
                              ...editedVariable,
                              type: e.target.value as any,
                            })
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="object">Object</option>
                          <option value="array">Array</option>
                        </select>
                      </div>
                    )}

                    {isEditing && (
                      <div>
                        <Label>Scope</Label>
                        <select
                          value={editedVariable.scope || selectedVariable.scope}
                          onChange={(e) =>
                            setEditedVariable({
                              ...editedVariable,
                              scope: e.target.value as any,
                            })
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="global">Global</option>
                          <option value="user">User</option>
                          <option value="project">Project</option>
                          <option value="session">Session</option>
                        </select>
                      </div>
                    )}

                    {!isEditing && (
                      <div>
                        <Label>Reference</Label>
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                          <code className="font-mono text-sm">{`{${selectedVariable.key}}`}</code>
                          <Button variant="ghost" size="sm" onClick={handleCopyReference} className="ml-auto">
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    {!isEditing && selectedVariable.metadata && Object.keys(selectedVariable.metadata).length > 0 && (
                      <div>
                        <Label>Metadata</Label>
                        <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                          <pre className="text-xs overflow-auto">
                            {JSON.stringify(selectedVariable.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {!isEditing && (
                    <Button onClick={() => handleApplyVariable(selectedVariable)} className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Apply Variable
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                <Database className="h-12 w-12 mb-2 opacity-20" />
                <p>Select a variable to view details</p>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}

