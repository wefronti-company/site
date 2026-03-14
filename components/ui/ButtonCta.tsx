import React from 'react';
import Link from 'next/link';
import { useScrollToSection } from '../../contexts/ScrollToContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { theme } from '../../styles/theme';

/* Estilos em GlobalStyles (span[data-cta-gradient-wrap]) */

interface ButtonCtaProps {
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  /** When true, renders an icon-only button (no default padding, no arrow) */
  iconOnly?: boolean;
  /** When provided, renders as Link to this href instead of button */
  href?: string;
  /** Abre o link em nova aba (target="_blank") */
  external?: boolean;
  /** Em telas menores: botão preenche toda a largura (default: true) */
  fullWidthOnMobile?: boolean;
  /** Fundo claro (ex: #EBEBEB) — borda mais escura para contraste */
  onLightBackground?: boolean;
}

const ButtonCta: React.FC<ButtonCtaProps> = ({ 
  label, 
  onClick,
  children,
  type = 'button',
  disabled = false,
  className,
  iconOnly = false,
  href,
  external = false,
  fullWidthOnMobile = true,
  onLightBackground = false,
}) => {
  const scrollToSection = useScrollToSection();
  const isMd = useMediaQuery(theme.breakpoints.md);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (type === 'button' && !href) {
      scrollToSection('cta');
    }
  };

  const content = (
    <>
      {iconOnly ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          {children}
        </span>
      ) : (
        <span style={{ color: '#fff' }}>
          {children || label || 'Contato'}
        </span>
      )}
    </>
  );

  const innerStyle = {
    display: fullWidthOnMobile ? 'flex' : 'inline-flex',
    width: fullWidthOnMobile ? '100%' : undefined,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    borderRadius: 9999,
    padding: iconOnly ? 0 : isMd ? '16px 24px' : '20px 24px',
    fontSize: isMd ? 16 : 18,
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' as const : 'pointer' as const,
    opacity: disabled ? 0.5 : 1,
    transition: 'opacity 0.2s, transform 0.2s',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    textDecoration: 'none' as const,
  };

  const wrap = (
    <span
      className={`${className ?? ''}`.trim() || undefined}
      data-cta-gradient-wrap
      data-cta-on-light={onLightBackground ? '' : undefined}
      style={{
        opacity: disabled ? 0.5 : 1,
        ...(fullWidthOnMobile && { display: 'block', width: '100%' }),
      }}
    >
      {href ? (
        (external || href.startsWith('http')) ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            aria-label={label || (typeof children === 'string' ? children : 'CTA')}
            style={innerStyle}
          >
            {content}
          </a>
        ) : (
          <Link
            href={href}
            onClick={onClick}
            aria-label={label || (typeof children === 'string' ? children : 'CTA')}
            style={innerStyle}
          >
            {content}
          </Link>
        )
      ) : (
        <button
          type={type}
          onClick={handleClick}
          disabled={disabled}
          aria-label={label || (typeof children === 'string' ? children : 'CTA')}
          style={innerStyle}
        >
          {content}
        </button>
      )}
    </span>
  );

  return wrap;
};

export default ButtonCta;
