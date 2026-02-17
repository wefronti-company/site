import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { X, Check } from 'lucide-react';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const OUTRAS_AGENCIAS: string[] = [
  'Processos engessados e lentos',
  'Só focam em fazer site bonito',
  'Não se preocupam em gerar resultado',
  'Entregam o site e somem',
  'Deixam o cliente na mão quando mais precisa',
];

const WEFRONTI: string[] = [
  'Processos ágeis e adaptados ao seu negócio',
  'Design que converte, não só “bonito”',
  'Foco em resultados e métricas que importam',
  'Suporte contínuo e parceria pós-entrega',
  'Ao seu lado quando mais precisar',
];

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
  display: 'grid',
  gap: spacing[12],
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[4]}px`,
  borderRadius: radii.md,
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
  paddingLeft: spacing[12],
  paddingRight: spacing[12],
  paddingBottom: spacing[8],
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[8],
  paddingLeft: spacing[12],
  paddingRight: spacing[12],
};

const cardStyle: React.CSSProperties = {
  padding: spacing[8],
  borderRadius: radii.md,
  border: `1px solid ${colors.neutral.borderDark}`,
  background: colors.neutral.accordeon,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[5],
};

const cardHighlightStyle: React.CSSProperties = {
  ...cardStyle,
  borderColor: 'rgba(53, 152, 255, 0.25)',
  boxShadow: '0 0 32px rgba(53, 152, 255, 0.08)',
  backgroundImage: "linear-gradient(rgba(4, 4, 4, 0.72), rgba(4, 4, 4, 0.78)), url('/images/brand/background.webp')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 500,
  color: colors.text.light,
  margin: 0,
  opacity: 0.9,
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: spacing[3],
  fontSize: fontSizes.base,
  lineHeight: 1.5,
  color: colors.text.light,
};

const iconWrapStyle: React.CSSProperties = {
  flexShrink: 0,
  width: 22,
  height: 22,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const iconNegativeStyle: React.CSSProperties = {
  ...iconWrapStyle,
  background: 'rgba(255, 255, 255, 0.08)',
  color: 'rgba(255, 120, 120, 0.95)',
};

const iconPositiveStyle: React.CSSProperties = {
  ...iconWrapStyle,
  background: 'rgba(53, 152, 255, 0.2)',
  color: colors.blue.primary,
};

const Comparison: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };
  const gridLayout: React.CSSProperties = {
    ...gridStyle,
    gridTemplateColumns: isMd ? '1fr 1fr' : '1fr',
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };

  return (
    <section id="comparativo" style={sectionStyle} aria-labelledby="comparison-heading">
      <div style={innerStyleBase}>
        <div style={{
          ...headerStyle,
          paddingLeft: headerPaddingX,
          paddingRight: headerPaddingX,
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
            Comparação
          </span>
          <h2 id="comparison-heading" style={{ ...titleStyle, textAlign: isMd ? 'center' : 'left' }}>
            Por que trabalhar conosco?
          </h2>
        </div>

        <div style={gridLayout}>
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Outras empresas</h3>
            <ul style={listStyle} role="list">
              {OUTRAS_AGENCIAS.map((text, i) => (
                <li key={i} style={itemStyle}>
                  <span style={iconNegativeStyle} aria-hidden>
                    <X size={14} strokeWidth={2.5} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={cardHighlightStyle}>
            <h3 style={cardTitleStyle}>Wefronti</h3>
            <ul style={listStyle} role="list">
              {WEFRONTI.map((text, i) => (
                <li key={i} style={itemStyle}>
                  <span style={iconPositiveStyle} aria-hidden>
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
