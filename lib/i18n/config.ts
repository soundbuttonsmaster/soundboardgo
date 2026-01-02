// Supported languages configuration
export const locales = [
  "en", // English
  "es", // Spanish
  "fr", // French
  "de", // German
  "pt", // Portuguese
  "it", // Italian
  "ja", // Japanese
  "ko", // Korean
  "ru", // Russian
] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  ru: "Русский",
}

// RTL languages
export const rtlLocales: Locale[] = []

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export const languages = locales
