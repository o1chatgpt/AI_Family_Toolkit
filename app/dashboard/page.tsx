import FileManager from "../../file-manager"
import { SeedButton } from "@/components/seed-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "lucide-react"
import { DemoSeedButton } from "@/components/demo-seed-button"

export default function DashboardPage() {
  return (
    <>
      <FileManager />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* ... existing cards ... */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
            <DemoSeedButton className="ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Supabase</div>
            <p className="text-xs text-muted-foreground">Connected to your Supabase database</p>
            <div className="mt-4">
              <SeedButton type="all" className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

