import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublicApiClient } from "@/lib/api/server";
import { getSoundboards } from "@/lib/api/helpers";
import HomePage from "./home-page";

interface Props {
  params: Promise<{ lang: string }>;
}

const getSounds = unstable_cache(
  async () => {
    const apiClient = getPublicApiClient();

    const [trendingResponse, newestResponse] = await Promise.all([
      apiClient.getTrendingSounds({ page_size: 40 }).catch((error) => {
        console.error("Error fetching trending sounds:", error);
        return { status: 200, data: { results: [] } };
      }),
      apiClient.getNewSounds({ page_size: 29 }).catch((error) => {
        console.error("Error fetching new sounds:", error);
        return { status: 200, data: { results: [] } };
      }),
    ]);

    return {
      trending: trendingResponse.data.results || [],
      newest: newestResponse.data.results || [],
    };
  },
  ["home-sounds"],
  { revalidate: 1800, tags: ["sounds"] }
);

const getCachedSoundboards = unstable_cache(
  async () => {
    try {
      return await getSoundboards();
    } catch (error) {
      console.error("Error fetching soundboards:", error);
      return [];
    }
  },
  ["soundboards"],
  { revalidate: 3600, tags: ["soundboards"] }
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const siteUrl = "https://soundboardgo.com";
  const ogImageUrl = `${siteUrl}/ogimage.jpg`;

  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: [
      "sound buttons",
      "meme soundboard",
      "free sound effects",
      "unblocked sounds",
      "funny sounds",
      "soundboard online",
      "meme sounds",
      "viral sounds",
      "sound effects free",
      "custom soundboard",
    ],
    authors: [{ name: "SoundboardGo" }],
    creator: "SoundboardGo",
    publisher: "SoundboardGo",
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
      url: `${siteUrl}/${lang}`,
      siteName: "SoundboardGo",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [ogImageUrl],
      creator: "@soundboardgo",
    },
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        fr: `${siteUrl}/fr`,
        de: `${siteUrl}/de`,
        pt: `${siteUrl}/pt`,
        it: `${siteUrl}/it`,
        ja: `${siteUrl}/ja`,
        ko: `${siteUrl}/ko`,
        ru: `${siteUrl}/ru`,
      },
    },
    verification: {
      google: "google-site-verification-code",
      other: {
        "msvalidate.01": "bing-verification-code",
      },
    },
  };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const [dict, { trending, newest }, soundboards] = await Promise.all([
    getDictionary(lang as Locale),
    getSounds(),
    getCachedSoundboards(),
  ]);

  return (
    <HomePage
      lang={lang as Locale}
      dict={dict}
      trendingSounds={trending}
      newSounds={newest}
      soundboards={soundboards}
    />
  );
}
