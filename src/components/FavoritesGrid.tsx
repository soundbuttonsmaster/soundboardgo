import { useState, useEffect } from "react";
import InfiniteScrollSoundGrid from "./InfiniteScrollSoundGrid";
import { authService } from "@/services/auth.service";
import { soundService } from "@/services/sound.service";
import type { SoundButton } from "@/types";

interface FavoritesGridProps {
  initialSounds?: SoundButton[];
  initialHasMore?: boolean;
}

export default function FavoritesGrid({
  initialSounds = [],
  initialHasMore = false,
}: FavoritesGridProps) {
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sounds, setSounds] = useState<SoundButton[]>(initialSounds);
  const [hasLoaded, setHasLoaded] = useState(initialSounds.length > 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);

    // If not authenticated, show error
    if (!authenticated) {
      setError("Please log in to view your favorites");
      return;
    } else {
      setError(null);
    }

    // If we don't have initial sounds, try to load them
    if (initialSounds.length === 0 && !hasLoaded) {
      loadInitialFavorites();
    }
  }, []);

  const loadInitialFavorites = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await soundService.getUserFavorites(1, 20);
      setSounds(result.sounds);
      setHasLoaded(true);
    } catch (err: any) {
      console.error("Error loading favorites:", err);
      if (err.status_code === 401 || err.response?.status === 401) {
        setError("Please log in to view your favorites");
        setIsAuthenticated(false);
      } else {
        setError("Failed to load favorites. Please try again.");
      }
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || error) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div className="max-w-md mx-auto">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 mb-6">
            {error || "Please log in to view your favorites"}
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Show loading state while fetching initial data
  if (!hasLoaded && loading) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center space-x-2">
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
          <span className="text-gray-600">Loading favorites...</span>
        </div>
      </div>
    );
  }

  // Show empty state when no favorites are available
  if (hasLoaded && sounds.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Sounds Available
        </h3>
        <p className="text-gray-600 mb-2">
          You haven't added any sounds to your favorites yet.
        </p>
        <p className="text-gray-500 text-sm">
          Start exploring and add sounds to your favorites to see them here!
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse Sounds
          </a>
        </div>
      </div>
    );
  }

  return (
    <InfiniteScrollSoundGrid
      initialSounds={sounds}
      type="favorites"
      pageSize={20}
      initialHasMore={initialHasMore}
    />
  );
}

