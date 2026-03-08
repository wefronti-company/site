'use client';

import React from 'react';

/**
 * Pontos de luz como estrelas: só o brilho, sem halo nem gradiente.
 * Efeito de céu estrelado — apenas os pontos brancos visíveis.
 */
const SPARKLES: { top: number; left: number; size: number; delay: number; duration: number }[] = [
  { top: 8, left: 5, size: 2, delay: 0, duration: 4 },
  { top: 15, left: 25, size: 2, delay: 0.3, duration: 5 },
  { top: 25, left: 85, size: 3, delay: 0.6, duration: 4.5 },
  { top: 35, left: 12, size: 2, delay: 0.2, duration: 5.5 },
  { top: 45, left: 55, size: 2, delay: 0.8, duration: 4 },
  { top: 55, left: 75, size: 2, delay: 0.1, duration: 5 },
  { top: 60, left: 20, size: 3, delay: 0.5, duration: 4.5 },
  { top: 70, left: 40, size: 2, delay: 0.9, duration: 5.5 },
  { top: 78, left: 90, size: 2, delay: 0.2, duration: 4 },
  { top: 85, left: 15, size: 2, delay: 0.7, duration: 5 },
  { top: 92, left: 65, size: 2, delay: 0.4, duration: 4.5 },
  { top: 5, left: 45, size: 2, delay: 0.1, duration: 5 },
  { top: 18, left: 70, size: 2, delay: 0.6, duration: 4 },
  { top: 42, left: 35, size: 2, delay: 0.3, duration: 5.5 },
  { top: 50, left: 92, size: 3, delay: 0.5, duration: 4.5 },
  { top: 65, left: 8, size: 2, delay: 0.8, duration: 5 },
  { top: 88, left: 48, size: 2, delay: 0.2, duration: 4 },
  { top: 12, left: 55, size: 2, delay: 0.9, duration: 5 },
  { top: 38, left: 78, size: 2, delay: 0.4, duration: 4.5 },
  { top: 72, left: 28, size: 2, delay: 0.7, duration: 5 },
  { top: 22, left: 42, size: 2, delay: 0.5, duration: 4 },
  { top: 48, left: 18, size: 2, delay: 0.1, duration: 5 },
  { top: 82, left: 62, size: 2, delay: 0.8, duration: 4.5 },
];

/**
 * Efeito fada (brilhos) que fica por cima das imagens de background das seções.
 * Coloque depois do gradient overlay, com z-index entre o bg e o conteúdo.
 */
const SectionSparkles: React.FC = () => (
  <div
    aria-hidden
    data-sparkle-layer
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 2,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}
  >
    {SPARKLES.map((s, i) => (
      <div
        key={i}
        data-sparkle-dot
        aria-hidden
        style={{
          position: 'absolute',
          top: `${s.top}%`,
          left: `${s.left}%`,
          width: s.size,
          height: s.size,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: 'none',
          animation: `sparkle-fairy ${s.duration}s ease-in-out infinite`,
          animationDelay: `${s.delay}s`,
          willChange: 'transform, opacity',
        }}
      />
    ))}
  </div>
);

export default SectionSparkles;
