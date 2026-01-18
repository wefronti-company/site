import React from 'react';
import { colors } from '../../styles/colors';
import { useRouter } from 'next/router';
import { ArrowRight } from 'lucide-react';

interface ButtonCtaProps {
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

const ButtonCta: React.FC<ButtonCtaProps> = ({ 
  label, 
  onClick,
  children,
  type = 'button',
  disabled = false,
  className
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
      className={`inline-flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group hover:bg-purple-tertiary ${className || ''}`}
      style={{ 
        border: `1px solid ${colors.neutral.borderLight}`, 
        background: 'transparent',
        borderRadius: '999px', 
        padding: '12px 24px'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = colors.purple.tertiary}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span
        className="text-base font-medium leading-none transition-colors duration-300"
        style={{ color: colors.primary.white }}
      >
        {children || label || 'Entre em contato'}
      </span>
      <ArrowRight 
        size={18} 
        color={colors.primary.white} 
        className="transition-transform duration-300 group-hover:-rotate-45" 
      />
    </button>
  );
};

export default ButtonCta;
