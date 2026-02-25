import React from 'react';
import Link from 'next/link';
import { colors } from '../../styles/colors';
import { ArrowRight } from 'lucide-react';
import { radii } from '@/styles/theme';
import { toDashUrl } from '../../lib/dash-url';

interface ButtonUserProps {
  label?: string;
  href?: string;
  className?: string;
  fullWidth?: boolean;
}

const ButtonUser: React.FC<ButtonUserProps> = ({
  label = 'Entrar',
  href = toDashUrl('/'),
  className,
  fullWidth = false,
}) => {
  return (
    <Link
      href={href}
      className={className}
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : undefined,
        border: `1px solid ${colors.neutral.borderDark}`,
        background: 'transparent',
        borderRadius: radii.full,
        padding: '12px 24px',
        color: colors.text.light,
        fontSize: 16,
        fontWeight: 500,
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'opacity 0.2s, background 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.9';
        e.currentTarget.style.background = 'rgba(123, 123, 123, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ color: colors.text.light }}>{label}</span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: `1px solid ${colors.neutral.borderDark}`,
        }}
      >
        <ArrowRight size={16} color={colors.text.light} strokeWidth={2.5} />
      </span>
    </Link>
  );
};

export default ButtonUser;
