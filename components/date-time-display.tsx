"use client"

import { useState, useEffect } from "react"

export function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState("")

  useEffect(() => {
    // Set initial date/time
    updateDateTime()

    // Update every minute
    const interval = setInterval(updateDateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  const updateDateTime = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    setDateTime(now.toLocaleString("en-US", options))
  }

  return <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{dateTime}</div>
}

