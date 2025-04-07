"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, MessageSquare, Code, Users } from "lucide-react"

export default function AIFamilyReturnPage() {
  const router = useRouter()

  // Automatically redirect to home after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Returning from AI Family</h1>
        <p className="text-gray-500 dark:text-gray-400">
          You're being redirected to the home page. You can also choose one of the options below.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Button size="lg" asChild>
          <Link href="/">
            <Home className="h-5 w-5 mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              AI Family
            </CardTitle>
            <CardDescription>Return to AI Family overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Browse all AI Family members and their specialties
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/ai-family">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to AI Family
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
              Chat
            </CardTitle>
            <CardDescription>Start a new conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">Chat with any AI Family member about any topic</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/chat">Open Chat</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-purple-500" />
              Code Editor
            </CardTitle>
            <CardDescription>Write and edit code</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get coding assistance and generate code snippets</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/code">Open Code Editor</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You will be automatically redirected to the home page in a few seconds.
        </p>
        <div className="mt-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-1" />
              Go to Home Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

