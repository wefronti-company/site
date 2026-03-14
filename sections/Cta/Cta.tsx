import React from 'react';
import Image from 'next/image';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO } from '../../lib/whatsapp';

const { colors, spacing, fontSizes } = theme;

/** Largura alinhada aos cards de preço para não ficar tão largo */
const CTA_MAX_WIDTH = 920;

const wrapperStyleBase: React.CSSProperties = {
  width: '100%',
  maxWidth: CTA_MAX_WIDTH,
  margin: '0 auto',
  borderRadius: 30,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#EBEBEB',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
};

const badgeOuterStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: 6,
  borderRadius: 30,
  backgroundColor: '#171717',
  border: '1px solid rgba(0, 0, 0, 0.08)',
};

const badgeInnerStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: 9999,
  background: 'linear-gradient(90deg, #49C0FF, #0280FF)',
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: '#fff',
};

const badgeOuterTextStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: 'rgba(255, 255, 255, 0.9)',
  margin: 0,
};

const headingStyle: React.CSSProperties = {
  fontSize: theme.sectionTitleFontSize,
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: '#171717',
  margin: 0,
};

const subheadingStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  lineHeight: 1.5,
  color: '#52525b',
  margin: 0,
  maxWidth: 520,
};

interface CtaProps {
  conteudo?: Record<string, unknown>;
}

const Cta: React.FC<CtaProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];

  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Hora de colocar sua empresa em órbita';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Seja para um site ou landing page. Orçamento sem compromisso, resposta rápida.';
  const botao = (conteudo?.botao != null ? String(conteudo.botao) : '') || 'Quero um site que vende';
  const mensagemWhatsApp = (conteudo?.mensagemWhatsApp != null ? String(conteudo.mensagemWhatsApp) : '') || WHATSAPP_MESSAGE_ORCAMENTO;
  const whatsappHref = buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, mensagemWhatsApp);
  const sectionStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '100vh',
    marginTop: 0,
    marginBottom: 0,
    paddingTop: spacing[16],
    paddingBottom: 0,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  };

  const ctaBgImageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  };

  const ctaGradientOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(to bottom, ${colors.background.general} 0%, ${colors.background.general} 18%, transparent 50%)`,
    zIndex: 1,
    pointerEvents: 'none',
  };

  const logoBgStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  };

  const wrapperWrapStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[12],
  };

  const footerLegalStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.5,
    paddingTop: spacing[24],
  };

  /** Em telas menores, menos padding na div de CTA e botão em largura total */
  const wrapperStyle: React.CSSProperties = {
    ...wrapperStyleBase,
    padding: isMd ? `${spacing[16]}px ${spacing[10]}px` : `${spacing[8]}px ${spacing[6]}px`,
    gap: isMd ? spacing[6] : spacing[4],
    alignItems: isMd ? 'center' : 'stretch',
  };

  return (
    <section id="cta" style={sectionStyle} aria-labelledby="cta-heading">
      <div style={ctaBgImageStyle} aria-hidden>
        <Image
          src="/images/brand/background.webp"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority={false}
        />
      </div>
      <div style={ctaGradientOverlayStyle} aria-hidden />
      <div style={wrapperWrapStyle}>
      <div style={wrapperStyle}>
        <div style={logoBgStyle} aria-hidden>
          <Image
            src="/images/brand/logo-backgroun.webp"
            alt=""
            fill
            sizes="(max-width: 920px) 100vw, 920px"
            style={{ objectFit: 'contain', objectPosition: 'center bottom', opacity: 0.15 }}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMd ? spacing[6] : spacing[4], width: '100%' }}>
        <div style={badgeOuterStyle} role="status" aria-label="Seção CTA">
          <span style={badgeInnerStyle}>CTA</span>
          <span style={badgeOuterTextStyle}>Vamos começar</span>
        </div>
        <h2 id="cta-heading" style={headingStyle}>
          {titulo}
        </h2>
        <p style={subheadingStyle}>
          {subtitulo}
        </p>
        <ButtonCta href={whatsappHref} external fullWidthOnMobile={!isMd} onLightBackground>
          {botao}
        </ButtonCta>
        </div>
      </div>
      <p style={footerLegalStyle}>
        CNPJ: 64.507.638/0001-04<br />
        ©2026 - Wefronti. Todos os direitos reservados.
      </p>
      </div>
    </section>
  );
};


export default Cta;
