import type { Metadata } from "next";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { type Locale, locales } from "@/lib/i18n/config";
import { getSoundboards } from "@/lib/api/helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://soundboardgo.com";

  return {
    title: "About Us - SoundBoardGo",
    description:
      "Learn about SoundBoardGo, your premier destination for free meme soundboards, sound effects, and audio buttons. Discover our mission to bring joy through sounds.",
    keywords:
      "about sound buttons, about us, meme soundboard platform, sound effects website, audio entertainment",
    robots: "index, follow",
    openGraph: {
      title: "About Us - SoundBoardGo",
      description:
        "Learn about SoundBoardGo and our mission to provide the best free meme soundboards and sound effects.",
      url: `${baseUrl}/${lang}/about`,
      siteName: "SoundBoardGo",
      images: [{ url: `${baseUrl}/og-image.jpg` }],
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "About Us - SoundBoardGo",
      description:
        "Learn about SoundBoardGo and our mission to provide the best free meme soundboards and sound effects.",
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/about`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/about`])
      ),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const soundboards = await getSoundboards();

  return (
    <>
      <Header lang={lang} dict={dict} soundboards={soundboards} />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="mb-6 text-4xl font-bold text-slate-900 dark:text-white">
            About SoundBoardGo
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Welcome to SoundBoardGo
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                SoundBoardGo is your premier destination for free meme
                soundboards, hilarious sound effects, and audio entertainment.
                We provide a vast collection of over 500,000 sound buttons that
                bring joy, laughter, and entertainment to millions of users
                worldwide.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Our mission is to create the world's largest and most
                entertaining collection of sound buttons and meme soundboards.
                We believe that sounds have the power to bring people together,
                create memorable moments, and add fun to everyday conversations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                What We Offer
              </h2>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>500,000+ free sound buttons and meme sounds</li>
                <li>Custom soundboard creation tools</li>
                <li>No downloads or registration required</li>
                <li>Mobile-friendly and works on all devices</li>
                <li>Regular updates with trending sounds</li>
                <li>Community-driven content</li>
                <li>Unblocked access from anywhere</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Why Choose Us
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We are committed to providing the best user experience with fast
                loading times, high-quality audio, and an intuitive interface.
                Our platform is completely free and accessible to everyone, with
                no hidden fees or premium subscriptions. We continuously improve
                our service based on user feedback and the latest trends in
                internet culture.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Have questions, suggestions, or feedback? We'd love to hear from
                you! Reach out to us at{" "}
                <a
                  href="mailto:contact@soundboardgo.com"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  contact@soundboardgo.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
