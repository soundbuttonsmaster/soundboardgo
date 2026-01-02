"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "./auth-context"

interface FavoritesContextType {
  favorites: Set<number>
  loading: boolean
  toggleFavorite: (soundId: number) => Promise<boolean>
  isFavorite: (soundId: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  loading: true,
  toggleFavorite: async () => false,
  isFavorite: () => false,
})

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
      // Load from localStorage for non-authenticated users
      const stored = localStorage.getItem("favorites")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setFavorites(new Set(Array.isArray(parsed) ? parsed : []))
        } catch {
          setFavorites(new Set())
        }
      }
      setLoading(false)
    }
  }, [user])

  const loadFavorites = async () => {
    if (!user) return

    try {
      const response = await apiClient.getUserFavorites()
      const favoriteIds = response.data.results.map((sound) => sound.id)
      setFavorites(new Set(favoriteIds))
    } catch (error) {
      console.error("Failed to load favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = useCallback(
    async (soundId: number): Promise<boolean> => {
      const isFav = favorites.has(soundId)

      if (user) {
        // Authenticated user - save to API
        try {
          if (isFav) {
            await apiClient.unfavoriteSound(soundId)
          } else {
            await apiClient.favoriteSound(soundId)
          }
        } catch (error) {
          console.error("Failed to toggle favorite:", error)
          return isFav
        }
      } else {
        // Non-authenticated user - save to localStorage
        const newFavorites = new Set(favorites)
        if (isFav) {
          newFavorites.delete(soundId)
        } else {
          newFavorites.add(soundId)
        }
        localStorage.setItem("favorites", JSON.stringify([...newFavorites]))
      }

      setFavorites((prev) => {
        const newSet = new Set(prev)
        if (isFav) {
          newSet.delete(soundId)
        } else {
          newSet.add(soundId)
        }
        return newSet
      })

      return !isFav
    },
    [favorites, user],
  )

  const isFavorite = useCallback(
    (soundId: number) => {
      return favorites.has(soundId)
    },
    [favorites],
  )

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
