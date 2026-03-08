'use client';

import React from 'react';

const SPARKLE_COLOR = 'rgba(212, 105, 62, 0.6)';
const SPARKLE_COLOR_SOFT = 'rgba(212, 105, 62, 0.35)';

/** Posições e tamanhos dos brilhos (top/left em %, size em px) */
const SPARKLES_BEHIND: { top: number; left: number; size: number; delay: number; duration: number }[] = [
  { top: 8, left: 12, size: 12, delay: 0, duration: 12 },
  { top: 25, left: 85, size: 10, delay: 2, duration: 14 },
  { top: 45, left: 8, size: 14, delay: 1, duration: 10 },
  { top: 60, left: 75, size: 10, delay: 3, duration: 16 },
  { top: 80, left: 20, size: 11, delay: 0.5, duration: 13 },
  { top: 15, left: 55, size: 10, delay: 4, duration: 11 },
  { top: 70, left: 45, size: 12, delay: 1.5, duration: 15 },
  { top: 35, left: 92, size: 9, delay: 2.5, duration: 14 },
  { top: 90, left: 65, size: 11, delay: 0.8, duration: 12 },
  { top: 5, left: 40, size: 12, delay: 3.5, duration: 13 },
];

const SPARKLES_FRONT: { top: number; left: number; size: number; delay: number; duration: number }[] = [
  { top: 12, left: 70, size: 11, delay: 1, duration: 11 },
  { top: 40, left: 15, size: 13, delay: 2.5, duration: 13 },
  { top: 55, left: 88, size: 10, delay: 0, duration: 14 },
  { top: 75, left: 35, size: 14, delay: 3, duration: 10 },
  { top: 22, left: 45, size: 11, delay: 1.5, duration: 12 },
  { top: 65, left: 60, size: 12, delay: 2, duration: 15 },
  { top: 88, left: 80, size: 10, delay: 0.5, duration: 11 },
  { top: 35, left: 65, size: 12, delay: 3.5, duration: 13 },
  { top: 50, left: 5, size: 11, delay: 1.2, duration: 14 },
  { top: 95, left: 50, size: 12, delay: 2.8, duration: 12 },
];

const sparkleBaseStyle: React.CSSProperties = {
  position: 'absolute',
  borderRadius: '50%',
  pointerEvents: 'none',
  willChange: 'transform, opacity',
};

interface SparkleDotProps {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  layer: 'back' | 'front';
}

const SparkleDot: React.FC<SparkleDotProps> = ({ top, left, size, delay, duration, layer }) => (
  <div
    aria-hidden
    data-sparkle-dot
    style={{
      ...sparkleBaseStyle,
      top: `${top}%`,
      left: `${left}%`,
      width: size,
      height: size,
      background: `radial-gradient(circle, ${SPARKLE_COLOR} 0%, ${SPARKLE_COLOR_SOFT} 40%, transparent 70%)`,
      boxShadow: `0 0 ${size * 3}px ${SPARKLE_COLOR_SOFT}`,
      animation: `sparkle-float-${layer} ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);

/**
 * Efeito de brilhos/flashes que passam pela frente e por trás do conteúdo,
 * com animação em perspectiva 3D. Acompanha o scroll da página.
 */
const SparklesEffect: React.FC = () => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      perspective: 1200,
    }}
  >
    {/* Camada ATRÁS do conteúdo */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        transformStyle: 'preserve-3d',
      }}
    >
      {SPARKLES_BEHIND.map((s, i) => (
        <SparkleDot key={`b-${i}`} {...s} layer="back" />
      ))}
    </div>
    {/* Camada NA FRENTE do conteúdo */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 25,
        transformStyle: 'preserve-3d',
      }}
    >
      {SPARKLES_FRONT.map((s, i) => (
        <SparkleDot key={`f-${i}`} {...s} layer="front" />
      ))}
    </div>
  </div>
);

export default SparklesEffect;
