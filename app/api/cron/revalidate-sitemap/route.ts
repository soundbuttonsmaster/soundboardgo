import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Revalidate all sitemap routes
    revalidatePath("/sitemap.xml")
    revalidatePath("/sitemap-static.xml")
    revalidatePath("/sitemap-soundboards.xml")
    revalidatePath("/sitemap-sounds.xml")

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: "Sitemaps revalidated successfully at 3AM USA time",
    })
  } catch (error) {
    console.error("[SoundBoardGo] Sitemap revalidation error:", error)
    return NextResponse.json(
      {
        revalidated: false,
        error: "Failed to revalidate sitemaps",
      },
      { status: 500 },
    )
  }
}
