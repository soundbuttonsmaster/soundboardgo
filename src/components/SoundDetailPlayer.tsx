import { useState, useEffect, useRef } from "react";
import type { SoundButton as SoundButtonType } from "@/types";
import { useGlobalAudioPlayer } from "@/hooks/useGlobalAudioPlayer";
import ShareModal from "./ShareModal";
import { soundService } from "@/services/sound.service";
import { authService } from "@/services/auth.service";

interface SoundDetailPlayerProps {
  sound: SoundButtonType;
  hideActions?: boolean;
}

interface ButtonSvgProps {
  mainColor: string;
  darkColor: string;
}

/**
 * Default (unpressed) 3D button SVG.
 */
function DefaultButtonSvg({ mainColor, darkColor }: ButtonSvgProps) {
  return (
    <svg
      key={`svg-${mainColor}-${darkColor}`}
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2500 2500"
      aria-hidden="true"
      className="w-full h-full"
      style={{ pointerEvents: "none" }}
    >
      <path
        fill="#2d363c"
        d="M2474.51,1336.4v283.16c-7.69,174.23-128.12,345.93-357.47,479.19-479.18,276.74-1255.62,276.74-1733.53,0-230.62-133.26-351.06-304.96-358.75-479.19v-283.16h2449.74Z"
      />
      <path
        fill="#3c4a52"
        d="M2474.51,1241.77v283.17c-7.69,174.23-128.12,345.93-357.47,479.18-479.18,276.74-1255.62,276.74-1733.53,0-230.62-133.26-351.06-304.95-358.75-479.18v-283.17h2449.74Z"
      />
      <path
        fill="#5e7381"
        d="M2116.8,1742.18c-478.7,276.38-1254.85,276.37-1733.57-.01-478.71-276.39-478.73-724.5-.02-1000.87,478.7-276.38,1254.84-276.37,1733.56.01,478.72,276.39,478.73,724.5.03,1000.87Z"
      />
      <path
        fill={mainColor}
        d="M2297.7,1241.77c0,155.04-101.22,308.78-306.22,427.93-409.99,235.76-1073.69,235.76-1482.39,0-205.01-119.15-307.51-272.89-307.51-427.93,0-34.6,1.28-67.91,5.12-101.21,19.22,137.09,120.44,270.33,302.38,375.4,408.71,235.75,1072.4,235.75,1482.39,0,181.95-105.07,281.88-238.31,301.1-375.4,3.84,33.3,5.12,66.61,5.12,101.21Z"
      />
      <path
        fill={darkColor}
        d="M2292.58,1140.55c-19.22,137.09-119.15,270.33-301.1,375.4-409.99,235.75-1073.69,235.75-1482.39,0-181.94-105.07-283.16-238.31-302.38-375.4,20.51-224.21,112.75-425.38,253.69-585.54v-1.28c192.19-220.37,475.34-360.04,789.25-360.04s597.06,138.39,789.24,358.76c140.94,160.16,233.19,362.6,253.7,588.1Z"
      />
      <path
        fill={mainColor}
        d="M2042.73,635.74c0,14.09-1.28,28.18-3.85,39.71-14.09,103.79-89.68,205.01-228.06,284.43-310.06,178.11-812.31,178.11-1121.09,0-138.37-79.42-215.25-180.64-229.34-284.43-2.56-11.53-3.84-25.62-3.84-39.71,0-26.92,1.28-53.82,3.84-80.72v-1.28c192.19-220.37,475.34-360.04,789.25-360.04s597.06,138.39,789.24,358.76c2.57,26.9,3.85,55.09,3.85,83.29Z"
      />
      <path
        fill="#fff"
        fillOpacity="0.3"
        d="M1972.26,640.85c-157.6-130.69-360.03-207.55-581.69-207.55-138.37,0-270.34,30.75-388.21,85.83-117.87,55.09-221.66,134.54-306.22,231.92-124.28,142.22-206.28,319.03-224.22,516.35-3.84,29.47-3.84,58.93-3.84,89.68,0,65.34,20.5,131.97,64.06,193.47-137.1-97.38-206.29-216.54-206.29-335.7,0-29.47,1.28-58.93,5.13-88.4,17.94-197.32,98.65-375.4,222.93-516.35v-1.28c169.13-193.47,418.97-316.47,695.72-316.47s526.59,121.71,695.72,315.19c8.97,10.26,19.22,21.78,26.91,33.31Z"
      />
    </svg>
  );
}

/**
 * Pressed 3D button SVG.
 */
