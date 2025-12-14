import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { soundService } from "@/services/sound.service";
import { authService } from "@/services/auth.service";
import type { ApiError, Category } from "@/types";

export default function UploadSoundForm() {
  const [name, setName] = useState("");
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const [soundFileUrl, setSoundFileUrl] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Check if user is authenticated
  useEffect(() => {
    const user = authService.getStoredUser();
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const fetchedCategories = await soundService.getCategories();
        // Flatten categories including children
        const flattenCategories = (cats: Category[]): Category[] => {
          const flattened: Category[] = [];
          const processCategory = (cat: Category) => {
            if (cat && cat.id && cat.is_active !== false) {
              flattened.push(cat);
            }
            if (cat.children && Array.isArray(cat.children) && cat.children.length > 0) {
              cat.children.forEach((child) => processCategory(child));
            }
          };
          cats.forEach((cat) => processCategory(cat));
          return flattened;
        };
        setCategories(flattenCategories(fetchedCategories));
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/m4a", "audio/webm"];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|webm)$/i)) {
        setError("Please select a valid audio file (MP3, WAV, OGG, M4A, or WebM)");
        return;
      }
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }
      setSoundFile(file);
      setSoundFileUrl(""); // Clear URL if file is selected
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    // Validate that either file or URL is provided
    if (!soundFile && !soundFileUrl.trim()) {
      setError("Please provide either an audio file or a sound file URL");
      setLoading(false);
      return;
    }

    // Validate name
    if (!name.trim()) {
      setError("Sound name is required");
      setLoading(false);
      return;
    }

    try {
      await soundService.uploadSound({
        name: name.trim(),
        sound_file: soundFile || undefined,
        sound_file_url: soundFileUrl.trim() || undefined,
        tag: tag.trim() || undefined,
        category: category,
      });

      setSuccess(true);
      // Reset form
      setName("");
      setSoundFile(null);
      setSoundFileUrl("");
      setTag("");
      setCategory(undefined);
      // Reset file input
      const fileInput = document.getElementById("sound_file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/sounds";
      }, 2000);
    } catch (err: any) {
      const apiError = err as ApiError;
      if (apiError.details) {
        // Handle field-specific errors
        const errors: Record<string, string> = {};
        Object.keys(apiError.details).forEach((key) => {
          const value = apiError.details[key];
          if (Array.isArray(value)) {
            errors[key] = value[0];
          } else if (typeof value === "string") {
            errors[key] = value;
          }
        });
        setFieldErrors(errors);

        // Handle general error message
        if (apiError.details.error) {
          const errorMsg = Array.isArray(apiError.details.error)
            ? apiError.details.error[0]
            : apiError.details.error;
          setError(errorMsg);
        } else {
          setError(apiError.error || "Upload failed. Please try again.");
        }
      } else {
        setError(apiError.error || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-md flex items-start animate-shake">
          <svg
            className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r-md flex items-start">
          <svg
            className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Sound uploaded successfully! Redirecting...</span>
        </div>
      )}

      <div className="space-y-5">
        {/* Sound Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Sound Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl transition-all duration-200 ${
                fieldErrors.name
                  ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500"
              } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm`}
              placeholder="My Awesome Sound"
            />
          </div>
          {fieldErrors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Audio File Upload */}
        <div>
          <label
            htmlFor="sound_file"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Audio File
          </label>
          <div className="relative">
            <input
              id="sound_file"
              name="sound_file"
              type="file"
              accept="audio/*,.mp3,.wav,.ogg,.m4a,.webm"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 file:cursor-pointer border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          {soundFile && (
            <p className="mt-2 text-sm text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Selected: {soundFile.name} ({(soundFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: MP3, WAV, OGG, M4A, WebM (max 50MB)
          </p>
        </div>

        {/* OR Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Sound File URL */}
        <div>
          <label
            htmlFor="sound_file_url"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Sound File URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <input
              id="sound_file_url"
              name="sound_file_url"
              type="url"
              value={soundFileUrl}
              onChange={(e) => {
                setSoundFileUrl(e.target.value);
                if (e.target.value) setSoundFile(null); // Clear file if URL is provided
              }}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl transition-all duration-200 ${
                fieldErrors.sound_file_url
                  ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500"
              } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm`}
              placeholder="https://example.com/sound.mp3"
            />
          </div>
          {fieldErrors.sound_file_url && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {fieldErrors.sound_file_url}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Provide a direct URL to an audio file if you don't want to upload a file
          </p>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tag"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Tags
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <input
              id="tag"
              name="tag"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="funny, music, test (comma-separated)"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple tags with commas
          </p>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <select
              id="category"
              name="category"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={loadingCategories}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm appearance-none cursor-pointer"
            >
              <option value="">Select a category (optional)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {loadingCategories && (
            <p className="mt-1 text-xs text-gray-500">Loading categories...</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading || success}
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
            loading || success
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-xl"
          }`}
        >
          {loading ? (
            <>
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
              Uploading...
            </>
          ) : success ? (
            "Uploaded Successfully!"
          ) : (
            "Upload Sound"
          )}
        </button>
      </div>
    </form>
  );
}

