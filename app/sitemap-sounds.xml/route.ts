import { getPublicApiClient } from "@/lib/api/server"
import { locales } from "@/lib/i18n/config"

export async function GET() {
  console.log("[SoundBoardGo] ===== SITEMAP SOUNDS GENERATION START =====")

  const baseUrl = "https://soundboardgo.com"
  const apiClient = getPublicApiClient()

  console.log("[SoundBoardGo] API client created")
  console.log("[SoundBoardGo] Attempting to fetch sounds...")

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

  try {
    let page = 1
    let hasMore = true
    const pageSize = 100
    let totalSounds = 0

    while (hasMore && page <= 100) {
      const response = await apiClient.getSounds({ page, page_size: pageSize })
      const sounds = response.data.results || []

      if (sounds.length === 0) {
        hasMore = false
        break
      }

      sounds.forEach((sound) => {
        const slug = sound.name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")

        const lastMod = sound.updated_at ? new Date(sound.updated_at).toISOString() : new Date().toISOString()

        locales.forEach((lang) => {
          xml += "  <url>\n"
          xml += `    <loc>${baseUrl}/${lang}/sound/${slug}/${sound.id}</loc>\n`
          xml += `    <lastmod>${lastMod}</lastmod>\n`
          xml += "    <changefreq>weekly</changefreq>\n"
          xml += "    <priority>0.7</priority>\n"
          locales.forEach((altLang) => {
            xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/sound/${slug}/${sound.id}" />\n`
          })
          xml += "  </url>\n"
        })

        totalSounds++
      })

      hasMore = !!response.data.next
      page++
    }

    console.log(`[SoundBoardGo] SUCCESS: Found ${totalSounds} sounds`)
  } catch (error) {
    console.error("[SoundBoardGo] ERROR:", error)
    xml += `  <!-- Error: ${error instanceof Error ? error.message : "Unknown error"} -->\n`
  }

  xml += "</urlset>"

  console.log("[SoundBoardGo] ===== SITEMAP SOUNDS GENERATION END =====")

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=21600, s-maxage=21600, stale-while-revalidate=43200",
    },
  })
}
