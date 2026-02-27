import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import SolucoesCtaBar from './SolucoesCtaBar';

/**
 * Na home:
 * - Hero/ValoresCarousel: WhatsApp, barra nunca aparece
 * - Scroll para baixo: barra aparece na Soluções, vai até antes da CTA
 * - Scroll para cima: barra aparece na CTA, vai até antes de Soluções
 * - Na CTA: barra recolhe (footer visível)
 * - Em Soluções ao subir: barra recolhe
 * Em outras páginas: sempre WhatsApp.
 */
const BottomCtaOrWhatsApp: React.FC = () => {
  const router = useRouter();
  const [showBar, setShowBar] = useState(false);
  const isHome = router.pathname === '/';

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (!isHome) return;

    let rafId = 0;

    const updateVisibility = () => {
      const solucoesSection = document.getElementById('solucoes');
      const ctaSection = document.getElementById('cta');
      if (!solucoesSection || !ctaSection) return;

      const y = window.scrollY;
      const solucoesTop = solucoesSection.offsetTop;
      const ctaTop = ctaSection.offsetTop;

      // Barra visível somente entre Soluções e CTA (inclusive Soluções, exclusivo CTA).
      const withinRange = y >= solucoesTop - 8 && y < ctaTop - 8;
      setShowBar(withinRange);
    };

    const onScrollOrResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateVisibility);
    };

    // Tenta anexar imediatamente e também em retry (hydration/sections tardias).
    const tryStart = () => {
      const solucoesSection = document.getElementById('solucoes');
      const ctaSection = document.getElementById('cta');
      return Boolean(solucoesSection && ctaSection);
    };

    if (tryStart()) {
      updateVisibility();
    } else {
      const interval = setInterval(() => {
        if (tryStart()) {
          clearInterval(interval);
          updateVisibility();
        }
      }, 120);
      const timeout = setTimeout(() => clearInterval(interval), 5000);
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isHome, router.pathname]);

  if (!isHome) return null;

  return (
    <>
      <AnimatePresence>
        {showBar ? <SolucoesCtaBar key="solucoes-cta-bar" /> : null}
      </AnimatePresence>
    </>
  );
};

export default BottomCtaOrWhatsApp;
