import React, { useEffect, useRef, useState } from 'react';
import { Eye, LucideIcon, Zap, Target, UserCheck, Rocket, SmartphoneCharging } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const PHRASES: { text: string; icon: LucideIcon }[] = [
  { text: 'Estrutura pensada pra vender', icon: Target },
  { text: 'Primeira impressão define a decisão', icon: Eye },
  { text: 'Carregamento ultra rápido', icon: Zap },
  { text: 'Experiência que retém o visitante', icon: UserCheck },
  { text: 'Otimizado para mobile', icon: SmartphoneCharging },
  { text: 'Construído para escalar', icon: Rocket },
  { text: 'Estrutura pensada pra vender', icon: Target },
  { text: 'Primeira impressão define a decisão', icon: Eye },
  { text: 'Carregamento ultra rápido', icon: Zap },
  { text: 'Experiência que retém o visitante', icon: UserCheck },
  { text: 'Otimizado para mobile', icon: SmartphoneCharging },
  { text: 'Construído para escalar', icon: Rocket },
  { text: 'Estrutura pensada pra vender', icon: Target },
  { text: 'Primeira impressão define a decisão', icon: Eye },
  { text: 'Carregamento ultra rápido', icon: Zap },
  { text: 'Experiência que retém o visitante', icon: UserCheck },
  { text: 'Otimizado para mobile', icon: SmartphoneCharging },
  { text: 'Construído para escalar', icon: Rocket },
];

const sectionStyle: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[24],
  paddingBottom: spacing[24],
  overflow: 'hidden',
  backgroundColor: colors.background.general,
};

const trackWrapStyle: React.CSSProperties = {
  width: '100vw',
  marginLeft: '50%',
  transform: 'translateX(-50%)',
  overflow: 'visible',
};

const trackStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'nowrap',
  gap: spacing[6],
  alignItems: 'center',
};

const badgeWrapStyle: React.CSSProperties = {
  flexShrink: 0,
  padding: 1,
  borderRadius: 9999,
  background: 'linear-gradient(90deg, #49C0FF, #0280FF)',
};

const badgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[3]}px ${spacing[4]}px`,
  borderRadius: 9999,
  backgroundColor: '#EBEBEB',
  fontSize: fontSizes.lg,
  fontWeight: 500,
  color: '#000',
};

const PhrasesSection: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!isMd) return;
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      setTranslateX((prev) => prev - delta);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMd]);

  if (!isMd) return null;

  return (
    <section style={sectionStyle} aria-hidden>
      <svg width={0} height={0} aria-hidden style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="phrases-icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#49C0FF" />
            <stop offset="100%" stopColor="#0280FF" />
          </linearGradient>
        </defs>
      </svg>
      <div style={trackWrapStyle}>
        <div
          ref={trackRef}
          style={{
            ...trackStyle,
            paddingLeft: spacing[8],
            paddingRight: spacing[8],
            transform: `translateX(${translateX}px)`,
            transition: 'none',
          }}
        >
          {PHRASES.map(({ text, icon: Icon }, i) => (
            <span key={i} style={badgeWrapStyle}>
              <span style={badgeStyle}>
                <Icon size={18} strokeWidth={1.8} stroke="url(#phrases-icon-gradient)" style={{ flexShrink: 0 }} />
                {text}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhrasesSection;
