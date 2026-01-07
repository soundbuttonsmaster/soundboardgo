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
    title: "Terms and Conditions - SoundBoardGo",
    description:
      "Read the terms and conditions for using SoundBoardGo. Understand your rights and responsibilities when using our free meme soundboard platform.",
    keywords:
      "terms and conditions, terms of service, user agreement, legal terms",
    robots: "index, follow",
    openGraph: {
      title: "Terms and Conditions - SoundBoardGo",
      description: "Terms and conditions for using SoundBoardGo services.",
      url: `${baseUrl}/${lang}/terms`,
      siteName: "SoundBoardGo",
      images: [{ url: `${baseUrl}/ogimage.jpg` }],
      locale: lang,
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/terms`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/terms`])
      ),
    },
  };
}

export default async function TermsPage({
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
            Terms and Conditions
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
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                By accessing and using SoundBoardGo ("the Service"), you accept
                and agree to be bound by these Terms and Conditions. If you do
                not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Use of Service
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                2.1 Permitted Use
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                You may use SoundBoardGo for personal, non-commercial
                entertainment purposes. You agree to use the Service in
                compliance with all applicable laws and regulations.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                2.2 Prohibited Activities
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>Uploading malicious content or viruses</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Harassing or abusing other users</li>
                <li>
                  Uploading content that infringes on copyrights or intellectual
                  property
                </li>
                <li>Using the Service for illegal purposes</li>
                <li>
                  Scraping or automated data collection without permission
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. User Accounts
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you create an account, you are responsible for maintaining
                the security of your account and password. You agree to accept
                responsibility for all activities that occur under your account.
                We reserve the right to terminate accounts that violate these
                terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. User Content
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                By uploading content to SoundBoardGo, you grant us a
                non-exclusive, worldwide, royalty-free license to use, display,
                and distribute your content on our platform. You represent that:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>You own or have the right to upload the content</li>
                <li>
                  The content does not violate any laws or third-party rights
                </li>
                <li>
                  The content does not contain hate speech, harassment, or
                  illegal material
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The Service and its original content, features, and
                functionality are owned by SoundBoardGo and are protected by
                international copyright, trademark, and other intellectual
                property laws. Sound content on the platform may be owned by
                third parties and is provided for entertainment purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Copyright and DMCA
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We respect intellectual property rights. If you believe your
                copyright has been infringed, please review our{" "}
                <a
                  href={`/${lang}/dmca`}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  DMCA Policy
                </a>{" "}
                and contact us at contact@soundboardgo.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Disclaimer of Warranties
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT
                WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR
                SECURE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOUND BOARD GO SHALL NOT
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Indemnification
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                You agree to indemnify and hold harmless SoundBoardGo from any
                claims, damages, losses, and expenses arising from your use of
                the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                10. Modifications to Service and Terms
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We reserve the right to modify or discontinue the Service at any
                time without notice. We may also update these Terms and
                Conditions. Continued use of the Service after changes
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                11. Governing Law
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with applicable laws, without regard to conflict of law
                provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                12. Contact Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                For questions about these Terms and Conditions, please contact
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
