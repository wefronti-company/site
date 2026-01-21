import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { colors } from '../../styles/colors';
import ButtonCta from './ButtonCta';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Clock } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

type HeaderVariant = 'float' | 'header';

const Header: React.FC<{ variant?: HeaderVariant }> = ({ variant = 'float' }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const router = require('next/router').useRouter();

  // Atualizar hora do Brasil a cada segundo
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const brazilTime = now.toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setCurrentTime(brazilTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Função para scroll suave até seção
  const scrollToSection = (sectionId: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const element = document.querySelector(sectionId);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // fallback para scrollIntoView se não encontrar
        const fallback = document.getElementById(sectionId.replace('#', ''));
        if (fallback) fallback.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  // pages that should always render a dark header with a bottom border
  const routesWithDarkHeader = new Set(['/solucoes']);
  const forceDarkHeader = routesWithDarkHeader.has(router.pathname);

  // Track page scroll (legacy fallback) and detect visibility of the Hero section.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Observe the hero section — while it's visible the header should be transparent.
    const heroEl = document.querySelector('#hero');
    let obs: IntersectionObserver | null = null;
    if (heroEl) {
      obs = new IntersectionObserver((entries) => {
        const e = entries[0];
        // consider visible when at least 40% of the hero is in view
        setHeroVisible(e.isIntersecting && e.intersectionRatio > 0.4);
      }, { threshold: [0, 0.25, 0.4, 0.6, 1] });
      obs.observe(heroEl);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (obs && heroEl) obs.unobserve(heroEl);
    };
  }, []);

  // Header variant
  if (variant === 'header') {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          background: colors.background.dark,
          transition: 'background 0.3s ease', borderBottom: `1px solid ${colors.neutral.borderDark}`
        }}
      >
        <nav
          aria-label="Main navigation"
          className="w-full transition-all duration-300"
        >
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-3xl md:max-w-6xl mx-auto py-8 md:py-10 relative">
              <div className="flex items-center justify-between relative">
                {/* Logo à esquerda */}
                <div className="flex items-center relative z-[110]">
                  <Logo href="/" ariaLabel="Ir para a página inicial" isDark={false} className="h-8" />
                </div>

                {/* Relógio no centro - posição absoluta em relação ao container maior */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[105] group" style={{ position: 'absolute' }}>
                  <span 
                    className="text-sm md:text-base font-light tracking-wider whitespace-nowrap px-3 py-1.5 rounded flex items-center gap-2 relative group"
                    style={{ 
                      color: colors.text.light,
                      border: `1px solid ${colors.neutral.borderDark}`
                      // ...existing style
                    }}
                  >
                    <Clock className="w-4 h-4" style={{ color: colors.icons.light }} />
                    {currentTime}
                  </span>
                  {/* Balão ao passar o mouse */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 mt-0 z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto flex flex-col items-center"
                    style={{ minWidth: 370, top: '100%' }}
                    onMouseEnter={e => { e.currentTarget.classList.add('opacity-100'); e.currentTarget.classList.add('pointer-events-auto'); }}
                    onMouseLeave={e => { e.currentTarget.classList.remove('opacity-100'); e.currentTarget.classList.remove('pointer-events-auto'); }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-neutral-900 border border-white/10 shadow-xl px-6 py-4 flex flex-col items-center"
                      style={{ borderRadius: '6px', color: colors.text.light }}
                    >
                      <span className="text-base mb-4 text-center leading-snug">
                        Toda boa decisão<br />
                        começa com uma conversa!
                      </span>
                      <button
                        className="mt-1 px-5 py-2 rounded bg-white text-black font-medium text-sm hover:opacity-90 transition"
                        onClick={() => {
                          const el = document.querySelector('#contato');
                          if (el) {
                            window.scrollTo({
                              top: el.getBoundingClientRect().top + window.scrollY - 80,
                              behavior: 'smooth'
                            });
                          }
                        }}
                      >
                        Iniciar conversa
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* Botão à direita - Agora para desktop e mobile */}
                <div className="flex items-center gap-3 relative z-[110]">
              <button
                className="relative flex items-center justify-center transition-colors duration-200 cursor-pointer"
                aria-expanded={menuOpen}
                aria-controls="main-menu"
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                type="button"
                style={{ padding: 0, margin: 0 }}
              >
                <div className="w-12 h-6 relative flex items-center justify-center">
                  <span 
                    className="absolute block w-11 h-[1.5px] rounded transition-all duration-700 ease-in-out"
                    style={{ 
                      background: colors.text.light,
                      transform: menuOpen 
                        ? 'translateY(0) rotate(45deg)' 
                        : 'translateY(-3px) rotate(0deg)'
                    }} 
                  />
                  <span 
                    className="absolute block w-11 h-[1.5px] rounded transition-all duration-700 ease-in-out"
                    style={{ 
                      background: colors.text.light,
                      transform: menuOpen 
                        ? 'translateY(0) rotate(-45deg)' 
                        : 'translateY(3px) rotate(0deg)'
                    }} 
                  />
                </div>
              </button>
              </div>
            </div>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Menu Mobile - Dropdown de cima para baixo */}
              <motion.div
                key="mobile-menu"
                initial={{ height: 0 }}
                animate={{ height: 'calc(100vh - 100px)' }}
                exit={{ height: 0, transition: { duration: 1, delay: 0.5, ease: [0.32, 0.72, 0, 1] } }}
                transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                className="md:hidden fixed left-0 right-0 bottom-0 z-[90] overflow-hidden"
                style={{ 
                  top: '100px',
                  background: colors.background.dark
                }}
              >
                <div className="h-full flex flex-col p-6 overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5, ease: "easeOut" } }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.5, delay: 0, ease: "easeIn" } }}
                    className="flex flex-col gap-12"
                  >
                    {/* Navegação */}
                    <div>
                      <h4 className="text-sm font-regular uppercase mb-6 tracking-wider" style={{ color: colors.text.dark }}>Navegação</h4>
                      <ul className="flex flex-col gap-3">
                        <li>
                          <button 
                            onClick={() => scrollToSection('#hero')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Início</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#clients')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Clientes</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#sobre')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Sobre</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          </button>
                        </li>
                        
                        <li>
                          <button 
                            onClick={async () => {
                              setMenuOpen(false);
                              await new Promise(r => setTimeout(r, 10));
                              scrollToSection('#contato');
                            }}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Contato</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#faq')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>FAQ</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <h4 className="text-sm font-regular uppercase mb-6 tracking-wider" style={{ color: colors.text.dark }}>Whatsapp</h4>
                      <a 
                        href="https://wa.me/message/3V45SAJMLIJJJ1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block transition-all duration-300"
                     
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-transparent"
                          >
                            <img 
                              src="/images/icons/icon-fran.svg" 
                              alt="Ícone Fran"
                              className="w-full h-full object-contain bg-transparent"
                              style={{ background: 'transparent' }}
                            />
                          </div>
                          <span className="text-lg font-medium" style={{ color: colors.text.light }}>Falar com a Fran</span>
                        </div>
                        <p className="text-sm font-light" style={{ color: colors.text.light, opacity: 0.7 }}>
                          Um primeiro contato via WhatsApp para entender seu contexto e avançar com clareza.
                        </p>
                      </a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Menu Desktop - Dropdown de cima para baixo */}
              <motion.div
                key="desktop-menu"
                initial={{ height: 0 }}
                animate={{ height: 'calc(100vh - 100px)' }}
                exit={{ height: 0, transition: { duration: 1, delay: 0.5, ease: [0.32, 0.72, 0, 1] } }}
                transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                className="hidden md:block fixed left-0 right-0 bottom-0 z-[90] overflow-hidden"
                style={{ 
                  top: '100px',
                  background: colors.background.dark
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full max-w-3xl md:max-w-6xl">
                    <motion.div 
                      className="grid grid-cols-3 gap-16 w-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5, ease: "easeOut" } }}
                      exit={{ opacity: 0, y: 20, transition: { duration: 0.5, delay: 0, ease: "easeIn" } }}
                    >
                      {/* Coluna 1 - Navegação Principal (alinhada à esquerda com logo) */}
                      <div>
                        <h4 className="text-sm font-regular uppercase mb-8 tracking-wider" style={{ color: colors.text.dark }}>Navegação</h4>
                      <ul className="flex flex-col gap-3">
                        <li>
                          <button 
                            onClick={() => scrollToSection('#hero')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Início</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.icons.light }}
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#clients')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Clientes</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.icons.light }}
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#sobre')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Sobre</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.icons.light }}
                            />
                          </button>
                        </li>
                        
                        <li>
                          <button 
                            onClick={() => scrollToSection('#contato')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Contato</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.icons.light }}
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#faq')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>FAQ</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.icons.light }}
                            />
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Coluna 2 - WhatsApp (centralizada) */}
                    <div className="flex flex-col items-center justify-start">
                      <div>
                        <h4 className="text-sm font-regular uppercase mb-8 tracking-wider" style={{ color: colors.text.dark }}>Whatsapp</h4>
                      <a 
                        href="https://wa.me/message/3V45SAJMLIJJJ1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block rounded-2xl transition-all duration-300"
                      
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center"
                          >
                            <img 
                              src="/images/icons/icon-fran.svg" 
                              alt="Ícone Fran"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-lg font-medium" style={{ color: colors.text.light }}>Falar com a Fran</span>
                        </div>
                        <p className="text-sm font-light" style={{ color: colors.text.light, opacity: 0.7 }}>
                          Um primeiro contato via WhatsApp para entender seu contexto e avançar com clareza.
                        </p>
                      </a>
                      </div>
                    </div>

                    {/* Coluna 3 - Redes Sociais (alinhada à direita com botão menu) */}
                    <div className="flex justify-end">
                      <div>
                      <h4 className="text-sm font-regular uppercase mb-8 tracking-wider" style={{ color: colors.text.dark }}>Conecte-se</h4>
                      <div className="flex flex-col gap-4">
                        <a 
                          href="https://instagram.com/wefronti" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="rounded-2xl transition-all duration-300 flex items-center"
                        >
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-left"
                          >
                            <FaInstagram className="w-6 h-6" style={{ color: colors.icons.light }} />
                          </div>
                          <div>
                            <div className="text-lg font-medium mb-1" style={{ color: colors.text.light }}>Instagram</div>
                          </div>
                        </a>
                        
                        <a 
                          href="https://linkedin.com/company/wefronti" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="rounded-2xl transition-all duration-300 flex items-center"
                        >
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-left"
                          >
                            <FaLinkedin className="w-6 h-6" style={{ color: colors.icons.light }} />
                          </div>
                          <div>
                            <div className="text-lg font-medium mb-1" style={{ color: colors.text.light }}>LinkedIn</div>
                          </div>
                        </a>
                      </div>
                      </div>
                    </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    );
  };
};

export default Header;
