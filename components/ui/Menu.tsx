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
      <div className="relative flex items-center justify-between gap-4 px-6 py-3 shadow-lg w-[720px] max-w-[92vw]"
      style={{ background: colors.green.primary, borderRadius: '6px' }}>

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
