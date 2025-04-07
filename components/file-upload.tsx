"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function FileUpload({ userId }: { userId: string }) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    clearInterval(interval)
    setProgress(100)

    // In a real app, this would upload to Supabase Storage
    console.log("Uploading files for user:", userId)

    setTimeout(() => {
      setUploading(false)
      setFiles([])
      setProgress(0)
    }, 500)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-1">Drag and drop files</h3>
          <p className="text-sm text-muted-foreground mb-4">or click to browse from your computer</p>
          <input type="file" id="file-upload" className="hidden" multiple onChange={handleFileChange} />
          <Button asChild>
            <label htmlFor="file-upload">Select Files</label>
          </Button>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Files to upload</h4>
              <Button variant="outline" size="sm" onClick={() => setFiles([])}>
                Clear All
              </Button>
            </div>

            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                      {file.type.includes("image") ? (
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={file.name}
                          className="w-8 h-8 rounded-md object-cover"
                        />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={uploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {uploading ? (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-xs text-center text-muted-foreground">Uploading... {progress}%</p>
              </div>
            ) : (
              <Button onClick={uploadFiles} className="w-full">
                Upload {files.length} {files.length === 1 ? "File" : "Files"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

