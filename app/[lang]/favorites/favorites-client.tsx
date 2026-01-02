"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { apiClient, type Sound } from "@/lib/api/client"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/contexts/favorites-context"
import SoundGrid from "@/components/sound/sound-grid"
import type { Locale } from "@/lib/i18n/config"
import Link from "next/link"

interface Props {
  lang: Locale
  dict: any
}

export default function FavoritesClient({ lang, dict }: Props) {
  const [sounds, setSounds] = useState<Sound[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { favorites } = useFavorites()

  useEffect(() => {
    loadFavorites()
  }, [user, favorites])

  const loadFavorites = async () => {
    try {
      if (user) {
        // Load from API for authenticated users
        const response = await apiClient.getUserFavorites({ page_size: 100 })
        setSounds(response.data.results || [])
      } else {
        // Load from localStorage for non-authenticated users
        if (favorites.size > 0) {
          // Fetch sounds by IDs
          const favoriteIds = Array.from(favorites)
          const soundPromises = favoriteIds.map((id) => apiClient.getSound(id).catch(() => null))
          const soundResults = await Promise.all(soundPromises)
          setSounds(soundResults.filter((s): s is Sound => s !== null && s.data !== undefined).map((s) => s.data))
        } else {
          setSounds([])
        }
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
      setSounds([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
      </div>
    )
  }

  if (sounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Heart className="h-16 w-16 text-slate-300 dark:text-slate-700" />
        <h2 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
          {dict.favorites?.empty || "No favorites yet"}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {dict.favorites?.emptyDescription || "Click the heart icon on any sound to add it to your favorites"}
        </p>
        {!user && (
          <Link
            href={`/${lang}/login`}
            className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Login to save favorites
          </Link>
        )}
      </div>
    )
  }

  return <SoundGrid sounds={sounds} lang={lang} />
}
