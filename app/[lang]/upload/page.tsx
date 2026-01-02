import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSoundboards } from "@/lib/api/helpers";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DottedBackground from "@/components/ui/dotted-background";
import UploadForm from "./upload-form";
import { getServerApiClient } from "@/lib/api/server";
import { Upload } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const siteUrl = "https://soundboardgo.com";
  const pageUrl = `${siteUrl}/${lang}/upload`;
  const ogImageUrl = `${siteUrl}/og-image.jpg`;

  const title = "Upload Sound - Share Your Sounds | SoundBoardGo";
  const description =
    "Upload and share your own sound buttons with the SoundBoardGo community. Add custom meme sounds, audio clips, and sound effects for free. Join thousands of creators!";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "upload sound",
      "share sounds",
      "upload audio",
      "custom soundboard",
      "upload meme sound",
      "add sound button",
      "sound creator",
      "upload sound effect",
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
          alt: "Upload Sound - SoundBoardGo",
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
        locales.map((l) => [l, `${siteUrl}/${l}/upload`])
      ),
    },
  };
}

export default async function UploadPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const apiClient = await getServerApiClient();
  const [dict, allSoundboards, categoriesResponse] = await Promise.all([
    getDictionary(lang),
    getSoundboards(),
    apiClient.getCategories().catch(() => ({ status: 200, data: [] })),
  ]);

  // Flatten categories tree for dropdown
  const flattenCategories = (
    cats: typeof categoriesResponse.data
  ): { id: number; name: string }[] => {
    const result: { id: number; name: string }[] = [];
    const traverse = (items: typeof categoriesResponse.data, prefix = "") => {
      items.forEach((cat) => {
        result.push({ id: cat.id, name: prefix + cat.name });
        if (cat.children && cat.children.length > 0) {
          traverse(cat.children, prefix + cat.name + " > ");
        }
      });
    };
    traverse(cats);
    return result;
  };

  const categories = flattenCategories(categoriesResponse.data);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Upload Sound",
    description: "Upload and share your own sound buttons",
    url: `https://soundboardgo.com/${lang}/upload`,
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
      <Header lang={lang} dict={dict} soundboards={allSoundboards} />

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Fun decorative elements */}
        <div className="mb-6 flex justify-center gap-2">
          <span
            className="inline-block h-3 w-3 animate-bounce rounded-full bg-sky-400"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="inline-block h-3 w-3 animate-bounce rounded-full bg-lime-400"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="inline-block h-3 w-3 animate-bounce rounded-full bg-amber-400"
            style={{ animationDelay: "300ms" }}
          />
          <span
            className="inline-block h-3 w-3 animate-bounce rounded-full bg-rose-400"
            style={{ animationDelay: "450ms" }}
          />
        </div>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
            <Upload className="h-8 w-8 text-sky-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Upload Sound
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Share your sound with the community
          </p>
        </div>

        {/* Form card with subtle shadow */}
        <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80 dark:shadow-slate-900/50">
          <UploadForm lang={lang} dict={dict} categories={categories} />
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  );
}
