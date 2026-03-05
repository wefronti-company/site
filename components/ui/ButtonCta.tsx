import React from 'react';
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { radii } from '@/styles/theme';
import { colors } from '@/styles/colors';
import { useScrollToSection } from '../../hooks/useScrollToSection';

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
}) => {
  const scrollToSection = useScrollToSection();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (type === 'button' && !href) {
      scrollToSection('precos');
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
                <Rocket size={16} color={colors.blue.primary} strokeWidth={2.5} />
              </span>
            </span>
          )}
        </>
      )}
    </>
  );

  const innerStyle = {
    display: 'inline-flex' as const,
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
      style={{ opacity: disabled ? 0.5 : 1, transition: 'opacity 0.2s, transform 0.2s' }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {href ? (
        <Link
          href={href}
          onClick={onClick}
          aria-label={label || (typeof children === 'string' ? children : 'CTA')}
          style={innerStyle}
        >
          {content}
        </Link>
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
