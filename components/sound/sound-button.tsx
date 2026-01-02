"use client";

import type React from "react";
import { useState, useRef, useCallback, memo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/contexts/favorites-context";
import type { Sound } from "@/lib/api/client";
import type { Locale } from "@/lib/i18n/config";
import { getColorHex } from "@/lib/constants/colors";
import { getSoundUrl } from "@/lib/utils/slug";
import { Button } from "../ui/button";
import { DownloadIcon, Share2Icon, HeartIcon, Loader2 } from "lucide-react";

interface Props {
  sound: Sound;
  lang: Locale;
  hideActions?: boolean;
  size?: "default" | "large";
  hideName?: boolean; // Added prop to hide the name
  onShareClick?: (soundName: string) => void; // New prop for share button click
  setMessageContent?: (content: string) => void;
  setShowMessage?: (show: boolean) => void;
  dict?: any;
  className?: string;
}

// Global audio context for pausing other sounds
let currentAudio: HTMLAudioElement | null = null;

const SoundButton = memo(function SoundButton({
  sound,
  lang,
  hideActions = false,
  size = "default",
  hideName = false,
  onShareClick,
  setMessageContent,
  setShowMessage,
  dict,
  className,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonId = `btn-${sound.id}`;

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(Number(sound.id));

  // Get color based on sound properties
  const getSoundColor = (sound: Sound) => {
    const colors = [
      "red",
      "blue",
      "green",
      "yellow",
      "purple",
      "orange",
      "cyan",
      "emerald",
      "violet",
      "fuchsia",
      "teal",
      "lime",
      "amber",
      "sky",
      "rose",
    ];
    // Use sound id to determine color (cyclic through available colors)
    const colorIndex = sound.id % colors.length;
    return colors[colorIndex];
  };

  const colorHex = getColorHex(getSoundColor(sound));

  const rgb = hexToRgb(colorHex);
  const colors = generateColorVariations(rgb);

  const handlePlay = useCallback(() => {
    const audioUrl = `https://play.soundboard.cloud/api/soundboardgo.com/sounds/${sound.id}/audio`;
    // Stop any currently playing sound
    if (currentAudio && currentAudio !== audioRef.current) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      currentAudio = null;
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        currentAudio = null;
      };
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        currentAudio = null;
      };
    }

    audioRef.current.currentTime = 0;
    console.log("Attempting to play audio:", audioUrl); // Added console.log here
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        currentAudio = audioRef.current;
        // Increment play count
        fetch(`/api/sounds/${sound.id}/play`, { method: "POST" }).catch(
          () => {}
        );
      })
      .catch((e) => {
        console.error("Error playing sound:", e);
        setIsPlaying(false);
      });

    // Button press animation
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  }, [isPlaying, sound.id]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(Number(sound.id));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShareClick) {
      onShareClick(sound.name);
    } else {
      // Fallback for pages where onShareClick is not provided (e.g., detail page)
      const url = `${window.location.origin}${getSoundUrl(
        sound.name,
        Number(sound.id),
        lang
      )}`;
      navigator.clipboard.writeText(url).then(() => {
        if (setMessageContent && setShowMessage && dict) {
          setMessageContent(dict.share.success);
          setShowMessage(true);
        }
      });
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      const downloadUrl = `https://play.soundboard.cloud/api/soundboardgo.com/sounds/${sound.id}/audio?download=true`;
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sound.name}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading sound:", error);
      alert("Failed to download sound.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col text-center",
        className
      )}
    >
      {/* Button section - centered */}
      <div className="flex items-center justify-center py-1 flex-shrink-0">
        <div
          className={`relative transition-all duration-300 ${
            isPlaying ? "scale-95" : "group-hover:scale-105"
          }`}
        >
          <div
            role="button"
            aria-label={`Play ${sound.name}`}
            onClick={handlePlay}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setTimeout(() => setIsPressed(false), 150)}
            onMouseLeave={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setTimeout(() => setIsPressed(false), 150)}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {!isPressed ? (
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 508.88 499.32" width={size === "large" ? "250" : "104"} height={size === "large" ? "230" : "99"}>
                <g>
                  <path fill="#58595b" d="M474.89,216.79H33.99c-9.89,18.18-15.31,37.91-15.31,58.54v48.77c0,6.86.69,13.62,2.15,20.23,15.49,73.31,114.17,129.84,233.61,129.84s218.12-56.53,233.61-129.84c1.42-6.61,2.15-13.37,2.15-20.23v-48.77l-15.31-58.54Z"/>
                  <path fill="#404140" d="M490.2,275.33c0,90.99-105.55,164.77-235.76,164.77S18.68,366.32,18.68,275.33c0-20.63,5.42-40.36,15.31-58.54,33.79-62.1,119.74-106.23,220.45-106.23s186.66,44.13,220.45,106.23c9.89,18.18,15.31,37.91,15.31,58.54Z"/>
                  <ellipse fill="#b0aaab" cx="255.29" cy="272.16" rx="227.47" ry="155.26"/>
                </g>
                <g>
                  <path fill={rgbToHex(colors.darkest.r, colors.darkest.g, colors.darkest.b)} d="M455.79,159.73v90.9c0,5.8-.61,11.54-1.84,17.14-13.23,62.11-97.52,109.99-199.51,109.99s-186.28-47.87-199.51-109.99c-1.23-5.6-1.84-11.34-1.84-17.14v-90.9h402.7Z"/>
                  <ellipse fill={rgbToHex(colors.medium.r, colors.medium.g, colors.medium.b)} cx="254.44" cy="159.73" rx="201.35" ry="134.58"/>
                  <ellipse fill={rgbToHex(colors.medium.r, colors.medium.g, colors.medium.b)} cx="254.52" cy="157.14" rx="191.18" ry="126.81"/>
                </g>
              </svg>
            ) : (
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 508.88 499.32" width={size === "large" ? "250" : "104"} height={size === "large" ? "230" : "99"}>
                <g>
                  <path fill="#58595b" d="M478.95,189.49H29.92c-10.08,17.65-15.59,36.81-15.59,56.84v47.35c0,6.66.7,13.22,2.19,19.64,15.78,71.18,116.28,126.06,237.92,126.06s222.14-54.88,237.92-126.06c1.44-6.42,2.19-12.98,2.19-19.64v-47.35l-15.59-56.84Z"/>
                  <path fill="#404140" d="M494.54,246.33c0,88.35-107.5,159.98-240.11,159.98S14.33,334.67,14.33,246.33c0-20.02,5.51-39.17,15.59-56.83,5.28-9.25,11.81-18.09,19.46-26.44.41-.46.84-.92,1.28-1.37,2.62-2.8,5.37-5.54,8.24-8.21,1.91-1.79,3.89-3.56,5.9-5.28,43.93-37.63,112.54-61.85,189.63-61.85s145.99,24.32,189.91,62.09c1.92,1.64,3.8,3.32,5.62,5.04,2.89,2.67,5.65,5.43,8.28,8.25.43.44.83.88,1.24,1.33,7.64,8.34,14.18,17.19,19.46,26.44,10.07,17.66,15.59,36.81,15.59,56.83Z"/>
                  <ellipse fill="#b0aaab" cx="255.31" cy="243.25" rx="231.66" ry="150.74"/>
                </g>
                <g>
                  <path fill={rgbToHex(colors.darkest.r, colors.darkest.g, colors.darkest.b)} d="M459.5,166.81v69.71c0,5.09-.62,10.13-1.87,15.04-13.48,54.5-99.32,96.5-203.2,96.5s-189.71-42-203.19-96.5c-1.24-4.91-1.87-9.95-1.87-15.04v-69.71l3.49-10.05h403.15c.92,2.85,1.67,5.74,2.23,8.66.43.46.83.93,1.24,1.4Z"/>
                  <path fill={rgbToHex(colors.dark.r, colors.dark.g, colors.dark.b)} d="M459.52,178.59c0,.51-.01,1.02-.02,1.53-.1,4.89-.72,9.7-1.83,14.43-13.53,57.67-99.36,102.13-203.22,102.13s-189.67-44.46-203.21-102.13c-1.22-5.22-1.86-10.54-1.86-15.96v-.15c.01-4.42.44-8.78,1.28-13.06.56-2.9,1.3-5.77,2.22-8.61,17.79-54.78,101.28-96.24,201.57-96.24s183.79,41.46,201.58,96.24c.92,2.85,1.67,5.74,2.23,8.66.69,3.53,1.09,7.11,1.22,10.73.01.31.02.61.02.92.01.51.02,1.02.02,1.53Z"/>
                  <ellipse fill={rgbToHex(colors.medium.r, colors.medium.g, colors.medium.b)} cx="254.53" cy="176.33" rx="194.7" ry="111.27"/>
                </g>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Sound name */}
      {!hideName && (
        <div className="flex items-center justify-center px-2 flex-shrink-0">
          <Link
            href={getSoundUrl(sound.name, Number(sound.id), lang)}
            className={cn(
              "mt-2 block w-full text-center",
              size === "large"
                ? "h-[56px] max-w-[300px]"
                : "h-[36px] max-w-[90px]"
            )}
            style={{ minHeight: size === "large" ? "56px" : "36px" }}
          >
            <p
              className={cn(
                "line-clamp-2 font-semibold leading-snug text-slate-700 underline hover:text-blue-600 transition-colors dark:text-slate-300 dark:hover:text-blue-400",
                size === "large" ? "text-lg" : "text-[13px]"
              )}
            >
              {sound.name}
            </p>
          </Link>
        </div>
      )}

      {!hideActions && (
        <div
          className="mt-1 flex items-center justify-center gap-2"
          style={{ minHeight: "20px" }}
        >
          {/* Heart icon */}
          <button
            type="button"
            onClick={handleFavorite}
            className={cn(
              "transition-colors",
              favorite ? "text-red-500" : "text-red-400 hover:text-red-500"
            )}
            aria-label="Add to favorites"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={favorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Share icon */}
          <button
            type="button"
            onClick={handleShare}
            className="text-blue-500 transition-colors hover:text-blue-600"
            aria-label="Share"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>

          {/* Download icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-8 w-8"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <DownloadIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Download</span>
          </Button>
        </div>
      )}

      <style jsx>{`

      `}</style>
    </div>
  );
});

function generateColorVariations(baseRgb: { r: number; g: number; b: number }) {
  const light = {
    r: Math.min(255, baseRgb.r + 45),
    g: Math.min(255, baseRgb.g + 45),
    b: Math.min(255, baseRgb.b + 45),
  };

  const medium = baseRgb;

  const dark = {
    r: Math.max(0, baseRgb.r - 35),
    g: Math.max(0, baseRgb.g - 35),
    b: Math.max(0, baseRgb.b - 35),
  };

  const darkest = {
    r: Math.max(0, baseRgb.r - 65),
    g: Math.max(0, baseRgb.g - 65),
    b: Math.max(0, baseRgb.b - 65),
  };

  return { light, medium, dark, darkest };
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 107, g: 114, b: 128 };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

export default SoundButton;
