import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { X, Check } from 'lucide-react';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const OUTRAS_AGENCIAS: string[] = [
  'Recebem o pagamento e somem — você fica sem site e sem dinheiro',
  'Prometem o mundo, entregam qualquer coisa e não respondem mais',
  'Processos lentos, prazos que estouram e zero transparência',
  'Site “bonito” que não converte e não aparece no Google',
  'Abrem o chamado e te deixam na mão quando mais precisa',
];

const WEFRONTI: string[] = [
  'Transparência total: prazos claros, etapas definidas e comunicação constante',
  'Parceria de verdade: suporte pós-entrega e melhorias contínuas',
  'Processos ágeis, adaptados ao seu negócio, sem enrolação',
  'Foco em resultado: site que converte e aparece na busca',
  'Ao seu lado quando mais precisar — não somimos depois da entrega',
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
  borderRadius: 30,
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
  /** Em telas menores, sem padding horizontal no header/grid para igualar à largura da seção FAQ */
  const gridLayout: React.CSSProperties = {
    ...gridStyle,
    gridTemplateColumns: isMd ? '1fr 1fr' : '1fr',
    paddingLeft: isMd ? headerPaddingX : 0,
    paddingRight: isMd ? headerPaddingX : 0,
  };

  return (
    <section id="comparativo" style={sectionStyle} aria-labelledby="comparison-heading">
      <div style={innerStyleBase}>
        <div style={{
          ...headerStyle,
          paddingLeft: isMd ? headerPaddingX : 0,
          paddingRight: isMd ? headerPaddingX : 0,
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
            Diferenciais
          </span>
          <h2 id="comparison-heading" style={{ ...titleStyle, textAlign: isMd ? 'center' : 'left' }}>
            Você já passou por isso<br />com outra empresa?
          </h2>
          <p style={{ margin: 0, fontSize: '1.3rem', color: colors.text.light, opacity: 0.88, lineHeight: 1.5, textAlign: isMd ? 'center' : 'left', maxWidth: 640 }}>
            Veja o que acontece na prática com muitas agências e por que a Wefronti é diferente.
          </p>
        </div>

        <div style={gridLayout}>
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>O que muita gente sofre por aí</h3>
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
            <h3 style={cardTitleStyle}>Como é trabalhar com a Wefronti</h3>
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

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMd ? 'center' : 'flex-start',
          gap: isMd ? spacing[6] : spacing[4],
          marginTop: isMd ? spacing[12] : spacing[8],
          textAlign: isMd ? 'center' : 'left',
        }}>
          <p style={{
            margin: 0,
            fontSize: '1.3rem',
            lineHeight: 1.6,
            color: colors.text.light,
            opacity: 0.92,
            maxWidth: 720,
          }}>
            Não deixe seu investimento e seu negócio na mão de quem some. A Wefronti entrega o que promete, com transparência, suporte e foco no seu resultado. Conte sua necessidade e veja como podemos resolver.
          </p>
          <ButtonCta
            label="Solicitar orçamento"
            onClick={() => {
              const el = document.getElementById('cta');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              else if (typeof window !== 'undefined') window.location.href = '/#cta';
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Comparison;
