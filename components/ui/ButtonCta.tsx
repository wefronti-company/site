import React from 'react';
import Link from 'next/link';
import { Rocket, ArrowUpRight } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { radii } from '@/styles/theme';
import { colors } from '@/styles/colors';
import { useScrollToSection } from '../../contexts/ScrollToContext';

/* Gradiente animado: estilos em GlobalStyles (.cta-btn-gradient-wrap + @keyframes cta-btn-flow) */

interface ButtonCtaProps {
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  /** When true, renders an icon-only button (no default padding, no arrow) */
  iconOnly?: boolean;
  /** When true, hides the icon (e.g. for header button) */
  hideIcon?: boolean;
  /** When provided, renders as Link to this href instead of button */
  href?: string;
  /** 'rocket' (default), 'whatsapp' ou 'arrow' — ícone ao lado do texto */
  iconVariant?: 'rocket' | 'whatsapp' | 'arrow';
  /** Abre o link em nova aba (target="_blank") */
  external?: boolean;
  /** Em telas menores: botão preenche toda a largura */
  fullWidthOnMobile?: boolean;
}

const ButtonCta: React.FC<ButtonCtaProps> = ({ 
  label, 
  onClick,
  children,
  type = 'button',
  disabled = false,
  className,
  iconOnly = false,
  hideIcon = false,
  href,
  iconVariant = 'rocket',
  external = false,
  fullWidthOnMobile = false,
}) => {
  const scrollToSection = useScrollToSection();

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
        <>
          <span style={{ color: '#fff' }}>
            {children || label || 'Contato'}
          </span>
          {!hideIcon && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.95)',
              }}
            >
              <span style={{ display: 'inline-flex' }} aria-hidden>
                {iconVariant === 'whatsapp' ? (
                  <SiWhatsapp size={18} color={colors.blue.primary} />
                ) : iconVariant === 'arrow' ? (
                  <ArrowUpRight size={18} color={colors.blue.primary} strokeWidth={2.5} />
                ) : (
                  <Rocket size={16} color={colors.blue.primary} strokeWidth={2.5} />
                )}
              </span>
            </span>
          )}
        </>
      )}
    </>
  );

  const innerStyle = {
    display: fullWidthOnMobile ? 'flex' : 'inline-flex',
    width: fullWidthOnMobile ? '100%' : undefined,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    borderRadius: radii.full,
    padding: iconOnly ? 0 : '12px 24px',
    fontSize: 16,
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
      style={{
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s, transform 0.2s',
        ...(fullWidthOnMobile && { display: 'block', width: '100%' }),
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
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
