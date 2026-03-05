import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '../../lib/whatsapp';

const { colors, spacing, fontSizes } = theme;

const DEFAULT_WHATSAPP_MESSAGE = 'Olá, gostaria de um orçamento para site ou landing page.';

/** Largura alinhada aos cards de preço para não ficar tão largo */
const CTA_MAX_WIDTH = 920;

const wrapperStyleBase: React.CSSProperties = {
  width: '100%',
  maxWidth: CTA_MAX_WIDTH,
  margin: '0 auto',
  borderRadius: 30,
  overflow: 'hidden',
  background: colors.background.gradient,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: `1px solid ${colors.neutral.border}`,
};

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(1.75rem, 5vw, 3.4rem)',
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

  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Pronto para ter seu site ou landing page?';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Fale com a gente. Orçamento sem compromisso e resposta rápida.';
  const botao = (conteudo?.botao != null ? String(conteudo.botao) : '') || 'Pedir orçamento';
  const mensagemWhatsApp = (conteudo?.mensagemWhatsApp != null ? String(conteudo.mensagemWhatsApp) : '') || DEFAULT_WHATSAPP_MESSAGE;
  const whatsappHref = buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, mensagemWhatsApp);
  const sectionStyle: React.CSSProperties = {
    width: '100%',
    marginTop: spacing[24],
    marginBottom: spacing[24],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  };

  /** Em telas menores, menos padding na div de CTA */
  const wrapperStyle: React.CSSProperties = {
    ...wrapperStyleBase,
    padding: isMd ? `${spacing[16]}px ${spacing[10]}px` : `${spacing[8]}px ${spacing[6]}px`,
    gap: isMd ? spacing[6] : spacing[4],
  };

  return (
    <section id="cta" style={sectionStyle} aria-labelledby="cta-heading">
      <div style={wrapperStyle}>
        <h2 id="cta-heading" style={headingStyle}>
          {titulo}
        </h2>
        <p style={subheadingStyle}>
          {subtitulo}
        </p>
        <ButtonCta
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open(whatsappHref, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          {botao}
        </ButtonCta>
      </div>
    </section>
  );
};


export default Cta;
