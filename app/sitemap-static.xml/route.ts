import { locales } from "@/lib/i18n/config"

export async function GET() {
  const baseUrl = "https://soundboardgo.com"
  const currentDate = new Date().toISOString()

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

  locales.forEach((lang) => {
    // Home page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>hourly</changefreq>\n"
    xml += "    <priority>1.0</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}" />\n`
    })
    xml += "  </url>\n"

    // Trending page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}/trending</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>hourly</changefreq>\n"
    xml += "    <priority>0.9</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/trending" />\n`
    })
    xml += "  </url>\n"

    // New page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}/new</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>hourly</changefreq>\n"
    xml += "    <priority>0.9</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/new" />\n`
    })
    xml += "  </url>\n"

    // About page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}/about</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>monthly</changefreq>\n"
    xml += "    <priority>0.6</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/about" />\n`
    })
    xml += "  </url>\n"

    // Contact page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}/contact</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>monthly</changefreq>\n"
    xml += "    <priority>0.6</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/contact" />\n`
    })
    xml += "  </url>\n"

    // DMCA page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}/dmca</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>monthly</changefreq>\n"
    xml += "    <priority>0.4</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/dmca" />\n`
    })
    xml += "  </url>\n"

    // Disclaimer page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}/disclaimer</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>monthly</changefreq>\n"
    xml += "    <priority>0.4</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/disclaimer" />\n`
    })
    xml += "  </url>\n"

    // Login page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}/login</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>monthly</changefreq>\n"
    xml += "    <priority>0.5</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/login" />\n`
    })
    xml += "  </url>\n"

    // Register page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}/register</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>monthly</changefreq>\n"
    xml += "    <priority>0.5</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/register" />\n`
    })
    xml += "  </url>\n"

    // Upload page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}/upload</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>weekly</changefreq>\n"
    xml += "    <priority>0.6</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/upload" />\n`
    })
    xml += "  </url>\n"

    // Favorites page
    xml += "  <url>\n"
    xml += `    <loc>${baseUrl}/${lang}/favorites</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += "    <changefreq>weekly</changefreq>\n"
    xml += "    <priority>0.5</priority>\n"
    locales.forEach((altLang) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/favorites" />\n`
    })
    xml += "  </url>\n"
  })

  xml += "</urlset>"

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=21600, s-maxage=21600, stale-while-revalidate=43200",
    },
  })
}
