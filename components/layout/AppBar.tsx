import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Logo from '../ui/Logo';
import { colors } from '../../styles/colors';

const AppBar: React.FC = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Clientes', href: '#clients' },
    { label: 'Contrate-nos', href: '#services' },
    { label: 'Projetos', href: '#projects' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="w-full relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="h-40 flex items-center justify-between w-full">
          {/* LEFT: logo + divider + nav */}
          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Ir para o topo" className="flex items-center">
              <Logo />
            </button>
            
            {/* Vertical divider */}
            <div className="h-6 w-px" style={{ backgroundColor: colors.whiteColor }}></div>
            
            {/* Nav items */}
            <nav className="flex items-center gap-1 text-base font-500">
              {navItems.map(item => (
                <button
                  key={item.href}
                  onClick={() => {
                    const el = document.querySelector(item.href);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-3 py-2 rounded-md transition-colors"
                  style={{ color: colors.colorGrayhover }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.whiteColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.colorGrayhover}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile: just logo */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Ir para o topo" className="flex items-center">
              <Logo />
            </button>
          </div>

          {/* RIGHT: Entrar (com ícone gradient) + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-base font-medium transition-opacity hover:opacity-80 flex items-center gap-2"
              style={{ color: colors.whiteColor }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: colors.gradientOne }} />
                    <stop offset="50%" style={{ stopColor: colors.gradientTwo }} />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="8" r="4" stroke="url(#userGradient)" strokeWidth="2" fill="none"/>
                <path d="M4 20c0-4 3-6 8-6s8 2 8 6" stroke="url(#userGradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
              Painel
            </button>
            <button 
              onClick={() => router.push('/form')}
              className="px-6 py-2 text-base font-semibold rounded-[30px] transition-all hover:opacity-90"
              style={{ 
                backgroundColor: colors.whiteColor,
                color: colors.blackColor
              }}
            >
              Entrar em contato
            </button>
          </div>

          {/* MOBILE: hamburger */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 flex flex-col items-center justify-center gap-1.5" aria-label="Toggle menu">
              <span className={`w-6 h-0.5 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ backgroundColor: colors.whiteColor }} />
              <span className={`w-6 h-0.5 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} style={{ backgroundColor: colors.whiteColor }} />
              <span className={`w-6 h-0.5 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ backgroundColor: colors.whiteColor }} />
            </button>
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
              className="px-4 py-3 rounded-lg text-base font-medium transition-all text-left w-full hover:opacity-80"
              style={{ color: colors.whiteColor }}
            >
              {item.label}
            </button>
          ))}

          <div className="mt-2 flex flex-col gap-2">
            <button 
              onClick={() => { setMobileOpen(false); router.push('/login'); }}
              className="w-full px-5 py-3 text-base font-medium transition-all flex items-center justify-center gap-2"
              style={{ color: colors.whiteColor }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="userGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: colors.gradientOne }} />
                    <stop offset="50%" style={{ stopColor: colors.gradientTwo }} />

                  </linearGradient>
                </defs>
                <circle cx="12" cy="8" r="4" stroke="url(#userGradientMobile)" strokeWidth="2" fill="none"/>
                <path d="M4 20c0-4 3-6 8-6s8 2 8 6" stroke="url(#userGradientMobile)" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
              Painel
            </button>
            <button 
              onClick={() => { setMobileOpen(false); router.push('/form'); }}
              className="w-full px-5 py-3 text-base font-semibold rounded-[10px] transition-all"
              style={{ 
                backgroundColor: colors.whiteColor,
                color: colors.blackColor
              }}
            >
              Entrar em contato
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AppBar;
