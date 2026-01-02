"use client"

import { useEffect, useState } from "react"

export function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  // Render placeholder during SSR to match initial client render
  return <>{year ?? new Date().getFullYear()}</>
}
