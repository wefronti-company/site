import React from 'react';
import { colors } from '../../styles/colors';

interface ButtonPainelProps {
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

const ButtonPainel: React.FC<ButtonPainelProps> = ({
  label,
  onClick,
  children,
  type = 'button',
  disabled = false,
  className,
}) => (
  <button
    type={type}
    className={className}
    onClick={onClick}
    disabled={disabled}
    aria-label={label || (typeof children === 'string' ? children : 'Ação')}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      border: `1px solid ${colors.blue.primary}`,
      background: colors.blue.primary,
      borderRadius: 6,
      padding: '12px 24px',
      color: colors.text.light,
      fontSize: 16,
      fontWeight: 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'opacity 0.2s',
    }}
    onMouseEnter={(e) => {
      if (!disabled) e.currentTarget.style.opacity = '0.9';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.opacity = disabled ? '0.5' : '1';
    }}
  >
    <span style={{ color: colors.text.light }}>
      {children || label}
    </span>
  </button>
);

export default ButtonPainel;
