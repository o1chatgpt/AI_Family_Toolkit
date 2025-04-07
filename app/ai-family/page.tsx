import { AIFamilyRoster } from "@/components/ai-family/ai-family-roster"
import { AIFamilyAddForm } from "@/components/ai-family/ai-family-add-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AIFamilyPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Family Management</h1>

      <Tabs defaultValue="roster" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roster">AI Family Roster</TabsTrigger>
          <TabsTrigger value="add">Add New Member</TabsTrigger>
        </TabsList>

        <TabsContent value="roster">
          <Card>
            <CardHeader>
              <CardTitle>AI Family Roster</CardTitle>
              <CardDescription>View and manage your AI family members</CardDescription>
            </CardHeader>
            <CardContent>
              <AIFamilyRoster />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New AI Family Member</CardTitle>
              <CardDescription>Create a new AI family member with custom capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <AIFamilyAddForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

