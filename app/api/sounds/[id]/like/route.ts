import { NextResponse } from "next/server"
import { getServerApiClient } from "@/lib/api/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numericId = Number.parseInt(id, 10)

    const apiClient = await getServerApiClient()
    await apiClient.likeSound(numericId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error liking sound:", error)
    return NextResponse.json({ success: false, error: "Failed to like sound" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numericId = Number.parseInt(id, 10)

    const apiClient = await getServerApiClient()
    await apiClient.unlikeSound(numericId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unliking sound:", error)
    return NextResponse.json({ success: false, error: "Failed to unlike sound" }, { status: 500 })
  }
}
