import React from 'react';
import ButtonCta from './ui/ButtonCta';
import { theme } from '../styles/theme';

const { colors, spacing } = theme;

const CTA_TEXT = 'Pronto para crescer no digital?';
const CTA_BUTTON = 'Quero um site que vende';

const SolucoesCtaBar: React.FC = () => {
  const barStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing[6],
    minHeight: 96,
    padding: `${spacing[8]}px ${spacing[6]}`,
    backgroundColor: 'rgba(245, 255, 240, 0.4)',
    backdropFilter: 'saturate(160%) blur(10px)',
    WebkitBackdropFilter: 'saturate(160%) blur(20px)',
    borderTop: `1px solid ${colors.neutral.border}`,
    boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.06)',
  };

  return (
    <div style={barStyle} role="banner" aria-live="polite" data-solucoes-cta-bar>
      <span
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: 500,
          color: colors.text.primary,
        }}
      >
        {CTA_TEXT}
      </span>
      <ButtonCta>{CTA_BUTTON}</ButtonCta>
    </div>
  );
};

export default SolucoesCtaBar;
