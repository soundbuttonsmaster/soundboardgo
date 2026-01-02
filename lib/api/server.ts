/**
 * Server-side API client helper
 * Handles token from cookies for server-side requests
 */

import { cookies } from "next/headers"
import ApiClient, { type User } from "./client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://play.soundboard.cloud/api/soundboardgo"

/**
 * Get a public API client (no authentication)
 * Use this for cached functions that don't need user context
 */
export function getPublicApiClient(): ApiClient {
  return new ApiClient(API_BASE_URL)
}

/**
 * Get an authenticated API client from cookies
 * Use this for non-cached functions that need user context
 */
export async function getServerApiClient(): Promise<ApiClient> {
  const cookieStore = await cookies()
  const token = cookieStore.get("api_token")?.value || null

  const client = new ApiClient(API_BASE_URL)
  if (token) {
    client.setToken(token)
  }

  return client
}

export async function getServerUser(): Promise<User | null> {
  try {
    const client = await getServerApiClient()
    const response = await client.getProfile()
    return response.data
  } catch {
    return null
  }
}

export async function setServerToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("api_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function clearServerToken() {
  const cookieStore = await cookies()
  cookieStore.delete("api_token")
}

