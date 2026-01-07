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
    title: "Disclaimer - SoundBoardGo",
    description:
      "Read SoundBoardGo's disclaimer regarding the use of our website, sound content, and services. Understand limitations of liability and user responsibilities.",
    keywords: "disclaimer, legal disclaimer, liability, terms of use",
    robots: "index, follow",
    openGraph: {
      title: "Disclaimer - SoundBoardGo",
      description: "Important disclaimer information for SoundBoardGo users.",
      url: `${baseUrl}/${lang}/disclaimer`,
      siteName: "SoundBoardGo",
      images: [{ url: `${baseUrl}/ogimage.jpg` }],
      locale: lang,
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/disclaimer`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/disclaimer`])
      ),
    },
  };
}

export default async function DisclaimerPage({
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
            Disclaimer
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
                1. General Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The information provided by SoundBoardGo ("we," "us," or "our")
                on soundboardgo.com (the "Site") is for general informational
                and entertainment purposes only. All information on the Site is
                provided in good faith, however we make no representation or
                warranty of any kind, express or implied, regarding the
                accuracy, adequacy, validity, reliability, availability, or
                completeness of any information on the Site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Use at Your Own Risk
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY
                LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF
                THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE.
                YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE
                SITE IS SOLELY AT YOUR OWN RISK.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Content Disclaimer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                SoundBoardGo provides a platform for sharing and playing audio
                content, including:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>Meme sounds and sound effects</li>
                <li>User-generated audio content</li>
                <li>Third-party sound clips</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                We do not claim ownership of all sound content on our platform.
                Many sounds are user-generated or sourced from publicly
                available content. We make reasonable efforts to ensure content
                does not infringe on copyrights, but users are responsible for
                their uploads.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. External Links Disclaimer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The Site may contain links to external websites that are not
                provided or maintained by or in any way affiliated with
                SoundBoardGo. We do not guarantee the accuracy, relevance,
                timeliness, or completeness of any information on these external
                websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Professional Disclaimer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The Site is intended for entertainment purposes only. Any
                content or advice provided on the Site should not be considered
                professional advice. Always seek the advice of qualified
                professionals for specific concerns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Fair Use and Copyright
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Some content on SoundBoardGo may be protected by copyright. We
                believe that the use of such content for the purpose of
                entertainment, education, and commentary constitutes fair use
                under copyright law. However, if you are a copyright owner and
                believe your work has been improperly used, please contact us
                through our{" "}
                <a
                  href={`/${lang}/dmca`}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  DMCA Policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. No Warranties
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The Site is provided on an "as is" and "as available" basis.
                SoundBoardGo makes no warranties, expressed or implied, and
                hereby disclaims all warranties including, without limitation,
                implied warranties of merchantability, fitness for a particular
                purpose, or non-infringement of intellectual property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                SoundBoardGo, its directors, employees, partners, agents,
                suppliers, or affiliates shall not be liable for any loss or
                damage, direct or indirect, including without limitation, loss
                of data or profit arising out of the use or inability to use the
                materials on the Site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Accuracy of Materials
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The materials appearing on the Site may include technical,
                typographical, or photographic errors. We do not warrant that
                any of the materials on the Site are accurate, complete, or
                current. We may make changes to the materials contained on the
                Site at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                10. User Responsibility
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Users are responsible for ensuring their use of SoundBoardGo
                complies with all applicable laws and regulations. Use sound
                content responsibly and respect intellectual property rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                11. Changes to Disclaimer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We reserve the right to update or change this Disclaimer at any
                time. Your continued use of the Site after we post any
                modifications constitutes acknowledgment and acceptance of those
                modifications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                12. Contact Us
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you have any questions about this Disclaimer, please contact
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
