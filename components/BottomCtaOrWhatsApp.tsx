import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import SolucoesCtaBar from './SolucoesCtaBar';
import FloatingWhatsApp from './FloatingWhatsApp';

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
  const [hasReachedSolucoes, setHasReachedSolucoes] = useState(false);
  const [hasReachedCta, setHasReachedCta] = useState(false);
  const [inHero, setInHero] = useState(true);
  const [inSolucoes, setInSolucoes] = useState(false);
  const [inCta, setInCta] = useState(false);
  const isHome = router.pathname === '/';

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (!isHome) return;

    let cleanup: (() => void) | null = null;

    const setupObservers = (
      heroEl: HTMLElement | null,
      solEl: HTMLElement | null,
      ctaEl: HTMLElement | null
    ) => {
      const opts = { threshold: 0, rootMargin: '0px 0px -10% 0px' };
      const heroObs = heroEl ? new IntersectionObserver(
        (entries) => { for (const e of entries) setInHero(e.isIntersecting); },
        opts
      ) : null;
      const solObs = solEl ? new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const v = e.isIntersecting;
            setInSolucoes(v);
            if (v) setHasReachedSolucoes(true);
          }
        },
        opts
      ) : null;
      const ctaObs = ctaEl ? new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const v = e.isIntersecting;
            setInCta(v);
            if (v) setHasReachedCta(true);
          }
        },
        opts
      ) : null;

      if (heroEl) heroObs?.observe(heroEl);
      if (solEl) solObs?.observe(solEl);
      if (ctaEl) ctaObs?.observe(ctaEl);
      return () => {
        heroObs?.disconnect();
        solObs?.disconnect();
        ctaObs?.disconnect();
      };
    };

    const heroSection = document.getElementById('hero');
    const solucoesSection = document.getElementById('solucoes');
    const ctaSection = document.getElementById('cta');

    if (heroSection || solucoesSection || ctaSection) {
      // Hero pode não existir em SSR, mas solucoes/cta sim na home
      const hero = document.getElementById('hero');
      cleanup = setupObservers(hero, solucoesSection, ctaSection);
      return () => cleanup?.();
    }

    const interval = setInterval(() => {
      const hero = document.getElementById('hero');
      const sol = document.getElementById('solucoes');
      const cta = document.getElementById('cta');
      if (hero || sol || cta) {
        clearInterval(interval);
        cleanup = setupObservers(hero ?? null, sol ?? null, cta ?? null);
      }
    }, 100);
    const timeout = setTimeout(() => clearInterval(interval), 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      cleanup?.();
    };
  }, [isHome, router.pathname]);

  if (!isHome) return <FloatingWhatsApp />;
  if (inCta) return null;

  // Barra: de Soluções até CTA (scroll down) ou de CTA até Soluções (scroll up)
  // Nunca em Hero. Em Soluções ao subir (hasReachedCta): recolhe
  const showBar =
    !inHero &&
    ((inSolucoes && !hasReachedCta) || (hasReachedSolucoes && !inSolucoes));

  if (showBar) {
    return (
      <AnimatePresence mode="wait">
        <SolucoesCtaBar key="solucoes-cta-bar" />
      </AnimatePresence>
    );
  }

  return <FloatingWhatsApp />;
};

export default BottomCtaOrWhatsApp;
