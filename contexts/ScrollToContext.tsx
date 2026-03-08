'use client';

import React, { createContext, useCallback, useContext } from 'react';

const HEADER_OFFSET = 5;

type ScrollToSectionFn = (id: string, customOffset?: number) => void;

const ScrollToContext = createContext<ScrollToSectionFn | null>(null);

export function useScrollToSection(): ScrollToSectionFn {
  const ctx = useContext(ScrollToContext);
  return ctx ?? scrollToSectionNative;
}

export function scrollToSectionNative(id: string, customOffset?: number) {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`;
    return;
  }
  const el = document.getElementById(id);
  if (!el) {
    window.location.href = `/#${id}`;
    return;
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ScrollToProvider({ children, scrollFn }: { children: React.ReactNode; scrollFn: ScrollToSectionFn }) {
  return <ScrollToContext.Provider value={scrollFn}>{children}</ScrollToContext.Provider>;
}
