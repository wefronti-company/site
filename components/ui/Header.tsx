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
const DECRYPT_INTERVAL_MS = 78;
const DECRYPT_CHARS = 'abcdefghijklmnopqrstuvwxyz';

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
  const [decryptedLabels, setDecryptedLabels] = useState<Record<string, string>>(
    () => NAV_LINKS.reduce<Record<string, string>>((acc, link) => {
      acc[link.id] = link.label;
      return acc;
    }, {})
  );
  const decryptIntervalsRef = useRef<Record<string, ReturnType<typeof setInterval> | null>>({});

  useEffect(() => {
    if (isMd) setMobileMenuOpen(false);
  }, [isMd]);

  const clearDecryptInterval = (id: string) => {
    const current = decryptIntervalsRef.current[id];
    if (current) {
      clearInterval(current);
      decryptIntervalsRef.current[id] = null;
    }
  };

  useEffect(() => {
    return () => {
      Object.values(decryptIntervalsRef.current).forEach((intervalId) => {
        if (intervalId) clearInterval(intervalId);
      });
    };
  }, []);

  const buildDecryptedText = (label: string, revealCount: number) => {
    const chars = label.split('');
    return chars
      .map((char, idx) => {
        if (char === ' ') return ' ';
        if (idx < revealCount) return label[idx];
        return DECRYPT_CHARS[Math.floor(Math.random() * DECRYPT_CHARS.length)];
      })
      .join('');
  };

  const handleLinkMouseEnter = (id: string, label: string) => {
    clearDecryptInterval(id);
    let reveal = 0;

    setDecryptedLabels((prev) => ({ ...prev, [id]: buildDecryptedText(label, 0) }));
    decryptIntervalsRef.current[id] = setInterval(() => {
      reveal += 1;
      if (reveal >= label.length) {
        clearDecryptInterval(id);
        setDecryptedLabels((prev) => ({ ...prev, [id]: label }));
        return;
      }
      setDecryptedLabels((prev) => ({ ...prev, [id]: buildDecryptedText(label, reveal) }));
    }, DECRYPT_INTERVAL_MS);
  };

  const handleLinkMouseLeave = (id: string, label: string) => {
    clearDecryptInterval(id);
    setDecryptedLabels((prev) => ({ ...prev, [id]: label }));
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[2],
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

  const linkDotStyle: React.CSSProperties = {
    display: 'inline-block',
    width: 10,
    height: 10,
    minWidth: 10,
    minHeight: 10,
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    border: `1px solid ${colors.text.primary}`,
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s ease',
    flexShrink: 0,
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
                return (
                  <li key={id}>
                    <Link
                      href={href}
                      className="header-nav-link"
                      style={linkStyle}
                      onClick={(e) => handleNavClick(e, href)}
                      onMouseEnter={() => {
                        setHoveredLinkId(id);
                        handleLinkMouseEnter(id, label);
                      }}
                      onMouseLeave={() => {
                        setHoveredLinkId((prev) => (prev === id ? null : prev));
                        handleLinkMouseLeave(id, label);
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          ...linkDotStyle,
                          backgroundColor: hoveredLinkId === id ? colors.text.primary : 'transparent',
                        }}
                      />
                      <span>{decryptedLabels[id] ?? label}</span>
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
