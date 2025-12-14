import { useState, useEffect, type FormEvent } from "react";

interface SearchSectionProps {
  category?: string;
  categorySlug?: string;
  initialQuery?: string;
  variant?: "hero" | "default";
}

export default function SearchSection({
  category,
  categorySlug,
  initialQuery,
  variant = "default",
}: SearchSectionProps = {}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Update search query from URL params on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get("q");
      if (queryParam && !initialQuery) {
        setSearchQuery(queryParam);
      }
      const categoryIdParam = urlParams.get("category");
      if (categoryIdParam) {
        setSelectedCategoryId(categoryIdParam);
      }
    }
  }, [initialQuery]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim() && !selectedCategoryId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Navigate to search page with new format: /search/{querystring}
      const query = searchQuery.trim();
      
      if (!query && selectedCategoryId) {
        // If only category is selected, use old format
        window.location.href = `/search?category=${selectedCategoryId}`;
        return;
      }

      if (!query) {
        setLoading(false);
        return;
      }

      // Encode the query string for URL (but keep it readable)
      const encodedQuery = encodeURIComponent(query);
      let searchUrl = `/search/${encodedQuery}`;

      // If we're in a category context, navigate to category search page
      if (categorySlug) {
        searchUrl = `/categories/${categorySlug}/search/${encodedQuery}`;
        if (selectedCategoryId) {
          searchUrl += `?category=${selectedCategoryId}`;
        }
      } else if (category) {
        // If category name is provided but no slug, use category filter in general search
        searchUrl = `/search/${encodedQuery}?category=${encodeURIComponent(
          category
        )}`;
        if (selectedCategoryId) {
          searchUrl += `&category_id=${selectedCategoryId}`;
        }
      } else if (selectedCategoryId) {
        // Add category_id as query parameter if selected
        searchUrl += `?category=${selectedCategoryId}`;
      }

      window.location.href = searchUrl;
    } catch (err: any) {
      setError("Failed to perform search. Please try again.");
      console.error("Search error:", err);
      setLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);

    // If a category is selected, navigate to fetch sounds for that category
    if (categoryId) {
      window.location.href = `/search?category=${categoryId}`;
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setError(null);
  };

  const isHero = variant === "hero";

  return (
    <>
      {/* Search Bar */}
      {isHero ? (
        <div className="w-full">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex gap-2">
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sounds by name or tag..."
                  className="block w-full pl-10 pr-20 py-2.5 border border-white/30 rounded-lg bg-white/95 backdrop-blur-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-sm shadow-xl transition-all"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={
                      loading || (!searchQuery.trim() && !selectedCategoryId)
                    }
                    className="px-4 py-1.5 bg-white text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600"
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
                        Searching...
                      </span>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-white/90 text-center drop-shadow">{error}</p>
            )}
          </form>
        </div>
      ) : (
        <section className="py-8 -mt-6 relative z-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sounds by name or tag..."
                      className="block w-full pl-12 pr-24 py-4 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base shadow-lg transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-2">
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={handleClear}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Clear search"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={
                          loading || (!searchQuery.trim() && !selectedCategoryId)
                        }
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                            Searching...
                          </span>
                        ) : (
                          "Search"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
                )}
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
