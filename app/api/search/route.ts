import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const lang = searchParams.get("lang") || "en"

    console.log("[SoundBoardGo] Search API called with query:", query)

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ sounds: [] })
    }

    const searchTerm = query.trim()

    // Use Python API search endpoint
    const response = await apiClient.searchSounds(searchTerm, { page_size: 100 })

    console.log("[SoundBoardGo] Found", response.data.results?.length || 0, "sounds matching:", query)

    return NextResponse.json({ sounds: response.data.results || [] })
  } catch (error) {
    console.error("[SoundBoardGo] Error in search API:", error)
    return NextResponse.json({ error: "Internal server error", sounds: [] }, { status: 500 })
  }
}
