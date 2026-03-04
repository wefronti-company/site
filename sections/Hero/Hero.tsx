import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Heart, TrendingUp, DollarSign } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii } = theme;

const heroSectionStyleBase: React.CSSProperties = {
  position: 'relative',
  minHeight: '80vh',
  background: 'transparent',
  zIndex: 25,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};

const heroContentStyleBase: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[8],
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
  maxWidth: 1120,
};

const heroTitleStyle = (isMd: boolean): React.CSSProperties => ({
  fontWeight: 400,
  lineHeight: 1.06,
  letterSpacing: '-0.02em',
  fontSize: isMd ? 'clamp(3rem, 5vw, 4.5rem)' : 'clamp(2.5rem, 5vw, 2.5rem)',
  color: colors.text.primary,
  margin: 0,
});

/** Palavras destacadas no H1: tom azul */
const HIGHLIGHT_WORDS = ['digitais de elite', '100% de código', 'estratégia'];
const highlightWordStyle: React.CSSProperties = {
  color: '#60a5fa',
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

const heroSubtitleStyle = (isMd: boolean): React.CSSProperties => ({
  fontSize: isMd ? '1.4rem' : '1.05rem',
  fontWeight: 400,
  lineHeight: 1.45,
  color: colors.text.primary,
  opacity: 0.92,
  margin: 0,
});


interface HeroProps {
  conteudo?: Record<string, unknown>;
}

const HERO_BADGES: Array<{
  id: string;
  title: string;
  iconType: 'rocket' | 'dollar' | 'heart' | 'trend';
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
    top: '24%',
    left: '4%',
    floatDuration: 4.8,
    floatOffset: 10,
    parallaxFactor: 0.35,
  },
  {
    id: 'roi',
    title: 'ROI para crescer',
    iconType: 'trend',
    top: '54%',
    left: '8%',
    floatDuration: 5.1,
    floatOffset: 11,
    parallaxFactor: 0.45,
  },
  {
    id: 'design',
    title: 'Design para impressionar',
    iconType: 'heart',
    top: '20%',
    left: '89%',
    floatDuration: 4.9,
    floatOffset: 11,
    parallaxFactor: 0.42,
  },
  {
    id: 'strategy',
    title: 'Estratégia para converter',
    iconType: 'dollar',
    top: '58%',
    left: '87%',
    floatDuration: 5.4,
    floatOffset: 12,
    parallaxFactor: 0.5,
  },
];

interface HeroBadgeProps {
  badge: (typeof HERO_BADGES)[number];
  idx: number;
  hasEntered: boolean;
}

const HeroBadge: React.FC<HeroBadgeProps> = ({ badge, idx, hasEntered }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: badge.top,
        left: badge.left,
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: hasEntered ? 1 : 0, scale: hasEntered ? 1 : 0.98 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + idx * 0.08 }}
    >
      <motion.div
        style={{
          border: `1px solid ${colors.neutral.border}`,
          borderRadius: '50%',
          width: 78,
          height: 78,
          background: 'rgba(24, 24, 27, 0.7)',
          backdropFilter: 'saturate(150%) blur(14px)',
          WebkitBackdropFilter: 'saturate(150%) blur(14px)',
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
            borderRadius: radii.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(37, 99, 235, 0.15)',
            border: `1px solid ${colors.neutral.border}`,
            flexShrink: 0,
          }}
        >
          {badge.iconType === 'rocket' ? (
            <Rocket size={22} color="#2563eb" strokeWidth={2} />
          ) : badge.iconType === 'dollar' ? (
            <DollarSign size={22} color="#2563eb" strokeWidth={2} />
          ) : badge.iconType === 'trend' ? (
            <TrendingUp size={22} color="#2563eb" strokeWidth={2} />
          ) : (
            <Heart size={22} color="#2563eb" strokeWidth={2} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Hero: React.FC<HeroProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const scrollToSection = useScrollToSection();
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const tituloRaw = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Projetamos e desenvolvemos produtos digitais que crescem com o seu negócio.';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Unimos estratégia, design e tecnologia para criar produtos que não precisam ser refeitos daqui 6 meses. Entregamos performance real e controle total sobre o seu projeto.';
  const botaoPrincipal = (conteudo?.botaoPrincipal != null ? String(conteudo.botaoPrincipal) : '') || 'Iniciar um projeto';

  const heroSectionStyle: React.CSSProperties = {
    ...heroSectionStyleBase,
    padding: isMd ? spacing[12] : spacing[4],
    paddingBottom: isMd ? spacing[10] : spacing[6],
    borderBottomLeftRadius: isMd ? 48 : 28,
    borderBottomRightRadius: isMd ? 48 : 28,
    ...(!isMd && {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingTop: spacing[12],
    }),
  };
  const heroContentStyle: React.CSSProperties = {
    ...heroContentStyleBase,
    maxWidth: isMd ? 1040 : 720,
    ...(!isMd && {
      alignItems: 'flex-start',
      textAlign: 'left',
    }),
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

  const badgesLayerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
  };

  return (
    <section ref={sectionRef} id="hero" style={heroSectionStyle}>
      <div style={heroContentStyle}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          style={heroTitleStyle(isMd)}
        >
          {renderHeroTitle(tituloRaw)}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
          style={heroSubtitleStyle(isMd)}
        >
          {subtitulo}
        </motion.p>

        <motion.div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing[4],
            alignItems: 'center',
            justifyContent: isMd ? 'center' : 'flex-start',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
        >
          <ButtonCta>{botaoPrincipal}</ButtonCta>
          <button
            type="button"
            onClick={() => scrollToSection('solucoes')}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.blue.primary;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.neutral.border;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 24px',
              minHeight: 52,
              minWidth: 220,
              fontSize: 16,
              fontWeight: 500,
              color: colors.text.primary,
              backgroundColor: 'rgba(24, 24, 27, 0.7)',
              backdropFilter: 'saturate(150%) blur(14px)',
              WebkitBackdropFilter: 'saturate(150%) blur(14px)',
              border: `1px solid ${colors.neutral.border}`,
              borderRadius: radii.full,
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
          >
            Nossas soluções
          </button>
        </motion.div>
      </div>
      {isMd ? (
        <div style={badgesLayerStyle} aria-hidden>
          {HERO_BADGES.map((badge, idx) => (
            <HeroBadge
              key={badge.id}
              badge={badge}
              idx={idx}
              hasEntered={hasEntered}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default Hero;
