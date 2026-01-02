import { getPublicApiClient } from "@/lib/api/server"
import { locales } from "@/lib/i18n/config"

export async function GET() {
  const baseUrl = "https://soundboardgo.com"
  const apiClient = getPublicApiClient()

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

  try {
    const response = await apiClient.getCategories()
    const categories = response.data || []

    const flattenCategories = (cats: typeof categories): typeof categories => {
      const result: typeof categories = []
      const traverse = (items: typeof categories) => {
        items.forEach((cat) => {
          result.push(cat)
          if (cat.children && cat.children.length > 0) {
            traverse(cat.children)
          }
        })
      }
      traverse(cats)
      return result
    }

    const allCategories = flattenCategories(categories)

    allCategories.forEach((category) => {
      const slug = category.name.toLowerCase().replace(/\s+/g, "-")
      const lastMod = category.updated_at ? new Date(category.updated_at).toISOString() : new Date().toISOString()

      locales.forEach((lang) => {
        xml += "  <url>\n"
        xml += `    <loc>${baseUrl}/${lang}/${slug}/${category.id}</loc>\n`
        xml += `    <lastmod>${lastMod}</lastmod>\n`
        xml += "    <changefreq>daily</changefreq>\n"
        xml += "    <priority>0.8</priority>\n"
        locales.forEach((altLang) => {
          xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/${slug}/${category.id}" />\n`
        })
        xml += "  </url>\n"
      })
    })
  } catch (error) {
    console.error("[SoundBoardGo] Sitemap error fetching categories:", error)
    xml += `  <!-- Error: ${error instanceof Error ? error.message : "Unknown error"} -->\n`
  }

  xml += "</urlset>"

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=21600, s-maxage=21600, stale-while-revalidate=43200",
    },
  })
}
