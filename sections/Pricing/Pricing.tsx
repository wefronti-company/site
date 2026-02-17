import React from 'react';
import { CheckCircle, CheckCircle2, CheckCircleIcon } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  backgroundColor: colors.background.dark,
};

const innerStyleBase: React.CSSProperties = {
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[12],
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[4]}px`,
  borderRadius: radii.full,
  border: `1px solid ${colors.neutral.borderDark}`,
  backgroundColor: 'rgba(255,255,255,0.04)',
  fontSize: fontSizes.xs,
  fontWeight: 500,
  color: colors.text.light,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 5vw, 4rem)',
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.light,
  margin: 0,
  textAlign: 'center',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
};

const gridWrapStyle: React.CSSProperties = {
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[8],
  alignItems: 'stretch',
};

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 30,
  border: `1px solid ${colors.neutral.borderDark}`,
  padding: spacing[16],
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[6],
  background: 'rgba(255,255,255,0.02)',
};

const cardEmphasisStyle: React.CSSProperties = {
  borderColor: colors.blue.primary,
  boxShadow: `0 0 24px ${colors.blue.primary}30`,
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
};

const priceBlockStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
};

const priceFromLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.9,
  margin: 0,
  marginBottom: spacing[1],
};

const priceRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: spacing[2],
  flexWrap: 'wrap' as const,
};

const priceSymbolStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.light,
};

const priceValueStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 4.5vw, 2.75rem)',
  fontWeight: 700,
  color: colors.text.light,
  margin: 0,
  lineHeight: 1.2,
};

const priceSecondaryStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.85,
  margin: 0,
  marginTop: spacing[2],
};

const pricePixStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.text.light,
  opacity: 0.75,
  margin: 0,
  marginTop: spacing[1],
};

const featureListStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[3],
  flex: 1,
};

const featureItemStyle = (dimmed?: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: dimmed ? 0.45 : 1,
  fontStyle: dimmed ? ('italic' as const) : 'normal',
  transition: 'transform 0.2s ease',
});

const checkIconStyle: React.CSSProperties = {
  flexShrink: 0,
  color: colors.blue.primary,
};

const checkIconDimmedStyle: React.CSSProperties = {
  flexShrink: 0,
  color: colors.neutral.borderDark,
};

const LANDING_FEATURES = [
  { text: 'Desenvolvimento ágil', dimmed: false },
  { text: 'Copy focada em conversão', dimmed: false },
  { text: '1 única página', dimmed: false },
  { text: 'Otimizada para ads', dimmed: false },
  { text: 'Design moderno e responsivo', dimmed: false },
  { text: 'Formulário de contato', dimmed: false },
  { text: 'SEO básico', dimmed: false },
  { text: 'Performance (carregamento rápido)', dimmed: false },
  { text: 'Blog ou seção de recursos', dimmed: true },
  { text: 'Área administrativa', dimmed: true },
  { text: 'Suporte pós-entrega estendido', dimmed: true },
];

const SITE_FEATURES = [
  'Desenvolvimento ágil',
  'Focado em conversão e engajamento',
  'Múltiplas páginas',
  ' Google Analytics / Google Tag Manager',
  'Design moderno e responsivo',
  'Formulário de contato',
  'SEO avançado',
  'Suporte pós-entrega estendido',
];

const Pricing: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];

  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };

  const grid = isMd
    ? gridStyle
    : { ...gridStyle, gridTemplateColumns: '1fr', gap: spacing[6] };

  /** Em telas menores, menos padding nos cards para não ficar tão alto */
  const cardStyleResponsive: React.CSSProperties = {
    ...cardBaseStyle,
    padding: isMd ? spacing[16] : spacing[6],
  };

  return (
    <section id="precos" style={sectionStyle} aria-labelledby="pricing-heading">
      <div style={innerStyleBase}>
        <div style={{
          ...headerStyle,
          alignItems: isMd ? 'center' : 'flex-start',
        }}>
          <span style={badgeStyle} aria-hidden>
            <span
              className="badge-dot-pulse"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: colors.blue.primary,
              }}
            />
            Preços
          </span>
          <h2 id="pricing-heading" style={{ ...titleStyle, textAlign: isMd ? 'center' : 'left' }}>
            Invista no seu negócio
          </h2>
        </div>

        <div style={gridWrapStyle}>
          <div style={grid}>
          <div style={cardStyleResponsive}>
            <h3 style={cardTitleStyle}>Landing Page</h3>
            <p style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.88, margin: 0 }}>
              Uma página focada em converter visitantes em leads ou vendas. Ideal para campanhas e ofertas específicas.
            </p>
            <div style={priceBlockStyle}>
              <p style={priceFromLabelStyle}>A partir de:</p>
              <div style={priceRowStyle}>
                <span style={priceSymbolStyle}>R$</span>
                <span style={priceValueStyle}>1.397,00</span>
              </div>
              <p style={priceSecondaryStyle}>Parcelado em até 10x </p>
              <p style={pricePixStyle}>À vista no PIX: 10% de desconto</p>
            </div>
            <ul style={featureListStyle}>
              {LANDING_FEATURES.map((item, i) => (
                <li key={i} className="pricing-feature-item" style={featureItemStyle(item.dimmed)}>
                  <span style={item.dimmed ? checkIconDimmedStyle : checkIconStyle} aria-hidden>
                    <CheckCircle2 size={20} strokeWidth={2} />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 'auto' }}>
              <ButtonCta label="Quero uma landing page" />
            </div>
          </div>

          <div style={{ ...cardStyleResponsive, ...cardEmphasisStyle }}>
            <h3 style={cardTitleStyle}>Site completo</h3>
            <p style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.88, margin: 0 }}>
              Site com múltiplas páginas, otimizado para busca no Google e suporte pós-entrega. O pacote mais completo.
            </p>
            <div style={priceBlockStyle}>
              <p style={priceFromLabelStyle}>A partir de:</p>
              <div style={priceRowStyle}>
                <span style={priceSymbolStyle}>R$</span>
                <span style={priceValueStyle}>4.697,00</span>
              </div>
              <p style={priceSecondaryStyle}>Parcelado em até 10x</p>
              <p style={pricePixStyle}>À vista no PIX: 10% de desconto</p>
            </div>
            <ul style={featureListStyle}>
              {SITE_FEATURES.map((text, i) => (
                <li key={i} className="pricing-feature-item" style={featureItemStyle(false)}>
                  <span style={checkIconStyle} aria-hidden>
                    <CheckCircle2 size={20} strokeWidth={2} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 'auto' }}>
              <ButtonCta label="Quero um site" />
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
