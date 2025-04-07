"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSystem } from "./system-core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Link,
  Database,
  User,
  FileText,
  Code,
  ImageIcon,
  MessageSquare,
  Layers,
  Search,
  Plus,
  X,
  Edit,
  Save,
  Trash,
  ExternalLink,
} from "lucide-react"

// Define types for our content references
type ContentReference = {
  id: string
  name: string
  type: "prompt" | "image" | "code" | "text" | "api" | "user" | "project"
  value: string
  tags: string[]
  source: string
  created: Date
  modified: Date
  metadata: Record<string, any>
}

// Define props for the component
interface ContentReferenceManagerProps {
  onSelect?: (reference: ContentReference) => void
  onApply?: (reference: ContentReference) => void
  filter?: Partial<ContentReference>
}

export function ContentReferenceManager({ onSelect, onApply, filter }: ContentReferenceManagerProps) {
  const { state, registerEntity, updateEntity, removeEntity, findEntities, addEventListener } = useSystem()

  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [references, setReferences] = useState<ContentReference[]>([])
  const [selectedReference, setSelectedReference] = useState<ContentReference | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedReference, setEditedReference] = useState<Partial<ContentReference>>({})

  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true)
  // Use a ref to prevent multiple event listeners
  const eventListenerRef = useRef<(() => void) | null>(null)

  // Load references from the system
  const loadReferences = useCallback(() => {
    if (!isMountedRef.current) return

    // Convert system entities to content references
    const entities = findEntities({ type: "content" })

    const contentRefs: ContentReference[] = entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      type: entity.metadata?.contentType || "text",
      value: entity.value,
      tags: entity.metadata?.tags || [],
      source: entity.metadata?.source || "user",
      created: new Date(entity.metadata?.created || Date.now()),
      modified: new Date(entity.metadata?.modified || Date.now()),
      metadata: entity.metadata || {},
    }))

    // Apply filter if provided
    const filteredRefs = filter
      ? contentRefs.filter((ref) =>
          Object.entries(filter).every(([key, value]) => ref[key as keyof ContentReference] === value),
        )
      : contentRefs

    setReferences(filteredRefs)
  }, [findEntities, filter])

  // Set up event listener only once on mount
  useEffect(() => {
    // Set the mounted ref
    isMountedRef.current = true

    // Load references initially
    loadReferences()

    // Add event listener for entity changes only if not already added
    if (!eventListenerRef.current) {
      const handleEntityUpdate = () => {
        if (isMountedRef.current) {
          loadReferences()
        }
      }

      eventListenerRef.current = addEventListener("entity.updated", handleEntityUpdate)
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false
      if (eventListenerRef.current) {
        eventListenerRef.current()
        eventListenerRef.current = null
      }
    }
  }, [addEventListener, loadReferences])

  // Filter references based on search query and active tab
  const filteredReferences = references.filter((ref) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      ref.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filter by tab
    const matchesTab = activeTab === "all" || ref.type === activeTab

    return matchesSearch && matchesTab
  })

  // Handle reference selection
  const handleSelectReference = useCallback(
    (reference: ContentReference) => {
      setSelectedReference(reference)
      if (onSelect) {
        onSelect(reference)
      }
    },
    [onSelect],
  )

  // Handle reference application
  const handleApplyReference = useCallback(
    (reference: ContentReference) => {
      if (onApply) {
        onApply(reference)
      }
    },
    [onApply],
  )

  // Handle reference editing
  const handleEditReference = useCallback(() => {
    if (!selectedReference) return

    setEditedReference({
      ...selectedReference,
    })
    setIsEditing(true)
  }, [selectedReference])

  // Handle reference saving
  const handleSaveReference = useCallback(() => {
    if (!selectedReference || !editedReference) return

    // Update the entity in the system
    updateEntity(selectedReference.id, {
      name: editedReference.name || selectedReference.name,
      value: editedReference.value || selectedReference.value,
      metadata: {
        ...selectedReference.metadata,
        tags: editedReference.tags || selectedReference.tags,
        modified: new Date().toISOString(),
      },
    })

    // Update the local state
    setSelectedReference({
      ...selectedReference,
      ...editedReference,
      modified: new Date(),
    })

    setIsEditing(false)
  }, [selectedReference, editedReference, updateEntity])

  // Handle reference deletion
  const handleDeleteReference = useCallback(() => {
    if (!selectedReference) return

    // Remove the entity from the system
    removeEntity(selectedReference.id)

    // Update the local state
    setReferences((prev) => prev.filter((ref) => ref.id !== selectedReference.id))
    setSelectedReference(null)
  }, [selectedReference, removeEntity])

  // Handle creating a new reference
  const handleCreateReference = useCallback(() => {
    // Create a new entity in the system
    const id = registerEntity({
      type: "content",
      name: "New Reference",
      value: "",
      metadata: {
        contentType: activeTab === "all" ? "text" : activeTab,
        tags: [],
        source: "user",
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
    })

    // Create a new reference
    const newReference: ContentReference = {
      id,
      name: "New Reference",
      type: activeTab === "all" ? "text" : (activeTab as any),
      value: "",
      tags: [],
      source: "user",
      created: new Date(),
      modified: new Date(),
      metadata: {},
    }

    // Update the local state
    setReferences((prev) => [...prev, newReference])
    setSelectedReference(newReference)
    setEditedReference(newReference)
    setIsEditing(true)
  }, [activeTab, registerEntity])

  // Get icon for reference type
  const getIconForType = (type: string) => {
    switch (type) {
      case "prompt":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-purple-500" />
      case "code":
        return <Code className="h-4 w-4 text-green-500" />
      case "text":
        return <FileText className="h-4 w-4 text-gray-500" />
      case "api":
        return <Database className="h-4 w-4 text-orange-500" />
      case "user":
        return <User className="h-4 w-4 text-indigo-500" />
      case "project":
        return <Layers className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Content References</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search references..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleCreateReference} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-7 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Prompts</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            <span>Images</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>Code</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>APIs</span>
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-1 gap-4">
          {/* References list */}
          <div className="w-1/3 overflow-auto border rounded-md">
            {filteredReferences.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                <FileText className="h-12 w-12 mb-2 opacity-20" />
                <p>No references found</p>
                <Button variant="outline" size="sm" onClick={handleCreateReference} className="mt-4">
                  Create New Reference
                </Button>
              </div>
            ) : (
              <ul className="divide-y">
                {filteredReferences.map((reference) => (
                  <li
                    key={reference.id}
                    className={cn(
                      "p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
                      selectedReference?.id === reference.id && "bg-gray-100 dark:bg-gray-800",
                    )}
                    onClick={() => handleSelectReference(reference)}
                  >
                    <div className="flex items-center gap-2">
                      {getIconForType(reference.type)}
                      <span className="font-medium">{reference.name}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 truncate">
                      {reference.value.substring(0, 100)}
                      {reference.value.length > 100 && "..."}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {reference.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Modified: {reference.modified.toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reference details */}
          <div className="w-2/3 overflow-auto">
            {selectedReference ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getIconForType(selectedReference.type)}
                      {isEditing ? (
                        <Input
                          value={editedReference.name || ""}
                          onChange={(e) =>
                            setEditedReference({
                              ...editedReference,
                              name: e.target.value,
                            })
                          }
                          className="font-bold text-lg"
                        />
                      ) : (
                        <CardTitle>{selectedReference.name}</CardTitle>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="sm" onClick={handleSaveReference}>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={handleEditReference}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleApplyReference(selectedReference)}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleDeleteReference}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Type: {selectedReference.type.charAt(0).toUpperCase() + selectedReference.type.slice(1)} • Source:{" "}
                    {selectedReference.source} • Created: {selectedReference.created.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Content</Label>
                      {isEditing ? (
                        <textarea
                          value={editedReference.value || ""}
                          onChange={(e) =>
                            setEditedReference({
                              ...editedReference,
                              value: e.target.value,
                            })
                          }
                          className="w-full min-h-[200px] p-2 border rounded-md"
                        />
                      ) : (
                        <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800 min-h-[200px] whitespace-pre-wrap">
                          {selectedReference.value}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Tags</Label>
                      {isEditing ? (
                        <Input
                          value={(editedReference.tags || []).join(", ")}
                          onChange={(e) =>
                            setEditedReference({
                              ...editedReference,
                              tags: e.target.value
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="Enter tags separated by commas"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedReference.tags.length === 0 ? (
                            <span className="text-sm text-gray-500">No tags</span>
                          ) : (
                            selectedReference.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Metadata</Label>
                      <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(selectedReference.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleApplyReference(selectedReference)} className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Apply Reference
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                <Link className="h-12 w-12 mb-2 opacity-20" />
                <p>Select a reference to view details</p>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}

