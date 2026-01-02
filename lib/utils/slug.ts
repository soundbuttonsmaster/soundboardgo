/**
 * Generate SEO-friendly slug from sound name
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

/**
 * Create sound URL path with slug and numeric ID
 * @example getSoundUrl("Fart Sound", 123, "en") => "/en/sound/fart-sound/123"
 */
export function getSoundUrl(soundName: string, numericId: number, lang = "en"): string {
  const slug = generateSlug(soundName)
  return `/${lang}/sound/${slug}/${numericId}`
}

/**
 * Extract numeric ID from URL
 */
export function extractIdFromUrl(id: string): number {
  return Number.parseInt(id, 10)
}

/**
 * Create soundboard URL path with slug and numeric ID
 * @example getSoundboardUrl("Meme Soundboard", 1, "en") => "/en/meme-soundboard/1"
 */
export function getSoundboardUrl(soundboardName: string, numericId: number, lang = "en"): string {
  const slug = generateSlug(soundboardName)
  return `/${lang}/${slug}/${numericId}`
}
