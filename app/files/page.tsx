"use client"

import { AAPanelFileManager } from "@/components/aa-panel-file-manager"
import { FileList } from "@/components/file-list"
import { AdminOnly } from "@/components/admin-only"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function FilesPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if the component has mounted
    if (typeof window !== "undefined") {
      // Check if the user has completed onboarding
      const hasCompletedOnboarding =
        localStorage.getItem("user_name") &&
        localStorage.getItem("user_industry") &&
        localStorage.getItem("user_primary_use") &&
        localStorage.getItem("user_ai_experience")

      // Redirect to onboarding if not completed
      if (!hasCompletedOnboarding) {
        router.push("/onboarding")
      }
    }
  }, [router])

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Files</h1>

      <div className="grid gap-6">
        <AdminOnly
          fallback={
            <div className="mb-6">
              <FileList readOnly />
            </div>
          }
        >
          <div className="mb-6">
            <AAPanelFileManager />
          </div>
        </AdminOnly>
      </div>
    </div>
  )
}

