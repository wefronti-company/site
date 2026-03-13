'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import ButtonCta from './ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '../lib/whatsapp';
import { theme } from '../styles/theme';

const EXIT_INTENT_THRESHOLD = 15;
const STORAGE_KEY = 'wefronti_exit_intent_shown';

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 99999,
  padding: theme.spacing[4],
};

const modalStyle: React.CSSProperties = {
  position: 'relative',
  maxWidth: 520,
  width: '100%',
  padding: theme.spacing[8],
  borderRadius: 20,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backgroundColor: 'rgba(24, 24, 27, 0.95)',
  backdropFilter: 'saturate(150%) blur(20px)',
  WebkitBackdropFilter: 'saturate(150%) blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: theme.spacing[4],
  right: theme.spacing[4],
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.1)',
  color: theme.colors.text.primary,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const copyStyle: React.CSSProperties = {
  fontSize: theme.fontSizes.lg,
  lineHeight: 1.5,
  color: theme.colors.text.primary,
  margin: 0,
  marginBottom: theme.spacing[6],
  paddingTop: 40,
  paddingRight: 40,
  textAlign: 'center',
};

/**
 * Modal de exit intent: aparece quando o mouse sai pelo topo (área das abas).
 * Copy: "Não vai ainda, vamos conversar sobre o seu projeto..."
 */
const ExitIntentModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [canShow, setCanShow] = useState(false);
  const lastYRef = React.useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: hover)');
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    setCanShow(mq.matches && !alreadyShown);
  }, []);

  useEffect(() => {
    if (!canShow || visible) return;

    const handleMouseMove = (e: MouseEvent) => {
      lastYRef.current = e.clientY;
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      const y = e.clientY;
      const lastY = lastYRef.current;
      const leftViewport = e.relatedTarget === null;
      const inTopZone = y <= 80 || lastY <= 80;
      if (leftViewport && inTopZone) {
        setVisible(true);
        sessionStorage.setItem(STORAGE_KEY, '1');
      } else if (y <= EXIT_INTENT_THRESHOLD) {
        setVisible(true);
        sessionStorage.setItem(STORAGE_KEY, '1');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [canShow, visible]);

  const handleClose = () => setVisible(false);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!visible) return null;

  const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, 'Oi, quero conversar sobre meu projeto.');

  return (
    <div style={overlayStyle} onClick={handleOverlayClick} role="dialog" aria-modal aria-labelledby="exit-intent-title">
      <div style={modalStyle}>
        <button
          type="button"
          onClick={handleClose}
          style={closeBtnStyle}
          aria-label="Fechar"
        >
          <X size={18} strokeWidth={2} />
        </button>
        <p id="exit-intent-title" style={copyStyle}>
          Não vai ainda, vamos conversar sobre o seu projeto, sem compromisso. Só uma conversa.
        </p>
        <ButtonCta
          href={whatsappUrl}
          external
          label="Iniciar conversa"
          fullWidthOnMobile
        />
      </div>
    </div>
  );
};

export default ExitIntentModal;
