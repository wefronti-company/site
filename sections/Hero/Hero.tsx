import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes } = theme;

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

const Hero: React.FC<HeroProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
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

  return (
    <section ref={sectionRef} id="hero" style={heroSectionStyle}>
      <div style={heroContentStyle}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing[2] }}
        >
          <Image
            src="/images/brand/isologo-white.webp"
            alt="Wefronti"
            width={180}
            height={50}
            style={{ width: 'clamp(140px, 22vw, 200px)', height: 'auto', objectFit: 'contain' }}
            priority
          />
        </motion.div>
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
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
