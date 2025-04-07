"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FileUpload } from "@/components/file-upload"
import {
  type FileMetadata,
  type Folder,
  listFiles,
  listFolders,
  createFolder,
  deleteFile,
  deleteFolder,
  updateFileMetadata,
  STORAGE_BUCKETS,
} from "@/lib/storage-utils"
import { cn } from "@/lib/utils"
import {
  File,
  FolderIcon,
  MoreVertical,
  Trash2,
  Edit,
  Download,
  Star,
  Move,
  Search,
  Grid3X3,
  List,
  ArrowUp,
  ArrowDown,
  Filter,
  Upload,
} from "lucide-react"

interface FileBrowserProps {
  bucketName?: string
  initialFolderId?: string
  onFileSelect?: (file: FileMetadata) => void
  onFolderSelect?: (folder: Folder) => void
  selectionMode?: "single" | "multiple" | "none"
  showToolbar?: boolean
  showBreadcrumbs?: boolean
  className?: string
}

export function FileBrowser({
  bucketName = STORAGE_BUCKETS.FILES,
  initialFolderId,
  onFileSelect,
  onFolderSelect,
  selectionMode = "none",
  showToolbar = true,
  showBreadcrumbs = true,
  className,
}: FileBrowserProps) {
  const router = useRouter()
  const [currentFolderId, setCurrentFolderId] = React.useState<string | undefined>(initialFolderId)
  const [files, setFiles] = React.useState<FileMetadata[]>([])
  const [folders, setFolders] = React.useState<Folder[]>([])
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([])
  const [selectedFolders, setSelectedFolders] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [sortField, setSortField] = React.useState<"name" | "created_at" | "updated_at" | "size">("name")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [breadcrumbs, setBreadcrumbs] = React.useState<Folder[]>([])
  const [showNewFolderDialog, setShowNewFolderDialog] = React.useState(false)
  const [newFolderName, setNewFolderName] = React.useState("")
  const [showUploadDialog, setShowUploadDialog] = React.useState(false)

  // Load files and folders
  const loadFilesAndFolders = React.useCallback(async () => {
    setIsLoading(true)
    try {
      // Load folders
      const foldersData = await listFolders(currentFolderId, {
        sortBy: "name",
        sortOrder: "asc",
      })
      setFolders(foldersData)

      // Load files
      const filesData = await listFiles(bucketName, currentFolderId, {
        sortBy: sortField,
        sortOrder: sortOrder,
      })
      setFiles(filesData)

      // Load breadcrumbs
      if (currentFolderId) {
        // In a real app, you would implement a function to get the folder path
        // For this demo, we'll just show the current folder
        const currentFolder = await getFolderById(currentFolderId)
        if (currentFolder) {
          setBreadcrumbs([currentFolder])
        }
      } else {
        setBreadcrumbs([])
      }
    } catch (error) {
      console.error("Error loading files and folders:", error)
      toast({
        title: "Error",
        description: "Failed to load files and folders.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [bucketName, currentFolderId, sortField, sortOrder])

  // Mock function to get a folder by ID
  const getFolderById = async (id: string): Promise<Folder | null> => {
    // In a real app, you would fetch this from the database
    // For this demo, we'll just return a mock folder
    return {
      id,
      name: "Current Folder",
      path: id,
      user_id: "user123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_favorite: false,
    }
  }

  // Load files and folders on mount and when dependencies change
  React.useEffect(() => {
    loadFilesAndFolders()
  }, [loadFilesAndFolders])

  // Handle file selection
  const handleFileClick = (file: FileMetadata) => {
    if (selectionMode === "none") {
      onFileSelect?.(file)
      return
    }

    if (selectionMode === "single") {
      setSelectedFiles([file.id])
      setSelectedFolders([])
      onFileSelect?.(file)
      return
    }

    // Multiple selection mode
    if (selectedFiles.includes(file.id)) {
      setSelectedFiles(selectedFiles.filter((id) => id !== file.id))
    } else {
      setSelectedFiles([...selectedFiles, file.id])
    }
  }

  // Handle folder selection
  const handleFolderClick = (folder: Folder) => {
    if (selectionMode === "none") {
      // Navigate to folder
      setCurrentFolderId(folder.id)
      onFolderSelect?.(folder)
      return
    }

    if (selectionMode === "single") {
      setSelectedFolders([folder.id])
      setSelectedFiles([])
      onFolderSelect?.(folder)
      return
    }

    // Multiple selection mode
    if (selectedFolders.includes(folder.id)) {
      setSelectedFolders(selectedFolders.filter((id) => id !== folder.id))
    } else {
      setSelectedFolders([...selectedFolders, folder.id])
    }
  }

  // Handle file download
  const handleFileDownload = async (file: FileMetadata) => {
    try {
      // In a real app, you would implement a function to download the file
      // For this demo, we'll just open the file URL in a new tab
      window.open(file.url, "_blank")
    } catch (error) {
      console.error("Error downloading file:", error)
      toast({
        title: "Error",
        description: "Failed to download file.",
        variant: "destructive",
      })
    }
  }

  // Handle file deletion
  const handleFileDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId)
      setFiles(files.filter((file) => file.id !== fileId))
      setSelectedFiles(selectedFiles.filter((id) => id !== fileId))
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Error",
        description: "Failed to delete file.",
        variant: "destructive",
      })
    }
  }

  // Handle folder deletion
  const handleFolderDelete = async (folderId: string) => {
    try {
      await deleteFolder(folderId)
      setFolders(folders.filter((folder) => folder.id !== folderId))
      setSelectedFolders(selectedFolders.filter((id) => id !== folderId))
      toast({
        title: "Folder deleted",
        description: "The folder and its contents have been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting folder:", error)
      toast({
        title: "Error",
        description: "Failed to delete folder.",
        variant: "destructive",
      })
    }
  }

  // Handle new folder creation
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty.",
        variant: "destructive",
      })
      return
    }

    try {
      const newFolder = await createFolder(newFolderName, currentFolderId)
      setFolders([...folders, newFolder])
      setNewFolderName("")
      setShowNewFolderDialog(false)
      toast({
        title: "Folder created",
        description: `Folder "${newFolderName}" has been created successfully.`,
      })
    } catch (error) {
      console.error("Error creating folder:", error)
      toast({
        title: "Error",
        description: "Failed to create folder.",
        variant: "destructive",
      })
    }
  }

  // Handle file upload complete
  const handleUploadComplete = (file: FileMetadata) => {
    setFiles([...files, file])
    setShowUploadDialog(false)
  }

  // Handle toggle favorite
  const handleToggleFavorite = async (file: FileMetadata) => {
    try {
      const updatedFile = await updateFileMetadata(file.id, {
        is_favorite: !file.is_favorite,
      })

      setFiles(files.map((f) => (f.id === file.id ? updatedFile : f)))

      toast({
        title: updatedFile.is_favorite ? "Added to favorites" : "Removed from favorites",
        description: updatedFile.is_favorite
          ? `${file.name} has been added to favorites.`
          : `${file.name} has been removed from favorites.`,
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      })
    }
  }

  // Handle folder navigation
  const handleNavigateToFolder = (folderId?: string) => {
    setCurrentFolderId(folderId)
    setSelectedFiles([])
    setSelectedFolders([])
  }

  // Filter files and folders based on search query
  const filteredFiles = searchQuery
    ? files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files

  const filteredFolders = searchQuery
    ? folders.filter((folder) => folder.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : folders

  return (
    <div className={cn("space-y-4", className)}>
      {showToolbar && (
        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortField("name")}>Sort by Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortField("created_at")}>Sort by Date Created</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortField("updated_at")}>Sort by Date Modified</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortField("size")}>Sort by Size</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? <ArrowUp className="h-4 w-4 mr-2" /> : <ArrowDown className="h-4 w-4 mr-2" />}
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowNewFolderDialog(true)}>
              <FolderIcon className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button size="sm" onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      )}

      {showBreadcrumbs && (
        <div className="flex items-center gap-1 text-sm">
          <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => handleNavigateToFolder(undefined)}>
            Root
          </Button>
          {breadcrumbs.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <span>/</span>
              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => handleNavigateToFolder(folder.id)}>
                {folder.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : filteredFolders.length === 0 && filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FolderIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">No files or folders</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : "This folder is empty. Upload files or create a new folder to get started."}
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowNewFolderDialog(true)}>
              <FolderIcon className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : "space-y-2",
          )}
        >
          {/* Folders */}
          {filteredFolders.map((folder) => (
            <div
              key={folder.id}
              className={cn(
                "group cursor-pointer",
                viewMode === "grid" ? "relative" : "flex items-center justify-between p-2 rounded-md hover:bg-muted",
                selectedFolders.includes(folder.id) && "bg-primary/10",
              )}
              onClick={() => handleFolderClick(folder)}
            >
              {viewMode === "grid" ? (
                <Card
                  className={cn(
                    "overflow-hidden border transition-colors",
                    selectedFolders.includes(folder.id) && "border-primary",
                  )}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <FolderIcon className="h-12 w-12 text-primary mb-2" />
                    <p className="text-sm font-medium truncate w-full">{folder.name}</p>
                  </CardContent>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // Implement rename folder
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // Implement move folder
                          }}
                        >
                          <Move className="h-4 w-4 mr-2" />
                          Move
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFolderDelete(folder.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <FolderIcon className="h-5 w-5 text-primary" />
                    <span className="text-sm">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Implement rename folder
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFolderDelete(folder.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Files */}
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={cn(
                "group cursor-pointer",
                viewMode === "grid" ? "relative" : "flex items-center justify-between p-2 rounded-md hover:bg-muted",
                selectedFiles.includes(file.id) && "bg-primary/10",
              )}
              onClick={() => handleFileClick(file)}
            >
              {viewMode === "grid" ? (
                <Card
                  className={cn(
                    "overflow-hidden border transition-colors",
                    selectedFiles.includes(file.id) && "border-primary",
                  )}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    {file.type.startsWith("image/") && file.thumbnail_url ? (
                      <div className="w-full h-24 mb-2 bg-muted rounded-md overflow-hidden">
                        <img
                          src={file.thumbnail_url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <File className="h-12 w-12 text-muted-foreground mb-2" />
                    )}
                    <p className="text-sm font-medium truncate w-full">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </CardContent>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileDownload(file)
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleFavorite(file)
                          }}
                        >
                          <Star className={cn("h-4 w-4 mr-2", file.is_favorite && "fill-yellow-400 text-yellow-400")} />
                          {file.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // Implement rename file
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // Implement move file
                          }}
                        >
                          <Move className="h-4 w-4 mr-2" />
                          Move
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileDelete(file.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    {file.type.startsWith("image/") && file.thumbnail_url ? (
                      <div className="w-8 h-8 bg-muted rounded-md overflow-hidden">
                        <img
                          src={file.thumbnail_url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <File className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <span className="text-sm">{file.name}</span>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        file.is_favorite ? "text-yellow-400" : "opacity-0 group-hover:opacity-100",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleFavorite(file)
                      }}
                    >
                      <Star className={cn("h-4 w-4", file.is_favorite && "fill-yellow-400")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileDownload(file)
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileDelete(file.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewFolderName("")
                setShowNewFolderDialog(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <FileUpload
              bucket={bucketName}
              path={currentFolderId}
              onUploadComplete={handleUploadComplete}
              onUploadError={() => {}}
              multiple={true}
              generateThumbnail={true}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

