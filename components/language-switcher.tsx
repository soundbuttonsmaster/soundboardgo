"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { locales, localeNames, type Locale } from "@/lib/i18n/config"
import { Globe } from "lucide-react"

interface Props {
  currentLang: Locale
}

export default function LanguageSwitcher({ currentLang }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`)
    router.push(newPath)
  }

  return (
    <div className="relative w-28">
      <Globe className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <select
        value={currentLang}
        onChange={handleChange}
        className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-8 text-sm text-slate-700 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        aria-label="Select language"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
    </div>
  )
}
