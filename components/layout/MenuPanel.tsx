import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from './MenuContext';
import { colors } from '../../styles/colors';
import Logo from '../ui/Logo';
import ButtonCta from '../ui/ButtonCta';
import { useRouter } from 'next/router';

const navItems = [
  { label: 'Como funciona', href: '/como-funciona', isExternal: true },
  { label: 'Sobre', href: '/sobre', isExternal: true },
  { label: 'Portfólio', href: '/portfolio', isExternal: true },
  { label: 'Clientes', href: '#clients', isExternal: false },
  { label: 'Contrate-nos', href: '#services', isExternal: false },
  { label: 'FAQ', href: '#faq', isExternal: false },
];

const MenuPanel: React.FC = () => {
  const { open, setOpen } = useMenu();
  const router = useRouter();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998]"
            style={{ backgroundColor: 'rgba(5,5,5,0.6)' }}
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[9999] w-full md:w-[42%] lg:w-[36%] max-w-[720px] h-full overflow-y-auto"
            style={{ backgroundColor: colors.blackColor, borderLeft: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="max-w-[720px] mx-auto px-6 py-8 flex flex-col h-full">
              <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Logo />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fechar menu"
                  className="flex items-center gap-2"
                >
                  <span className="text-sm font-medium" style={{ color: colors.whiteColor }}>Fechar</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.whiteColor} strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </header>

              <nav className="flex-1 flex flex-col items-start justify-start gap-6 pt-4">
                {navItems.map((item, idx) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      setOpen(false);
                      if (item.isExternal) router.push(item.href);
                      else {
                        const el = document.querySelector(item.href);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-2xl md:text-3xl font-light text-left"
                    style={{ color: colors.whiteColor }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="pt-6 pb-4">
                <ButtonCta label="Agendar uma reunião" />
              </div>

              <footer className="mt-auto pt-6 text-sm text-gray-400">
                <div className="mb-2">PROJECT BY</div>
                <div className="uppercase tracking-widest">Huy + Ivor</div>
              </footer>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuPanel;
