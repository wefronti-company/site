import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ButtonCta from '../../components/ui/ButtonCta';
import Badge from '../../components/ui/Badge';
import StatCounter from '../../components/ui/StatCounter';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import { ptBR } from '../../locales/pt-BR';
import SimpleDashboard from '../../components/ui/SimpleDashboard';

// Versões pesadas apenas para desktop
const InteractiveDashboard = dynamic(
  () => import('../../components/ui/InteractiveDashboard'),
  { ssr: false }
);

const Hero: React.FC = () => {
  const { openModal } = useQuoteModal();
  const t = ptBR;
  const heroRef = React.useRef<HTMLElement | null>(null);
  const [navFixed, setNavFixed] = React.useState(false);

  const handleNav = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      // fix nav after a small offset
      setNavFixed(y > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      className="w-full h-auto md:h-screen md:w-screen transition-colors duration-300 relative overflow-hidden border-b bg-black"
      ref={heroRef}
      style={{
        backgroundImage: "url('/images/background-hero.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderBottomColor: '#D1D5DB'
      }}
    >
      {/* Overlay to improve contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/10" />

      <div className="px-4 md:px-8 lg:px-16 relative z-10 md:h-full">
        {/* Hero nav (inline) — sticky and glass effect when scrolling */}
        {/* Side glass panels (fill entire lateral of the section when scrolled) */}
        <div className={`hidden lg:block absolute top-0 left-0 h-full w-[14%] transition-opacity duration-400 pointer-events-none ${scrolled ? 'opacity-100 backdrop-blur-lg bg-black/30' : 'opacity-0'}`} />
        <div className={`hidden lg:block absolute top-0 right-0 h-full w-[14%] transition-opacity duration-400 pointer-events-none ${scrolled ? 'opacity-100 backdrop-blur-lg bg-black/30' : 'opacity-0'}`} />

        <div
          className={`w-full z-50 transition-all duration-300 ${navFixed ? 'fixed left-0 right-0 top-0 backdrop-blur-md bg-black/30 border-b border-white/10' : ''}`}
        >
          <div className={`max-w-[1400px] mx-auto py-4 px-4 flex items-center justify-between gap-4 ${!navFixed && (scrolled ? 'backdrop-blur-md bg-black/20' : 'bg-transparent')}`}>
          {/* Left: isologo-white */}
          <div className="flex items-center flex-shrink-0">
            <img src="/images/isologo-white.webp" alt="Wefronti" className="h-10 md:h-12 object-contain" />
          </div>

          {/* Center: links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
            <button onClick={() => handleNav('#section-0')} className="hover:opacity-80 transition-opacity">Início</button>
            <button onClick={() => handleNav('#clients')} className="hover:opacity-80 transition-opacity">Clientes</button>
            <button onClick={() => handleNav('#services')} className="hover:opacity-80 transition-opacity">Serviços</button>
            <button onClick={() => handleNav('#projects')} className="hover:opacity-80 transition-opacity">Projetos</button>
            <button onClick={() => handleNav('#faq')} className="hover:opacity-80 transition-opacity">FAQ</button>
          </nav>

            {/* Right: CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openModal()}
              className="hidden md:inline-flex px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:brightness-110 transition-all"
            >
              {t.hero.cta}
            </button>
            {/* Mobile: simple menu button (keeps previous mobile header behaviour) */}
            <button
              className="md:hidden inline-flex px-3 py-2 rounded-lg bg-white/10 text-white text-sm font-medium"
              onClick={() => openModal()}
            >
              {t.hero.cta}
            </button>
          </div>
        </div>
        </div>
          <div className="w-full max-w-[1400px] mx-auto md:h-full flex items-center py-20 md:py-0">
            {/* Layout: 70% Left / 30% Right */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
              
              {/* Left Side - 70% */}
              <div className="w-full lg:w-[60%] flex flex-col gap-6">
                <Badge text={t.hero.badge} icon="star" />
                
                <h1 className="text-5xl md:text-6xl lg:text-6xl font-medium text-white leading-tight">
                  {t.hero.title}
                </h1>
                
                <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                  {t.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <ButtonCta 
                    label={t.hero.cta} 
                    variant="primary"
                  />
                </div>

                {/* Stats Counters */}
                <div className="flex flex-wrap gap-8 mt-4 mb-8 lg:mb-0">
                  <StatCounter value="50+" label={t.hero.stats.projects} />
                  <StatCounter value="30+" label={t.hero.stats.clients} />
                  <StatCounter value="98%" label={t.hero.stats.satisfaction} />
                </div>
              </div>

              {/* Right Side - 30% - Dashboard responsivo */}
              <div className="w-full lg:w-[40%] flex items-center justify-center">
                {/* Dashboard simples mobile */}
                <div className="w-full lg:hidden">
                  <SimpleDashboard />
                </div>
                {/* Dashboard interativo desktop */}
                <div className="w-full h-full min-h-[600px] hidden lg:block">
                  <InteractiveDashboard />
                </div>
              </div>

            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
