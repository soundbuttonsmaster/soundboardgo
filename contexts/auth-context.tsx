"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient, type User } from "@/lib/api/client"

interface AuthContextType {
  user: User | null
  loading: boolean
  mounted: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  mounted: false,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize with false to match server-side render (no user during SSR)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false) // Start with false to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)

  const refreshUser = async () => {
    setLoading(true)
    try {
      const token = apiClient.getToken()
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const response = await apiClient.getProfile()
      setUser(response.data)
    } catch (error) {
      // Token invalid or expired
      apiClient.logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    refreshUser()
  }, [])

  const signOut = async () => {
    apiClient.logout()
    setUser(null)
    // Clear server-side cookie
    await fetch("/api/auth/logout", { method: "POST" })
  }

  return <AuthContext.Provider value={{ user, loading, mounted, signOut, refreshUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
