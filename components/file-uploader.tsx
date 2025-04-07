"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, File, Image, FileText, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  maxSize?: number // in MB
  className?: string
  buttonText?: string
  multiple?: boolean
}

export function FileUploader({
  onUpload,
  accept = "*/*",
  maxSize = 10, // 10MB default
  className,
  buttonText = "Upload File",
  multiple = false,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(e.target.files)
    }
  }

  const handleFiles = async (fileList: FileList) => {
    setError(null)

    // Convert FileList to array for easier handling
    const files = Array.from(fileList)

    // Check file size
    const oversizedFiles = files.filter((file) => file.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError(`File size exceeds the ${maxSize}MB limit: ${oversizedFiles.map((f) => f.name).join(", ")}`)
      return
    }

    // Process files
    setIsUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Simulate progress for better UX
        const uploadSteps = 10
        for (let step = 1; step <= uploadSteps; step++) {
          setProgress((step / uploadSteps) * 100)
          await new Promise((resolve) => setTimeout(resolve, 50))
        }

        await onUpload(file)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
      setProgress(0)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="h-6 w-6" />
    if (fileType.includes("pdf")) return <FileText className="h-6 w-6" />
    if (fileType.includes("text") || fileType.includes("javascript") || fileType.includes("json")) {
      return <Code className="h-6 w-6" />
    }
    return <File className="h-6 w-6" />
  }

  return (
    <div className={className}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700",
          isUploading && "opacity-50 pointer-events-none",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={accept}
          multiple={multiple}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            {accept === "*/*" ? "Any file type" : accept.split(",").join(", ")} up to {maxSize}MB
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {buttonText}
          </Button>
        </div>
      </div>

      {isUploading && (
        <div className="mt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center mt-1">Uploading... {Math.round(progress)}%</p>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-500 flex items-center">
          <X className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}

