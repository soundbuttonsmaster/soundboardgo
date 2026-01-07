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
    title: "DMCA Policy - SoundBoardGo",
    description:
      "SoundBoardGo DMCA copyright policy. Learn how to file a copyright infringement notice and our procedures for handling DMCA requests.",
    keywords: "DMCA, copyright policy, copyright infringement, takedown notice",
    robots: "index, follow",
    openGraph: {
      title: "DMCA Policy - SoundBoardGo",
      description:
        "Our DMCA policy and procedures for handling copyright infringement claims.",
      url: `${baseUrl}/${lang}/dmca`,
      siteName: "SoundBoardGo",
      images: [{ url: `${baseUrl}/ogimage.jpg` }],
      locale: lang,
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/dmca`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/dmca`])
      ),
    },
  };
}

export default async function DMCAPage({
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
            DMCA Copyright Policy
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
                1. Overview
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                SoundBoardGo respects the intellectual property rights of others
                and expects our users to do the same. In accordance with the
                Digital Millennium Copyright Act (DMCA), we will respond
                promptly to claims of copyright infringement on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Filing a DMCA Notice
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                If you believe that your copyrighted work has been copied in a
                way that constitutes copyright infringement and is accessible on
                our website, please notify us by providing the following
                information:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>
                  A physical or electronic signature of the copyright owner or
                  authorized representative
                </li>
                <li>
                  Identification of the copyrighted work claimed to have been
                  infringed
                </li>
                <li>
                  Identification of the material that is claimed to be
                  infringing, including its URL or location
                </li>
                <li>
                  Your contact information (address, telephone number, and email
                  address)
                </li>
                <li>
                  A statement that you have a good faith belief that the use is
                  not authorized by the copyright owner
                </li>
                <li>
                  A statement that the information in the notification is
                  accurate, and under penalty of perjury, that you are
                  authorized to act on behalf of the copyright owner
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Where to Send DMCA Notices
              </h2>
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:contact@soundboardgo.com"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    contact@soundboardgo.com
                  </a>
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Subject Line:</strong> DMCA Copyright Infringement
                  Notice
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Our Response to DMCA Notices
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Upon receiving a valid DMCA notice, we will:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>
                  Remove or disable access to the allegedly infringing material
                </li>
                <li>
                  Notify the user who posted the material about the removal
                </li>
                <li>Terminate repeat infringers' accounts as appropriate</li>
                <li>
                  Respond to the copyright owner within a reasonable timeframe
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Counter-Notification
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                If you believe your content was wrongly removed due to a DMCA
                notice, you may file a counter-notification containing:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>Your physical or electronic signature</li>
                <li>Identification of the material that has been removed</li>
                <li>
                  A statement under penalty of perjury that you have a good
                  faith belief the material was removed by mistake
                </li>
                <li>Your name, address, and telephone number</li>
                <li>
                  A statement that you consent to the jurisdiction of the
                  Federal District Court
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Repeat Infringers
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We have a policy of terminating the accounts of users who are
                repeat copyright infringers. Users who repeatedly upload
                infringing content will have their accounts permanently banned.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Fair Use
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We recognize that some uses of copyrighted material may be
                considered fair use under copyright law. We encourage copyright
                owners to consider whether their use complaint is valid before
                filing a DMCA notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. False Claims
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Please note that under Section 512(f) of the DMCA, any person
                who knowingly materially misrepresents that material is
                infringing may be subject to liability for damages. Do not make
                false claims.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Contact Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                For all DMCA-related inquiries, please contact:{" "}
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
