import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { colors } from '../../styles/colors';
import ButtonMenu from './ButtonMenu';
import ButtonCta from './ButtonCta';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
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
    const element = document.querySelector(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
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
          transition: 'background 0.3s ease',
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
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[105]">
                  <span 
                    className="text-sm md:text-base font-light tracking-wider whitespace-nowrap"
                    style={{ color: colors.text.dark }}
                  >
                    {currentTime}
                  </span>
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
                      background: colors.primary.white,
                      transform: menuOpen 
                        ? 'translateY(0) rotate(45deg)' 
                        : 'translateY(-3px) rotate(0deg)'
                    }} 
                  />
                  <span 
                    className="absolute block w-11 h-[1.5px] rounded transition-all duration-700 ease-in-out"
                    style={{ 
                      background: colors.primary.white,
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
                      <h4 className="text-xs font-semibold uppercase mb-6 tracking-wider" style={{ color: colors.text.light }}>Navegar</h4>
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
                              style={{ backgroundColor: colors.purple.tertiary }}
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#services')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Serviços</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.purple.tertiary }}
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#comparative')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Sobre nós</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.purple.tertiary }}
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#clients')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Casos de sucesso</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.purple.tertiary }}
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
                              style={{ backgroundColor: colors.purple.tertiary }}
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
                              style={{ backgroundColor: colors.purple.tertiary }}
                            />
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase mb-6 tracking-wider" style={{ color: colors.text.light }}>Tirar dúvidas</h4>
                      <a 
                        href="https://wa.me/message/3V45SAJMLIJJJ1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block transition-all duration-300"
                        style={{ 
                          backgroundColor: colors.background.transparent 
                        }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: colors.neutral.borderLight }}
                          >
                            <img 
                              src="/images/site/secetraria-whatsapp.webp" 
                              alt="Secretária WhatsApp"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-lg font-medium" style={{ color: colors.text.light }}>Chamar no Whatsapp</span>
                        </div>
                        <p className="text-sm font-light" style={{ color: colors.text.light, opacity: 0.7 }}>
                          Fale com nosso time para tirar dúvidas rápidas sobre nossos serviços
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
                        <h4 className="text-xs font-semibold uppercase mb-8 tracking-wider" style={{ color: colors.text.light }}>Navegar</h4>
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
                              style={{ backgroundColor: colors.purple.tertiary }}
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#services')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Serviços</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.purple.tertiary }}
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#comparative')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Sobre nós</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.purple.tertiary }}
                            />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => scrollToSection('#clients')}
                            className="text-2xl font-light transition-all duration-300 flex items-center gap-3 group"
                            style={{ color: colors.text.light }}
                          >
                            <span>Casos de sucesso</span>
                            <span 
                              className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: colors.purple.tertiary }}
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
                              style={{ backgroundColor: colors.purple.tertiary }}
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
                              style={{ backgroundColor: colors.purple.tertiary }}
                            />
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Coluna 2 - WhatsApp (centralizada) */}
                    <div className="flex flex-col items-center justify-start">
                      <div>
                        <h4 className="text-xs font-semibold uppercase mb-8 tracking-wider" style={{ color: colors.text.light }}>Tirar dúvidas</h4>
                      <a 
                        href="https://wa.me/message/3V45SAJMLIJJJ1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-6 rounded-2xl transition-all duration-300"
                        style={{ 
                          backgroundColor: colors.background.transparent 
                        }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: colors.neutral.borderLight }}
                          >
                            <img 
                              src="/images/site/secetraria-whatsapp.webp" 
                              alt="Secretária WhatsApp"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-lg font-medium" style={{ color: colors.text.light }}>Chamar no Whatsapp</span>
                        </div>
                        <p className="text-sm font-light" style={{ color: colors.text.light, opacity: 0.7 }}>
                          Fale com nosso time para tirar dúvidas rápidas sobre nossos serviços
                        </p>
                      </a>
                      </div>
                    </div>

                    {/* Coluna 3 - Redes Sociais (alinhada à direita com botão menu) */}
                    <div className="flex justify-end">
                      <div>
                      <h4 className="text-xs font-semibold uppercase mb-8 tracking-wider" style={{ color: colors.text.light }}>Redes sociais</h4>
                      <div className="flex flex-col gap-4">
                        <a 
                          href="https://instagram.com/wefronti" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-6 rounded-2xl transition-all duration-300 flex items-center gap-4"
                          style={{ backgroundColor: colors.background.transparent }}
                        >
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: colors.neutral.gray }}
                          >
                            <FaInstagram className="w-6 h-6" style={{ color: colors.primary.white }} />
                          </div>
                          <div>
                            <div className="text-lg font-medium mb-1" style={{ color: colors.text.light }}>Instagram</div>
                          </div>
                        </a>
                        
                        <a 
                          href="https://linkedin.com/company/wefronti" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-6 rounded-2xl transition-all duration-300 flex items-center gap-4"
                          style={{ backgroundColor: colors.background.transparent }}
                        >
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: colors.neutral.gray }}
                          >
                            <FaLinkedin className="w-6 h-6" style={{ color: colors.primary.white }} />
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
  }

  // fallback: original floating/pill header (keeps same behavior)
  return (
    <div className="relative">
      <div className="relative flex items-center justify-between gap-4 px-6 py-3 w-[720px] max-w-[92vw] mx-auto"
        style={{ background: colors.primary.white, border: `1px solid ${colors.neutral.borderLight}`, borderRadius: '999px' }}>

        <div className="flex items-center">
          <button
            className="p-2 rounded-full relative flex items-center gap-3 transition-colors duration-200"
            aria-expanded={menuOpen}
            aria-controls="solutions-menu"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <div className="w-7 h-6 relative flex items-center">
              <span className={`absolute block w-6 h-[2px] bg-black rounded transition-all duration-200 ${menuOpen ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45' : 'left-0 top-1/2 -translate-y-1'}`} />
              <span className={`absolute block w-6 h-[2px] bg-black rounded transition-all duration-200 ${menuOpen ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45' : 'left-0 top-1/2 translate-y-1'}`} />
            </div>
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>

        <Logo href="/" ariaLabel="Ir para a página inicial" isDark className="h-6 absolute left-1/2 -translate-x-1/2" />

        <div className="flex items-center">
          <ButtonMenu label="Impulsionar meu negócio" />
        </div>

      </div>

      {/* mobile/desktop panel (same as header panel) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-panel"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.28 }}
            style={{ background: colors.primary.white, borderRadius: '30px', transformOrigin: 'top' }}
            className="absolute left-0 right-0 top-full mt-3 shadow-lg p-6 z-40"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium uppercase mb-3" style={{ color: colors.text.dark }}>Navegação</h4>
                <ul className="flex flex-col gap-3">
                  <li><Link href="/home" className="inline-flex items-center gap-2 text-sm" ><span>Home</span> <ArrowUpRight className="w-4 h-4" /></Link></li>
                  <li><Link href="/solucoes" className="inline-flex items-center gap-2 text-sm" ><span>Soluções</span> <ArrowUpRight className="w-4 h-4" /></Link></li>
                  <li><Link href="/projetos" className="inline-flex items-center gap-2 text-sm" ><span>Projetos</span> <ArrowUpRight className="w-4 h-4" /></Link></li>
                  <li><Link href="/sobre-nos" className="inline-flex items-center gap-2 text-sm" ><span>Sobre nós</span> <ArrowUpRight className="w-4 h-4" /></Link></li>
                  <li><Link href="/contato" className="inline-flex items-center gap-2 text-sm" ><span>Contato</span> <ArrowUpRight className="w-4 h-4" /></Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium uppercase mb-3" style={{ color: colors.text.dark }}>Redes sociais</h4>
                <div className="flex flex-col items-start gap-3">
                  <a href="https://instagram.com/wefronti" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm" aria-label="Instagram">
                    <span className="w-8 h-8 flex items-center justify-center rounded-md" style={{ color: colors.purple.tertiary }}>
                      <FaInstagram className="w-5 h-5" aria-hidden />
                    </span>
                    <span>Instagram</span>
                  </a>

                  <a href="https://linkedin.com/company/wefronti" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm" aria-label="LinkedIn">
                    <span className="w-8 h-8 flex items-center justify-center rounded-md" style={{ color: colors.purple.tertiary }}>
                      <FaLinkedin className="w-5 h-5" aria-hidden />
                    </span>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium uppercase mb-3" style={{ color: colors.text.dark }}>Tira dúvidas</h4>
                <p className="text-sm text-gray-600 mb-3">Fale com nosso time via WhatsApp para tirar dúvidas rápidas.</p>
                <a href="https://wa.me/message/3V45SAJMLIJJJ1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-3 py-3 rounded-md shadow-sm" style={{ borderRadius: '999px', background: colors.apoio.green, color: colors.whiteColor }} aria-label="Tirar dúvidas no WhatsApp">
                  <FaWhatsapp className="w-5 h-5" style={{ color: colors.whiteColor }} aria-hidden />
                  <span className="font-medium">Tirar dúvidas</span>
                </a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
