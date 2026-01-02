import type { MetadataRoute } from "next"
import { locales } from "@/lib/i18n/config"
import { getPublicApiClient } from "@/lib/api/server"

async function generateStaticSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = []

  locales.forEach((lang) => {
    staticPages.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    })

    staticPages.push({
      url: `${baseUrl}/${lang}/trending`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    })

    staticPages.push({
      url: `${baseUrl}/${lang}/new`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    })

    staticPages.push(
      {
        url: `${baseUrl}/${lang}/login`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${baseUrl}/${lang}/register`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
    )
  })

  return staticPages
}

async function generateSoundSitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const apiClient = getPublicApiClient()
  const soundPages: MetadataRoute.Sitemap = []

  try {
    let page = 1
    let hasMore = true
    const pageSize = 100

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

        const lastMod = sound.updated_at ? new Date(sound.updated_at) : new Date()

        locales.forEach((lang) => {
          soundPages.push({
            url: `${baseUrl}/${lang}/sound/${slug}/${sound.id}`,
            lastModified: lastMod,
            changeFrequency: "weekly",
            priority: 0.7,
          })
        })
      })

      hasMore = !!response.data.next
      page++
    }
  } catch (error) {
    console.error("Error generating sound sitemap:", error)
  }

  return soundPages
}

async function generateCategorySitemap(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const apiClient = getPublicApiClient()
  const categoryPages: MetadataRoute.Sitemap = []

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
      const lastMod = category.updated_at ? new Date(category.updated_at) : new Date()

      locales.forEach((lang) => {
        categoryPages.push({
          url: `${baseUrl}/${lang}/${slug}/${category.id}`,
          lastModified: lastMod,
          changeFrequency: "weekly",
          priority: 0.8,
        })
      })
    })
  } catch (error) {
    console.error("Error generating category sitemap:", error)
  }

  return categoryPages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://soundbuttonsmax.com"
  const currentDate = new Date().toISOString()

  return [
    {
      url: `${baseUrl}/sitemap-static.xml`,
      lastModified: currentDate,
    },
    {
      url: `${baseUrl}/sitemap-categories.xml`,
      lastModified: currentDate,
    },
    {
      url: `${baseUrl}/sitemap-sounds.xml`,
      lastModified: currentDate,
    },
  ]
}
