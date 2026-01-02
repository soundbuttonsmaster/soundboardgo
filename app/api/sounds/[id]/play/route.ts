import { NextResponse } from "next/server"
import { getPublicApiClient } from "@/lib/api/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numericId = Number.parseInt(id, 10)

    // Update views when sound is played (public endpoint, no auth required)
    const apiClient = getPublicApiClient()
    await apiClient.updateViews(numericId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error incrementing play count:", error)
    return NextResponse.json({ success: false, error: "Failed to increment play count" }, { status: 500 })
  }
}
