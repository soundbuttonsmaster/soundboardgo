import { useState, useEffect, useRef } from 'react';

// Global state to track the currently playing sound
let globalPlayingSoundId: number | null = null;
let globalAudioInstance: HTMLAudioElement | null = null;
const listeners: Set<(soundId: number | null) => void> = new Set();

// Notify all listeners when the playing sound changes
function notifyListeners(soundId: number | null) {
  listeners.forEach(listener => listener(soundId));
}

// Stop the currently playing sound
function stopCurrentSound() {
  if (globalAudioInstance) {
    globalAudioInstance.pause();
    globalAudioInstance.currentTime = 0;
    globalAudioInstance = null;
  }
  if (globalPlayingSoundId !== null) {
    globalPlayingSoundId = null;
    notifyListeners(null);
  }
}

// Start playing a new sound
function startPlayingSound(soundId: number, audio: HTMLAudioElement) {
  // Stop any currently playing sound IMMEDIATELY (synchronously)
  // This prevents race conditions when clicking buttons quickly
  if (globalAudioInstance && globalAudioInstance !== audio) {
    try {
      globalAudioInstance.pause();
      globalAudioInstance.currentTime = 0;
      globalAudioInstance.src = ""; // Clear source to stop loading
    } catch (e) {
      console.warn('Error stopping previous audio:', e);
    }
  }
  
  // Clear previous state
  if (globalPlayingSoundId !== null) {
    globalPlayingSoundId = null;
    notifyListeners(null);
  }
  
  // Set the new playing sound
  globalPlayingSoundId = soundId;
  globalAudioInstance = audio;
  notifyListeners(soundId);
  
  // Check if audio has a valid source before playing
  if (!audio.src || audio.src === "") {
    console.error('Error: Audio element has no source');
    stopCurrentSound();
    return;
  }
  
  // Actually play the audio
  audio.play().catch((error) => {
    console.error('Error playing audio:', error);
    // If play fails, reset state
    if (globalPlayingSoundId === soundId) {
      stopCurrentSound();
    }
  });
  
  // Clean up when audio ends
  audio.addEventListener('ended', () => {
    if (globalPlayingSoundId === soundId) {
      stopCurrentSound();
    }
  }, { once: true });
}

/**
 * Custom hook for global audio player management
 * Ensures only one sound plays at a time across all components
 */
export function useGlobalAudioPlayer(soundId: number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Listen for global play state changes
    const listener = (playingSoundId: number | null) => {
      setIsPlaying(playingSoundId === soundId);
      // If another sound started playing, stop this one's audio
      if (playingSoundId !== soundId && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    listeners.add(listener);
    
    // Set initial state
    setIsPlaying(globalPlayingSoundId === soundId);

    return () => {
      listeners.delete(listener);
    };
  }, [soundId]);

  const play = (audio: HTMLAudioElement) => {
    audioRef.current = audio;
    startPlayingSound(soundId, audio);
    setIsPlaying(true);
  };

  const pause = () => {
    if (audioRef.current && globalPlayingSoundId === soundId) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      stopCurrentSound();
      setIsPlaying(false);
    }
  };

  const toggle = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    
    if (isPlaying) {
      pause();
    } else {
      play(audio);
    }
  };

  return {
    isPlaying,
    play,
    pause,
    toggle,
  };
}
