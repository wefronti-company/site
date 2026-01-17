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
      className={`inline-flex items-center justify-center gap-2 transition-all duration-300 hover:gap-3 disabled:opacity-50 disabled:cursor-not-allowed group ${className || ''}`}
      style={{ 
        border: 'none', 
        background: colors.neutral.grayHover,
        backdropFilter: 'blur(10px)',
        borderRadius: '999px', 
        padding: '12px 24px'
      }}
    >
      <span
        className="text-base font-medium leading-none"
        style={{ color: colors.primary.white }}
      >
        {children || label || 'Entre em contato'}
      </span>
      <ArrowRight size={18} color={colors.primary.white} />
    </button>
  );
};

export default ButtonCta;
