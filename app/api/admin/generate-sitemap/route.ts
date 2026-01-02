import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { getServerUser } from "@/lib/api/server"

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated
    const user = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Add admin role check when API supports it
    // For now, any authenticated user can regenerate sitemaps
    // if (user.role_code !== 'ADMIN') {
    //   return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    // }

    // Revalidate all sitemap routes
    revalidatePath("/sitemap.xml")
    revalidatePath("/sitemap-static.xml")
    revalidatePath("/sitemap-categories.xml")
    revalidatePath("/sitemap-sounds.xml")

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: "Sitemaps regenerated successfully",
    })
  } catch (error) {
    console.error("[SoundBoardGo] Admin sitemap generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to regenerate sitemaps",
      },
      { status: 500 },
    )
  }
}
