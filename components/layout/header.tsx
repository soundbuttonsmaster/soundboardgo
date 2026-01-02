"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  Upload,
  User,
  Heart,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { Locale } from "@/lib/i18n/config";
import { getSoundboardUrl } from "@/lib/utils/slug";
import LanguageSwitcher from "@/components/language-switcher";
import ThemeToggle from "@/components/theme-toggle";

interface Props {
  lang: Locale;
  dict: any;
  soundboards?: Array<{ numeric_id: number; name: string; slug: string }>;
}

export default function Header({ lang, dict, soundboards = [] }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundboardsOpen, setSoundboardsOpen] = useState(false);
  const router = useRouter();
  const { user, loading, mounted, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 min-h-[60px] border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 md:gap-4 sm:gap-2">
          {/* Logo */}
          <Link href={`/${lang}`} className="shrink-0 min-w-fit">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              SOUND BOARD GO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 md:flex shrink-0 min-w-0">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {dict.nav?.home || "HOME"}
            </Link>
            <Link
              href={`/${lang}/new`}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {dict.nav?.new || "NEW"}
            </Link>
            <Link
              href={`/${lang}/trending`}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {dict.nav?.trending || "TRENDS"}
            </Link>

            {soundboards.length > 0 && (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white whitespace-nowrap"
                >
                  {dict.nav?.soundboards || "SOUNDBOARDS"}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full hidden pt-1 group-hover:block">
                  <div className="min-w-[200px] rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    {soundboards.map((soundboard) => (
                      <Link
                        key={soundboard.numeric_id}
                        href={getSoundboardUrl(
                          soundboard.name,
                          soundboard.numeric_id,
                          lang
                        )}
                        className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        {soundboard.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <LanguageSwitcher currentLang={lang} />

            <div
              className="ml-1 hidden items-center gap-1 md:flex min-w-0"
              suppressHydrationWarning
            >
              {mounted && loading ? (
                <div className="h-8 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
              ) : mounted && user ? (
                <>
                  <Link
                    href={`/${lang}/favorites`}
                    className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap"
                  >
                    <Heart className="h-4 w-4" />
                    Favorites
                  </Link>
                  <Link
                    href={`/${lang}/upload`}
                    className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 whitespace-nowrap"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Link>
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 whitespace-nowrap max-w-[120px] truncate"
                    >
                      <User className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {user.user_metadata?.username ||
                          user.email?.split("@")[0]}
                      </span>
                    </button>
                    <div className="absolute right-0 top-full hidden pt-1 group-hover:block">
                      <div className="rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href={`/${lang}/login`}
                    className="flex items-center gap-1 rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-600 whitespace-nowrap"
                  >
                    <LogIn className="h-4 w-4" />
                    Log-in
                  </Link>
                  <Link
                    href={`/${lang}/register`}
                    className="flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 whitespace-nowrap"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign-up
                  </Link>
                  <Link
                    href={`/${lang}/upload`}
                    className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 whitespace-nowrap"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 h-full w-64 overflow-y-auto bg-white p-4 shadow-xl dark:bg-slate-950 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>

            <nav className="mt-12 flex flex-col gap-4">
              <Link
                href={`/${lang}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                {dict.nav?.home || "HOME"}
              </Link>
              <Link
                href={`/${lang}/new`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                {dict.nav?.new || "NEW"}
              </Link>
              <Link
                href={`/${lang}/trending`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                {dict.nav?.trending || "TRENDS"}
              </Link>

              {soundboards.length > 0 && (
                <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSoundboardsOpen(!soundboardsOpen)}
                    className="flex w-full items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    {dict.nav?.soundboards || "SOUNDBOARDS"}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        soundboardsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {soundboardsOpen && (
                    <div className="mt-2 flex flex-col gap-2 pl-4">
                      {soundboards.map((soundboard) => (
                        <Link
                          key={soundboard.numeric_id}
                          href={getSoundboardUrl(
                            soundboard.name,
                            soundboard.numeric_id,
                            lang
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          {soundboard.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div
                className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-6 dark:border-slate-800"
                suppressHydrationWarning
              >
                {mounted && loading ? (
                  <>
                    <div className="h-10 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                    <div className="h-10 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                  </>
                ) : mounted && user ? (
                  <>
                    <Link
                      href={`/${lang}/favorites`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <Heart className="h-4 w-4" />
                      My Favorites
                    </Link>
                    <Link
                      href={`/${lang}/upload`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Sound
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/${lang}/login`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-md bg-slate-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-600"
                    >
                      <LogIn className="h-4 w-4" />
                      Log-in
                    </Link>
                    <Link
                      href={`/${lang}/register`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <UserPlus className="h-4 w-4" />
                      Sign-up
                    </Link>
                    <Link
                      href={`/${lang}/upload`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
