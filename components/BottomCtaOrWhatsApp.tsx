import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SolucoesCtaBar from './SolucoesCtaBar';
import FloatingWhatsApp from './FloatingWhatsApp';

/**
 * Na home: quando a seção Soluções estiver visível, mostra a barra CTA inferior.
 * Caso contrário, mostra o botão flutuante WhatsApp.
 * Em outras páginas: sempre mostra o WhatsApp.
 */
const BottomCtaOrWhatsApp: React.FC = () => {
  const router = useRouter();
  const [inSolucoes, setInSolucoes] = useState(false);
  const isHome = router.pathname === '/';

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (!isHome) return;

    const attachObserver = (el: HTMLElement) => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setInSolucoes(entry.isIntersecting);
          }
        },
        { threshold: 0, rootMargin: '0px 0px -15% 0px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    };

    let section = document.getElementById('solucoes');
    let cleanup: (() => void) | null = null;

    if (section) {
      cleanup = attachObserver(section);
    } else {
      const interval = setInterval(() => {
        const s = document.getElementById('solucoes');
        if (s) {
          clearInterval(interval);
          cleanup = attachObserver(s);
        }
      }, 100);
      const timeout = setTimeout(() => clearInterval(interval), 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
        cleanup?.();
      };
    }

    return () => cleanup?.();
  }, [isHome, router.pathname]);

  // Em páginas sem seção Soluções, sempre WhatsApp
  if (!isHome) {
    return <FloatingWhatsApp />;
  }

  // Na home: barra CTA quando em Soluções, senão WhatsApp
  return inSolucoes ? <SolucoesCtaBar /> : <FloatingWhatsApp />;
};

export default BottomCtaOrWhatsApp;
