import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { colors } from '../../styles/colors';
import ButtonMenu from './ButtonMenu';
import ButtonCta from './ButtonCta';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

type HeaderVariant = 'float' | 'header';

const Header: React.FC<{ variant?: HeaderVariant }> = ({ variant = 'float' }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  // Track page scroll (legacy fallback) and detect visibility of the Hero section.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Observe the hero section — while it's visible the header should be transparent.
    const heroEl = document.querySelector('#section-0');
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
      <header className="fixed top-0 left-0 right-0 z-[60] pointer-events-auto">
        <nav
          aria-label="Main navigation"
          className="w-full transition-all duration-300"
        >
          <div className="w-full px-4 md:px-8 lg:px-12 flex items-center justify-between py-4 md:py-5">
            {/* Logo à esquerda */}
            <div className="flex items-center">
              <Logo isDark={false} className="h-6" />
            </div>

            {/* Links centralizados */}
            <ul className="hidden md:flex items-center gap-6 text-base absolute left-1/2 -translate-x-1/2 transition-colors duration-200" style={{ color: colors.text.light }}>
              <li><a href="#section-0" className="hover:opacity-100 transition-colors duration-200" style={{ color: colors.text.light }} onMouseEnter={(e) => e.currentTarget.style.color = colors.neutral.grayHover} onMouseLeave={(e) => e.currentTarget.style.color = colors.text.light}>Início</a></li>
              <li><a href="#solutions" className="hover:opacity-100 transition-colors duration-200" style={{ color: colors.text.light }} onMouseEnter={(e) => e.currentTarget.style.color = colors.neutral.grayHover} onMouseLeave={(e) => e.currentTarget.style.color = colors.text.light}>O que fazemos</a></li>
              <li><a href="#comparative" className="hover:opacity-100 transition-colors duration-200" style={{ color: colors.text.light }} onMouseEnter={(e) => e.currentTarget.style.color = colors.neutral.grayHover} onMouseLeave={(e) => e.currentTarget.style.color = colors.text.light}>Sobre nós</a></li>
              <li><a href="#clients" className="hover:opacity-100 transition-colors duration-200" style={{ color: colors.text.light }} onMouseEnter={(e) => e.currentTarget.style.color = colors.neutral.grayHover} onMouseLeave={(e) => e.currentTarget.style.color = colors.text.light}>Casos de sucesso</a></li>
              <li><a href="#contato" className="hover:opacity-100 transition-colors duration-200" style={{ color: colors.text.light }} onMouseEnter={(e) => e.currentTarget.style.color = colors.neutral.grayHover} onMouseLeave={(e) => e.currentTarget.style.color = colors.text.light}>Contato</a></li>
              <li><a href="#contato" className="hover:opacity-100 transition-colors duration-200" style={{ color: colors.text.light }} onMouseEnter={(e) => e.currentTarget.style.color = colors.neutral.grayHover} onMouseLeave={(e) => e.currentTarget.style.color = colors.text.light}>FAQ</a></li>

            </ul>

            {/* Botão à direita */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <ButtonCta label="Entrar em contato" />
              </div>

              <div className="md:hidden">
                <button
                  className="p-2 rounded-full relative flex items-center gap-3 transition-colors duration-200"
                  aria-expanded={menuOpen}
                  aria-controls="solutions-menu"
                  onClick={() => setMenuOpen(prev => !prev)}
                  aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                >
                  <div className="w-7 h-6 relative flex items-center">
                    <span className={`absolute block w-6 h-[2px] rounded transition-all duration-200 ${menuOpen ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45' : 'left-0 top-1/2 -translate-y-1'}`}
                      style={{ background: colors.text.light }} />
                    <span className={`absolute block w-6 h-[2px] rounded transition-all duration-200 ${menuOpen ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45' : 'left-0 top-1/2 translate-y-1'}`}
                      style={{ background: colors.text.light }} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="menu-panel"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.28 }}
              style={{ background: colors.primary.white, borderRadius: '12px', transformOrigin: 'top' }}
              className="max-w-3xl mx-auto mt-3 shadow-lg p-6 z-40"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium uppercase mb-3" style={{ color: colors.text.dark }}>Navegação</h4>
                  <ul className="flex flex-col gap-3">
                    <li><a href="#section-0" className="inline-flex items-center gap-2 text-sm" ><span>Início</span> <ArrowUpRight className="w-4 h-4" /></a></li>
                    <li><a href="#solutions" className="inline-flex items-center gap-2 text-sm" ><span>Soluções</span> <ArrowUpRight className="w-4 h-4" /></a></li>
                    <li><a href="#projetos" className="inline-flex items-center gap-2 text-sm" ><span>Projetos</span> <ArrowUpRight className="w-4 h-4" /></a></li>
                    <li><a href="#sobre-nos" className="inline-flex items-center gap-2 text-sm" ><span>Sobre nós</span> <ArrowUpRight className="w-4 h-4" /></a></li>
                    <li><a href="#contato" className="inline-flex items-center gap-2 text-sm" ><span>Contato</span> <ArrowUpRight className="w-4 h-4" /></a></li>
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

        <Logo isDark className="h-6 absolute left-1/2 -translate-x-1/2" />

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
