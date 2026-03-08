'use client';

import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';

interface BackgroundAudioContextValue {
  pauseBackground: () => void;
  resumeBackground: () => void;
}

const BackgroundAudioContext = createContext<BackgroundAudioContextValue | null>(null);

export function useBackgroundAudio(): BackgroundAudioContextValue {
  const ctx = useContext(BackgroundAudioContext);
  if (!ctx) {
    return {
      pauseBackground: () => {},
      resumeBackground: () => {},
    };
  }
  return ctx;
}

/**
 * Provider de áudio de fundo. Fornece pause/resume via contexto
 * para que os depoimentos possam pausar o som ao tocar.
 */
export const BackgroundAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const pauseBackground = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.pause();
  }, []);

  const resumeBackground = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    audio.loop = true;
    audio.play().catch(() => {});
  }, []);

  const value: BackgroundAudioContextValue = { pauseBackground, resumeBackground };

  return (
    <BackgroundAudioContext.Provider value={value}>
      <audio
        ref={audioRef}
        src="/audio/testimonials/sound.mp3"
        loop
        preload="auto"
        aria-hidden
        style={{ display: 'none' }}
      />
      {children}
    </BackgroundAudioContext.Provider>
  );
};
