import { useCallback } from 'react';
import { useLenis } from 'lenis/react';

/**
 * Retorna uma função para rolar até uma seção.
 * Usa Lenis quando disponível; caso contrário, usa scrollIntoView.
 */
export function useScrollToSection() {
  const lenis = useLenis();

  const scrollToSection = useCallback(
    (id: string, offset = 0) => {
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
      if (lenis) {
        lenis.scrollTo(`#${id}`, { offset, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [lenis]
  );

  return scrollToSection;
}
