import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Palette, TrendingUp, Search } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const HERO_CHIPS: { label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { label: 'Site rápido e seguro', Icon: Shield },
  { label: 'Design de alto nível', Icon: Palette },
  { label: 'Focado em conversão', Icon: TrendingUp },
  { label: 'Otimizado para Google', Icon: Search },
];

const heroSectionStyleBase: React.CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  background: 'transparent',
  zIndex: 25,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
};

const heroContentStyleBase: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[8],
};

const heroTitleStyle: React.CSSProperties = {
  fontWeight: 400,
  lineHeight: 1.06,
  letterSpacing: '-0.02em',
  fontSize: 'clamp(3rem, 6.5vw, 5rem)',
  color: colors.text.primary,
  margin: 0,
};

const heroSubtitleStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 200,
  lineHeight: 1.45,
  color: colors.text.primary,
  opacity: 0.92,
  margin: 0,
};


const chipStyleBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[4]}px`,
  fontWeight: 200,
  color: colors.text.primary,
  backgroundColor: 'transparent',
  border: `1px solid ${colors.neutral.border}`,
  borderRadius: radii.full,
  whiteSpace: 'nowrap',
};


interface HeroProps {
  conteudo?: Record<string, unknown>;
}

const Hero: React.FC<HeroProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const scrollToSection = useScrollToSection();
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Soluções em tecnologia, estratégia e design para negócios que querem crescer';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Planejamento, tecnologia e otimização contínua para tornar seu site um verdadeiro canal de aquisição.';
  const chipsLabels = Array.isArray(conteudo?.chips) ? (conteudo.chips as string[]).map((c) => String(c)) : HERO_CHIPS.map((c) => c.label);
  const botaoPrincipal = (conteudo?.botaoPrincipal != null ? String(conteudo.botaoPrincipal) : '') || 'Quero um site que vende';
  const botaoSecundario = (conteudo?.botaoSecundario != null ? String(conteudo.botaoSecundario) : '') || 'Ver Portfolio';

  const heroSectionStyle: React.CSSProperties = {
    ...heroSectionStyleBase,

    padding: isMd ? spacing[10] : spacing[4],
    paddingBottom: isMd ? spacing[10] : spacing[6],
    borderBottomLeftRadius: isMd ? 48 : 28,
    borderBottomRightRadius: isMd ? 48 : 28,
    alignItems: isMd ? 'center' : 'flex-start',
  };
  const heroContentStyle: React.CSSProperties = {
    ...heroContentStyleBase,
    alignItems: isMd ? 'center' : 'flex-start',
    textAlign: isMd ? 'center' : 'left',
  };
  const chipsGridStyle: React.CSSProperties = isMd
    ? {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        gap: spacing[6],
      }
    : {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing[3],
        justifyItems: 'start',
      };
  const chipStyle: React.CSSProperties = {
    ...chipStyleBase,
    fontSize: isMd ? fontSizes.sm : fontSizes.xs,
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

  return (
    <section ref={sectionRef} id="hero" style={heroSectionStyle}>
      <div style={heroContentStyle}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          style={heroTitleStyle}
        >
          {titulo}
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
          style={chipsGridStyle}
          initial={{ opacity: 0, y: 12 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
        >
          {HERO_CHIPS.map(({ Icon }, i) => (
            <span key={i} className="hero-chip-float" style={{ ...chipStyle, animationDelay: `${i * 0.25}s` }}>
              <span style={{ display: 'flex', flexShrink: 0 }}><Icon size={18} /></span>
              {chipsLabels[i] ?? ''}
            </span>
          ))}
        </motion.div>

        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[4], alignItems: 'center' }}
          initial={{ opacity: 0, y: 16 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
        >
          <ButtonCta>{botaoPrincipal}</ButtonCta>
          <Link
            href="/#portfolio"
            aria-label="Ver portfolio"
            onClick={(e) => {
              if (typeof window !== 'undefined' && window.location.pathname === '/') {
                e.preventDefault();
                scrollToSection('portfolio');
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 24px',
              minHeight: 52,
              borderRadius: 9999,
              fontWeight: 500,
              fontSize: 16,
              color: colors.text.primary,
              border: `1px solid ${colors.neutral.border}`,
              background: 'transparent',
              textDecoration: 'none',
              transition: 'opacity 0.2s, border-color 0.2s, background 0.2s',
            }}
          >
            {botaoSecundario}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
