import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PresentationsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Presentations</h1>
      <p className="mb-4">This is the presentations page.</p>
      <Button asChild>
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  )
}

