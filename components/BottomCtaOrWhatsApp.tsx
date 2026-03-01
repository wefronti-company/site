import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import SolucoesCtaBar from './SolucoesCtaBar';

/**
 * Na home: barra CTA fixa visível entre as seções Soluções e CTA.
 * Em outras páginas: não renderiza nada.
 */
const BottomCtaOrWhatsApp: React.FC = () => {
  const router = useRouter();
  const [showBar, setShowBar] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      setPricingModalOpen(Boolean(customEvent.detail));
    };
    window.addEventListener('pricing-modal-visibility-change', handler as EventListener);
    return () => {
      window.removeEventListener('pricing-modal-visibility-change', handler as EventListener);
    };
  }, []);

  if (!isHome) return null;

  return (
    <AnimatePresence>
      {showBar && !pricingModalOpen ? <SolucoesCtaBar key="solucoes-cta-bar" /> : null}
    </AnimatePresence>
  );
};

export default BottomCtaOrWhatsApp;
