// Right-click blocking removed for accessibility and developer UX.
if (typeof window !== 'undefined') {
  // Previously blocked contextmenu globally — removed for accessibility.
}
import React, { useEffect, useState, useRef } from 'react';
import Logo from './Logo';
import { colors } from '../../styles/colors';

type HeaderVariant = 'float' | 'header';

const NAV_LINKS = [
  { id: 'hero', label: 'Início' },
  { id: 'clients', label: 'Clientes' },
  { id: 'contato', label: 'Contato' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'faq', label: 'FAQ' },
] as const;

const HEADER_OFFSET = 100;
const SCROLL_TOP_THRESHOLD = 20; // abaixo disso = "no topo" (hero)
const SCROLL_DIRECTION_THRESHOLD = 5; // mínimo de movimento para considerar direção

const Header: React.FC<{ variant?: HeaderVariant }> = ({ variant = 'float' }) => {
  const [atTop, setAtTop] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const prev = lastScrollYRef.current;
      lastScrollYRef.current = y;

      setAtTop(y <= SCROLL_TOP_THRESHOLD);

      if (y <= SCROLL_TOP_THRESHOLD) {
        setScrollDirection(null);
      } else {
        const delta = y - prev;
        if (Math.abs(delta) >= SCROLL_DIRECTION_THRESHOLD) {
          setScrollDirection(delta > 0 ? 'down' : 'up');
        }
      }
    };

    const initialY = typeof window !== 'undefined' ? window.scrollY : 0;
    lastScrollYRef.current = initialY;
    setAtTop(initialY <= SCROLL_TOP_THRESHOLD);
    if (initialY > SCROLL_TOP_THRESHOLD) setScrollDirection(null);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (sectionId: string) => {
    if (typeof window === 'undefined') return;
    const id = sectionId.replace(/^#/, '');

    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const targetTop = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  // Variant "header": no topo = transparente; mostra só ao scrollar para cima, com fundo desfocado
  const showHeaderBar = atTop || scrollDirection === 'up';
  const hasBlurredBackground = !atTop && scrollDirection === 'up';

  if (variant === 'header') {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-100 transition-all duration-300 ease-out"
        style={{
          transform: showHeaderBar ? 'translateY(0)' : 'translateY(-100%)',
          background: hasBlurredBackground
            ? `rgba(0, 0, 0, 0.4)`
            : 'transparent',
          backdropFilter: hasBlurredBackground ? 'saturate(180%) blur(12px)' : 'none',
          WebkitBackdropFilter: hasBlurredBackground ? 'saturate(180%) blur(12px)' : 'none',
          borderBottom: hasBlurredBackground ? `1px solid ${colors.neutral.borderDark}` : '1px solid transparent',
        }}
      >
        <nav aria-label="Navegação principal" className="w-full">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-3xl md:max-w-6xl mx-auto py-5 md:py-6">
              <div className="flex items-center justify-between gap-4">
                {/* Esquerda: logo */}
                <div className="flex-shrink-0">
                  <Logo href="/" ariaLabel="Ir para a página inicial" isDark={false} className="h-8 md:h-9 w-auto" />
                </div>

                {/* Direita: links (desktop) + botão, alinhados */}
                <div className="flex items-center gap-5 lg:gap-6">
                  <ul className="hidden md:flex items-center gap-5 lg:gap-6">
                    {NAV_LINKS.map(({ id, label }) => (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => handleNav(id)}
                          className="text-sm md:text-base font-normal tracking-wide transition-colors hover:opacity-80 whitespace-nowrap"
                          style={{ color: colors.text.light }}
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => handleNav('contato')}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm md:px-5 md:py-2.5 md:text-base font-medium rounded transition-opacity hover:opacity-90 flex-shrink-0"
                    style={{
                      background: colors.blue.primary,
                      color: colors.text.light,
                    }}
                  >
                    Quero ter um site
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  // Variant "float" (legacy): manter estrutura mínima para não quebrar se for usado em outro lugar
  return (
    <header
      className="fixed top-0 left-0 right-0 z-100"
      style={{
        background: colors.background.dark,
        borderBottom: `1px solid ${colors.neutral.borderDark}`,
      }}
    >
      <nav className="w-full px-4 md:px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo href="/" ariaLabel="Ir para a página inicial" isDark={false} className="h-8 w-auto" />
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => handleNav(id)}
                  className="text-sm font-medium"
                  style={{ color: colors.text.light }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
