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
    title: "Contact Us - SoundBoardGo",
    description:
      "Get in touch with SoundBoardGo. Send us your questions, feedback, or suggestions about our free meme soundboard platform.",
    keywords:
      "contact sound buttons, feedback, support, customer service, help",
    robots: "index, follow",
    openGraph: {
      title: "Contact Us - SoundBoardGo",
      description:
        "Get in touch with the SoundBoardGo team. We'd love to hear from you!",
      url: `${baseUrl}/${lang}/contact`,
      siteName: "SoundBoardGo",
      images: [{ url: `${baseUrl}/og-image.jpg` }],
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact Us - SoundBoardGo",
      description:
        "Get in touch with the SoundBoardGo team. We'd love to hear from you!",
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/contact`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/contact`])
      ),
    },
  };
}

export default async function ContactPage({
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
            Contact Us
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We value your feedback and are here to help! Whether you have
                questions, suggestions, or need assistance with SoundBoardGo,
                our team is ready to assist you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Email Us
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                For all inquiries, please contact us at:
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                <a
                  href="mailto:contact@soundboardgo.com"
                  className="text-xl font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  contact@soundboardgo.com
                </a>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                What Can We Help You With?
              </h2>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>Technical support and troubleshooting</li>
                <li>Questions about sound buttons and features</li>
                <li>Content removal requests (DMCA)</li>
                <li>Partnership and collaboration opportunities</li>
                <li>Bug reports and feature suggestions</li>
                <li>General feedback and inquiries</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Response Time
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We aim to respond to all inquiries within 24-48 hours during
                business days. For urgent matters, please include "URGENT" in
                your email subject line.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Copyright and DMCA Notices
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you believe your copyright has been infringed, please review
                our{" "}
                <a
                  href={`/${lang}/dmca`}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  DMCA Policy
                </a>{" "}
                and send your notice to contact@soundboardgo.com with "DMCA" in
                the subject line.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
