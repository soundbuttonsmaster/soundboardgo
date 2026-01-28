import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { getPublicApiClient } from "@/lib/api/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSoundboards } from "@/lib/api/helpers";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import SoundDetailClient from "./sound-detail-client";
import type { Sound } from "@/lib/types/database";
import { extractIdFromUrl, generateSlug } from "@/lib/utils/slug";

interface Props {
  params: Promise<{ lang: Locale; slug: string; id: string }>;
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 500
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on 404 errors (sound doesn't exist)
      if (error instanceof Error && error.message.includes("404")) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error("Max retries exceeded");
}

/**
 * Factory function to create a cached sound data fetcher for a specific sound ID
 * This ensures each sound has its own cache entry
 */
function createSoundDataFetcher(numericId: number) {
  return unstable_cache(
    async () => {
      if (isNaN(numericId) || numericId < 1) {
        return null;
      }

      const apiClient = getPublicApiClient();

      try {
        // Retry logic for sound fetch
        const soundResponse = await retryWithBackoff(
          () => apiClient.getSound(numericId),
          3,
          500
        ).catch((error) => {
          console.error(`Failed to fetch sound ${numericId} after retries:`, error);
          return null;
        });

        if (!soundResponse || !soundResponse.data) {
          return null;
        }

        // Fetch related sounds (non-critical, so we allow it to fail silently)
        const relatedResponse = await apiClient
          .getRelatedSounds(numericId, { limit: 29 })
          .catch(() => ({ status: 200, data: { results: [] } }));

        return {
          sound: soundResponse.data as unknown as Sound,
          relatedSounds: (relatedResponse.data.results || []) as Sound[],
        };
      } catch (error) {
        console.error(`Error fetching sound data for ID ${numericId}:`, error);
        return null;
      }
    },
    [`sound-detail-${numericId}`],
    {
      revalidate: 900,
      tags: ["sounds"],
    }
  );
}

// Helper function to get sound data with caching
async function getSoundData(numericId: number) {
  const fetcher = createSoundDataFetcher(numericId);
  return fetcher();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug, id } = await params;
  const numericId = extractIdFromUrl(id);

  if (isNaN(numericId)) {
    return {
      title: "Sound Not Found | SoundBoardGo",
    };
  }

  const data = await getSoundData(numericId);

  if (!data) {
    return {
      title: "Sound Not Found | SoundBoardGo",
    };
  }

  const { sound } = data;
  const siteUrl = "https://soundboardgo.com";
  // Use actual route params to ensure canonical matches the page URL
  const soundUrl = `${siteUrl}/${lang}/sound/${slug}/${id}`;
  const ogImageUrl = `${siteUrl}/ogimage.jpg`;

  // Localized SEO title & description templates per language
  const soundName = sound.name;

  const titleByLocale: Record<Locale, string> = {
    en: `${soundName} Sound Effect Button | SoundBoardGo`,
    es: `${soundName} Botón de Efecto de Sonido | SoundBoardGo`,
    fr: `${soundName} Bouton d'Effet Sonore | SoundBoardGo`,
    de: `${soundName} Soundeffekt-Button | SoundBoardGo`,
    pt: `${soundName} Botão de Efeito Sonoro | SoundBoardGo`,
    it: `${soundName} Pulsante Effetto Sonoro | SoundBoardGo`,
    ja: `${soundName} 効果音ボタン | SoundBoardGo`,
    ko: `${soundName} 효과음 버튼 | SoundBoardGo`,
    ru: `${soundName} Кнопка Звукового Эффекта | SoundBoardGo`,
  };

  const descriptionByLocale: Record<Locale, string> = {
    en: `Download and play the ${soundName} sound effect button for your soundboard. Perfect for meme creation, gaming, and custom soundboards!`,
    es: `Descarga y reproduce el botón de efecto de sonido ${soundName} para tu soundboard. ¡Perfecto para crear memes, gaming y soundboards personalizados!`,
    fr: `Téléchargez et jouez le bouton d'effet sonore ${soundName} pour votre soundboard. Parfait pour la création de mèmes, le gaming et les soundboards personnalisés !`,
    de: `Laden Sie den ${soundName} Soundeffekt-Button für Ihr Soundboard herunter und spielen Sie ihn ab. Perfekt für Meme-Erstellung, Gaming und individuelle Soundboards!`,
    pt: `Baixe e reproduza o botão de efeito sonoro ${soundName} para seu soundboard. Perfeito para criação de memes, gaming e soundboards personalizados!`,
    it: `Scarica e riproduci il pulsante effetto sonoro ${soundName} per la tua soundboard. Perfetto per creare meme, gaming e soundboard personalizzate!`,
    ja: `サウンドボード用の${soundName}効果音ボタンをダウンロードして再生。ミーム作成、ゲーミング、カスタムサウンドボードに最適!`,
    ko: `사운드보드용 ${soundName} 효과음 버튼을 다운로드하고 재생하세요. 밈 제작, 게임, 커스텀 사운드보드에 완벽합니다!`,
    ru: `Скачайте и воспроизведите кнопку звукового эффекта ${soundName} для вашей звуковой панели. Идеально для создания мемов, игр и пользовательских звуковых панелей!`,
  };

  const title = titleByLocale[lang];
  const description = descriptionByLocale[lang];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      sound.name,
      `${sound.name} sound`,
      `${sound.name} button`,
      `${sound.name} mp3`,
      `${sound.name} download`,
      "sound button",
      "free sound download",
      "meme sound",
      "soundboard",
      sound.soundboard?.name || "",
      "sound effect",
      "audio clip",
    ],
    authors: [{ name: "SoundBoardGo" }],
    creator: "SoundBoardGo",
    publisher: "SoundBoardGo",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: lang,
      url: soundUrl,
      siteName: "SoundBoardGo",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${sound.name} Sound Button`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      creator: "@soundboardgo",
    },
    alternates: {
      canonical: soundUrl,
      languages: Object.fromEntries(
        locales.map((l) => {
          // Use the same slug for all language alternates to maintain consistency
          const altSlug = l === lang ? slug : generateSlug(sound.name);
          return [l, `${siteUrl}/${l}/sound/${altSlug}/${id}`];
        })
      ),
    },
  };
}

export default async function SoundDetailPage({ params }: Props) {
  const { lang, slug, id } = await params;
  const numericId = extractIdFromUrl(id);

  if (isNaN(numericId)) {
    notFound();
  }

  const [dict, soundboards, data] = await Promise.all([
    getDictionary(lang),
    getSoundboards(),
    getSoundData(numericId),
  ]);

  if (!data) {
    notFound();
  }

  const { sound, relatedSounds } = data;
  
  // Validate slug matches sound name - redirect to correct URL if mismatch
  const expectedSlug = generateSlug(sound.name);
  if (slug !== expectedSlug) {
    // Redirect to the correct URL with proper slug
    redirect(`/${lang}/sound/${expectedSlug}/${id}`, "replace");
  }

  return (
    <SoundDetailClient
      sound={sound}
      relatedSounds={relatedSounds}
      lang={lang}
      dict={dict}
      soundboards={soundboards}
    />
  );
}
