"use client"

import { useState } from "react"
import { FileText, Image, Code, File, Download, Trash2, ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatFileSize, formatDate } from "@/lib/utils"

interface FileViewerProps {
  file: {
    id: string
    name: string
    type: string
    size: number
    url?: string
    created_at: string
  }
  onDelete: (id: string) => void
}

export function FileViewer({ file, onDelete }: FileViewerProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isDemo = file.id.startsWith("demo-")

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-6 w-6" />
    } else if (file.type.includes("pdf")) {
      return <FileText className="h-6 w-6" />
    } else if (
      file.type.includes("javascript") ||
      file.type.includes("typescript") ||
      file.type.includes("html") ||
      file.type.includes("css") ||
      file.type.includes("json")
    ) {
      return <Code className="h-6 w-6" />
    } else {
      return <File className="h-6 w-6" />
    }
  }

  const getFilePreview = () => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center p-4">
          <img
            src={file.url || "/placeholder.svg?height=400&width=300"}
            alt={file.name}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      )
    } else if (file.type.includes("pdf") && !isDemo) {
      return <iframe src={file.url} className="w-full h-[70vh]" title={file.name} />
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          {getFileIcon()}
          <p className="mt-4 text-center">
            {isDemo ? "This is a demo file. Preview is not available." : "Preview not available for this file type."}
          </p>
          {!isDemo && (
            <Button variant="outline" className="mt-4" onClick={() => window.open(file.url, "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open File
            </Button>
          )}
        </div>
      )
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(file.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div
          className="h-32 bg-gray-100 flex items-center justify-center cursor-pointer"
          onClick={() => setShowPreview(true)}
        >
          {file.type.startsWith("image/") ? (
            <img
              src={file.url || "/placeholder.svg?height=200&width=200"}
              alt={file.name}
              className="max-w-full max-h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              {getFileIcon()}
              <span className="text-xs mt-2 text-gray-500">{file.type.split("/")[1]?.toUpperCase() || "FILE"}</span>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm truncate" title={file.name}>
            {file.name}
          </h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
            <span className="text-xs text-gray-500">{formatDate(file.created_at)}</span>
          </div>
        </CardContent>
        <CardFooter className="p-2 pt-0 flex justify-between">
          {!isDemo && (
            <Button variant="ghost" size="sm" asChild>
              <a href={file.url} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(true)}>
            Preview
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{file.name}</DialogTitle>
          </DialogHeader>
          {getFilePreview()}
        </DialogContent>
      </Dialog>
    </>
  )
}

