import React from 'react';
import { motion } from 'framer-motion';
import ButtonCta from './ui/ButtonCta';
import { theme } from '../styles/theme';

const { colors, spacing } = theme;

const CTA_TEXT = 'Pronto para crescer no digital?';
const CTA_BUTTON = 'Quero um site que vende';

const EASE_SOFT = [0.32, 0.72, 0, 1] as const;
const EASE_SLIDE_DOWN = [0.22, 1, 0.36, 1] as const;
const DURATION_ENTER = 0.5;
const DURATION_EXIT = 0.7;

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
    backgroundColor: 'rgba(245, 255, 240, 0.7)',
    backdropFilter: 'saturate(160%) blur(20px)',
    WebkitBackdropFilter: 'saturate(160%) blur(20px)',
    borderTop: `2px solid ${colors.neutral.border}`,
    boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.06)',
  };

  return (
    <motion.div
      style={barStyle}
      role="banner"
      aria-live="polite"
      data-solucoes-cta-bar
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { duration: DURATION_ENTER, ease: EASE_SOFT } }}
      exit={{ y: '100%', opacity: 0, transition: { duration: DURATION_EXIT, ease: EASE_SLIDE_DOWN } }}
    >
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
    </motion.div>
  );
};

export default SolucoesCtaBar;
