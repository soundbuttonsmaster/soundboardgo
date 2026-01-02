import { NextResponse } from "next/server"
import { clearServerToken } from "@/lib/api/server"

export async function POST() {
  try {
    await clearServerToken()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

