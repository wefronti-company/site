import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ArrowUpRight } from 'lucide-react';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const WHATSAPP_LINK = 'https://wa.me/message/3V45SAJMLIJJJ1';
const WHATSAPP_MESSAGE = 'Olá, tenho algumas dúvidas e gostaria de conversar.';

/** Largura alinhada aos cards de preço para não ficar tão largo */
const CTA_MAX_WIDTH = 920;

const wrapperStyleBase: React.CSSProperties = {
  width: '100%',
  maxWidth: CTA_MAX_WIDTH,
  margin: '0 auto',
  borderRadius: 30,
  overflow: 'hidden',
  backgroundImage: "url('/images/brand/background.webp')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: `1px solid ${colors.neutral.borderDark}`,
};

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.light,
  margin: 0,
};

const subheadingStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  lineHeight: 1.5,
  color: colors.text.light,
  opacity: 0.92,
  margin: 0,
  maxWidth: 520,
};

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '14px 28px',
  fontSize: fontSizes.base,
  fontWeight: 500,
  borderRadius: radii.full,
  backgroundColor: colors.blue.primary,
  color: colors.text.light,
  border: `1px solid ${colors.blue.primary}`,
  textDecoration: 'none',
  cursor: 'pointer',
  marginTop: spacing[2],
  transition: 'opacity 0.2s ease',
};

const Cta: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];
  const whatsappUrl = `${WHATSAPP_LINK}${WHATSAPP_LINK.includes('?') ? '&' : '?'}text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

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
    backgroundColor: colors.background.dark,
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
        Vamos transformar o seu site em uma máquina de vendas?

        </h2>
        <p style={subheadingStyle}>
        Fale com a gente pelo WhatsApp, vamos conversar sobre o seu negócio e como podemos ajudar.

        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={buttonStyle}
          aria-label="Abrir conversa no WhatsApp para tirar dúvidas"
        >
          Falar no WhatsApp
          <ArrowUpRight size={20} strokeWidth={2.5} aria-hidden />
        </a>
      </div>
    </section>
  );
};


export default Cta;
