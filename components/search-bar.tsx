"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import type { Locale } from "@/lib/i18n/config"

interface Props {
  lang: Locale
  placeholder: string
}

export default function SearchBar({ lang, placeholder }: Props) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${lang}/search/${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      <label htmlFor="search-input" className="sr-only">
        {placeholder || "Search"}
      </label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="flex-1 border border-r-0 border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
      />
      <button
        type="submit"
        className="border border-slate-300 bg-slate-100 px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  )
}
