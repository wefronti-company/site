import React, { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

const LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2,
  autoRaf: true,
  anchors: false, // Desabilitado: usamos useScrollToSection com offset para o badge
} as const;

/**
 * Envolve o app com Lenis para scroll suave.
 * Em mobile/touch: usa scroll nativo (mais rápido).
 * Respeita prefers-reduced-motion (não usa Lenis quando ativo).
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
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
