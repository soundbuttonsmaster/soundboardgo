import { useEffect, useState } from "react";
import SoundButton from "./SoundButton";
import LoadMoreButton from "./LoadMoreButton";
import type { SoundButton as SoundButtonType } from "@/types";
import { soundService } from "@/services/sound.service";
import { authService } from "@/services/auth.service";

interface SoundGridProps {
  initialSounds: SoundButtonType[];
  category?: string;
  tag?: string;
  initialHasMore?: boolean;
}

export default function SoundGrid({
  initialSounds,
  category,
  tag,
  initialHasMore,
}: SoundGridProps) {
  const [sounds, setSounds] = useState<SoundButtonType[]>(initialSounds);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Load current user's favorites so hearts can be filled across grids
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
        console.error("Error loading favorites for SoundGrid:", error);
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMore = (newSounds: SoundButtonType[]) => {
    setSounds((prev) => [...prev, ...newSounds]);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-11 gap-1">
        {sounds.map((sound) => {
          const soundWithFavorite = favoriteIds.includes(sound.id)
            ? { ...sound, is_favorited: true }
            : sound;

          return <SoundButton key={sound.id} sound={soundWithFavorite} />;
        })}
      </div>
      <LoadMoreButton
        initialSounds={sounds}
        category={category}
        tag={tag || category}
        onLoadMore={handleLoadMore}
        initialHasMore={initialHasMore}
      />
    </>
  );
}
