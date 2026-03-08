'use client';

import React, { useCallback } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import { ScrollToProvider } from '../contexts/ScrollToContext';

const LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2,
  autoRaf: true,
  anchors: false,
} as const;

function ScrollToProviderWithLenis({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const scrollFn = useCallback(
    (id: string, customOffset?: number) => {
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
      const offset = -(customOffset ?? 5);
      if (lenis) {
        lenis.scrollTo(`#${id}`, { offset, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [lenis]
  );
  return <ScrollToProvider scrollFn={scrollFn}>{children}</ScrollToProvider>;
}

export default function SmoothScrollLenis({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <ScrollToProviderWithLenis>{children}</ScrollToProviderWithLenis>
    </ReactLenis>
  );
}
