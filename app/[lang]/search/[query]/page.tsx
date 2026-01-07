import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { locales, type Locale } from "@/lib/i18n/config";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DottedBackground from "@/components/ui/dotted-background";
import SoundButton from "@/components/sound/sound-button";
import { getPublicApiClient } from "@/lib/api/server";
import { getSoundboards } from "@/lib/api/helpers";
import { SearchIcon } from "lucide-react";
import type { Sound } from "@/lib/types/database";

interface Props {
  params: Promise<{ lang: Locale; query: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, query } = resolvedParams;
  const dict = await getDictionary(lang);
  const decodedQuery = decodeURIComponent(query);

  const siteUrl = "https://soundboardgo.com";
  const pageUrl = `${siteUrl}/${lang}/search/${encodeURIComponent(query)}`;
  const ogImageUrl = `${siteUrl}/ogimage.jpg`;

  const title = dict.search.metaTitle.replace("{Search Name}", decodedQuery);
  const description = dict.search.metaDescription.replace(
    "{Search Name}",
    decodedQuery
  );

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      decodedQuery,
      `${decodedQuery} sound`,
      `${decodedQuery} button`,
      "search sound buttons",
      "find sounds",
      "sound search",
      "meme search",
      "soundboard search",
    ],
    authors: [{ name: "Sound Board Go" }],
    creator: "Sound Board Go",
    publisher: "Sound Board Go",
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
      siteName: "Sound Board Go",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Search: ${decodedQuery}`,
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
        locales.map((l) => [
          l,
          `${siteUrl}/${l}/search/${encodeURIComponent(query)}`,
        ])
      ),
    },
  };
}

async function searchSounds(query: string): Promise<Sound[]> {
  console.log("[Sound Board Go] Searching for:", query);

  const apiClient = getPublicApiClient();
  const searchTerm = query.trim();

  try {
    const response = await apiClient.searchSounds(searchTerm, {
      page_size: 100,
    });
    return (response.data.results || []) as Sound[];
  } catch (error) {
    console.error("[Sound Board Go] Error searching sounds:", error);
    return [];
  }
}

export default async function SearchPage({ params }: Props) {
  const resolvedParams = await params;
  const { lang, query } = resolvedParams;

  const dict = await getDictionary(lang);
  const soundboards = await getSoundboards();
  const decodedQuery = decodeURIComponent(query);

  const sounds = await searchSounds(decodedQuery);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `Search: ${decodedQuery}`,
    description: `Search results for ${decodedQuery}`,
    url: `https://soundboardgo.com/${lang}/search/${encodeURIComponent(query)}`,
    numberOfItems: sounds.length,
    isPartOf: {
      "@type": "WebSite",
      name: "Sound Board Go",
      url: "https://soundboardgo.com",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `https://soundboardgo.com/${lang}/search/{search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://soundboardgo.com/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Search: ${decodedQuery}`,
        item: `https://soundboardgo.com/${lang}/search/${encodeURIComponent(
          query
        )}`,
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header lang={lang} dict={dict} soundboards={soundboards} />
      <DottedBackground />

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Link
                href={`/${lang}`}
                className="transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                {dict.nav?.home || "Home"}
              </Link>
              <span>/</span>
              <span className="text-slate-900 dark:text-white">
                {dict.common?.search || "Search"}
              </span>
            </div>

            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <SearchIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dict.search?.h1?.replace("{Search Name}", decodedQuery) ||
                    `${decodedQuery} Sound Effect Button`}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {sounds.length} {sounds.length === 1 ? "result" : "results"}{" "}
                  found
                </p>
              </div>
            </div>
          </div>

          {/* No Results */}
          {sounds.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <SearchIcon className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                {dict.common?.noResults || "No results found"}
              </h2>
              <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
                Try searching with different keywords or browse our soundboards
              </p>
              <Link
                href={`/${lang}`}
                className="inline-flex items-center justify-center rounded-lg bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                {dict.nav?.home || "Go Home"}
              </Link>
            </div>
          )}

          {/* Search Results Grid */}
          {sounds.length > 0 && (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {sounds.map((sound) => (
                <SoundButton
                  key={sound.id}
                  sound={sound}
                  lang={lang}
                  showCategory
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  );
}