function PressedButtonSvg({ mainColor, darkColor }: ButtonSvgProps) {
  return (
    <svg
      key={`svg-pressed-${mainColor}-${darkColor}`}
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2500 2500"
      aria-hidden="true"
      className="w-full h-full"
      style={{ pointerEvents: "none" }}
    >
      <path
        fill="#2d363c"
        d="M2465.79,1300.34v228.75c-7.63,140.75-127.21,279.46-354.92,387.12-475.77,223.57-1246.68,223.57-1721.18,0-228.98-107.65-348.56-246.36-356.19-387.12v-228.75h2432.29Z"
      />
      <g>
        <path
          fill="#3c4a52"
          d="M2465.79,1171.84v231.08c-7.63,142.18-127.21,282.29-354.92,391.04-475.77,225.83-1246.68,225.83-1721.18,0-228.98-108.74-348.56-248.86-356.19-391.04v-231.08h2432.29Z"
        />
        <path
          fill="#5e7381"
          d="M2110.62,1580.2c-475.29,225.54-1245.91,225.53-1721.22,0-475.3-225.55-475.32-591.22-.02-816.76,475.29-225.54,1245.91-225.53,1721.21,0,475.31,225.55,475.32,591.22.03,816.76Z"
        />
        <path
          fill={mainColor}
          d="M2290.24,1166.76c0,111.27-100.5,221.61-304.04,307.12-407.07,169.2-1066.04,169.2-1471.83,0-203.55-85.51-305.31-195.85-305.31-307.12,0-24.83,1.28-48.74,5.09-72.64,19.08,98.39,119.58,194.01,300.23,269.41,405.79,169.19,1064.76,169.19,1471.83,0,180.65-75.41,279.87-171.03,298.95-269.41,3.81,23.9,5.09,47.81,5.09,72.64Z"
        />
        <path
          fill={darkColor}
          d="M2285.15,1094.13c-19.08,98.39-118.3,194.01-298.95,269.41-407.07,169.19-1066.04,169.19-1471.83,0-180.65-75.41-281.14-171.03-300.23-269.41,20.36-160.91,111.95-305.29,251.88-420.23v-.92c190.82-158.16,471.95-258.39,783.62-258.39s592.8,99.32,783.62,257.47c139.94,114.94,231.53,260.23,251.89,422.07Z"
        />
        <path
          fill={mainColor}
          d="M2037.08,731.83c0,10.11-1.27,20.23-3.82,28.5-13.99,74.49-89.04,147.13-226.43,204.13-307.85,127.83-806.52,127.83-1113.1,0-137.39-57-213.71-129.64-227.71-204.13-2.55-8.27-3.82-18.39-3.82-28.5,0-19.32,1.27-38.63,3.82-57.93v-.92c190.82-158.16,471.95-258.39,783.62-258.39s592.8,99.32,783.62,257.47c2.55,19.31,3.82,39.54,3.82,59.77Z"
        />
        <path
          fill="#fff"
          fillOpacity="0.3"
          d="M1967.12,735.5c-156.47-93.79-357.47-148.95-577.55-148.95-137.38,0-268.42,22.07-385.45,61.6-117.03,39.54-220.08,96.55-304.04,166.44-123.4,102.07-204.81,228.96-222.62,370.57-3.81,21.15-3.81,42.29-3.81,64.36,0,46.9,20.35,94.71,63.6,138.85-136.12-69.89-204.82-155.4-204.82-240.93,0-21.15,1.27-42.29,5.1-63.44,17.81-141.61,97.95-269.41,221.35-370.57v-.92c167.92-138.85,415.99-227.12,690.76-227.12s522.84,87.35,690.76,226.2c8.91,7.36,19.08,15.63,26.72,23.91Z"
        />
      </g>
    </svg>
  );
}

