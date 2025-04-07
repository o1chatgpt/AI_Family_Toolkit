"use client"

import { useRouter as useNextRouter, usePathname, useSearchParams } from "next/navigation"

export function useRouter() {
  const router = useNextRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return {
    ...router,
    pathname,
    query: Object.fromEntries(searchParams.entries()),
    asPath: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""),
  }
}

