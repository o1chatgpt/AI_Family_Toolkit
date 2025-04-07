import { CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from 'lucide-react'
import { AdminStatus } from "@/components/admin-status"
import { AdminProvider } from "@/components/providers"
import { AIFamilyList } from "@/components/ai-family-list"
import { TaskList } from "@/components/task-list"
import { FileText, Settings } from 'lucide-react';

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Family",
  description: "Your intelligent AI assistant family for various tasks",
}

export default function Home() {
 return (
   <div className="container py-8">
     <div className="flex flex-col items-center text-center mb-12">
       <h1 className="text-4xl font-bold mb-4">Welcome to AI Family</h1>
       <p className="text-xl text-muted-foreground max-w-2xl mb-6">
         Your intelligent AI assistant family for various tasks
       </p>
       <AdminStatus />
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center">
             <Users className="h-4 w-4 mr-2" />
             AI Family
           </CardTitle>
           <CardDescription>Meet your AI assistant family members</CardDescription>
         </CardHeader>
         <CardContent>
           <AIFamilyList />
         </CardContent>
       </Card>

       <Card>
         <CardHeader>
           <CardTitle className="flex items-center">
             <FileText className="h-4 w-4 mr-2" />
             Tasks
           </CardTitle>
           <CardDescription>View and manage tasks assigned to AI family members</CardDescription>
         </CardHeader>
         <CardContent>
           <TaskList />
         </CardContent>
       </Card>

       <Card>
         <CardHeader>
           <CardTitle className="flex items-center">
             <Settings className="h-4 w-4 mr-2" />
             System Settings
           </CardTitle>
           <CardDescription>Configure global settings for the AI Family Toolkit</CardDescription>
         </CardHeader>
         <CardContent>
           <p>Configure system settings here</p>
         </CardContent>
       </Card>
     </div>
   </div>
 )
}