export default function SoundDetailPlayer({
  sound,
  hideActions = false,
}: SoundDetailPlayerProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(sound.is_favorited || false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const loadingAudioRef = useRef<HTMLAudioElement | null>(null);
  const {
    isPlaying,
    play: playGlobal,
    toggle,
    pause,
  } = useGlobalAudioPlayer(sound.id);

  // Debug: Log when component renders
  useEffect(() => {
    console.log(
      "🔵 SoundDetailPlayer: Component rendered for sound ID:",
      sound.id,
      "Name:",
      sound.name || sound.title
    );
  }, [sound.id, sound.name, sound.title]);

  // Keep local favorite state in sync with latest API data
  useEffect(() => {
    setIsFavorited(!!sound.is_favorited);
  }, [sound.is_favorited]);

  // Generate different colors based on sound data (same as SoundButton)
  const getButtonColor = (soundData: SoundButtonType) => {
    const colors = [
      { main: "#ff1a1a", dark: "#a30f0f" }, // Red
      { main: "#3b82f6", dark: "#1e40af" }, // Blue
      { main: "#10b981", dark: "#047857" }, // Green
      { main: "#f59e0b", dark: "#92400e" }, // Amber
      { main: "#8b5cf6", dark: "#5b21b6" }, // Purple
      { main: "#ec4899", dark: "#9f1239" }, // Pink
      { main: "#06b6d4", dark: "#0e7490" }, // Cyan
      // { main: "#f97316", dark: "#9a3412" }, // Orange
    ];

    const id =
      typeof soundData.id === "number" &&
      !isNaN(soundData.id) &&
      soundData.id > 0
        ? soundData.id
        : 0;

    const name = String(soundData.name || soundData.title || "")
      .toLowerCase()
      .trim();

    let nameHash = 0;
    for (let i = 0; i < name.length; i++) {
      nameHash = (nameHash << 5) - nameHash + name.charCodeAt(i);
      nameHash = nameHash & nameHash;
    }
    nameHash = Math.abs(nameHash);

    const key = id * 17 + nameHash + name.length * 3;
    const index = Math.abs(key) % colors.length;

    return colors[index];
  };

  const buttonColor = getButtonColor(sound);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [audio]);

  const handlePlay = async () => {
    console.log(
      "🎯 SoundDetailPlayer: handlePlay called for sound ID:",
      sound.id
    );

    // Store the sound ID we're trying to play to prevent race conditions
    const currentSoundId = sound.id;

    if (audio) {
      // Check if audio has a valid source before toggling
      if (
        !audio.src ||
        audio.src === "" ||
        audio.readyState === HTMLMediaElement.HAVE_NOTHING
      ) {
        // Audio source was cleared or invalid, need to reload
        console.log("⚠️ SoundDetailPlayer: Audio source invalid, reloading...");
        setAudio(null);
        // Fall through to load new audio
      } else {
        // Use global toggle to handle play/pause and stop other sounds
        console.log("🎵 SoundDetailPlayer: Toggling existing audio");
        toggle(audio);
        return;
      }
    }

    if (!audio) {
      // IMPORTANT: Stop any currently playing sound immediately before loading new one
      // This prevents race conditions when clicking buttons quickly
      pause();

      // Clean up any pending audio load
      if (loadingAudioRef.current) {
        loadingAudioRef.current.pause();
        loadingAudioRef.current.src = "";
        loadingAudioRef.current = null;
      }

      // Build list of potential audio URLs to try (in order of preference)
      const potentialUrls: string[] = [];

      // 1. Try API endpoint first (audio_url)
      if (sound.audio_url) {
        potentialUrls.push(sound.audio_url);
      }

      // 2. Try sound_file_url or sound_file with media base URL
      const soundFile = sound.sound_file_url || sound.sound_file;
      if (soundFile) {
        // If it's already a full URL, use it
        if (
          soundFile.startsWith("http://") ||
          soundFile.startsWith("https://")
        ) {
          potentialUrls.push(soundFile);
        } else {
          // Build media URL from API base URL
          // Example: http://192.168.1.96:8051/api -> http://192.168.1.96:8051/media
          const apiBaseUrl =
            import.meta.env.PUBLIC_API_BASE_URL ||
            "http://192.168.1.96:8051/api";
          let mediaBaseUrl = apiBaseUrl;
          if (mediaBaseUrl.endsWith("/api")) {
            mediaBaseUrl = mediaBaseUrl.slice(0, -4);
          } else if (mediaBaseUrl.endsWith("/api/")) {
            mediaBaseUrl = mediaBaseUrl.slice(0, -5);
          }

          // Remove leading slash from sound file path if present
          const cleanPath = soundFile.startsWith("/")
            ? soundFile.slice(1)
            : soundFile;
          potentialUrls.push(`${mediaBaseUrl}/media/${cleanPath}`);
        }
      }

      console.log("🔍 SoundDetailPlayer: Potential audio URLs:", potentialUrls);

      if (potentialUrls.length === 0) {
        console.error(
          "❌ SoundDetailPlayer: No audio URL available for sound:",
          sound
        );
        return;
      }

      // Try each URL until one works
      let audioLoaded = false;
      for (let i = 0; i < potentialUrls.length && !audioLoaded; i++) {
        // Check if we're still trying to play the same sound (prevent race condition)
        if (currentSoundId !== sound.id) {
          console.log("⚠️ SoundDetailPlayer: Sound ID changed, aborting load");
          break;
        }

        const audioUrl = potentialUrls[i];
        console.log(
          `🎵 SoundDetailPlayer: Trying URL ${i + 1}/${potentialUrls.length}:`,
          audioUrl
        );

        const newAudio = new Audio(audioUrl);
        newAudio.preload = "auto";

        // Store in ref to track loading audio
        loadingAudioRef.current = newAudio;

        // Create a promise to handle the audio loading - optimized for INSTANT playback
        const loadAudio = (): Promise<HTMLAudioElement> => {
          return new Promise((resolve, reject) => {
            let resolved = false;

            // Very short timeout - try to play immediately
            const timeout = setTimeout(() => {
              if (!resolved) {
                resolved = true;
                // Always try to resolve - play immediately
                resolve(newAudio);
              }
            }, 100); // Very short timeout - play almost immediately

            const cleanup = () => {
              clearTimeout(timeout);
              newAudio.removeEventListener("loadstart", onReady);
              newAudio.removeEventListener("loadedmetadata", onReady);
              newAudio.removeEventListener("loadeddata", onReady);
              newAudio.removeEventListener("canplay", onReady);
              newAudio.removeEventListener("error", onError);
            };

            const onReady = () => {
              if (resolved) return;

              // Double-check we're still playing the same sound
              if (currentSoundId !== sound.id) {
                cleanup();
                reject(new Error("Sound ID changed during load"));
                return;
              }

              resolved = true;
              cleanup();
              resolve(newAudio);
            };

            const onError = (e: Event) => {
              if (resolved) return;
              const error = newAudio.error;
              console.warn(`⚠️ SoundDetailPlayer: URL ${i + 1} error:`, {
                url: audioUrl,
                errorCode: error?.code,
                errorMessage: error?.message,
                readyState: newAudio.readyState,
              });

              // Even on error, try to resolve if we have any data
              if (newAudio.readyState >= HTMLMediaElement.HAVE_NOTHING) {
                resolved = true;
                cleanup();
                resolve(newAudio);
              } else {
                resolved = true;
                cleanup();
                reject(error || new Error("Audio load failed"));
              }
            };

            // Check if already ready - play immediately
            if (newAudio.readyState >= HTMLMediaElement.HAVE_NOTHING) {
              // Try to resolve immediately, but also listen for events
              // Listen to the earliest possible events for fastest response
              newAudio.addEventListener("loadstart", onReady, { once: true });
              newAudio.addEventListener("loadedmetadata", onReady, {
                once: true,
              });
              newAudio.addEventListener("loadeddata", onReady, { once: true });
              newAudio.addEventListener("canplay", onReady, { once: true });
              newAudio.addEventListener("error", onError, { once: true });

              // Also try to resolve immediately if we have metadata
              if (newAudio.readyState >= HTMLMediaElement.HAVE_METADATA) {
                resolved = true;
                cleanup();
                resolve(newAudio);
              }
            } else {
              // Listen to the earliest possible events for fastest response
              newAudio.addEventListener("loadstart", onReady, { once: true });
              newAudio.addEventListener("loadedmetadata", onReady, {
                once: true,
              });
              newAudio.addEventListener("loadeddata", onReady, { once: true });
              newAudio.addEventListener("canplay", onReady, { once: true });
              newAudio.addEventListener("error", onError, { once: true });
            }
          });
        };

        try {
          const loadedAudio = await loadAudio();

          // Final check: make sure we're still playing the same sound
          if (currentSoundId !== sound.id) {
            console.log(
              "⚠️ SoundDetailPlayer: Sound ID changed after load, discarding audio"
            );
            loadedAudio.pause();
            loadedAudio.src = "";
            break;
          }

          console.log(
            `✅ SoundDetailPlayer: Successfully loaded audio from URL ${i + 1}`
          );

          // Clear loading ref
          loadingAudioRef.current = null;

          // Set audio in state
          setAudio(loadedAudio);

          // Register with global player - this will handle playing and stop other sounds
          // Play IMMEDIATELY - don't wait for anything
          console.log(
            "🎵 SoundDetailPlayer: Registering audio with global player"
          );
          playGlobal(loadedAudio);

          // Also try direct play immediately for fastest response
          loadedAudio.play().catch((playError) => {
            // Ignore play errors - global player will handle it
            console.log(
              "⚠️ SoundDetailPlayer: Direct play attempt (will retry via global player)"
            );
          });

          console.log(
            "✅ SoundDetailPlayer: Audio registered and should be playing"
          );

          audioLoaded = true;
        } catch (error) {
          // Clear loading ref on error
          loadingAudioRef.current = null;

          // Check if error is due to sound ID change
          if (
            error instanceof Error &&
            error.message === "Sound ID changed during load"
          ) {
            console.log(
              "⚠️ SoundDetailPlayer: Load aborted due to sound ID change"
            );
            break;
          }

          // If this is the last URL and it failed, try to play anyway if audio exists
          if (
            i === potentialUrls.length - 1 &&
            loadingAudioRef.current === null
          ) {
            // Try to use the audio element even if it errored
            const erroredAudio = newAudio;
            if (
              erroredAudio &&
              erroredAudio.readyState >= HTMLMediaElement.HAVE_NOTHING
            ) {
              console.log(
                "⚠️ SoundDetailPlayer: Last URL failed, but attempting to play anyway"
              );
              try {
                setAudio(erroredAudio);
                playGlobal(erroredAudio);
                audioLoaded = true;
                break;
              } catch (playError) {
                console.warn(
                  "⚠️ SoundDetailPlayer: Failed to play errored audio:",
                  playError
                );
              }
            }
          }

          console.warn(
            `⚠️ SoundDetailPlayer: Failed to load from URL ${
              i + 1
            }, trying next...`
          );
          // Continue to next URL
        }
      }

      if (!audioLoaded && currentSoundId === sound.id) {
        console.error(
          "❌ SoundDetailPlayer: All audio URLs failed. Tried:",
          potentialUrls
        );
        console.error("   → Check if the audio files exist and are accessible");
        console.error(
          "   → Try opening the URLs directly in browser to verify"
        );
      }
    }
  };

  return (
    <div
      className="flex flex-col items-center"
      style={{ border: "none", outline: "none" }}
    >
      {/* 3D Button using SVGs - Same design as SoundButton */}
      <div className="flex items-start justify-center relative">
        <button
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log(
              "🖱️ SoundDetailPlayer: Button clicked, calling handlePlay"
            );
            handlePlay();
          }}
          style={{
            width: "300px",
            height: "120px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            position: "relative",
            transformOrigin: "top center",
            transform: isPressed ? "translateY(4px)" : "translateY(0)",
            outline: "none",
          }}
          aria-label={`Play ${sound.title || sound.name}`}
        >
          {/* SVG states for default / pressed */}
          {isPressed ? (
            <PressedButtonSvg
              key={`pressed-${sound.id}-${buttonColor.main}`}
              mainColor={buttonColor.main}
              darkColor={buttonColor.dark}
            />
          ) : (
            <DefaultButtonSvg
              key={`default-${sound.id}-${buttonColor.main}`}
              mainColor={buttonColor.main}
              darkColor={buttonColor.dark}
            />
          )}

          {/* Play/Pause Icon - positioned on top dome */}
          {/* <div
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              top: "36%",
              left: "12.5%",
              width: "75%",
              height: "37.5%",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {isPlaying ? (
              <svg
                className="w-12 h-12 text-white drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-12 h-12 text-white ml-1 drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            )}
          </div> */}
        </button>
      </div>

      {/* Action Icons */}
      {!hideActions && (
        <div className="flex justify-center items-center gap-2 mt-2">
          {/* Heart/Favorite */}
          <button
            onClick={async () => {
              if (isFavoriteLoading) return;

              // Check if user is authenticated
              if (!authService.isAuthenticated()) {
                window.location.href = "/login";
                return;
              }

              setIsFavoriteLoading(true);
              try {
                if (isFavorited) {
                  const updatedSound = await soundService.removeFromFavorites(
                    sound.id
                  );
                  setIsFavorited(updatedSound.is_favorited || false);
                } else {
                  const updatedSound = await soundService.addToFavorites(
                    sound.id
                  );
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
            }}
            className={`focus:outline-none hover:opacity-80 transition-opacity ${
              isFavoriteLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Favorite"
            disabled={isFavoriteLoading}
          >
            <svg
              className={`w-8 h-8 ${
                isFavorited ? "text-red-500 fill-current" : "text-red-500"
              }`}
              viewBox="0 0 20 20"
              fill={isFavorited ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={isFavorited ? 0 : 1.5}
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              setIsShareModalOpen(true);
            }}
            className="focus:outline-none hover:opacity-80 transition-opacity"
            aria-label="Share"
          >
            <svg
              className="w-8 h-8 text-blue-500 fill-current"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>

          {/* Download */}
          <button
            onClick={() => {
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
            }}
            className="focus:outline-none hover:opacity-80 transition-opacity"
            aria-label="Download"
          >
            <svg
              className="w-8 h-8 text-orange-500 fill-current"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        sound={sound}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
