import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { theme } from '../styles/theme';

const { colors, spacing, fontSizes } = theme;

const DURATION_MS = 3000; // 5 segundos
const HOLD_AT_100_MS = 1000; // 2s em 100% antes do slide
const SLIDE_DURATION_MS = 500;

const LOADING_TEXT = 'Você está a um site de distância do seu próximo cliente.';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'counting' | 'holding' | 'sliding' | 'done'>('counting');
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  // Contador 0 → 100% em 5 segundos
  useEffect(() => {
    if (phase !== 'counting') return;

    const tick = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const next = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(next);

      if (next >= 100) {
        setPhase('holding');
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  // Em 100%, aguardar 2s e então iniciar o slide
  useEffect(() => {
    if (phase !== 'holding') return;
    const t = setTimeout(() => setPhase('sliding'), HOLD_AT_100_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Ao entrar em 'sliding', após a animação chamar onComplete
  useEffect(() => {
    if (phase !== 'sliding') return;
    const t = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, SLIDE_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  const wrapStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.background.gradient,
    transition: phase === 'sliding' ? `transform ${SLIDE_DURATION_MS}ms ease-out` : 'none',
    transform: phase === 'sliding' ? 'translateY(-100%)' : 'translateY(0)',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing[12],
    padding: spacing[8],
  };

  const barWrapStyle: React.CSSProperties = {
    width: 'min(280px, 80vw)',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  };

  const barFillStyle: React.CSSProperties = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: colors.blue.primary,
    borderRadius: 2,
    transition: 'width 0.05s linear',
  };

  const percentStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    color: colors.text.primary,
    opacity: 0.8,
  };

  const taglineStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    color: colors.text.primary,
    opacity: 0.85,
    margin: 0,
    textAlign: 'center',
  };

  return (
    <div style={wrapStyle} aria-hidden="true">
      <div style={contentStyle}>
        <Image
          src="/images/brand/isologo-wefronti.webp"
          alt="Wefronti"
          width={160}
          height={43}
          priority
          style={{ objectFit: 'contain', maxWidth: '100%' }}
        />
        <p style={taglineStyle}>{LOADING_TEXT}</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[2] }}>
          <div style={barWrapStyle}>
            <div style={barFillStyle} />
          </div>
          <span style={percentStyle}>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
