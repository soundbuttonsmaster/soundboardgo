import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { getPublicApiClient } from "@/lib/api/server";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSoundboards } from "@/lib/api/helpers";
import CategoryDetailClient from "./category-detail-client";

// Fetch category data with caching
const getCategoryData = unstable_cache(
  async (categoryId: number) => {
    if (isNaN(categoryId) || categoryId < 1) {
      return null;
    }

    const apiClient = getPublicApiClient();

    try {
      const [categoryResponse, soundsResponse] = await Promise.all([
        apiClient.getCategory(categoryId).catch(() => null),
        apiClient
          .getSounds({ category: categoryId, page_size: 500 })
          .catch(() => ({ status: 200, data: { results: [] } })),
      ]);

      if (!categoryResponse || !categoryResponse.data) {
        return null;
      }

      return {
        category: categoryResponse.data,
        sounds: soundsResponse.data.results || [],
      };
    } catch (error) {
      console.error("Error fetching category data:", error);
      return null;
    }
  },
  ["category-detail"],
  { revalidate: 900, tags: ["categories"] }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string; id: string }>;
}): Promise<Metadata> {
  const { lang, slug, id } = await params;
  const categoryId = Number.parseInt(id, 10);
  const data = await getCategoryData(categoryId);

  if (!data) {
    return {
      title: "Category Not Found | SoundBoardGo",
    };
  }

  const { category, sounds } = data;
  const siteUrl = "https://soundboardgo.com";
  const pageUrl = `${siteUrl}/${lang}/${slug}/${id}`;
  const ogImageUrl = `${siteUrl}/og-image.jpg`;

  const name = category.name;

  const titleByLocale: Record<Locale, string> = {
    en: `${name} Soundboard: Sound Buttons Unblocked`,
    es: `${name} Soundboard: Botones de Sonido Desbloqueados`,
    fr: `${name} Soundboard: Boutons Sonores Débloqués`,
    de: `${name} Soundboard: Sound-Buttons Entsperrt`,
    pt: `${name} Soundboard: Botões de Som Desbloqueados`,
    it: `${name} Soundboard: Pulsanti Sonori Sbloccati`,
    ja: `${name}サウンドボード：サウンドボタン ブロック解除`,
    ko: `${name} 사운드보드: 사운드 버튼 차단 해제`,
    ru: `${name} Доска звуков: разблокированные звуковые кнопки`,
  };

  const descriptionByLocale: Record<Locale, string> = {
    en: `Explore ${name} soundboards with trending sound buttons and meme soundboard. Play, download, and share sounds for gaming, content creation, and fun!`,
    es: `Explora ${name} soundboards con botones de sonido en tendencia y meme soundboard. ¡Reproduce, descarga y comparte sonidos para juegos, creación de contenido y diversión!`,
    fr: `Explorez les soundboards ${name} avec des boutons sonores tendance et un meme soundboard. Jouez, téléchargez et partagez des sons pour les jeux, la création de contenu et le plaisir!`,
    de: `Entdecke ${name} Soundboards mit angesagten Sound-Buttons und Meme-Soundboards. Spiele, downloade und teile Sounds für Gaming, Content-Erstellung und Spaß!`,
    pt: `Explore ${name} soundboards com botões de som em tendência e meme soundboard. Reproduza, baixe e compartilhe sons para jogos, criação de conteúdo e diversão!`,
    it: `Esplora i soundboard ${name} con pulsanti sonori trend e meme soundboard. Riproduci, scarica e condividi suoni per giochi, creazione di contenuti e divertimento!`,
    ja: `${name} サウンドボードをトレンドサウンドボタンとミームサウンドボードで探索してください。ゲーム、コンテンツ作成、楽しみのための音を再生、ダウンロード、共有してください!`,
    ko: `트렌딩 사운드 버튼과 밈 사운드보드가 있는 ${name} 사운드보드를 탐색하세요. 게이밍, 콘텐츠 생성 및 재미를 위해 사운드를 재생, 다운로드 및 공유하세요!`,
    ru: `Исследуйте доски ${name} со звуковыми кнопками тренда и доской мем-звуков. Воспроизводите, загружайте и делитесь звуками для игр, создания контента и развлечений!`,
  };

  const title = titleByLocale[lang];
  const description = descriptionByLocale[lang];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      category.name,
      `${category.name} soundboard`,
      `${category.name} sounds`,
      `${category.name} buttons`,
      "soundboard",
      "sound buttons",
      "free sounds",
      "meme sounds",
      "sound effects",
      "audio clips",
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
          alt: `${category.name} Category`,
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
      languages: Object.fromEntries(
        locales.map((locale) => {
          const altSlug =
            locale === lang
              ? slug
              : category.name.toLowerCase().replace(/\s+/g, "-");
          return [locale, `${siteUrl}/${locale}/${altSlug}/${id}`];
        })
      ),
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string; id: string }>;
}) {
  const { lang, id } = await params;
  const categoryId = Number.parseInt(id, 10);

  if (isNaN(categoryId)) {
    notFound();
  }

  const data = await getCategoryData(categoryId);

  if (!data) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const allSoundboards = await getSoundboards();

  return (
    <CategoryDetailClient
      category={data.category}
      sounds={data.sounds}
      allSoundboards={allSoundboards}
      dict={dict}
      lang={lang}
    />
  );
}
