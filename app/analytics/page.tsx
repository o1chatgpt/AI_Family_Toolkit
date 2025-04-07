import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <p className="mb-4">This is the analytics page.</p>
      <Button asChild>
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  )
}

