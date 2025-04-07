import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TrainingPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Training Materials</h1>
      <p className="mb-4">Browse training materials here.</p>
      <Button asChild>
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  )
}

