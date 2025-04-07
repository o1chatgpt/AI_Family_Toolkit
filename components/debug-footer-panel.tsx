"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, Bug, RefreshCw, Download, Trash2, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Log entry type definition
type LogEntry = {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error" | "success"
  message: string
  details?: string
}

// Sample log entries
const sampleLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: new Date(),
    level: "info",
    message: "Application initialized",
    details: "All systems operational",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 60000),
    level: "warning",
    message: "API response slow",
    details: "Response time: 2.5s",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 120000),
    level: "error",
    message: "Failed to load resource",
    details: "Error: Network timeout",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 180000),
    level: "success",
    message: "Database connection established",
    details: "Connected to primary database",
  },
]

export function DebugFooterPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>(sampleLogs)
  const [activeTab, setActiveTab] = useState("all")

  // Add a new log entry
  const addLogEntry = (level: "info" | "warning" | "error" | "success", message: string, details?: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      details,
    }
    setLogs((prev) => [newLog, ...prev])
  }

  // Clear all logs
  const clearLogs = () => {
    setLogs([])
  }

  // Download logs as JSON
  const downloadLogs = () => {
    const data = JSON.stringify(logs, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-family-logs-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Filter logs based on active tab
  const filteredLogs = logs.filter((log) => {
    if (activeTab === "all") return true
    return log.level === activeTab
  })

  // Get icon based on log level
  const getLogIcon = (level: "info" | "warning" | "error" | "success") => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  // Add a system info log on mount
  useEffect(() => {
    addLogEntry("info", "Debug panel initialized", "System monitoring active")
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="rounded-t-lg rounded-b-none border-b-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug Console
          {isOpen ? <ChevronDown className="h-4 w-4 ml-2" /> : <ChevronUp className="h-4 w-4 ml-2" />}
        </Button>
      </div>

      <div
        className={cn(
          "bg-background border-t transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "h-64" : "h-0",
        )}
      >
        <div className="flex items-center justify-between p-2 border-b">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="warning">Warnings</TabsTrigger>
              <TabsTrigger value="error">Errors</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => addLogEntry("info", "Manual refresh", "User initiated")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={downloadLogs}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={clearLogs}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-40px)]">
          <div className="p-2 space-y-2">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "p-2 rounded-md text-sm",
                    log.level === "info" && "bg-blue-50 dark:bg-blue-900/20",
                    log.level === "warning" && "bg-yellow-50 dark:bg-yellow-900/20",
                    log.level === "error" && "bg-red-50 dark:bg-red-900/20",
                    log.level === "success" && "bg-green-50 dark:bg-green-900/20",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {getLogIcon(log.level)}
                    <span className="font-medium">{log.message}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{log.timestamp.toLocaleTimeString()}</span>
                  </div>
                  {log.details && <div className="mt-1 text-xs text-muted-foreground">{log.details}</div>}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No logs to display</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

