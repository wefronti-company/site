import { useState, useEffect } from 'react';

/**
 * Retorna true quando a viewport tem largura >= breakpoint (px).
 * Útil para aplicar estilos responsivos em React (inline).
 */
export function useMediaQuery(breakpointPx: number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpointPx]);

  return matches;
}
