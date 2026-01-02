"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Sound } from "@/lib/api/client";
import SoundButton from "./sound-button";

interface Props {
  sounds: Sound[];
  lang: Locale;
  maxMobile?: number; // Optional prop to limit sounds on mobile
  centerLastRow?: boolean; // Optional prop to center the last row if it has 7 sounds
  onShareClick: (soundName: string) => void;
  setMessageContent: (content: string) => void;
  setShowMessage: (show: boolean) => void;
  dict: any;
  desktopCols?: number; // New prop for desktop columns
}

export default function SoundGrid({
  sounds,
  lang,
  maxMobile,
  centerLastRow = false,
  onShareClick,
  setMessageContent,
  setShowMessage,
  dict,
  desktopCols = 9,
}: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile on client-side
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const displaySounds =
    isMobile && maxMobile ? sounds.slice(0, maxMobile) : sounds;

  const soundsPerRow = isMobile ? 3 : desktopCols;
  const rows: Sound[][] = [];

  // Build rows based on device type
  if (isMobile) {
    for (let i = 0; i < displaySounds.length; i += 3) {
      rows.push(displaySounds.slice(i, i + 3));
    }
  } else {
    // Desktop: Default desktopCols-per-row layout
    for (let i = 0; i < displaySounds.length; i += soundsPerRow) {
      rows.push(displaySounds.slice(i, i + soundsPerRow));
    }
  }

  return (
    <div className="space-y-4">
      {rows.map((rowSounds, rowIndex) => {
        const isLastRow = rowIndex === rows.length - 1;
        const shouldCenter =
          !isMobile && centerLastRow && isLastRow && rowSounds.length === 7;

        return (
          <div key={rowIndex}>
            <div
              className={`grid gap-2 ${
                shouldCenter
                  ? // Center 7 sounds on desktop only
                    "grid-cols-9 mx-auto w-fit"
                  : isMobile
                  ? // Mobile: Fixed 3 columns always
                    "grid-cols-3"
                  : // Desktop: Dynamic columns
                    `grid-cols-${desktopCols}`
              }`}
            >
              {rowSounds.map((sound) => (
                <SoundButton
                  key={sound.id}
                  sound={sound}
                  lang={lang}
                  onShareClick={() => onShareClick(sound.name)}
                  setMessageContent={setMessageContent}
                  setShowMessage={setShowMessage}
                  dict={dict}
                />
              ))}
            </div>
            {/* HR line after each row, except the last one */}
            {rowIndex < rows.length - 1 && (
              <hr className="mt-4 border-t border-slate-200 dark:border-slate-700" />
            )}
          </div>
        );
      })}
    </div>
  );
}
