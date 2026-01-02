"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import type { Locale } from "@/lib/i18n/config"
import type { Sound } from "@/lib/types/database"
import SoundGrid from "@/components/sound/sound-grid"
import { Button } from "@/components/ui/button"
import { ShareDialog } from "@/components/sound/share-dialog"

interface Props {
  sounds: Sound[]
  lang: Locale
  dict: any
}

export default function NewPageClient({ sounds, lang, dict }: Props) {
  const SOUNDS_PER_PAGE = 51 // 4 rows x 11 sounds + 1 row x 7 centered sounds
  const [displayCount, setDisplayCount] = useState(SOUNDS_PER_PAGE)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const [currentSoundName, setCurrentSoundName] = useState("")
  const [currentSoundImageUrl, setCurrentSoundImageUrl] = useState("")

  const handleShareClick = (soundName: string) => {
    setCurrentSoundName(soundName)
    setIsShareDialogOpen(true)
  }

  useEffect(() => {
    if (isShareDialogOpen && currentSoundName) {
      const sound = sounds.find(
        (s) => s.name === currentSoundName
      )
      if (sound) {
        const url = `${window.location.origin}/${lang}/sound/${sound.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}/${sound.id}`
        setShareUrl(url)
        setCurrentSoundImageUrl("/placeholder.jpg")
      }
    }
  }, [isShareDialogOpen, currentSoundName, sounds, lang])

  const displayedSounds = sounds.slice(0, displayCount)
  const hasMore = displayCount < sounds.length

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + SOUNDS_PER_PAGE, sounds.length))
  }

  const shouldCenterLastRow =
    displayedSounds.length % 51 === 0 || (displayedSounds.length > 44 && (displayedSounds.length - 44) % 51 === 7)

  return (
    <>
      <ShareDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        shareUrl={shareUrl}
        soundName={currentSoundName}
        soundImageUrl={currentSoundImageUrl}
        setMessageContent={setMessageContent}
        setShowMessage={setShowMessage}
        dict={dict}
      />

      {/* Sounds Grid */}
      {displayedSounds.length > 0 ? (
        <SoundGrid
          sounds={displayedSounds}
          lang={lang}
          centerLastRow={shouldCenterLastRow}
          onShareClick={handleShareClick}
          setMessageContent={setMessageContent}
          setShowMessage={setShowMessage}
          dict={dict}
        />
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-slate-500 dark:text-slate-400">{dict.new.empty}</p>
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <Button onClick={loadMore} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            {dict.new.loadMore}
          </Button>
        </div>
      )}
    </>
  )
}
