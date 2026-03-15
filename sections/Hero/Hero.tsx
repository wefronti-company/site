import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO } from '../../lib/whatsapp';

const { colors, spacing, fontSizes } = theme;

const HERO_CLIENT_IMAGES = ['/images/testimonials/cl-01.png', '/images/testimonials/cl-02.png', '/images/testimonials/cl-03.png', '/images/testimonials/cl-04.png', '/images/testimonials/cl-05.png', '/images/testimonials/cl-06.png', '/images/testimonials/cl-07.png'];

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
  backgroundImage: 'url(/images/brand/background.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
};

/** Gradiente na base: transparente → #010101 */
const heroBottomGradientStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '20%',
  background: 'linear-gradient(to top, #010101 0%, transparent 100%)',
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
  lineHeight: 1.12,
  letterSpacing: '-0.02em',
  fontSize: isMd ? 'clamp(3rem, 5vw, 4.5rem)' : 'clamp(3rem, 11.5vw, 4rem)',
  color: colors.text.primary,
  margin: 0,
  maxWidth: isMd ? undefined : '100%',
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
  fontSize: isMd ? '1.4rem' : 'clamp(1.25rem, 4.2vw, 1.5rem)',
  fontWeight: 400,
  lineHeight: 1.5,
  color: colors.text.primary,
  opacity: 0.92,
  margin: 0,
  maxWidth: isMd ? undefined : '100%',
});

interface HeroProps {
  conteudo?: Record<string, unknown>;
}

const Hero: React.FC<HeroProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const tituloRaw = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'O site certo aumenta o faturamento do seu negócio';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Sites projetados com engenharia de conversão: clareza de mensagem em segundos, carregamento rápido, percepção de valor e uma estrutura que conduz o visitante naturalmente até a ação.';
  const botaoPrincipal = (conteudo?.botaoPrincipal != null ? String(conteudo.botaoPrincipal) : '') || 'Quero ter um site que vende';

  const paddingX = isMd ? spacing[8] : 16;
  const heroSectionStyle: React.CSSProperties = {
    ...heroSectionStyleBase,
    padding: isMd ? `${spacing[12]}px ${paddingX}px` : `${spacing[5]}px ${paddingX}px`,
    paddingBottom: isMd ? spacing[10] : spacing[8],
    ...(!isMd && {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingTop: spacing[6],
      minHeight: '100svh',
    }),
  };
  const heroContentStyle: React.CSSProperties = {
    ...heroContentStyleBase,
    maxWidth: isMd ? 1040 : '100%',
    gap: isMd ? spacing[8] : spacing[6],
    ...(!isMd && {
      alignItems: 'flex-start',
      textAlign: 'left',
      paddingLeft: 0,
      paddingRight: 0,
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
      <div style={heroBottomGradientStyle} aria-hidden />
      <div style={heroContentStyle}>
        {/* Logo sempre visível no first paint (desktop e mobile) para LCP; animação só no restante */}
        {isMd ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing[2] }}>
            <Link href="/" aria-label="Wefronti — voltar para a página inicial" style={{ display: 'block' }}>
              <Image src="/images/brand/logo.webp" alt="Wefronti" width={180} height={50} style={{ width: 'clamp(140px, 22vw, 200px)', height: 'auto', objectFit: 'contain' }} priority fetchPriority="high" />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: spacing[4] }}>
            <Link href="/" aria-label="Wefronti — voltar para a página inicial" style={{ display: 'block' }}>
              <Image
                src="/images/brand/logo.webp"
                alt="Wefronti"
                width={180}
                height={50}
                style={{ width: 'clamp(120px, 42vw, 180px)', height: 'auto', objectFit: 'contain' }}
                priority
                fetchPriority="high"
              />
            </Link>
          </div>
        )}
        {isMd ? (
          <h1 className={hasEntered ? 'hero-css-fade d2' : ''} style={{ ...heroTitleStyle(isMd), opacity: hasEntered ? undefined : 0 }}>
            {renderHeroTitle(tituloRaw)}
          </h1>
        ) : (
          <h1 className={hasEntered ? 'hero-css-fade d2' : ''} style={{ ...heroTitleStyle(isMd), opacity: hasEntered ? undefined : 0 }}>
            {renderHeroTitle(tituloRaw)}
          </h1>
        )}
        {isMd ? (
          <p className={hasEntered ? 'hero-css-fade d3' : ''} style={{ ...heroSubtitleStyle(isMd), opacity: hasEntered ? undefined : 0 }}>
            {subtitulo}
          </p>
        ) : (
          <p className={hasEntered ? 'hero-css-fade d3' : ''} style={{ ...heroSubtitleStyle(isMd), opacity: hasEntered ? undefined : 0 }}>
            {subtitulo}
          </p>
        )}
        {isMd ? (
          <>
            <div
              className={hasEntered ? 'hero-css-fade d4' : ''}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: spacing[4],
                alignItems: 'center',
                justifyContent: 'center',
                opacity: hasEntered ? undefined : 0,
              }}
            >
            <ButtonCta
              href={buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO)}
              external
              fullWidthOnMobile={false}
            >
              {botaoPrincipal}
            </ButtonCta>
          </div>
          <div
            className={hasEntered ? 'hero-css-fade d5' : ''}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[3],
              marginTop: spacing[6],
              opacity: hasEntered ? undefined : 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {HERO_CLIENT_IMAGES.map((src, i) => (
                <div
                  key={src}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(255, 255, 255, 0.14)',
                    marginLeft: i === 0 ? 0 : -12,
                    position: 'relative' as const,
                    zIndex: HERO_CLIENT_IMAGES.length - i,
                  }}
                >
                  <Image src={src} alt="" width={48} height={48} style={{ objectFit: 'cover', width: '100%', height: '100%', filter: 'grayscale(100%)' }} />
                </div>
              ))}
            </div>
            <span style={{ color: colors.text.primary, fontSize: fontSizes.base, fontWeight: 500, opacity: 0.92 }}>
              + de 100 clientes atendidos
            </span>
          </div>
          </>
        ) : (
          <>
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
          <div
            className={hasEntered ? 'hero-css-fade d5' : ''}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: spacing[2],
              marginTop: spacing[5],
              width: '100%',
              opacity: hasEntered ? undefined : 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {HERO_CLIENT_IMAGES.map((src, i) => (
                <div
                  key={src}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(255, 255, 255, 0.14)',
                    marginLeft: i === 0 ? 0 : -10,
                    position: 'relative' as const,
                    zIndex: HERO_CLIENT_IMAGES.length - i,
                  }}
                >
                  <Image src={src} alt="" width={44} height={44} style={{ objectFit: 'cover', width: '100%', height: '100%', filter: 'grayscale(100%)' }} />
                </div>
              ))}
            </div>
            <span style={{ color: colors.text.primary, fontSize: fontSizes.base, fontWeight: 500, opacity: 0.92 }}>
              + de 100 clientes atendidos
            </span>
          </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
