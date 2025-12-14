import { useState } from 'react';
import type { SoundButton } from '@/types';
import { soundService } from '@/services/sound.service';

interface LoadMoreButtonProps {
  initialSounds: SoundButton[];
  category?: string;
  tag?: string;
  onLoadMore: (newSounds: SoundButton[]) => void;
  initialHasMore?: boolean;
}

export default function LoadMoreButton({
  initialSounds,
  category,
  tag,
  onLoadMore,
  initialHasMore,
}: LoadMoreButtonProps) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore !== undefined ? initialHasMore : true);
  const [currentPage, setCurrentPage] = useState(2); // Start at page 2 since page 1 is initialSounds
  const pageSize = 20; // Match the initial page size

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Check if category is a number (category_id) or string (tag/category name)
      const categoryId = category && !isNaN(Number(category)) ? Number(category) : null;
      const filterTag = tag || (category && !categoryId ? category : undefined);
      
      const params: { 
        tag?: string; 
        category?: number | string;
        page: number;
        page_size: number;
      } = {
        page: currentPage,
        page_size: pageSize,
      };
      
      if (categoryId) {
        params.category = categoryId;
      } else if (filterTag) {
        params.tag = filterTag;
      }
      
      // Use the pagination method to get next page
      const result = await soundService.getSoundsWithPagination(params);
      
      if (result.sounds.length > 0) {
        onLoadMore(result.sounds);
        setHasMore(result.hasMore);
        setCurrentPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more sounds:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={handleLoadMore}
        disabled={loading}
        className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium transition-colors disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Loading...
          </span>
        ) : (
          'Load More'
        )}
      </button>
    </div>
  );
}

