import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  fontFamily: '"Playfair Display", Georgia, serif',
  fontStyle: 'italic',
  fontWeight: 500,
  color: '#9CA3AF',
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

const Hero: React.FC<HeroProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    display: isMd ? 'block' : 'none',
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
      <div style={heroRightStyle} aria-hidden />
    </section>
  );
};

export default Hero;
