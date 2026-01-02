/**
 * Helper functions for API integration
 * Provides backward compatibility with soundboards concept using categories
 */

import { getPublicApiClient } from "./server"
import { type Category } from "./client"

export interface SoundboardItem {
  id: number
  name: string
  slug: string
  numeric_id: number
}

/**
 * Get categories formatted as soundboard items for navigation
 * This provides backward compatibility with the old soundboards structure
 * Uses public API client (no auth needed for categories)
 */
export async function getSoundboards(): Promise<SoundboardItem[]> {
  try {
    const apiClient = getPublicApiClient()
    const response = await apiClient.getCategories()
    console.log("API Response for getCategories:", response.data);

    // Flatten categories tree and format as soundboard items
    const flattenCategories = (cats: Category[]): SoundboardItem[] => {
      const result: SoundboardItem[] = []
      const traverse = (items: Category[]) => {
        items.forEach((cat) => {
          // Create slug from name
          const slug = cat.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")

          result.push({
            id: cat.id,
            numeric_id: cat.id,
            name: cat.name,
            slug,
          })

          if (cat.children && cat.children.length > 0) {
            traverse(cat.children)
          }
        })
      }
      traverse(response.data)
      return result
    }

    return flattenCategories(response.data)
  } catch (error) {
    console.error("Error fetching soundboards from API:", error)
    console.warn("Returning empty soundboards array due to API error")
    return []
  }
}

