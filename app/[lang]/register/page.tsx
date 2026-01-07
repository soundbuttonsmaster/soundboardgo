import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSoundboards } from "@/lib/api/helpers";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DottedBackground from "@/components/ui/dotted-background";
import RegisterForm from "./register-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const siteUrl = "https://soundboardgo.com";
  const pageUrl = `${siteUrl}/${lang}/register`;
  const ogImageUrl = `${siteUrl}/ogimage.jpg`;

  const title = "Sign Up - Create Your Sound Buttons Account | SoundBoardGo";
  const description =
    "Create a free SoundBoardGo account to save favorites, upload custom sounds, create personalized soundboards, and share your favorite meme sounds with friends.";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "sign up",
      "create account",
      "register",
      "join sound buttons",
      "free account",
      "soundboard account",
      "upload sounds",
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
          alt: "SoundBoardGo Sign Up",
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
        locales.map((l) => [l, `${siteUrl}/${l}/register`])
      ),
    },
  };
}

export default async function RegisterPage({
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
    "@type": "WebPage",
    name: "Sign Up",
    description: "Create a SoundBoardGo account",
    url: `https://soundboardgo.com/${lang}/register`,
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

      <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Fun decorative elements */}
          <div className="mb-6 flex justify-center gap-2">
            <span
              className="inline-block h-3 w-3 animate-bounce rounded-full bg-emerald-400"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="inline-block h-3 w-3 animate-bounce rounded-full bg-purple-400"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="inline-block h-3 w-3 animate-bounce rounded-full bg-orange-400"
              style={{ animationDelay: "300ms" }}
            />
            <span
              className="inline-block h-3 w-3 animate-bounce rounded-full bg-cyan-400"
              style={{ animationDelay: "450ms" }}
            />
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Join Sound Buttons to save favorites and upload sounds
            </p>
          </div>

          {/* Form card with subtle shadow */}
          <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80 dark:shadow-slate-900/50">
            <RegisterForm lang={lang} dict={dict} />
          </div>
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  );
}
