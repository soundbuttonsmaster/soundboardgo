import { useState, useEffect, useRef, useCallback } from "react";
import SoundButton from "./SoundButton";
import type { SoundButton as SoundButtonType } from "@/types";
import { soundService } from "@/services/sound.service";
import { authService } from "@/services/auth.service";

interface InfiniteScrollSoundGridProps {
  initialSounds: SoundButtonType[];
  type: "new" | "trending" | "favorites";
  pageSize?: number;
  initialHasMore?: boolean; // Pass hasMore from SSR
}

export default function InfiniteScrollSoundGrid({
  initialSounds,
  type,
  pageSize = 20,
  initialHasMore,
}: InfiniteScrollSoundGridProps) {
  const [sounds, setSounds] = useState<SoundButtonType[]>(initialSounds);
  const [loading, setLoading] = useState(false);
  // Use initialHasMore if provided, otherwise infer from results length
  const [hasMore, setHasMore] = useState(
    initialHasMore !== undefined
      ? initialHasMore
      : initialSounds.length >= pageSize
  );
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [page, setPage] = useState(2); // Start at page 2 since page 1 is initialSounds
  const observerTarget = useRef<HTMLDivElement>(null);

  // Load current user's favorites so hearts are filled on infinite grids too
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
        console.error("Error loading favorites for InfiniteScrollSoundGrid:", error);
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  // Function to load more sounds
  const loadMoreSounds = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      let result;
      if (type === "new") {
        result = await soundService.getNewSounds(undefined, page, pageSize);
      } else if (type === "trending") {
        result = await soundService.getTrendingSounds(
          undefined,
          page,
          pageSize
        );
      } else if (type === "favorites") {
        result = await soundService.getUserFavorites(page, pageSize);
      } else {
        throw new Error(`Unknown type: ${type}`);
      }

      if (result.sounds.length > 0) {
        setSounds((prev) => [...prev, ...result.sounds]);
        setHasMore(result.hasMore);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(`Error loading more ${type} sounds:`, error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [type, page, pageSize, loading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreSounds();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading 100px before reaching the bottom
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadMoreSounds]);

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

      {/* Loading indicator / Observer target */}
      {hasMore && (
        <div
          ref={observerTarget}
          className="flex justify-center items-center py-8"
        >
          {loading && (
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-6 w-6 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-600">Loading more sounds...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && sounds.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No more sounds to load
        </div>
      )}
    </>
  );
}
