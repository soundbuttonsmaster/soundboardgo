"use client";

import Link from "next/link";
import {
  Star,
  Sparkles,
  Headphones,
  Users,
  TrendingUp,
  Zap,
  Play,
  Download,
  Share2,
  Heart,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  CheckCircle,
  Volume2,
  Library,
  RefreshCw,
  FolderOpen,
  Music,
  Gamepad2,
  Film,
  Laugh,
  Target,
  ChevronDown,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Sound } from "@/lib/api/client";
import type { SoundboardItem } from "@/lib/api/helpers";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SoundGrid from "@/components/sound/sound-grid";
import SearchBar from "@/components/search-bar";
import DottedBackground from "@/components/ui/dotted-background";
import { Card, CardContent } from "@/components/ui/card";

import React, { useEffect, useState } from "react";
import { ShareDialog } from "@/components/sound/share-dialog";
import { getSoundUrl } from "@/lib/utils/slug";

interface Props {
  lang: Locale;
  dict: any;
  trendingSounds: Sound[];
  newSounds: Sound[];
  soundboards: SoundboardItem[];
}

export default function HomePage({
  lang,
  dict,
  trendingSounds,
  newSounds,
  soundboards,
}: Props) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [currentSoundName, setCurrentSoundName] = useState("");
  const [currentSoundImageUrl, setCurrentSoundImageUrl] = useState("");

  useEffect(() => {
    if (isShareDialogOpen && currentSoundName) {
      const sound = [...trendingSounds, ...newSounds].find(
        (s) => s.name === currentSoundName
      );
      if (sound) {
        setShareUrl(
          `${window.location.origin}${getSoundUrl(
            sound.name,
            Number(sound.id),
            lang
          )}`
        );
        setCurrentSoundImageUrl("/placeholder.jpg");
      }
    }
  }, [isShareDialogOpen, currentSoundName, trendingSounds, newSounds, lang]);

  const handleShareClick = (soundName: string) => {
    setCurrentSoundName(soundName);
    setIsShareDialogOpen(true);
  };
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sound Board Go",
    url: `https://soundboardgo.com/${lang}`,
    description: dict.meta.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://soundboardgo.com/${lang}/search/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

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

      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-950">
        <DottedBackground />
        <Header lang={lang} dict={dict} soundboards={soundboards} />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-6 text-center lg:py-6">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-balance text-2xl font-bold text-slate-900 dark:text-white md:text-2xl lg:text-2xl">
                {dict.home.title}
              </h1>
              <p className="text-pretty mx-auto mt-6 max-w-4xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
                {dict.home.subtitle}
              </p>

              {/* Search Bar */}
              <div className="mx-auto mt-6 max-w-lg">
                <SearchBar
                  lang={lang}
                  placeholder={dict.home.searchPlaceholder}
                />
              </div>
            </div>
          </section>

          {/* Trending & New Sounds */}
          <section className="py-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white md:text-xl">
                <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
                {dict.home.trending}
              </h2>
              <Link
                href={`/${lang}/trending`}
                className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {dict.common.seeAll}
                <span className="text-sky-500">→</span>
              </Link>
            </div>

            <div className="my-3 h-px bg-slate-200 dark:bg-slate-700" />

            {trendingSounds.length > 0 ? (
              <SoundGrid
                sounds={trendingSounds}
                lang={lang}
                maxMobile={16}
                centerLastRow={true}
                onShareClick={handleShareClick}
                setMessageContent={setMessageContent}
                setShowMessage={setShowMessage}
                dict={dict}
              />
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">
                {dict.common.noResults}
              </p>
            )}

            <div className="mt-8 text-center">
              <Link
                href={`/${lang}/trending`}
                className="inline-flex items-center gap-2 rounded-md border border-sky-600 px-6 py-3 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50 dark:border-sky-400 dark:text-sky-300 dark:hover:bg-sky-950"
              >
                <TrendingUp className="h-4 w-4" />
                {dict.home.exploreTrending}
                <span>→</span>
              </Link>
            </div>
          </section>

          <section className="py-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white md:text-xl">
                <Star
                  className="h-5 w-5 text-emerald-500"
                  fill="currentColor"
                />
                {dict.home.newSounds}
              </h2>
              <Link
                href={`/${lang}/new`}
                className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {dict.common.seeAll}
                <span className="text-emerald-500">→</span>
              </Link>
            </div>

            <div className="my-3 h-px bg-slate-200 dark:bg-slate-700" />

            {newSounds.length > 0 ? (
              <SoundGrid
                sounds={newSounds}
                lang={lang}
                maxMobile={8}
                centerLastRow={true}
                onShareClick={handleShareClick}
                setMessageContent={setMessageContent}
                setShowMessage={setShowMessage}
                dict={dict}
              />
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">
                {dict.common.noResults}
              </p>
            )}

            <div className="mt-8 text-center">
              <Link
                href={`/${lang}/new`}
                className="inline-flex items-center gap-2 rounded-md border border-emerald-600 px-6 py-3 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-950"
              >
                <Sparkles className="h-4 w-4" />
                {dict.home.exploreNew}
                <span>→</span>
              </Link>
            </div>
          </section>

          {/* Welcome Section */}
          <section className="py-6 text-center">
            <div className="mx-auto max-w-7xl">
              <Card className="mx-auto max-w-7xl dark:bg-slate-800">
                <CardContent className="text-center">
                  <h2 className="text-balance text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                    {dict.home.welcomeTitle}
                  </h2>
                  <p className="text-pretty mx-auto mt-6 max-w-5xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">
                    {dict.home.welcomeDescription}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className="py-6">
            <div className="text-center">
              <Card className="mx-auto max-w-7xl dark:bg-slate-800">
                <CardContent className="text-center">
                  <h2 className="text-balance text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                    {dict.home.whyChooseTitle}
                  </h2>
                  <p className="text-pretty mx-auto mt-4 max-w-5xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                    {dict.home.whyChooseDescription}
                  </p>
                  <p className="text-pretty mx-auto mt-4 max-w-5xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
                    {dict.home.dailyUpdates}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="py-6">
            <div className="text-center">
              <h2 className="text-balance text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                {dict.home.featuresTitle}
              </h2>
              <p className="text-pretty mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                {dict.home.featuresIntro}
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <div className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/50">
                    <Play className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <h3 className="mt-4 text-center text-xl font-bold text-slate-900 dark:text-white">
                  {dict.home.instantSoundTitle}
                </h3>
                <p className="mt-3 text-center text-slate-600 dark:text-slate-300">
                  {dict.home.instantSoundDesc}
                </p>
              </div>

              <div className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
                    <Library className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="mt-4 text-center text-xl font-bold text-slate-900 dark:text-white">
                  {dict.home.largestLibraryTitle}
                </h3>
                <p className="mt-3 text-center text-slate-600 dark:text-slate-300">
                  {dict.home.largestLibraryDesc}
                </p>
              </div>

              <div className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/50">
                    <RefreshCw className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="mt-4 text-center text-xl font-bold text-slate-900 dark:text-white">
                  {dict.home.dailyContentTitle}
                </h3>
                <p className="mt-3 text-center text-slate-600 dark:text-slate-300">
                  {dict.home.dailyContentDesc}
                </p>
              </div>

              {dict.home.customCollectionsTitle && (
                <div className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center justify-center">
                    <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/50">
                      <FolderOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-center text-xl font-bold text-slate-900 dark:text-white">
                    {dict.home.customCollectionsTitle}
                  </h3>
                  <p className="mt-3 text-center text-slate-600 dark:text-slate-300">
                    {dict.home.customCollectionsDesc}
                  </p>
                </div>
              )}

              {dict.home.highQualityAudioTitle && (
                <div className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center justify-center">
                    <div className="rounded-full bg-rose-100 p-3 dark:bg-rose-900/50">
                      <Volume2 className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-center text-xl font-bold text-slate-900 dark:text-white">
                    {dict.home.highQualityAudioTitle}
                  </h3>
                  <p className="mt-3 text-center text-slate-600 dark:text-slate-300">
                    {dict.home.highQualityAudioDesc}
                  </p>
                </div>
              )}

              <div className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-cyan-100 p-3 dark:bg-cyan-900/50">
                    <Globe className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
                <h3 className="mt-4 text-center text-xl font-bold text-slate-900 dark:text-white">
                  {dict.home.browserBasedTitle}
                </h3>
                <p className="mt-3 text-center text-slate-600 dark:text-slate-300">
                  {dict.home.browserBasedDesc}
                </p>
              </div>
            </div>
          </section>

          <section className="py-6">
            <div className="text-center">
              <h2 className="text-balance text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                {dict.home.categoriesTitle}
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Link href={`/${lang}/memes/914`}>
                <div className="group rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:from-emerald-950/50 dark:to-green-950/50">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/50">
                      <Laugh className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {dict.home.memesCategoryTitle}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {dict.home.memesCategoryDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href={`/${lang}/reactions/910`}>
                <div className="group rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:from-blue-950/50 dark:to-cyan-950/50">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
                      <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {dict.home.reactionsCategoryTitle}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {dict.home.reactionsCategoryDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href={`/${lang}/prank/919`}>
                <div className="group rounded-xl border border-slate-200 bg-gradient-to-br from-purple-100 to-pink-100 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:from-purple-950/50 dark:to-pink-950/50">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/50">
                      <Laugh className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {dict.home.prankCategoryTitle}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {dict.home.prankCategoryDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href={`/${lang}/trending`}>
                <div className="group rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:from-amber-950/50 dark:to-orange-950/50">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/50">
                      <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {dict.home.trendingCategoryTitle}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {dict.home.trendingCategoryDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href={`/${lang}/gaming/913`}>
                <div className="group rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:from-indigo-900/50 dark:to-purple-900/50">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                      <Gamepad2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {dict.home.gamingCategoryTitle}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {dict.home.gamingCategoryDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href={`/${lang}/movies/915`}>
                <div className="group rounded-xl border border-slate-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:from-rose-950/50 dark:to-pink-950/50">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-rose-100 p-3 dark:bg-rose-900/50">
                      <Film className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {dict.home.moviesCategoryTitle}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {dict.home.moviesCategoryDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Soundboard Unblocked */}
          <section className="py-6">
            <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-12">
              <div className="text-center">
                <h2 className="text-balance text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                  {dict.home.unblockedTitle}
                </h2>
                <p className="text-pretty mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  {dict.home.unblockedDescription}
                </p>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {dict.home.worksOnTitle}
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {(
                      dict.home.worksOnDevices ||
                      "iPhones and Android devices\nWindows and Mac computers\nChromebooks for students\nTablets and iPads\nAny modern web browser"
                    )
                      .split("\n")
                      .map((device: string, index: number) => {
                        const icons = [
                          <Smartphone key="smartphone" />,
                          <Monitor key="monitor" />,
                          <Tablet key="tablet" />,
                          <Globe key="globe" />,
                          <Globe key="browser" />,
                        ];
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          >
                            {icons[index % icons.length]}
                            <span>{device.trim()}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <p className="text-pretty mx-auto mt-8 max-w-2xl text-base text-slate-600 dark:text-slate-400">
                  {dict.home.noRegistration}
                </p>
              </div>
            </div>
          </section>

          <section className="py-6">
            <div className="text-center">
              <h2 className="text-balance text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                {dict.home.personalSoundboardTitle}
              </h2>
              <p className="text-pretty mx-auto mt-4 max-w-4xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {dict.home.personalSoundboardDescription}
              </p>
              <p className="text-pretty mx-auto mt-4 max-w-4xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
                {dict.home.personalSoundboardHow}
              </p>
            </div>
          </section>

          <section className="py-6">
            <div className="text-center">
              <h2 className="text-balance text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                {dict.home.perfectForEveryoneTitle}
              </h2>
              <p className="text-pretty mx-auto mt-4 max-w-4xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {dict.home.perfectForEveryoneDescription}
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50 md:p-12">
              <div className="mx-auto max-w-4xl">
                <h2 className="text-balance text-center text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                  {dict.home.faqTitle}
                </h2>

                <div className="mt-12 space-y-4">
                  <details className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span className="text-lg">{dict.home.faq1Question}</span>
                      <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-4 text-slate-700 dark:text-slate-300">
                      <p>{dict.home.faq1Answer}</p>
                    </div>
                  </details>

                  <details className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span className="text-lg">{dict.home.faq2Question}</span>
                      <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-4 text-slate-700 dark:text-slate-300">
                      <p>{dict.home.faq2Answer}</p>
                    </div>
                  </details>

                  <details className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span className="text-lg">{dict.home.faq3Question}</span>
                      <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-4 text-slate-700 dark:text-slate-300">
                      <p>{dict.home.faq3Answer}</p>
                    </div>
                  </details>

                  <details className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span className="text-lg">{dict.home.faq4Question}</span>
                      <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-4 text-slate-700 dark:text-slate-300">
                      <p>{dict.home.faq4Answer}</p>
                    </div>
                  </details>

                  {dict.home.faq5Question && (
                    <details className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                      <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 dark:text-white">
                        <span className="text-lg">
                          {dict.home.faq5Question}
                        </span>
                        <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-4 text-slate-700 dark:text-slate-300">
                        <p>{dict.home.faq5Answer}</p>
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer lang={lang} dict={dict} />
      </div>
    </>
  );
}
