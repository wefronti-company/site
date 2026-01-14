import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { colors } from '../../styles/colors';
import ButtonMenu from './ButtonMenu';

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
      <div className="flex items-center gap-4 px-6 py-4 shadow-lg"
      style={{ background: colors.green.primary, borderRadius: '4px' }}>
        <Logo isDark className="h-6" />
        <ButtonMenu label="Solicitar orçamento" className="ml-2" />

        <button
          className="ml-2 p-2 rounded relative w-8 h-8 flex items-center justify-center"
          aria-expanded={menuOpen}
          aria-controls="solutions-menu"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {/* Top bar: longer */}
          <span className={`absolute block w-6 h-[2px] bg-black rounded transition-transform duration-200 ${menuOpen ? 'rotate-45' : 'top-2'}`} />

          {/* Bottom bar: half-length and slightly right-offset when closed */}
          <span className={`absolute block w-6 h-[2px] bg-black rounded transition-transform duration-200 ${menuOpen ? '-rotate-45' : 'top-5'}`} />
        </button>
      </div>

      {menuOpen && (
        <div id="solutions-menu" className="mt-3 w-64 bg-white rounded-lg shadow-lg p-4 text-sm">
          <ul className="flex flex-col gap-3">
            <li><a href="/solucoes/sites" className="hover:underline">Sites e e-commerce</a></li>
            <li><a href="/solucoes/saas" className="hover:underline">SaaS e Dashboard</a></li>
            <li><a href="/solucoes/api" className="hover:underline">API e Sistemas</a></li>
            <li><a href="/agendar" className="hover:underline font-medium">Agendar uma conversa</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;
