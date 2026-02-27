import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import ButtonCta from './ButtonCta';
import { Plus, ArrowRight } from 'lucide-react';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import { useSplash } from '../../contexts/SplashContext';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, radii } = theme;
const REVERSE_DELAY_MS = 220;
const REVERSED_HOLD_MS = 520;

/** Links do menu — cada um leva à seção correspondente na página */
const NAV_LINKS = [
  { id: 'hero', label: 'Início', href: '/#hero' },
  { id: 'depoimentos', label: 'Clientes', href: '/#depoimentos' },
  { id: 'processo', label: 'Processos', href: '/#processo' },
  { id: 'portfolio', label: 'Portfolio', href: '/#portfolio' },
  { id: 'sobre', label: 'Sobre', href: '/#sobre' },
  { id: 'faq', label: 'FAQ', href: '/#faq' },
] as const;

const Header: React.FC = () => {
  const splash = useSplash();
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);
  const [reversedPhase, setReversedPhase] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (isMd) setMobileMenuOpen(false);
  }, [isMd]);

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

  const scrollToSection = useScrollToSection();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (typeof window === 'undefined') return;
    setMobileMenuOpen(false);
    const id = href.replace(/^.*#/, '') || 'hero';
    e.preventDefault();
    scrollToSection(id);
  };

  const headerPaddingX = isMd ? spacing[12] : spacing[6];
  const headerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    zIndex: 100,
    visibility: splash?.splashActive ? 'hidden' : 'visible',
    pointerEvents: splash?.splashActive ? 'none' : 'auto',
    isolation: 'isolate',
    paddingTop: 0,
    paddingBottom: 0,
  };

  const headerWrapperStyle: React.CSSProperties = {
    width: '100%',
    position: 'relative',
    zIndex: 100,
  };

  const innerBarStyle: React.CSSProperties = {
    width: '100%',
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
    paddingTop: isMd ? spacing[4] : spacing[3],
    paddingBottom: isMd ? spacing[4] : spacing[3],
    background: 'transparent',
    borderBottom: `1px solid ${colors.neutral.border}`,
  };

  const innerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[8],
  };

  const leftCellStyle: React.CSSProperties = { flex: '1 1 0', minWidth: 0, display: 'flex', justifyContent: 'flex-start' };
  const rightCellStyle: React.CSSProperties = {
    flex: '1 1 0',
    minWidth: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing[8],
  };

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
    fontWeight: 500,
    letterSpacing: '0.02em',
    color: colors.text.primary,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    textShadow: 'none',
    boxShadow: 'none',
    outline: 'none',
  };

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing[3]}px ${spacing[6]}px`,
    fontSize: fontSizes.sm,
    fontWeight: 500,
    borderRadius: radii.full,
    backgroundColor: colors.blue.primary,
    color: colors.text.primary,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    flexShrink: 0,
    outline: 'none',
  };

  return (
    <header style={headerStyle} role="banner">
      <div style={headerWrapperStyle}>
        <div style={innerBarStyle}>
        <nav aria-label="Navegação principal" style={innerStyle}>
          <div style={leftCellStyle}>
            <Logo href="/" ariaLabel="Ir para a página inicial" />
          </div>

          <div style={rightCellStyle}>
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
            {isMd ? (
              <ButtonCta className="header-user-btn">Contato</ButtonCta>
            ) : (
              <button
                type="button"
                aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileMenuOpen}
                className="header-cta-btn"
                onClick={() => setMobileMenuOpen((o) => !o)}
                style={{
                  ...btnStyle,
                  width: 44,
                  height: 44,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus
                  size={22}
                  strokeWidth={2}
                  color={colors.text.primary}
                  style={{
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: mobileMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                  aria-hidden
                />
              </button>
            )}
          </div>
        </nav>
        </div>
      </div>

      {!isMd && (
        <>
        {mobileMenuOpen && (
          <div
            role="presentation"
            aria-hidden={!mobileMenuOpen}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 98,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              transition: 'background-color 0.3s ease-out',
            }}
          />
        )}
        <div
          role="dialog"
          aria-label="Menu de navegação"
          aria-hidden={!mobileMenuOpen}
          style={{
            position: 'fixed',
            top: 88,
            right: 0,
            bottom: 0,
            left: 'auto',
            width: 'min(320px, 85vw)',
            overflowY: 'auto',
            zIndex: 99,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'saturate(140%) blur(14px)',
            WebkitBackdropFilter: 'saturate(140%) blur(14px)',
            border: '1px solid rgba(212, 232, 208, 0.6)',
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            paddingTop: spacing[8],
            paddingBottom: 0,
            paddingLeft: spacing[8],
            paddingRight: spacing[8],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: spacing[6],
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-out',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
            pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          }}
        >
          {NAV_LINKS.map(({ id, label, href }) => (
            <Link
              key={id}
              href={href}
              className="header-nav-link"
              style={{
                ...linkStyle,
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                lineHeight: 1.3,
                padding: `${spacing[2]}px 0`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
              onClick={(e) => handleNavClick(e, href)}
            >
              <span>{label}</span>
              <ArrowRight size={18} color={colors.text.primary} style={{ flexShrink: 0 }} aria-hidden />
            </Link>
          ))}
          <div style={{ paddingTop: spacing[2], width: '100%' }} onClick={() => setMobileMenuOpen(false)}>
            <ButtonCta
              className="header-user-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('precos');
              }}
            >
              Quero um site que vende
            </ButtonCta>
          </div>
        </div>
        </>
      )}
    </header>
  );
};

export default Header;
