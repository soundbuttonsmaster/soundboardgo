"use client";

import Link from "next/link";
import { Headphones, TrendingUp, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Sound } from "@/lib/api/client";
import type { Category } from "@/lib/api/client";
import type { SoundboardItem } from "@/lib/api/helpers";
import SoundGrid from "@/components/sound/sound-grid";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DottedBackground from "@/components/ui/dotted-background";
import { getSoundboardUrl } from "@/lib/utils/slug";
import { ShareDialog } from "@/components/sound/share-dialog";

import React, { useEffect, useState } from "react";

interface CategoryDetailClientProps {
  category: Category;
  sounds: Sound[];
  allSoundboards: SoundboardItem[];
  dict: any;
  lang: Locale;
}

export default function CategoryDetailClient({
  category,
  sounds,
  allSoundboards,
  dict,
  lang,
}: CategoryDetailClientProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [currentSoundName, setCurrentSoundName] = useState("");
  const [currentSoundImageUrl, setCurrentSoundImageUrl] = useState("");

  const handleShareClick = (soundName: string) => {
    setCurrentSoundName(soundName);
    setIsShareDialogOpen(true);
  };

  useEffect(() => {
    if (isShareDialogOpen && currentSoundName) {
      const sound = sounds.find((s) => s.name === currentSoundName);
      if (sound) {
        const url = `${window.location.origin}/${lang}/sound/${sound.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}/${sound.id}`;
        setShareUrl(url);
        setCurrentSoundImageUrl("/placeholder.jpg");
      }
    }
  }, [isShareDialogOpen, currentSoundName, sounds, lang]);

  const slug = category.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return (
    <>
      <ShareDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        shareUrl={shareUrl}
        soundName={currentSoundName}
        soundImageUrl={currentSoundImageUrl}
        setMessageContent={setMessageContent}
        setShowMessage={setShowMessage}
        dict={dict}
      />

      <div className="min-h-screen bg-white dark:bg-slate-950">
        <DottedBackground />
        <Header lang={lang} dict={dict} soundboards={allSoundboards} />

        <main className="mx-auto max-w-6xl px-4 py-8">
          {/* Category Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
              <Headphones className="h-8 w-8 text-sky-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              {lang === "es" && `${category.name} Soundboard`}
              {lang === "fr" && `${category.name} Soundboard`}
              {lang === "de" && `${category.name} Soundboard`}
              {lang === "pt" && `${category.name} Soundboard`}
              {lang === "it" && `${category.name} Soundboard`}
              {lang === "ja" && `${category.name} サウンドボード`}
              {lang === "ko" && `${category.name} 사운드보드`}
              {lang === "ru" && `${category.name} Доска звуков`}
              {![
                "es",
                "fr",
                "de",
                "pt",
                "it",
                "ja",
                "ko",
                "zh",
                "ar",
                "hi",
                "ru",
              ].includes(lang) && `${category.name} Soundboard`}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {sounds.length} {sounds.length === 1 ? "sound" : "sounds"}{" "}
              available
            </p>
          </div>

          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Link
              href={`/${lang}`}
              className="hover:text-slate-900 dark:hover:text-white"
            >
              {dict.nav?.home || "Home"}
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white">
              {category.name}
            </span>
          </nav>

          {/* Sounds Grid */}
          {sounds.length > 0 ? (
            <SoundGrid
              sounds={sounds}
              lang={lang}
              onShareClick={handleShareClick}
              setMessageContent={setMessageContent}
              setShowMessage={setShowMessage}
              dict={dict}
            />
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Headphones className="mx-auto h-12 w-12 text-slate-400" />
              <h2 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
                No sounds yet
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                This category doesn't have any sounds yet. Check back soon!
              </p>
            </div>
          )}

          {/* Related Categories */}
          {allSoundboards.length > 0 && (
            <div className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white">
                <Sparkles className="h-5 w-5 text-sky-500" />
                {dict.common?.exploreMore || "Explore More Categories"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {allSoundboards
                  .filter((sb) => sb.id !== category.id)
                  .slice(0, 10)
                  .map((soundboard) => (
                    <Link
                      key={soundboard.id}
                      href={getSoundboardUrl(
                        soundboard.name,
                        soundboard.numeric_id,
                        lang
                      )}
                      className="rounded-full border border-sky-300 bg-white px-4 py-2 text-sm font-medium text-sky-800 transition-colors hover:bg-sky-50 dark:border-sky-700 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700"
                    >
                      {soundboard.name}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </main>

        <Footer lang={lang} dict={dict} />
      </div>
    </>
  );
}
