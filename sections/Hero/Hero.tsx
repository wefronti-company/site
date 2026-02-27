import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { Rocket, Heart } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes } = theme;

const heroSectionStyleBase: React.CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  background: 'transparent',
  zIndex: 25,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  overflow: 'hidden',
};

const heroContentStyleBase: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[8],
  alignItems: 'flex-start',
  textAlign: 'left',
};

const heroTitleStyle: React.CSSProperties = {
  fontWeight: 400,
  lineHeight: 1.06,
  letterSpacing: '-0.02em',
  fontSize: 'clamp(3rem, 6.5vw, 5rem)',
  color: colors.text.primary,
  margin: 0,
};

/** Palavras destacadas no H1: serif italic, cinza claro */
const HIGHLIGHT_WORDS = ['tecnologia', 'design', 'estratégia'];
const highlightWordStyle: React.CSSProperties = {
  color: '#5c9369AF',
};

function renderHeroTitle(text: string): React.ReactNode {
  const regex = new RegExp(`(${HIGHLIGHT_WORDS.join('|')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    HIGHLIGHT_WORDS.some((w) => part.toLowerCase() === w) ? (
      <span key={`h-${i}-${part}`} style={highlightWordStyle}>
        {part}
      </span>
    ) : (
      <React.Fragment key={`h-${i}`}>{part}</React.Fragment>
    )
  );
}

const heroSubtitleStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 200,
  lineHeight: 1.45,
  color: colors.text.primary,
  opacity: 0.92,
  margin: 0,
};


interface HeroProps {
  conteudo?: Record<string, unknown>;
}

const HERO_BADGES: Array<{
  id: string;
  title: string;
  iconType: 'rocket' | 'dollar' | 'heart';
  top: string;
  left: string;
  floatDuration: number;
  floatOffset: number;
  parallaxFactor: number;
}> = [
  {
    id: 'tech',
    title: 'Tecnologia para escalar',
    iconType: 'rocket',
    top: '8%',
    left: '4%',
    floatDuration: 4.8,
    floatOffset: 10,
    parallaxFactor: 0.35,
  },
  {
    id: 'strategy',
    title: 'Estratégia para converter',
    iconType: 'dollar',
    top: '42%',
    left: '26%',
    floatDuration: 5.4,
    floatOffset: 12,
    parallaxFactor: 0.5,
  },
  {
    id: 'design',
    title: 'Design para impressionar',
    iconType: 'heart',
    top: '74%',
    left: '10%',
    floatDuration: 4.9,
    floatOffset: 11,
    parallaxFactor: 0.42,
  },
];

interface HeroBadgeProps {
  badge: (typeof HERO_BADGES)[number];
  idx: number;
  hasEntered: boolean;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}

const HeroBadge: React.FC<HeroBadgeProps> = ({ badge, idx, hasEntered, smoothX, smoothY }) => {
  const parallaxX = useTransform(smoothX, (v) => v * badge.parallaxFactor);
  const parallaxY = useTransform(smoothY, (v) => v * badge.parallaxFactor);

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: badge.top,
        left: badge.left,
        width: 'min(320px, 92%)',
        x: parallaxX,
        y: parallaxY,
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: hasEntered ? 1 : 0, scale: hasEntered ? 1 : 0.98 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + idx * 0.08 }}
    >
      <motion.div
        style={{
          border: `1px solid ${colors.neutral.border}`,
          borderRadius: 20,
          padding: `${spacing[5]}px ${spacing[5]}px`,
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'saturate(150%) blur(14px)',
          WebkitBackdropFilter: 'saturate(150%) blur(14px)',
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
        }}
        animate={{ y: [0, -badge.floatOffset, 0] }}
        transition={{
          duration: badge.floatDuration,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(102, 191, 130, 0.15)',
            border: `1px solid ${colors.neutral.border}`,
            flexShrink: 0,
          }}
        >
          {badge.iconType === 'rocket' ? (
            <Rocket size={22} color="#059669" strokeWidth={2} />
          ) : badge.iconType === 'dollar' ? (
            <span style={{ fontSize: 24, lineHeight: 1, color: '#059669', fontWeight: 700 }}>$</span>
          ) : (
            <Heart size={22} color="#059669" strokeWidth={2} />
          )}
        </div>
        <span
          style={{
            fontSize: '1.08rem',
            lineHeight: 1.3,
            color: colors.text.primary,
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          {badge.title}
        </span>
      </motion.div>
    </motion.div>
  );
};

const Hero: React.FC<HeroProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 85, damping: 22, mass: 0.9 });
  const smoothY = useSpring(mouseY, { stiffness: 85, damping: 22, mass: 0.9 });

  const tituloRaw = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Soluções em tecnologia, estratégia e design para negócios que querem crescer';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Planejamento, tecnologia e otimização contínua para tornar seu site um verdadeiro canal de aquisição.';
  const botaoPrincipal = (conteudo?.botaoPrincipal != null ? String(conteudo.botaoPrincipal) : '') || 'Quero um site que vende';

  const heroSectionStyle: React.CSSProperties = {
    ...heroSectionStyleBase,
    padding: isMd ? spacing[10] : spacing[4],
    paddingBottom: isMd ? spacing[10] : spacing[6],
    borderBottomLeftRadius: isMd ? 48 : 28,
    borderBottomRightRadius: isMd ? 48 : 28,
  };
  const heroContentStyle: React.CSSProperties = {
    ...heroContentStyleBase,
  };

  useEffect(() => {
    if (hasEntered) return;
    let cancelled = false;
    let obs: IntersectionObserver | null = null;

    obs = new IntersectionObserver((([entry]) => {
      if (entry.isIntersecting && !cancelled) {
        setHasEntered(true);
        if (obs && sectionRef.current) obs.unobserve(sectionRef.current);
      }
    }) as IntersectionObserverCallback, { threshold: 0.2, rootMargin: '0px' });

    if (sectionRef.current && obs) obs.observe(sectionRef.current);

    return () => {
      cancelled = true;
      if (obs && sectionRef.current) obs.unobserve(sectionRef.current);
    };
  }, [hasEntered]);

  const heroLeftStyle: React.CSSProperties = {
    flex: isMd ? '0 0 65%' : '1 1 100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };
  const heroRightStyle: React.CSSProperties = {
    flex: isMd ? '0 0 35%' : '0 0 0',
    display: isMd ? 'flex' : 'none',
    position: 'relative',
    minHeight: 420,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const heroRightSceneStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 420,
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rightRef.current) return;
    const rect = rightRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx * 22);
    mouseY.set(ny * 22);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section ref={sectionRef} id="hero" style={heroSectionStyle}>
      <div style={heroLeftStyle}>
      <div style={heroContentStyle}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          style={heroTitleStyle}
        >
          {renderHeroTitle(tituloRaw)}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
          style={heroSubtitleStyle}
        >
          {subtitulo}
        </motion.p>

        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[4], alignItems: 'center' }}
          initial={{ opacity: 0, y: 16 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
        >
          <ButtonCta>{botaoPrincipal}</ButtonCta>
        </motion.div>
      </div>
      </div>
      <div
        ref={rightRef}
        style={heroRightStyle}
        aria-hidden
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={heroRightSceneStyle}>
          {HERO_BADGES.map((badge, idx) => (
            <HeroBadge
              key={badge.id}
              badge={badge}
              idx={idx}
              hasEntered={hasEntered}
              smoothX={smoothX}
              smoothY={smoothY}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
