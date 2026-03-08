import React from 'react';
import Image from 'next/image';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO } from '../../lib/whatsapp';
import SectionSparkles from '../../components/SectionSparkles';

const { colors, spacing, fontSizes } = theme;

/** Largura alinhada aos cards de preço para não ficar tão largo */
const CTA_MAX_WIDTH = 920;

const wrapperStyleBase: React.CSSProperties = {
  width: '100%',
  maxWidth: CTA_MAX_WIDTH,
  margin: '0 auto',
  borderRadius: 30,
  overflow: 'hidden',
  backgroundColor: 'rgba(24, 24, 27, 0.5)',
  backdropFilter: 'saturate(150%) blur(20px)',
  WebkitBackdropFilter: 'saturate(150%) blur(20px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
};

const headingStyle: React.CSSProperties = {
  fontSize: theme.sectionTitleFontSize,
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
};

const subheadingStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  lineHeight: 1.5,
  color: colors.text.primary,
  opacity: 0.92,
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
  const botao = (conteudo?.botao != null ? String(conteudo.botao) : '') || 'Pedir orçamento';
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
    color: colors.text.primary,
    opacity: 0.6,
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.5,
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
          src="/images/brand/background-cta.webp"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority={false}
        />
      </div>
      <div style={ctaGradientOverlayStyle} aria-hidden />
      <SectionSparkles />
      <div style={wrapperWrapStyle}>
      <div style={wrapperStyle}>
        <h2 id="cta-heading" style={headingStyle}>
          {titulo}
        </h2>
        <p style={subheadingStyle}>
          {subtitulo}
        </p>
        <ButtonCta href={whatsappHref} external fullWidthOnMobile={!isMd}>
          {botao}
        </ButtonCta>
      </div>
      <p style={footerLegalStyle}>
        CNPJ: 64.507.638/0001-04<br />
        © 2026 Todos os direitos reservados.
      </p>
      </div>
    </section>
  );
};


export default Cta;
