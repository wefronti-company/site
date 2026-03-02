import React from 'react';

/**
 * Asteriscos decorativos no fundo (esquerda e direita).
 * Esquerda: gira horário. Direita: gira antihorário.
 * Oculto em rotas admin.
 */
const AsteriskDecor: React.FC = () => (
  <>
    <div
      className="asterisk-decor-left"
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        width: 'clamp(84px, 11vw, 160px)',
        height: 'clamp(84px, 11vw, 160px)',
        backgroundImage: "url('/images/brand/asset-asterisk.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left top',
        backgroundSize: 'contain',
        opacity: 0.55,
        pointerEvents: 'none',
      }}
    />
    <div
      className="asterisk-decor-right"
      aria-hidden
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        zIndex: 0,
        width: 'clamp(140px, 20vw, 300px)',
        height: 'clamp(140px, 20vw, 300px)',
        backgroundImage: "url('/images/brand/asset-asterisk.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right bottom',
        backgroundSize: 'contain',
        opacity: 0.55,
        pointerEvents: 'none',
      }}
    />
  </>
);

export default AsteriskDecor;
