import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { radii } from '@/styles/theme';
import { useScrollToSection } from '../../hooks/useScrollToSection';

interface ButtonCtaProps {
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  /** When true, renders an icon-only button (no default padding, no arrow) */
  iconOnly?: boolean;
}

const ButtonCta: React.FC<ButtonCtaProps> = ({ 
  label, 
  onClick,
  children,
  type = 'button',
  disabled = false,
  className,
  iconOnly = false
}) => {
  const scrollToSection = useScrollToSection();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (type === 'button') {
      scrollToSection('precos');
    }
  };
  
  return (
    <button
      type={type}
      className={`cta-gradient-animated ${className ?? ''}`.trim()}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label || (typeof children === 'string' ? children : 'CTA')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: radii.full,
        padding: iconOnly ? 0 : '12px 24px',
        color: '#fff',
        fontSize: 16,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s, transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 2px 12px rgba(5, 150, 105, 0.35)',
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (!disabled) {
          e.currentTarget.style.opacity = '0.95';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(5, 150, 105, 0.45)';
        }
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.opacity = disabled ? '0.5' : '1';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(5, 150, 105, 0.35)';
      }}
    >
      {iconOnly ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          {children}
        </span>
      ) : (
        <>
          <span style={{ color: '#fff' }}>
            {children || label || 'Contato'}
          </span>
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
            <span
              style={{
                display: 'inline-flex',
                transition: 'transform 0.25s ease',
                transform: isHovered ? 'rotate(-30deg)' : 'rotate(0deg)',
              }}
              aria-hidden
            >
              <ArrowRight size={16} color="#059669" strokeWidth={2.5} />
            </span>
          </span>
        </>
      )}
    </button>
  );
};

export default ButtonCta;
