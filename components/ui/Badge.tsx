import React from 'react';
import { colors } from '../../styles/colors';

/** Mesmo border-radius do ButtonCta para consistência (6px) */
const BORDER_RADIUS = '6px';

export interface BadgeProps {
  /** Texto do segmento à esquerda (ex: "Geramos", "Sites profissionais") */
  segmentLabel: string;
  /** Emoji ou caractere opcional entre o segmento e o texto principal */
  emoji?: string;
  /** Texto principal do badge */
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  segmentLabel,
  emoji,
  children,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center overflow-hidden ${className}`}
      style={{
        border: `1px solid ${colors.neutral.borderDark}`,
        background: colors.background.dark,
        borderRadius: BORDER_RADIUS,
        padding: 0,
        color: colors.text.light,
        fontSize: '0.875rem',
        fontWeight: 500,
      }}
    >
      <span
        style={{
          padding: '6px 12px',
          background: colors.blue.primary,
          borderRight: `1px solid ${colors.neutral.borderDark}`,
          borderRadius: `${BORDER_RADIUS} 0 0 ${BORDER_RADIUS}`,
          color: colors.text.light,
        }}
      >
        {segmentLabel}
      </span>
      {(emoji != null && emoji !== '') && (
        <span className="flex items-center justify-center px-1.5" aria-hidden>
          {emoji}
        </span>
      )}
      <span style={{ padding: '6px 12px' }}>{children}</span>
    </span>
  );
};

export default Badge;
