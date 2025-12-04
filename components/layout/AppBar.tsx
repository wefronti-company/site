import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import Logo from '../ui/Logo';
import { colors } from '../../styles/colors';

const AppBar: React.FC = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({ rotate: mobileOpen ? 135 : 0 });
  }, [mobileOpen, controls]);

  const navItems = [
    { label: 'Clientes', href: '#clients' },
    { label: 'Contrate-nos', href: '#services' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <header className="w-full fixed top-30 left-0 right-0 z-[100] pt-10 pb-[30px]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16">
          <div 
            className="rounded-[90px] border"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(16, 16, 16, 0.6)',
              borderColor: colors.borderDark
            }}
          >
            <div className="h-20 flex items-center justify-between w-full px-6">
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
              className="px-4 py-2 text-base font-medium transition-opacity hover:opacity-80 flex items-center gap-2 rounded-full border"
              style={{ 
                color: colors.whiteColor,
                borderColor: colors.borderDark
              }}
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

          {/* MOBILE: Menu button com texto + ícone */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="flex items-center gap-2 px-4 py-2" 
              aria-label="Toggle menu"
            >
              <span className="text-base font-medium" style={{ color: colors.whiteColor }}>
                Menu
              </span>
              <motion.div
                className="relative flex items-center justify-center"
                style={{ width: '24px', height: '24px' }}
                animate={controls}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div 
                  style={{ 
                    position: 'absolute',
                    width: '18px',
                    height: '2px',
                    backgroundColor: colors.whiteColor,
                    borderRadius: '2px'
                  }}
                />
                <div 
                  style={{ 
                    position: 'absolute',
                    width: '2px',
                    height: '18px',
                    backgroundColor: colors.whiteColor,
                    borderRadius: '2px'
                  }}
                />
              </motion.div>
            </button>
          </div>
            </div>
          </div>
        </div>

      {/* Mobile menu fullscreen overlay com backdrop blur */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-[9999]"
            style={{ 
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              backgroundColor: 'rgba(10, 10, 10, 0.98)'
            }}
          >
            <div className="w-full h-full flex flex-col pt-10 pb-[30px]">
              {/* Header com Logo e botão Menu X */}
              <div className="px-4 md:px-8 mx-auto max-w-[1400px] w-full">
                <div 
                  className="rounded-[90px] border h-20 flex items-center justify-between px-6"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    backgroundColor: 'rgba(16, 16, 16, 0.6)',
                    borderColor: colors.borderDark
                  }}
                >
                  <button onClick={() => { setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Ir para o topo" className="flex items-center">
                    <Logo />
                  </button>
                  
                  <button 
                    onClick={() => setMobileOpen(false)} 
                    className="flex items-center gap-2 px-4 py-2" 
                    aria-label="Fechar menu"
                  >
                    <span className="text-base font-medium" style={{ color: colors.whiteColor }}>
                      Menu
                    </span>
                    <div className="flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.whiteColor} strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Content - Links centralizados */}
              <motion.nav 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
              >
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 + index * 0.05, duration: 0.4 }}
                    onClick={() => {
                      setMobileOpen(false);
                      const el = document.querySelector(item.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="text-lg font-medium transition-all hover:opacity-70"
                    style={{ color: colors.whiteColor }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </motion.nav>

              {/* Bottom buttons */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="px-6 pb-10 flex flex-col gap-4"
              >
                <button 
                  onClick={() => { setMobileOpen(false); router.push('/login'); }}
                  className="w-full px-6 py-4 text-base font-medium transition-all flex items-center justify-center gap-2 rounded-[90px] border"
                  style={{ 
                    color: colors.whiteColor,
                    borderColor: colors.borderDark
                  }}
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
                  className="w-full px-6 py-4 text-base font-semibold rounded-[90px] transition-all"
                  style={{ 
                    backgroundColor: colors.whiteColor,
                    color: colors.blackColor
                  }}
                >
                  Entrar em contato
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </>
  );
};

export default AppBar;
