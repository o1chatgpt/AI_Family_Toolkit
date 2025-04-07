import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SalesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sales Collateral</h1>
      <p className="mb-4">Browse sales collateral here.</p>
      <Button asChild>
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  )
}

