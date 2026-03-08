import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO } from '../../lib/whatsapp';
import ValoresCarousel from '../ValoresCarousel';
import SectionSparkles from '../../components/SectionSparkles';

const { colors, spacing, fontSizes } = theme;

const heroSectionStyleBase: React.CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  background: colors.background.general,
  zIndex: 25,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  contain: 'layout style', // reduz propagação de reflows
};

/** Camada da imagem de fundo */
const heroBgImageStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: 'url(/images/brand/background-hero.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
};

/** Gradiente de baixo para cima: preto na base (funde com o fundo do site) → transparente no topo */
const heroGradientOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(to top, ${colors.background.general} 0%, ${colors.background.general} 25%, rgba(10, 10, 10, 0.6) 55%, transparent 100%)`,
  zIndex: 1,
  pointerEvents: 'none',
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

/** Uma palavra em destaque no H1 (azul) */
const HIGHLIGHT_WORD = 'convertem';
const highlightWordStyle: React.CSSProperties = { color: '#60a5fa' };

function renderHeroTitle(text: string): React.ReactNode {
  const regex = new RegExp(`(${HIGHLIGHT_WORD})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    part.toLowerCase() === HIGHLIGHT_WORD ? (
      <span key={`h-${i}`} style={highlightWordStyle}>{part}</span>
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

  const tituloRaw = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Sites e landing pages para empresas que querem decolar';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Com o Método LUNAR, criamos páginas que vendem. Engenharia de conversão e design de alto impacto para sua marca sair da inércia e entrar em órbita.';
  const botaoPrincipal = (conteudo?.botaoPrincipal != null ? String(conteudo.botaoPrincipal) : '') || 'Pedir orçamento';

  const heroSectionStyle: React.CSSProperties = {
    ...heroSectionStyleBase,
    padding: isMd ? spacing[12] : spacing[4],
    paddingBottom: isMd ? spacing[10] : spacing[6],
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
      <div style={heroBgImageStyle} aria-hidden />
      <div style={heroGradientOverlayStyle} aria-hidden />
      <SectionSparkles />
      <div style={heroContentStyle}>
        {isMd ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing[2] }}
          >
            <Link href="/" aria-label="Wefronti — voltar para a página inicial" style={{ display: 'block' }}>
              <Image src="/images/brand/isologo-white.webp" alt="Wefronti" width={180} height={50} style={{ width: 'clamp(140px, 22vw, 200px)', height: 'auto', objectFit: 'contain' }} priority />
            </Link>
          </motion.div>
        ) : (
          <div
            className={hasEntered ? 'hero-css-fade d1' : ''}
            style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: spacing[2], opacity: hasEntered ? undefined : 0 }}
          >
            <Link href="/" aria-label="Wefronti — voltar para a página inicial" style={{ display: 'block' }}>
              <Image src="/images/brand/isologo-white.webp" alt="Wefronti" width={180} height={50} style={{ width: 'clamp(140px, 22vw, 200px)', height: 'auto', objectFit: 'contain' }} priority />
            </Link>
          </div>
        )}
        {isMd ? (
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            style={heroTitleStyle(isMd)}
          >
            {renderHeroTitle(tituloRaw)}
          </motion.h1>
        ) : (
          <h1 className={hasEntered ? 'hero-css-fade d2' : ''} style={{ ...heroTitleStyle(isMd), opacity: hasEntered ? undefined : 0 }}>
            {renderHeroTitle(tituloRaw)}
          </h1>
        )}
        {isMd ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
            style={heroSubtitleStyle(isMd)}
          >
            {subtitulo}
          </motion.p>
        ) : (
          <p className={hasEntered ? 'hero-css-fade d3' : ''} style={{ ...heroSubtitleStyle(isMd), opacity: hasEntered ? undefined : 0 }}>
            {subtitulo}
          </p>
        )}
        {isMd ? (
          <motion.div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing[4],
              alignItems: 'center',
              justifyContent: 'center',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
          >
            <ButtonCta
              href={buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO)}
              external
              fullWidthOnMobile={false}
            >
              {botaoPrincipal}
            </ButtonCta>
          </motion.div>
        ) : (
          <div
            className={hasEntered ? 'hero-css-fade d4' : ''}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing[4],
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              opacity: hasEntered ? undefined : 0,
            }}
          >
            <ButtonCta
              href={buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO)}
              external
              fullWidthOnMobile={true}
            >
              {botaoPrincipal}
            </ButtonCta>
          </div>
        )}
        <div style={{ width: '100%', marginTop: spacing[8] }}>
          <ValoresCarousel />
        </div>
      </div>
    </section>
  );
};

export default Hero;
