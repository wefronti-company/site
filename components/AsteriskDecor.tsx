import React from 'react';

/** Foco de luz azul: gradiente radial suave */
const blueGlowStyle = (position: 'left top' | 'right bottom'): React.CSSProperties => {
  const isTopLeft = position === 'left top';
  return {
    position: 'fixed' as const,
    top: isTopLeft ? 0 : undefined,
    bottom: isTopLeft ? undefined : 0,
    left: isTopLeft ? 0 : undefined,
    right: isTopLeft ? undefined : 0,
    zIndex: 0,
    width: 'clamp(320px, 45vw, 560px)',
    height: 'clamp(320px, 45vw, 560px)',
    background: `radial-gradient(circle at ${position}, rgba(59, 130, 246, 0.28) 0%, rgba(37, 99, 235, 0.12) 35%, transparent 65%)`,
    pointerEvents: 'none',
  };
};

/**
 * Focos de luz azul nas laterais (superior esquerdo e inferior direito).
 * Oculto em rotas admin.
 */
const AsteriskDecor: React.FC = () => (
  <>
    <div aria-hidden style={blueGlowStyle('left top')} />
    <div aria-hidden style={blueGlowStyle('right bottom')} />
  </>
);

export default AsteriskDecor;
