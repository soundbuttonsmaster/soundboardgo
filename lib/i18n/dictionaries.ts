import type { Locale } from "./config"

// Dictionary type definition
export interface Dictionary {
  new: any
  common: {
    play: string
    pause: string
    search: string
    loading: string
    error: string
    noResults: string
    favorites: string
    mySoundboards: string
    allSounds: string
    share: string
    copy: string
    copied: string
  }
  home: {
    title: string
    subtitle: string
    searchPlaceholder: string
    popularSounds: string
    browseSoundboards: string
    trending: string
    newSounds: string
    exploreTrending: string
    exploreNew: string
    welcomeTitle?: string
    welcomeDescription?: string
    whyChooseTitle?: string
    whyChooseDescription?: string
    dailyUpdates?: string
    featuresTitle?: string
    featuresIntro?: string
    instantSoundTitle?: string
    instantSoundDesc?: string
    largestLibraryTitle?: string
    largestLibraryDesc?: string
    dailyContentTitle?: string
    dailyContentDesc?: string
    customCollectionsTitle?: string
    customCollectionsDesc?: string
    highQualityAudioTitle?: string
    highQualityAudioDesc?: string
    browserBasedTitle?: string
    browserBasedDesc?: string
    categoriesTitle?: string
    memesCategoryTitle?: string
    memesCategoryDesc?: string
    reactionsCategoryTitle?: string
    reactionsCategoryDesc?: string
    prankCategoryTitle?: string
    prankCategoryDesc?: string
    trendingCategoryTitle?: string
    trendingCategoryDesc?: string
    gamingCategoryTitle?: string
    gamingCategoryDesc?: string
    moviesCategoryTitle?: string
    moviesCategoryDesc?: string
    unblockedTitle?: string
    unblockedDescription?: string
    worksOnTitle?: string
    worksOnDevices?: string
    noRegistration?: string
    personalSoundboardTitle?: string
    personalSoundboardDescription?: string
    personalSoundboardHow?: string
    perfectForEveryoneTitle?: string
    perfectForEveryoneDescription?: string
    faqTitle?: string
    faq1Question?: string
    faq1Answer?: string
    faq2Question?: string
    faq2Answer?: string
    faq3Question?: string
    faq3Answer?: string
    faq4Question?: string
    faq4Answer?: string
    faq5Question?: string
    faq5Answer?: string
  }
  soundboard: {
    sounds: string
    noSounds: string
    addToFavorites: string
    removeFromFavorites: string
    addToSoundboard: string
    playCount: string
  }
  favorites: {
    title: string
    empty: string
    emptyDescription: string
  }
  mySoundboards: {
    title: string
    create: string
    createTitle: string
    namePlaceholder: string
    empty: string
    emptyDescription: string
    delete: string
    edit: string
  }
  footer: {
    copyright: string
    privacy: string
    terms: string
    contact: string
  }
  meta: {
    title: string
    description: string
  }
  search: {
    metaTitle: string
    metaDescription: string
    h1: string
  }
  trending: {
    title: string
    description: string
    h1?: string
    shortDescription?: string
    empty: string
  }
}

// Dictionaries storage
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  de: () => import("./dictionaries/de.json").then((m) => m.default),
  pt: () => import("./dictionaries/pt.json").then((m) => m.default),
  it: () => import("./dictionaries/it.json").then((m) => m.default),
  ja: () => import("./dictionaries/ja.json").then((m) => m.default),
  ko: () => import("./dictionaries/ko.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}
