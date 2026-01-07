export async function GET() {
  const baseUrl = "https://soundboardgo.com"
  const currentDate = new Date().toISOString()

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  xml += "  <sitemap>\n"
  xml += `    <loc>${baseUrl}/sitemap-static.xml</loc>\n`
  xml += `    <lastmod>${currentDate}</lastmod>\n`
  xml += "  </sitemap>\n"

  xml += "  <sitemap>\n"
  xml += `    <loc>${baseUrl}/sitemap-categories.xml</loc>\n`
  xml += `    <lastmod>${currentDate}</lastmod>\n`
  xml += "  </sitemap>\n"

  xml += "  <sitemap>\n"
  xml += `    <loc>${baseUrl}/sitemap-soundboards.xml</loc>\n`
  xml += `    <lastmod>${currentDate}</lastmod>\n`
  xml += "  </sitemap>\n"

  xml += "  <sitemap>\n"
  xml += `    <loc>${baseUrl}/sitemap-sounds.xml</loc>\n`
  xml += `    <lastmod>${currentDate}</lastmod>\n`
  xml += "  </sitemap>\n"

  xml += "</sitemapindex>"

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=21600, s-maxage=21600, stale-while-revalidate=43200",
    },
  })
}

