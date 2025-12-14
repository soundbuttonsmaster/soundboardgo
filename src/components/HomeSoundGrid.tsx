import { useEffect, useState } from "react";
import SoundButton from "./SoundButton";
import type { SoundButton as SoundButtonType } from "@/types";
import { soundService } from "@/services/sound.service";
import { authService } from "@/services/auth.service";

interface HomeSoundGridProps {
  sounds: SoundButtonType[];
  viewMoreUrl: string;
}

export default function HomeSoundGrid({
  sounds,
  viewMoreUrl,
}: HomeSoundGridProps) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Load current user's favorites once so hearts can be filled globally
  useEffect(() => {
    let isMounted = true;

    const loadFavorites = async () => {
      try {
        if (!authService.isAuthenticated()) return;

        const result = await soundService.getUserFavorites(1, 200);
        if (!isMounted) return;

        const ids = result.sounds.map((s) => s.id);
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Error loading favorites for HomeSoundGrid:", error);
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  // Limit to exactly 36 sounds (9 columns × 4 rows)
  const displayedSounds = sounds.slice(0, 36).map((sound) =>
    favoriteIds.includes(sound.id)
      ? { ...sound, is_favorited: true }
      : sound
  );

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-11 gap-1 p-0 m-0">
        {displayedSounds.map((sound) => (
          <SoundButton key={sound.id} sound={sound} />
        ))}
      </div>

      {sounds.length > 0 && (
        <div className="flex justify-center mt-10">
          <a
            href={viewMoreUrl}
            className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            View More
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      )}
    </>
  );
}
