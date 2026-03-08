'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ScrollToProvider, scrollToSectionNative } from '../contexts/ScrollToContext';

/** Lenis carregado só em desktop — em mobile não entra no bundle (reduz ~50KB + parse/avaliação) */
const SmoothScrollLenis = dynamic(() => import('./SmoothScrollLenis'), { ssr: false });

/**
 * Em mobile/touch: usa scroll nativo (sem Lenis, sem custo de JS).
 * Em desktop: carrega Lenis dinamicamente.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [useLenis, setUseLenis] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 767px)').matches || 'ontouchstart' in window;
    setUseLenis(!reduced && !mobile);
  }, []);

  if (!useLenis) {
    return (
      <ScrollToProvider scrollFn={scrollToSectionNative}>
        {children}
      </ScrollToProvider>
    );
  }
  return <SmoothScrollLenis>{children}</SmoothScrollLenis>;
}
