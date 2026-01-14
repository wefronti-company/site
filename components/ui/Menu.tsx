import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { colors } from '../../styles/colors';
import ButtonMenu from './ButtonMenu';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const Menu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = document.getElementById('solutions');
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      const ratio = entry.intersectionRatio || 0;
      const fitsInViewport = entry.boundingClientRect && entry.boundingClientRect.top >= 0 && entry.boundingClientRect.bottom <= window.innerHeight;
      const mostlyVisible = ratio >= 0.6;
      const show = fitsInViewport || mostlyVisible;
      setVisible(show);
      if (!show) setMenuOpen(false);
    }, { threshold: [0.2, 0.6, 1] });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-6 z-[60] -translate-x-1/2">
      <div className="relative flex items-center justify-between gap-4 px-6 py-3 w-[720px] max-w-[92vw]"
      style={{ background: colors.primary.white, border: `1px solid ${colors.neutral.borderLight}`, borderRadius: '6px' }}>

        {/* Left: menu button with bars + label */}
        <div className="flex items-center">
          <button
            className="p-2 rounded hover:bg-black/5 relative flex items-center gap-3"
            aria-expanded={menuOpen}
            aria-controls="solutions-menu"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <div className="w-7 h-6 relative flex items-center">
              {/* center both bars vertically and offset slightly when closed */}
              <span className={`absolute block w-6 h-[2px] bg-black rounded transition-all duration-200 ${menuOpen ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45' : 'left-0 top-1/2 -translate-y-1'}`} />
              <span className={`absolute block w-6 h-[2px] bg-black rounded transition-all duration-200 ${menuOpen ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45' : 'left-0 top-1/2 translate-y-1'}`} />
            </div>
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>

        {/* Center: logo */}
        <Logo isDark className="h-6 absolute left-1/2 -translate-x-1/2" />

        {/* Right: action button */}
        <div className="flex items-center">
          <ButtonMenu label="Solicitar orçamento" />
        </div>

      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-panel"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.28 }}
            style={{ background: colors.primary.white, borderRadius: '5px', transformOrigin: 'top' }}
            className="absolute left-0 right-0 top-full mt-3 shadow-lg p-6 z-40"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Navigation links */}
              <div>
                <h4 className="text-sm font-medium uppercase mb-3" style={{ color: colors.text.dark }}>Navegação</h4>
                <ul className="flex flex-col gap-3">
                  <li><Link href="/home" className="inline-flex items-center gap-2 hover:underline text-sm" ><span>Home</span> <ArrowUpRight className="w-4 h-4" /></Link></li>
                  <li><Link href="/solucoes" className="inline-flex items-center gap-2 hover:underline text-sm" ><span>Soluções</span> <ArrowUpRight className="w-4 h-4" /></Link></li>
                  <li><Link href="/projetos" className="inline-flex items-center gap-2 hover:underline text-sm" ><span>Projetos</span> <ArrowUpRight className="w-4 h-4" /></Link></li>
                  <li><Link href="/sobre-nos" className="inline-flex items-center gap-2 hover:underline text-sm" ><span>Sobre nós</span> <ArrowUpRight className="w-4 h-4" /></Link></li>
                  <li><Link href="/contato" className="inline-flex items-center gap-2 hover:underline text-sm" ><span>Contato</span> <ArrowUpRight className="w-4 h-4" /></Link></li>
                </ul>
              </div>

              {/* Column 2: Social (vertical list with site colors) */}
              <div>
                <h4 className="text-sm font-medium uppercase mb-3" style={{ color: colors.text.dark }}>Redes sociais</h4>
                <div className="flex flex-col items-start gap-3">
                  <a href="https://instagram.com/wefronti" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm hover:underline" aria-label="Instagram">
                    <span className="w-8 h-8 flex items-center justify-center rounded-md" style={{ color: colors.green.secondary }}>
                      <FaInstagram className="w-5 h-5" aria-hidden />
                    </span>
                    <span>Instagram</span>
                  </a>

                  <a href="https://linkedin.com/company/wefronti" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm hover:underline" aria-label="LinkedIn">
                    <span className="w-8 h-8 flex items-center justify-center rounded-md" style={{ color: colors.green.secondary }}>
                      <FaLinkedin className="w-5 h-5" aria-hidden />
                    </span>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Column 3: WhatsApp CTA */}
              <div>
                <h4 className="text-sm font-medium uppercase mb-3" style={{ color: colors.text.dark }}>Tira dúvidas</h4>
                <p className="text-sm text-gray-600 mb-3">Fale com nosso time via WhatsApp para tirar dúvidas rápidas.</p>
                <a href="https://wa.me/message/3V45SAJMLIJJJ1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-3 py-3 rounded-md shadow-sm" style={{ borderRadius: '5px', background: colors.green.secondary, color: colors.whiteColor }} aria-label="Tirar dúvidas no WhatsApp">
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

export default Menu;
