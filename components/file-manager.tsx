"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { FileType } from "@/lib/storage-utils"
import {
  listFilesAction,
  uploadFileAction,
  deleteFileAction,
  moveFileAction,
  createFolderAction,
} from "@/app/actions/file-actions"
import {
  File,
  FolderOpen,
  Upload,
  Trash2,
  Edit,
  Download,
  RefreshCw,
  FolderPlus,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  FileCode,
  FileIcon as FilePdf,
} from "lucide-react"

interface FileItem {
  name: string
  path: string
  url: string
  size: number
  created_at: string
}

export function FileManager() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFileType, setSelectedFileType] = useState<FileType>("document")
  const [currentFolder, setCurrentFolder] = useState<string>("")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFileName, setNewFileName] = useState("")
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // Load files on mount and when file type or folder changes
  useEffect(() => {
    loadFiles()
  }, [selectedFileType, currentFolder])

  // Load files from server
  const loadFiles = async () => {
    setLoading(true)
    try {
      const result = await listFilesAction(selectedFileType, currentFolder)

      if (result.success && result.data) {
        setFiles(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load files",
          variant: "destructive",
        })
        setFiles([])
      }
    } catch (error) {
      console.error("Error loading files:", error)
      toast({
        title: "Error",
        description: "Failed to load files. Please try again.",
        variant: "destructive",
      })
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  // Handle file upload
  const handleUpload = async () => {
    if (!fileToUpload) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", fileToUpload)
      formData.append("fileType", selectedFileType)
      formData.append("folder", currentFolder)

      const result = await uploadFileAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "File uploaded successfully",
        })
        setUploadDialogOpen(false)
        setFileToUpload(null)
        loadFiles()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to upload file",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  // Handle file deletion
  const handleDelete = async (file: FileItem) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) {
      return
    }

    try {
      const result = await deleteFileAction(file.path, selectedFileType)

      if (result.success) {
        toast({
          title: "Success",
          description: "File deleted successfully",
        })
        loadFiles()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete file",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle file rename
  const handleRename = async () => {
    if (!selectedFile) return

    try {
      const fileExt = selectedFile.name.split(".").pop()
      const newPath = currentFolder ? `${currentFolder}/${newFileName}.${fileExt}` : `${newFileName}.${fileExt}`

      const result = await moveFileAction(selectedFile.path, newPath, selectedFileType)

      if (result.success) {
        toast({
          title: "Success",
          description: "File renamed successfully",
        })
        setRenameDialogOpen(false)
        setSelectedFile(null)
        setNewFileName("")
        loadFiles()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to rename file",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error renaming file:", error)
      toast({
        title: "Error",
        description: "Failed to rename file. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle folder creation
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder name",
        variant: "destructive",
      })
      return
    }

    try {
      const folderPath = currentFolder ? `${currentFolder}/${newFolderName}` : newFolderName

      const result = await createFolderAction(folderPath, selectedFileType)

      if (result.success) {
        toast({
          title: "Success",
          description: "Folder created successfully",
        })
        setFolderDialogOpen(false)
        setNewFolderName("")
        loadFiles()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create folder",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating folder:", error)
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Navigate to a folder
  const navigateToFolder = (folderName: string) => {
    const newPath = currentFolder ? `${currentFolder}/${folderName}` : folderName

    setCurrentFolder(newPath)
  }

  // Navigate up one level
  const navigateUp = () => {
    if (!currentFolder) return

    const parts = currentFolder.split("/")
    parts.pop()
    setCurrentFolder(parts.join("/"))
  }

  // Get file icon based on file name
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()

    switch (ext) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <Image className="h-5 w-5 text-blue-500" />
      case "mp4":
      case "webm":
      case "mov":
        return <Video className="h-5 w-5 text-purple-500" />
      case "mp3":
      case "wav":
      case "ogg":
        return <Music className="h-5 w-5 text-green-500" />
      case "zip":
      case "rar":
      case "tar":
      case "gz":
        return <Archive className="h-5 w-5 text-amber-500" />
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
      case "html":
      case "css":
        return <FileCode className="h-5 w-5 text-emerald-500" />
      case "pdf":
        return <FilePdf className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">File Manager</h2>
          <p className="text-sm text-muted-foreground">Manage your files and folders</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedFileType} onValueChange={(value) => setSelectedFileType(value as FileType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="presentation">Presentations</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="attachment">Attachments</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={loadFiles}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
                <DialogDescription>Select a file to upload to {currentFolder || "root"} folder</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <Input id="file" type="file" onChange={(e) => setFileToUpload(e.target.files?.[0] || null)} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!fileToUpload || uploading}>
                  {uploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>Enter a name for the new folder</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="folder-name">Folder Name</Label>
                  <Input
                    id="folder-name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setFolderDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Folder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Files</CardTitle>
              <CardDescription>{currentFolder ? `Folder: ${currentFolder}` : "Root folder"}</CardDescription>
            </div>

            {currentFolder && (
              <Button variant="outline" size="sm" onClick={navigateUp}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Up
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <File className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No files found</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {currentFolder
                    ? `This folder is empty. Upload files or create a new folder.`
                    : `No files found. Upload files or create a new folder.`}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {files.map((file) => {
                  const isFolder = !file.name.includes(".")

                  return (
                    <div key={file.path} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                      <div
                        className="flex items-center gap-2 flex-1 cursor-pointer"
                        onClick={() => (isFolder ? navigateToFolder(file.name) : window.open(file.url, "_blank"))}
                      >
                        {isFolder ? <FolderOpen className="h-5 w-5 text-amber-500" /> : getFileIcon(file.name)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {isFolder ? "Folder" : formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!isFolder && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.open(file.url, "_blank")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}

                        {!isFolder && (
                          <Dialog
                            open={renameDialogOpen && selectedFile?.path === file.path}
                            onOpenChange={(open) => {
                              setRenameDialogOpen(open)
                              if (open) {
                                setSelectedFile(file)
                                setNewFileName(file.name.split(".")[0])
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Rename File</DialogTitle>
                                <DialogDescription>Enter a new name for the file</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="file-name">File Name</Label>
                                  <Input
                                    id="file-name"
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                    placeholder="Enter file name"
                                  />
                                </div>
                              </div>

                              <DialogFooter>
                                <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleRename}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Rename
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDelete(file)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

