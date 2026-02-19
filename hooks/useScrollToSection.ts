import { useCallback } from 'react';
import { useLenis } from 'lenis/react';

const HEADER_OFFSET = 120; // espaço para o header fixo (badge visível)

/**
 * Retorna uma função para rolar até uma seção.
 * Usa Lenis quando disponível; caso contrário, usa scrollIntoView.
 * Aplica offset para o badge ficar visível abaixo do header.
 * No Lenis: offset positivo = scroll a mais (esconde o topo). Usamos offset negativo.
 */
export function useScrollToSection() {
  const lenis = useLenis();

  const scrollToSection = useCallback(
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
      const offset = -(customOffset ?? HEADER_OFFSET);
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
