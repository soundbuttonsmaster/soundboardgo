import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { CopyrightYear } from "./copyright-year";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  MessageSquare,
} from "lucide-react";

interface Props {
  lang: Locale;
  dict: any;
}

export default function Footer({ lang, dict }: Props) {
  const companyLabel = dict.footer?.company ?? "Company";
  const legalLabel = dict.footer?.legal ?? "Legal";
  const aboutLabel =
    dict.footer?.aboutUs ?? dict.nav?.aboutUs ?? dict.nav?.about ?? "About Us";
  const contactLabel =
    dict.footer?.contactUs ??
    dict.nav?.contactUs ??
    dict.footer?.contact ??
    dict.nav?.contact ??
    "Contact";
  const dmcaLabel = dict.footer?.dmca ?? dict.nav?.dmca ?? "DMCA";
  const disclaimerLabel =
    dict.footer?.disclaimer ?? dict.nav?.disclaimer ?? "Disclaimer";
  const rightsLabel = dict.footer?.allRightsReserved ?? "All rights reserved.";

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap justify-center gap-8 text-center md:justify-between md:text-left">
          <div>
            <h2 className="text-xs font-bold uppercase text-slate-900 dark:text-white">
              {companyLabel}
            </h2>
            <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href={`/${lang}/about`}
                  className="inline-block py-2 hover:text-slate-900 dark:hover:text-white"
                >
                  {aboutLabel}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/contact`}
                  className="inline-block py-2 hover:text-slate-900 dark:hover:text-white"
                >
                  {contactLabel}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase text-slate-900 dark:text-white">
              {legalLabel}
            </h2>
            <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href={`/${lang}/privacy`}
                  className="inline-block py-2 hover:text-slate-900 dark:hover:text-white"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/terms`}
                  className="inline-block py-2 hover:text-slate-900 dark:hover:text-white"
                >
                  {dict.footer.terms}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/dmca`}
                  className="inline-block py-2 hover:text-slate-900 dark:hover:text-white"
                >
                  {dmcaLabel}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/disclaimer`}
                  className="inline-block py-2 hover:text-slate-900 dark:hover:text-white"
                >
                  {disclaimerLabel}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-12">
          <div className="flex justify-center space-x-10">
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:from-pink-500 dark:hover:to-orange-500 dark:hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="X (Twitter)"
            >
              <Twitter className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="Threads"
            >
              <MessageCircle className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-red-600 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-600 dark:hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="YouTube"
            >
              <Youtube className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              aria-label="Discord"
            >
              <MessageSquare className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
          <p>
            &copy; <CopyrightYear /> {dict.footer.copyright}. {rightsLabel}
          </p>
        </div>
      </div>
    </footer>
  );
}
