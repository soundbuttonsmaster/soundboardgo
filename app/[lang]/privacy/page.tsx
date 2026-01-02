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
    title: "Privacy Policy - SoundBoardGo",
    description:
      "Read SoundBoardGo's privacy policy to understand how we collect, use, and protect your personal information.",
    keywords:
      "privacy policy, data protection, user privacy, personal information",
    robots: "index, follow",
    openGraph: {
      title: "Privacy Policy - SoundBoardGo",
      description:
        "Our commitment to protecting your privacy and personal information.",
      url: `${baseUrl}/${lang}/privacy`,
      siteName: "SoundBoardGo",
      images: [{ url: `${baseUrl}/og-image.jpg` }],
      locale: lang,
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/privacy`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/privacy`])
      ),
    },
  };
}

export default async function PrivacyPage({
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
            Privacy Policy
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Welcome to SoundBoardGo ("we," "our," or "us"). We respect your
                privacy and are committed to protecting your personal
                information. This Privacy Policy explains how we collect, use,
                and safeguard your information when you visit our website
                soundboardgo.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                2.1 Information You Provide
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>
                  Account information (email address, username) if you register
                </li>
                <li>User-generated content (custom soundboards, favorites)</li>
                <li>Communications with us (emails, feedback)</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                2.2 Automatically Collected Information
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>Device information (browser type, operating system)</li>
                <li>Usage data (pages visited, sounds played)</li>
                <li>IP address and location data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To personalize your experience</li>
                <li>To improve our website and services</li>
                <li>To communicate with you about updates and features</li>
                <li>To analyze usage patterns and trends</li>
                <li>To protect against fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Cookies and Tracking Technologies
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We use cookies and similar technologies to enhance your
                experience, remember your preferences, and analyze site traffic.
                You can control cookies through your browser settings, but
                disabling them may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Data Sharing and Disclosure
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We do not sell your personal information. We may share your
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>
                  With service providers who assist in operating our website
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Data Security
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We implement reasonable security measures to protect your
                information from unauthorized access, alteration, or
                destruction. However, no internet transmission is completely
                secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Your Rights
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Our service is not directed to children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you believe we have collected such information,
                please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                10. Contact Us
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you have questions about this Privacy Policy, please contact
                us at{" "}
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
