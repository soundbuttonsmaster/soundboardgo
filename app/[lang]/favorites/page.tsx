import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSoundboards } from "@/lib/api/helpers";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DottedBackground from "@/components/ui/dotted-background";
import FavoritesClient from "./favorites-client";
import { Heart } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const siteUrl = "https://soundboardgo.com";
  const pageUrl = `${siteUrl}/${lang}/favorites`;
  const ogImageUrl = `${siteUrl}/ogimage.jpg`;

  const title = "My Favorites - Saved Sound Buttons | SoundBoardGo";
  const description =
    "Access your favorite sound buttons collection. View and play all your saved meme sounds, audio clips, and soundboard buttons in one place.";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "favorite sounds",
      "saved sounds",
      "my soundboard",
      "sound collection",
      "favorite buttons",
      "saved audio clips",
    ],
    authors: [{ name: "SoundBoardGo" }],
    creator: "SoundBoardGo",
    publisher: "SoundBoardGo",
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
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
          alt: "My Favorites - SoundBoardGo",
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
        locales.map((l) => [l, `${siteUrl}/${l}/favorites`])
      ),
    },
  };
}

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const [dict, soundboards] = await Promise.all([
    getDictionary(lang),
    getSoundboards(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "My Favorites",
    description: "Your favorite sound buttons collection",
    url: `https://soundboardgo.com/${lang}/favorites`,
    isPartOf: {
      "@type": "WebSite",
      name: "SoundBoardGo",
      url: "https://soundboardgo.com",
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <DottedBackground />
      <Header lang={lang} dict={dict} soundboards={soundboards} />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
            <Heart className="h-5 w-5 text-pink-500" fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {dict.favorites?.title || "My Favorites"}
          </h1>
        </div>
        <FavoritesClient lang={lang} dict={dict} />
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  );
}
