'use client';

import React, { useEffect, useState, useRef } from 'react';
import { SiWhatsapp } from 'react-icons/si';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO } from '../lib/whatsapp';

const SCROLL_THRESHOLD = 300;

const buttonStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#ffffff',
  textDecoration: 'none',
};

const sentinelStyle: React.CSSProperties = {
  position: 'absolute',
  top: SCROLL_THRESHOLD + 1,
  left: 0,
  width: 1,
  height: 1,
  pointerEvents: 'none',
  visibility: 'hidden',
};

/**
 * Botão flutuante do WhatsApp: mesmo efeito do CTA (gradiente + brilho),
 * ícone oficial, visível apenas após scroll de 300px.
 */
const FloatingWhatsApp: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '0px', threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO);

  return (
    <>
      <div ref={sentinelRef} style={sentinelStyle} aria-hidden />
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9998,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        <span
          data-cta-gradient-wrap
          style={{
            display: 'inline-flex',
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          style={buttonStyle}
        >
          <SiWhatsapp size={28} color="#ffffff" />
        </a>
        </span>
      </div>
    </>
  );
};

export default FloatingWhatsApp;
