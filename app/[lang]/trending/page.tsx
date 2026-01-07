import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Star } from "lucide-react";
import { getPublicApiClient } from "@/lib/api/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSoundboards } from "@/lib/api/helpers";
import { locales, type Locale } from "@/lib/i18n/config";
import type { Sound } from "@/lib/types/database";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DottedBackground from "@/components/ui/dotted-background";
import TrendingPageClient from "./trending-page-client";

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const siteUrl = "https://soundboardgo.com";
  const pageUrl = `${siteUrl}/${lang}/trending`;
  const ogImageUrl = `${siteUrl}/ogimage.jpg`;

  // Localized SEO title & description for Trending page
  const titleByLocale: Record<Locale, string> = {
    en: "Trending Soundboard: Popular Sound Buttons",
    es: "Soundboard en Tendencia: Botones de Sonido Populares",
    fr: "Soundboard Tendance: Boutons Sonores Populaires",
    de: "Trending Soundboard: Beliebte Soundtasten",
    pt: "Soundboard em Tendência: Botões de Som Populares",
    it: "Soundboard Trend: Pulsanti Sonori Popolari",
    ja: "トレンドサウンドボード: 人気のサウンドボタン",
    ko: "트렌딩 사운드보드: 인기 사운드 버튼",
    ru: "Популярная доска звуков: Популярные звуковые кнопки",
  };

  const descriptionByLocale: Record<Locale, string> = {
    en: "Explore trending meme soundboard and sound buttons collection on Soundboard Go. Browse the most popular sound buttons and viral sound effects right now!",
    es: "Explora la colección de meme soundboard en tendencia y botones de sonido en Soundboard Go. ¡Explora los botones de sonido más populares y efectos de sonido virales ahora mismo!",
    fr: "Explorez la collection de meme soundboard tendance et de boutons sonores sur Soundboard Go. Parcourez les boutons sonores les plus populaires et les effets sonores viraux dès maintenant!",
    de: "Erkunden Sie Trending-Meme-Soundboard- und Soundtasten-Sammlung auf Soundboard Go. Durchsuchen Sie jetzt die beliebtesten Soundtasten und viralen Soundeffekte!",
    pt: "Explore a coleção de meme soundboard em tendência e botões de som no Soundboard Go. Procure os botões de som mais populares e efeitos sonoros virais agora!",
    it: "Esplora la collezione di meme soundboard trend e pulsanti sonori su Soundboard Go. Sfoglia i pulsanti sonori più popolari e gli effetti sonori virali adesso!",
    ja: "Soundboard Go でトレンドミームサウンドボードとサウンドボタンコレクションを探索してください。今すぐ最も人気のあるサウンドボタンとバイラルサウンドエフェクトを参照してください!",
    ko: "Soundboard Go에서 트렌딩 밈 사운드보드 및 사운드 버튼 컬렉션을 탐색하세요. 지금 가장 인기 있는 사운드 버튼과 바이럴 사운드 이펙트를 찾아보세요!",
    ru: "Исследуйте коллекцию популярной доски мем-звуков и звуковых кнопок на Soundboard Go. Просматривайте самые популярные звуковые кнопки и вирусные звуковые эффекты прямо сейчас!",
  };

  const title = titleByLocale[lang];
  const description = descriptionByLocale[lang];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "trending sounds",
      "popular sound buttons",
      "viral meme sounds",
      "trending soundboard",
      "hot sounds",
      "most played sounds",
      "popular memes",
      "trending audio",
      "viral sound effects",
      "top sounds",
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
      url: pageUrl,
      siteName: "SoundBoardGo",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
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
      canonical: pageUrl,
      languages: {
        en: `${siteUrl}/en/trending`,
        es: `${siteUrl}/es/trending`,
        fr: `${siteUrl}/fr/trending`,
        de: `${siteUrl}/de/trending`,
        pt: `${siteUrl}/pt/trending`,
        it: `${siteUrl}/it/trending`,
        ja: `${siteUrl}/ja/trending`,
        ko: `${siteUrl}/ko/trending`,
        zh: `${siteUrl}/zh/trending`,
        ar: `${siteUrl}/ar/trending`,
        hi: `${siteUrl}/hi/trending`,
        ru: `${siteUrl}/ru/trending`,
      },
    },
  };
}

const getTrendingSounds = unstable_cache(
  async () => {
    const apiClient = getPublicApiClient();
    const response = await apiClient
      .getTrendingSounds({ page_size: 500 })
      .catch(() => ({ status: 200, data: { results: [] } }));
    return (response.data.results || []) as Sound[];
  },
  ["trending-sounds"],
  { tags: ["trending-sounds"] }
);

export default async function TrendingPage({ params }: Props) {
  const { lang } = await params;
  const [dict, sounds, soundboards] = await Promise.all([
    getDictionary(lang),
    getTrendingSounds(),
    getSoundboards(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Trending Sound Buttons",
    description: "Discover the most trending and viral sound buttons right now",
    url: `https://soundboardgo.com/${lang}/trending`,
    isPartOf: {
      "@type": "WebSite",
      name: "SoundBoardGo",
      url: "https://soundboardgo.com",
    },
    numberOfItems: sounds.length,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <DottedBackground />
      <Header lang={lang} dict={dict} soundboards={soundboards} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Page Header */}
        <div className="mb-6 text-center">
          <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            <Star className="h-6 w-6 text-amber-500" fill="currentColor" />
            {dict.trending.h1}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 md:text-base">
            {dict.trending.shortDescription}
          </p>
        </div>

        <TrendingPageClient sounds={sounds} lang={lang} dict={dict} />
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  );
}
