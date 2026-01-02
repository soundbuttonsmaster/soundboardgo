import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://soundboardgo.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/auth-cp/", "/api/", "/_next/", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/auth-cp/", "/api/", "/_next/", "/admin/"],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-static.xml`,
      `${baseUrl}/sitemap-soundboards.xml`,
      `${baseUrl}/sitemap-sounds.xml`,
    ],
    host: baseUrl,
  }
}
