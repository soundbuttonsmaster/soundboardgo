import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json()

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Email, password, and username are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const response = await apiClient.register({
      email,
      password,
      username,
    })

    return NextResponse.json(
      {
        success: true,
        user: response.data.user,
        token: response.data.token,
        message: "Registration successful!",
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
