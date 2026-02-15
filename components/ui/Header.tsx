import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;
const SCROLL_TOP_THRESHOLD = 1;
const REVERSE_DELAY_MS = 220;
const REVERSED_HOLD_MS = 520;

/** Links do menu (por enquanto fake – seções serão criadas depois) */
const NAV_LINKS = [
  { id: 'hero', label: 'Início', href: '/#hero' },
  { id: 'clients', label: 'Clientes', href: '/#clients' },
  { id: 'contato', label: 'Contato', href: '/#contato' },
  { id: 'sobre', label: 'Sobre', href: '/#sobre' },
  { id: 'faq', label: 'FAQ', href: '/#faq' },
] as const;

const Header: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);
  const [reversedPhase, setReversedPhase] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const handleLinkMouseEnter = (id: string) => {
    clearTimers();
    setHoveredLinkId(id);
    setReversedPhase(false);
    const t1 = setTimeout(() => {
      setReversedPhase(true);
      const t2 = setTimeout(() => {
        setReversedPhase(false);
      }, REVERSED_HOLD_MS);
      timersRef.current.push(t2);
    }, REVERSE_DELAY_MS);
    timersRef.current.push(t1);
  };

  const handleLinkMouseLeave = () => {
    clearTimers();
    setHoveredLinkId(null);
    setReversedPhase(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setScrolled(window.scrollY > SCROLL_TOP_THRESHOLD);
    const onScroll = () => setScrolled(window.scrollY > SCROLL_TOP_THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname !== '/') return;
    e.preventDefault();
    const id = href.replace(/^.*#/, '') || 'hero';
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = href;
    }
  };

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: scrolled ? 'rgba(4, 4, 4, 0.75)' : 'transparent',
    backdropFilter: scrolled ? 'saturate(180%) blur(12px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(12px)' : 'none',
    borderBottom: scrolled ? `1px solid ${colors.neutral.borderDark}` : '1px solid transparent',
    transition: 'background-color 0.25s ease, backdrop-filter 0.25s ease, border-color 0.25s ease',
    ...(scrolled ? { transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' } : {}),
  };

  const innerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: containerMaxWidth.header,
    margin: '0 auto',
    paddingLeft: isMd ? spacing[12] : spacing[6],
    paddingRight: isMd ? spacing[12] : spacing[6],
    paddingTop: spacing[5],
    paddingBottom: spacing[5],
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[8],
  };

  const leftCellStyle: React.CSSProperties = { flex: '1 1 0', minWidth: 0, display: 'flex', justifyContent: 'flex-start' };
  const centerCellStyle: React.CSSProperties = { flex: '0 0 auto', display: 'flex', justifyContent: 'center' };
  const rightCellStyle: React.CSSProperties = { flex: '1 1 0', minWidth: 0, display: 'flex', justifyContent: 'flex-end' };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isMd ? spacing[10] : spacing[6],
  };

  const linkListStyle: React.CSSProperties = {
    display: isMd ? 'flex' : 'none',
    alignItems: 'center',
    gap: spacing[8],
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  const linkStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    fontWeight: 400,
    letterSpacing: '0.02em',
    color: colors.text.light,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    textShadow: 'none',
    boxShadow: 'none',
  };

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing[3]}px ${spacing[6]}px`,
    fontSize: fontSizes.sm,
    fontWeight: 500,
    borderRadius: radii.md,
    backgroundColor: colors.blue.primary,
    color: colors.text.light,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    flexShrink: 0,
  };

  return (
    <header style={headerStyle} role="banner">
      <nav aria-label="Navegação principal" style={innerStyle}>
        <div style={rowStyle}>
          <div style={leftCellStyle}>
            <Logo href="/" ariaLabel="Ir para a página inicial" isDark={false} />
          </div>

          <div style={centerCellStyle}>
            <ul style={linkListStyle}>
              {NAV_LINKS.map(({ id, label, href }) => {
                const isHovered = hoveredLinkId === id;
                const chars = isHovered && reversedPhase ? label.split('').reverse() : label.split('');
                return (
                  <li key={id}>
                    <Link
                      href={href}
                      className="header-nav-link"
                      style={linkStyle}
                      onClick={(e) => handleNavClick(e, href)}
                      onMouseEnter={() => handleLinkMouseEnter(id)}
                      onMouseLeave={handleLinkMouseLeave}
                    >
                      {chars.map((char, i) => (
                        <span
                          key={`${id}-${reversedPhase ? 'r' : 'n'}-${i}-${char}`}
                          className={isHovered ? 'header-nav-link-char mix-in' : 'header-nav-link-char'}
                          style={isHovered ? { animationDelay: `${i * 0.028}s` } : undefined}
                        >
                          {char}
                        </span>
                      ))}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div style={rightCellStyle}>
            <Link
              href="/#contato"
              style={btnStyle}
              onClick={(e) => handleNavClick(e, '/#contato')}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              Solicitar orçamento
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
