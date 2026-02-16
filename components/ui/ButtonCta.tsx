import React from 'react';
import { colors } from '../../styles/colors';
import { useRouter } from 'next/router';
import { ArrowRight } from 'lucide-react';
import { radii } from '@/styles/theme';

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
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (type === 'button') {
      router.push('/form');
    }
  };
  
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label || (typeof children === 'string' ? children : 'CTA')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        border: `1px solid ${colors.blue.primary}`,
        background: colors.blue.primary,
        borderRadius: radii.full,
        padding: iconOnly ? 0 : '12px 24px',
        color: colors.text.light,
        fontSize: 16,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.opacity = '0.9'; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = disabled ? '0.5' : '1'; }}
    >
      {iconOnly ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text.light }}>
          {children}
        </span>
      ) : (
        <>
          <span style={{ color: colors.text.light }}>
            {children || label || 'Entre em contato'}
          </span>
          <ArrowRight size={18} color={colors.text.light} />
        </>
      )}
    </button>
  );
};

export default ButtonCta;
