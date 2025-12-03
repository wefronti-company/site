import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Logo from '../ui/Logo';
import { colors } from '../../styles/colors';
import { ptBR } from '../../locales/pt-BR';

const AppBar: React.FC = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = ptBR;

  const navItems = [
    { label: 'Início', href: '#section-0' },
    { label: t.appBar.nav.clients, href: '#clients' },
    { label: t.appBar.nav.services, href: '#services' },
    { label: t.appBar.nav.projects, href: '#projects' },
    { label: t.appBar.nav.faq, href: '#faq' },
  ];

  // AppBar is now non-fixed and plain (no blur, no bottom border)

  return (
    <header className={`w-full relative transition-all duration-300`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="h-40 flex items-center justify-between w-full">
          {/* LEFT: logo */}
          <div className="flex items-center gap-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Ir para o topo" className="flex items-center">
              <Logo />
            </button>
          </div>

          {/* CENTER: nav (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
            {navItems.map(item => (
              <button
                key={item.href}
                onClick={() => {
                  const el = document.querySelector(item.href);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-4 py-2 rounded-md transition-opacity"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* RIGHT: CTA + controls */}
          <div className="flex items-center gap-3">
            {/* CTA: desktop (removed external brightness/glow) */}
            <button onClick={() => router.push('/form')} className="hidden md:inline-flex px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold transition-all">
              {t.appBar.cta}
            </button>

            {/* MOBILE: hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 flex flex-col items-center justify-center gap-1.5" aria-label="Toggle menu">
                <span className={`w-6 h-0.5 bg-white/80 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-6 h-0.5 bg-white/80 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`w-6 h-0.5 bg-white/80 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="px-4 pb-6 flex flex-col gap-3">
          {navItems.map(item => (
            <button
              key={item.href}
              onClick={() => {
                setMobileOpen(false);
                const el = document.querySelector(item.href);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-4 py-3 rounded-lg text-base font-medium transition-all text-gray-200 cursor-pointer text-left w-full"
            >
              {item.label}
            </button>
          ))}

          

            <div className="mt-2">
            <button type="button" onClick={() => { setMobileOpen(false); router.push('/form'); }} className="w-full px-5 py-3 text-base font-medium text-white active:scale-95 transition-all duration-200 flex items-center justify-center" style={{ borderRadius: '7px', backgroundColor: colors.blueColor }}>
              {t.appBar.cta}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AppBar;
