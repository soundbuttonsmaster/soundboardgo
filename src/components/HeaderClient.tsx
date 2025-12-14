import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { soundService } from "@/services/sound.service";
import type { User, Category } from "@/types";

interface HeaderClientProps {
  initialCategories?: Category[];
}

export default function HeaderClient({
  initialCategories = [],
}: HeaderClientProps) {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );

  // Helper function to generate slug from name
  const generateCategoryName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Helper function to ensure category has a valid slug
  const ensureCategorySlug = (category: Category): string => {
    if (
      category.slug &&
      typeof category.slug === "string" &&
      category.slug !== "undefined" &&
      category.slug !== "null" &&
      category.slug.trim() !== ""
    ) {
      return category.slug;
    }
    return generateCategoryName(category.name);
  };

  useEffect(() => {
    // Check for user on mount
    const storedUser = authService.getStoredUser();
    setUser(storedUser);

    // Listen for storage changes (e.g., login/logout from another tab)
    const handleStorageChange = () => {
      const updatedUser = authService.getStoredUser();
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch categories when dropdown is opened
  useEffect(() => {
    if (
      showCategoriesDropdown &&
      categories.length === 0 &&
      !loadingCategories
    ) {
      const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
          const fetchedCategories = await soundService.getCategories();
          // Filter only active categories and ensure they have names
          const validCategories = fetchedCategories.filter((cat) => {
            // Check if category is active (default to true if not specified)
            if (cat.is_active === false) return false;

            // Ensure category has name and id
            if (!cat || !cat.id || !cat.name) return false;

            // Ensure slug exists (should be normalized by service, but double-check)
            if (!cat.slug) {
              cat.slug = generateCategoryName(cat.name);
            }

            return true;
          });
          setCategories(validCategories);
        } catch (err) {
          console.error("Error fetching categories:", err);
        } finally {
          setLoadingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [showCategoriesDropdown, categories.length, loadingCategories]);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showCategoriesDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".categories-dropdown-container")) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCategoriesDropdown]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    if (!showUserDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-dropdown-container")) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserDropdown]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-2 rounded-md p-1 focus:outline-none"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <span>SoundBoard Go</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:space-x-8">
            <a
              href="/new"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors relative group rounded-md focus:outline-none"
            >
              New
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </a>
            <a
              href="/trending"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors relative group rounded-md focus:outline-none"
            >
              Trending
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </a>
            <a
              href="/article"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors relative group rounded-md focus:outline-none"
            >
              Article
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </a>
            {/* Categories Dropdown */}
            <div
              className="relative categories-dropdown-container"
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <button
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 relative group rounded-lg focus:outline-none flex items-center gap-1.5 ${
                  showCategoriesDropdown
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
                onClick={() =>
                  setShowCategoriesDropdown(!showCategoriesDropdown)
                }
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span>Categories</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showCategoriesDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showCategoriesDropdown && (
                <div className="absolute left-0 top-full pt-3 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[600px] overflow-hidden flex flex-col backdrop-blur-sm">
                    <div
                      className="overflow-y-auto overflow-x-hidden category-dropdown-scrollbar py-2"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#cbd5e1 #f1f5f9",
                      }}
                    >
                      {loadingCategories ? (
                        <div className="px-6 py-12 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 mb-3">
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
                          </div>
                          <p className="text-sm text-gray-500 font-medium">
                            Loading categories...
                          </p>
                        </div>
                      ) : categories.length > 0 ? (
                        <div className="py-2">
                          {categories
                            .filter((category) => {
                              // Strict validation: category must exist, have a slug, and slug must be valid
                              if (!category || !category.id || !category.name)
                                return false;
                              const slug = category.slug;
                              return (
                                slug &&
                                typeof slug === "string" &&
                                slug !== "undefined" &&
                                slug.trim() !== "" &&
                                slug !== "null"
                              );
                            })
                            .map((category) => {
                              // Ensure category has a valid slug
                              const categoryName = ensureCategorySlug(category);
                              const hasChildren =
                                category.children &&
                                Array.isArray(category.children) &&
                                category.children.length > 0;
                              const isExpanded = expandedCategories.has(
                                category.id
                              );

                              return (
                                <div key={category.id} className="group">
                                  <div className="flex items-center hover:bg-gray-50 transition-colors duration-150">
                                    <a
                                      href={`/${categoryName}`}
                                      className="flex-1 px-5 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 transition-all duration-200 flex items-center gap-2 group-hover:translate-x-1"
                                      onClick={(e) => {
                                        // Additional validation on click
                                        if (
                                          !categoryName ||
                                          categoryName === "undefined" ||
                                          typeof categoryName !== "string"
                                        ) {
                                          e.preventDefault();
                                          console.error(
                                            "Invalid categoryName prevented navigation:",
                                            {
                                              id: category.id,
                                              name: category.name,
                                              categoryName: categoryName,
                                            }
                                          );
                                          return;
                                        }
                                        if (!hasChildren) {
                                          setShowCategoriesDropdown(false);
                                        }
                                      }}
                                    >
                                      <span className="flex-1 truncate">
                                        {category.name}
                                      </span>
                                    </a>
                                    {hasChildren && (
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          toggleCategory(category.id);
                                        }}
                                        className="px-3 py-3 text-gray-400 hover:text-primary-600 transition-all duration-200 hover:bg-gray-50 rounded-r-lg"
                                        aria-label={
                                          isExpanded ? "Collapse" : "Expand"
                                        }
                                      >
                                        {isExpanded ? (
                                          <svg
                                            className="w-4 h-4 transition-transform duration-200"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2.5}
                                              d="M19 9l-7 7-7-7"
                                            />
                                          </svg>
                                        ) : (
                                          <span className="text-gray-400 text-lg font-light transition-transform duration-200 group-hover:text-primary-600">
                                            ›
                                          </span>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                  {hasChildren && (
                                    <div
                                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isExpanded
                                          ? "max-h-96 opacity-100"
                                          : "max-h-0 opacity-0"
                                      }`}
                                    >
                                      <div className="bg-gray-50/50 border-l-2 border-primary-200">
                                        {category.children
                                          ?.filter((child) => {
                                            // Filter out inactive children
                                            if (child.is_active === false)
                                              return false;
                                            // Ensure child has required fields
                                            if (
                                              !child ||
                                              !child.id ||
                                              !child.name
                                            )
                                              return false;
                                            return true;
                                          })
                                          .map((child, index) => {
                                            // Ensure child has a valid slug
                                            const childCategoryName =
                                              ensureCategorySlug(child);
                                            // Use nested route pattern: /{categoryName}/{subCategoryName}
                                            const categoryName =
                                              ensureCategorySlug(category);
                                            return (
                                              <a
                                                key={child.id}
                                                href={`/${categoryName}/${childCategoryName}`}
                                                className="flex items-center gap-2 px-5 py-2.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-200 group/subcategory border-l-2 border-transparent hover:border-primary-400"
                                                onClick={(e) => {
                                                  if (
                                                    !childCategoryName ||
                                                    childCategoryName ===
                                                      "undefined" ||
                                                    typeof childCategoryName !==
                                                      "string" ||
                                                    !categoryName ||
                                                    categoryName ===
                                                      "undefined" ||
                                                    typeof categoryName !==
                                                      "string"
                                                  ) {
                                                    e.preventDefault();
                                                    return;
                                                  }
                                                  setShowCategoriesDropdown(
                                                    false
                                                  );
                                                }}
                                              >
                                                <span className="text-primary-500 font-semibold group-hover/subcategory:translate-x-1 transition-transform duration-200">
                                                  →
                                                </span>
                                                <span className="flex-1 truncate">
                                                  {child.name}
                                                </span>
                                              </a>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                            .filter(Boolean)}
                        </div>
                      ) : (
                        <div className="px-6 py-12 text-center">
                          <svg
                            className="w-12 h-12 mx-auto text-gray-300 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-500 font-medium">
                            No categories available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative user-dropdown-container">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary-600 transition-colors focus:outline-none rounded-md p-1 hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-xs">
                      {user.first_name?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:inline font-medium">
                    {user.full_name}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showUserDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
                      {/* Username Header */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      {/* Dropdown Items */}
                      <div className="py-1">
                        <a
                          href="/favorites"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
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
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span>My Favorites</span>
                        </a>
                        <a
                          href="/upload"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
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
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <span>Upload Sound</span>
                        </a>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 text-left"
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
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 px-4 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg focus:outline-none"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
