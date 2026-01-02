import type React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { locales, isRtl, type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"

interface Props {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params

  if (!locales.includes(lang as Locale)) {
    return {}
  }

  const dict = await getDictionary(lang as Locale)

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  }
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params

  if (!locales.includes(lang as Locale)) {
    notFound()
  }

  const isRtlLang = isRtl(lang as Locale)

  return (
    <div lang={lang} dir={isRtlLang ? "rtl" : "ltr"} className="min-h-screen">
      {children}
    </div>
  )
}
