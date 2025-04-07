"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { DialogTrigger } from "@/components/ui/dialog"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { File, FolderIcon, Download, Trash2, Edit, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface FileItem {
  name: string
  size: string
  type: string
  addtime: string
  id: string
}

export function AAPanelFileManager() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiSk, setApiSk] = useState("tvWFoGWYvjaVKsq7hB3HHd56M3mO2VbW") // Replace with your API key
  const [requestTime, setRequestTime] = useState<number>(0)
  const [requestToken, setRequestToken] = useState("")
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [fileToRename, setFileToRename] = useState<FileItem | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const router = useRouter()

  // Function to calculate the request token
  const calculateRequestToken = (requestTime: number, apiSk: string): string => {
    const md5 = (str: string) => {
      const crypto = require("crypto")
      return crypto.createHash("md5").update(str).digest("hex")
    }
    return md5(String(requestTime) + md5(apiSk))
  }

  // Function to fetch data from the aaPanel API
  const fetchData = async (action: string, params: Record<string, string> = {}) => {
    if (!apiSk) {
      setError("API key is not set.")
      return null
    }

    const now = Math.floor(Date.now() / 1000)
    const token = calculateRequestToken(now, apiSk)

    const url = `/data?action=${action}&table=sites` // Replace with the actual API endpoint
    const searchParams = new URLSearchParams({
      request_time: String(now),
      request_token: token,
      ...params,
    })

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: searchParams.toString(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.data) {
        throw new Error(data.msg || "No data received")
      }
      return data.data
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching data.")
      console.error("API Error:", error)
      return null
    }
  }

  // Fetch files
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true)
      const data = await fetchData("getData", { limit: "15" })
      if (data) {
        // Mock data for now
        const mockData: FileItem[] = data.map((item: any) => ({
          id: item.id.toString(), // Assuming id is a number, convert to string
          name: item.name,
          size: "10MB", // Mock size
          type: "application/pdf", // Mock type
          addtime: item.addtime,
        }))
        setFiles(mockData)
      }
      setLoading(false)
    }

    fetchFiles()
  }, [apiSk])

  // Handle new folder creation
  const handleCreateFolder = async () => {
    // Implement the API call to create a folder here
    // For now, just log the folder name
    console.log("Creating folder:", newFolderName)
    setShowNewFolderDialog(false)
    setNewFolderName("")
  }

  // Handle file upload
  const handleUpload = async () => {
    if (!fileToUpload) return

    // In a real implementation, you would upload the file to the server
    console.log("Uploading file:", fileToUpload.name)
    setShowUploadDialog(false)
    setFileToUpload(null)
  }

  // Handle file deletion
  const handleDelete = async (fileId: string) => {
    // Implement the API call to delete the file here
    // For now, just log the file ID
    console.log("Deleting file:", fileId)
    setFiles(files.filter((file) => file.id !== fileId))
  }

  // Handle file rename
  const handleRename = async () => {
    // Implement the API call to rename the file here
    // For now, just log the new file name
    console.log("Renaming file:", newFileName)
    setShowRenameDialog(false)
    setNewFileName("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>aaPanel File Manager</CardTitle>
        <CardDescription>Manage your websites and files</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {loading ? (
          <p>Loading files...</p>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowNewFolderDialog(true)} variant="outline" size="sm">
                <FolderIcon className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>Select a file to upload</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="file">File</Label>
                      <Input id="file" type="file" onChange={(e) => setFileToUpload(e.target.files?.[0] || null)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!fileToUpload}>
                      Upload
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <File className="h-4 w-4" />
                      {file.name}
                    </TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{file.addtime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setFileToRename(file)
                            setNewFileName(file.name.split(".")[0])
                            setShowRenameDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
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
                  <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFolder}>Create Folder</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
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
                      placeholder="Enter new file name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRename}>Rename</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  )
}

