import React from 'react';
import { motion } from 'framer-motion';
import ButtonCta from './ui/ButtonCta';
import { theme } from '../styles/theme';
import { useMediaQuery } from '../hooks/useMediaQuery';

const { colors, spacing } = theme;

const CTA_TEXT = 'Vamos juntos desenvolver um novo produto?';
const CTA_BUTTON = 'Iniciar um projeto';

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;
const DURATION_ENTER = 0.85;
const DURATION_EXIT = 0.85;

const SolucoesCtaBar: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const padY = isMd ? spacing[8] : spacing[10];
  const padX = isMd ? spacing[6] : spacing[12];
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
    gap: spacing[2],
    minHeight: isMd ? 96 : 150,
    padding: `${padY}px ${padX}`,
    backgroundColor: 'rgba(245, 255, 240, 0.7)',
    backdropFilter: 'saturate(160%) blur(20px)',
    WebkitBackdropFilter: 'saturate(160%) blur(15px)',
    borderTop: `1px solid ${colors.neutral.border}`,
    boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.06)',
  };

  return (
    <motion.div
      style={barStyle}
      role="banner"
      aria-live="polite"
      data-solucoes-cta-bar
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { duration: DURATION_ENTER, ease: EASE_SMOOTH } }}
      exit={{ y: '100%', opacity: 0, transition: { duration: DURATION_EXIT, ease: EASE_SMOOTH } }}
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
