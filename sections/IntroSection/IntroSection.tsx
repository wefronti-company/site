import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const sectionStyle: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  backgroundColor: colors.background.general,
  position: 'relative',
  overflow: 'hidden',
};

/** Imagem de fundo: alinhada à direita e à mesma altura do bloco de texto (mesmo padding vertical da seção) */
const bgImageStyle: React.CSSProperties = {
  position: 'absolute',
  top: spacing[16],
  right: 0,
  bottom: spacing[16],
  width: '52%',
  maxWidth: 720,
  backgroundImage: 'url(/images/brand/background-intro.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  zIndex: 0,
};

/** Gradientes na mesma faixa da imagem: superior, inferior e lateral esquerda — transição suave */
const bgGradientStyle: React.CSSProperties = {
  position: 'absolute',
  top: spacing[16],
  right: 0,
  bottom: spacing[16],
  left: 0,
  zIndex: 1,
  pointerEvents: 'none',
  background: `
    linear-gradient(to bottom, ${colors.background.general} 0%, transparent 22%),
    linear-gradient(to top, ${colors.background.general} 0%, transparent 22%),
    linear-gradient(to right,
      ${colors.background.general} 0%,
      ${colors.background.general} 38%,
      rgba(10, 10, 10, 0.98) 48%,
      rgba(10, 10, 10, 0.88) 58%,
      rgba(10, 10, 10, 0.6) 68%,
      rgba(10, 10, 10, 0.3) 78%,
      transparent 90%
    )
  `,
};

const innerStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[12],
  alignItems: 'center',
  paddingLeft: spacing[8],
  paddingRight: spacing[8],
};

const leftColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[8],
  textAlign: 'left',
};

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
};

const highlightStyle: React.CSSProperties = {
  color: colors.blue.primary,
  fontWeight: 600,
};

const dividerStyle: React.CSSProperties = {
  height: 1,
  width: '100%',
  backgroundColor: colors.neutral.border,
  margin: 0,
  border: 'none',
};

const problemListStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[5],
};

const problemItemStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.6,
  color: colors.text.secondary,
  margin: 0,
};

const subheadingStyle: React.CSSProperties = {
  fontSize: fontSizes.xl,
  fontWeight: 500,
  lineHeight: 1.35,
  color: colors.text.primary,
  margin: 0,
};

const paragraphStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.6,
  color: colors.text.secondary,
  margin: 0,
};

/** Coluna direita: vazia para o fundo da seção aparecer à direita */
const rightColumnStyle: React.CSSProperties = {
  minHeight: 320,
};

const PROBLEMS: { text: string; highlight: string; suffix: string }[] = [
  { text: 'Você investe em tráfego, mas vê os cliques sumirem ', highlight: 'sem virar venda', suffix: '.' },
  { text: 'Contratou agência ou freelancer que ', highlight: 'te entregou um site bonito, mas vazio', suffix: '.' },
  { text: 'Sua estrutura digital ', highlight: 'não acompanha o crescimento do seu negócio', suffix: ' — e está te travando.' },
];

interface IntroSectionProps {
  conteudo?: Record<string, unknown>;
}

const IntroSection: React.FC<IntroSectionProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);

  const heading = (conteudo?.heading != null ? String(conteudo.heading) : '') || 'Está cansado de jogar tráfego em ';
  const headingHighlight = (conteudo?.headingHighlight != null ? String(conteudo.headingHighlight) : '') || 'páginas que não convertem?';
  const subheading = (conteudo?.subheading != null ? String(conteudo.subheading) : '') || 'Você merece mais do que um ';
  const subheadingHighlight = (conteudo?.subheadingHighlight != null ? String(conteudo.subheadingHighlight) : '') || 'layout bonito.';
  const paragraph = (conteudo?.paragraph != null ? String(conteudo.paragraph) : '') || 'Na Wefronti, criamos páginas que justificam ';
  const paragraphHighlight = (conteudo?.paragraphHighlight != null ? String(conteudo.paragraphHighlight) : '') || 'cada centavo investido em tráfego';
  const paragraphSuffix = (conteudo?.paragraphSuffix != null ? String(conteudo.paragraphSuffix) : '') || ' — com estratégia, método e foco em resultado real.';

  const problems = (Array.isArray(conteudo?.problems) ? (conteudo.problems as { text?: string; highlight?: string; suffix?: string }[]) : null) ?? PROBLEMS;

  const gridLayout: React.CSSProperties = {
    ...innerStyle,
    gridTemplateColumns: isMd ? '1fr 1fr' : '1fr',
    gap: isMd ? spacing[12] : spacing[10],
    paddingLeft: isMd ? spacing[8] : spacing[4],
    paddingRight: isMd ? spacing[8] : spacing[4],
  };

  return (
    <section id="intro" style={sectionStyle} aria-labelledby="intro-heading">
      <div style={bgImageStyle} aria-hidden />
      <div style={bgGradientStyle} aria-hidden />
      <div style={gridLayout}>
        <div style={leftColumnStyle}>
          <h2 id="intro-heading" style={headingStyle}>
            {heading}
            <span style={highlightStyle}>{headingHighlight}</span>
          </h2>

          <hr style={dividerStyle} />

          <ul style={problemListStyle} role="list">
            {problems.map((item, i) => (
              <li key={i}>
                <p style={problemItemStyle}>
                  {item.text ?? ''}
                  <strong style={{ color: i === 2 ? colors.blue.primary : colors.text.secondary, fontWeight: 600 }}>
                    {item.highlight ?? ''}
                  </strong>
                  {item.suffix ?? ''}
                </p>
                {i < problems.length - 1 ? <hr style={{ ...dividerStyle, marginTop: spacing[5] }} /> : null}
              </li>
            ))}
          </ul>

          <h3 style={subheadingStyle}>
            {subheading}
            <span style={highlightStyle}>{subheadingHighlight}</span>
          </h3>

          <p style={paragraphStyle}>
            {paragraph}
            <strong style={highlightStyle}>{paragraphHighlight}</strong>
            {paragraphSuffix}
          </p>
        </div>

        <div style={{ ...rightColumnStyle, display: isMd ? 'block' : 'none' }} aria-hidden />
      </div>
    </section>
  );
};

export default IntroSection;
