import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Sparkles } from "lucide-react";
import { getPublicApiClient } from "@/lib/api/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSoundboards } from "@/lib/api/helpers";
import { locales, type Locale } from "@/lib/i18n/config";
import type { Sound } from "@/lib/types/database";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DottedBackground from "@/components/ui/dotted-background";
import NewPageClient from "./new-page-client";

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
  const pageUrl = `${siteUrl}/${lang}/new`;
  const ogImageUrl = `${siteUrl}/og-image.jpg`;

  // Localized SEO title & description for New page
  const titleByLocale: Record<Locale, string> = {
    en: "New SoundBoard: Latest Sound Buttons",
    es: "Nuevo Soundboard: Últimos Botones de Sonido",
    fr: "Nouveau Soundboard: Derniers Boutons Sonores",
    de: "Neues Soundboard: Neueste Soundtasten",
    pt: "Novo Soundboard: Últimos Botões de Som",
    it: "Nuovo Soundboard: Ultimi Pulsanti Sonori",
    ja: "新しいサウンドボード: 最新のサウンドボタン",
    ko: "새 사운드보드: 최신 사운드 버튼",
    ru: "Новая доска звуков: последние звуковые кнопки",
  };

  const descriptionByLocale: Record<Locale, string> = {
    en: "Explore the newest sound buttons and meme soundboards with trending sound effects updated daily to play, download, and share for gaming, memes, and fun!",
    es: "Explora los botones de sonido más nuevos y meme soundboards con efectos de sonido en tendencia actualizados diariamente para reproducir, descargar y compartir para juegos, memes y diversión!",
    fr: "Explorez les boutons sonores les plus récents et les meme soundboards avec des effets sonores tendance mis à jour quotidiennement pour jouer, télécharger et partager pour les jeux, les mèmes et le plaisir!",
    de: "Erkunden Sie die neuesten Soundtasten und Meme Soundboards mit täglich aktualisierten Trending-Soundeffekten zum Abspielen, Herunterladen und Teilen für Spiele, Memes und Spaß!",
    pt: "Explore os botões de som mais novos e meme soundboards com efeitos sonoros em tendência atualizados diariamente para reproduzir, baixar e compartilhar para jogos, memes e diversão!",
    it: "Esplora i pulsanti sonori più recenti e i meme soundboard con effetti sonori trend aggiornati quotidianamente da riprodurre, scaricare e condividere per giochi, meme e divertimento!",
    ja: "最新のサウンドボタンと、ゲーム、ミーム、楽しみのために毎日更新される最新のサウンドエフェクト付きのミームサウンドボードを探索してください。再生、ダウンロード、共有してください!",
    ko: "게이밍, 밈 및 재미를 위해 매일 업데이트되는 최신 사운드 버튼과 트렌딩 사운드 이펙트가 있는 최신 밈 사운드보드를 탐색하고 재생, 다운로드 및 공유하세요!",
    ru: "Исследуйте самые новые звуковые кнопки и доски мем-звуков с популярными звуковыми эффектами, обновляемыми ежедневно для воспроизведения, загрузки и обмена для игр, мемов и развлечений!",
  };

  const title = titleByLocale[lang];
  const description = descriptionByLocale[lang];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "new sounds",
      "latest sound buttons",
      "new meme sounds",
      "fresh sounds",
      "newly added sounds",
      "recent sounds",
      "new soundboard",
      "latest audio clips",
      "new sound effects",
      "fresh memes",
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
        en: `${siteUrl}/en/new`,
        es: `${siteUrl}/es/new`,
        fr: `${siteUrl}/fr/new`,
        de: `${siteUrl}/de/new`,
        pt: `${siteUrl}/pt/new`,
        it: `${siteUrl}/it/new`,
        ja: `${siteUrl}/ja/new`,
        ko: `${siteUrl}/ko/new`,
        zh: `${siteUrl}/zh/new`,
        ar: `${siteUrl}/ar/new`,
        hi: `${siteUrl}/hi/new`,
        ru: `${siteUrl}/ru/new`,
      },
    },
  };
}

const getNewSounds = unstable_cache(
  async () => {
    const apiClient = getPublicApiClient();
    const response = await apiClient
      .getNewSounds({ page_size: 500 })
      .catch(() => ({ status: 200, data: { results: [] } }));
    return (response.data.results || []) as Sound[];
  },
  ["new-sounds"],
  { revalidate: 600, tags: ["new-sounds"] }
);

export default async function NewPage({ params }: Props) {
  const { lang } = await params;
  const [dict, sounds, soundboards] = await Promise.all([
    getDictionary(lang),
    getNewSounds(),
    getSoundboards(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "New Sound Buttons",
    description:
      "Explore the newest sound buttons, fresh meme sounds, and latest audio clips",
    url: `https://soundboardgo.com/${lang}/new`,
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
            <Sparkles className="h-6 w-6 text-emerald-500" />
            {dict.new.h1}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 md:text-base">
            {dict.new.shortDescription}
          </p>
        </div>

        <NewPageClient sounds={sounds} lang={lang} dict={dict} />
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  );
}
