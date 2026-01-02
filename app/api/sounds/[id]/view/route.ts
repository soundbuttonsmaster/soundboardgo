import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numericId = Number.parseInt(id, 10)

    // Update views using Python API (public endpoint, no auth required)
    await apiClient.updateViews(numericId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return NextResponse.json({ error: "Failed to increment view count" }, { status: 500 })
  }
}
