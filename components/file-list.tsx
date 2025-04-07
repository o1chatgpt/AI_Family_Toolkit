"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Trash2, FileText, FileImage, FileArchive, FileIcon, Share2 } from "lucide-react"
import { useAdmin } from "@/contexts/admin-context"

// Mock file data
const mockFiles = [
  {
    id: "1",
    name: "project-proposal.pdf",
    type: "application/pdf",
    size: 2500000,
    uploadedAt: new Date(2023, 5, 15).toISOString(),
    uploadedBy: "Admin User",
  },
  {
    id: "2",
    name: "team-photo.jpg",
    type: "image/jpeg",
    size: 4200000,
    uploadedAt: new Date(2023, 6, 22).toISOString(),
    uploadedBy: "Demo User",
  },
  {
    id: "3",
    name: "data-analysis.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 1800000,
    uploadedAt: new Date(2023, 7, 5).toISOString(),
    uploadedBy: "Admin User",
  },
  {
    id: "4",
    name: "presentation.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 3500000,
    uploadedAt: new Date(2023, 8, 12).toISOString(),
    uploadedBy: "Demo User",
  },
  {
    id: "5",
    name: "source-code.zip",
    type: "application/zip",
    size: 8700000,
    uploadedAt: new Date(2023, 9, 8).toISOString(),
    uploadedBy: "Admin User",
  },
]

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
  else return (bytes / 1073741824).toFixed(1) + " GB"
}

// Helper function to get file icon
function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return FileImage
  else if (fileType.includes("pdf")) return FileText
  else if (fileType.includes("zip") || fileType.includes("archive")) return FileArchive
  else return FileIcon
}

interface FileListProps {
  readOnly?: boolean
}

export function FileList({ readOnly = false }: FileListProps) {
  const [files, setFiles] = useState(mockFiles)
  const { isAdmin } = useAdmin()

  // Function to delete a file
  const deleteFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  // Function to download a file (mock)
  const downloadFile = (file: (typeof mockFiles)[0]) => {
    alert(`Downloading ${file.name}...`)
    // In a real app, this would trigger a download
  }

  // Function to share a file (mock)
  const shareFile = (file: (typeof mockFiles)[0]) => {
    alert(`Sharing ${file.name}...`)
    // In a real app, this would generate a shareable link
  }

  // Function to format the date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No files found
              </TableCell>
            </TableRow>
          ) : (
            files.map((file) => {
              const FileTypeIcon = getFileIcon(file.type)

              return (
                <TableRow key={file.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileTypeIcon className="h-4 w-4 text-muted-foreground" />
                    {file.name}
                  </TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                  <TableCell>{file.uploadedBy}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => downloadFile(file)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => shareFile(file)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      {!readOnly && isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => deleteFile(file.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

