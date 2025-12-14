import { useState, useEffect } from "react";
import type { SoundButton as SoundButtonType } from "@/types";
import { soundService } from "@/services/sound.service";
import { authService } from "@/services/auth.service";
import ShareModal from "./ShareModal";

interface SoundDetailActionsProps {
  sound: SoundButtonType;
}

export default function SoundDetailActions({ sound }: SoundDetailActionsProps) {
  const [isFavorited, setIsFavorited] = useState(sound.is_favorited || false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Keep local favorite state in sync with latest API data
  useEffect(() => {
    setIsFavorited(!!sound.is_favorited);
  }, [sound.is_favorited]);

  const handleFavorite = async () => {
    if (isFavoriteLoading) return;

    if (!authService.isAuthenticated()) {
      window.location.href = "/login";
      return;
    }

    setIsFavoriteLoading(true);
    try {
      if (isFavorited) {
        const updatedSound = await soundService.removeFromFavorites(sound.id);
        setIsFavorited(updatedSound.is_favorited || false);
      } else {
        const updatedSound = await soundService.addToFavorites(sound.id);
        setIsFavorited(updatedSound.is_favorited || false);
      }
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
      if (error.status_code === 401) {
        window.location.href = "/login";
      } else {
        alert("Failed to update favorite. Please try again.");
      }
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleDownload = () => {
    const audioUrl =
      sound.audio_url || sound.sound_file_url || sound.sound_file;
    if (audioUrl && typeof window !== "undefined") {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = `${sound.title || sound.name || "sound"}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      {/* Action Buttons - 2 buttons per row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Download MP3 Button */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-3 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Download MP3</span>
        </button>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={isFavoriteLoading}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isFavorited
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          } ${isFavoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>Add to my soundboard</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-3 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          <span>Share</span>
        </button>

        {/* Category Button */}
        {sound.category_name && (
          <a
            href={`/categories/${sound.category_id}`}
            className="flex items-center gap-3 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span>{sound.category_name}</span>
          </a>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        sound={sound}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
}
