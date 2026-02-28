import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { X, CheckCircle2 } from 'lucide-react';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const OUTRAS_AGENCIAS: string[] = [
  'Pagou pelo site, ficou esperando e sumiram com o seu dinheiro',
  'Te prometeram um site incrível e entregaram algo que você teve vergonha de mostrar',
  'O prazo era 30 dias e 4 meses depois o site ainda não estava no ar',
  'Recebeu um site bonito que não gerou um único lead sequer',
  'Abriu um chamado de suporte e nunca mais teve resposta',
];

const WEFRONTI: string[] = [
  'Processo 100% transparente: você acompanha cada etapa, do briefing à entrega',
  'Site entregue no prazo combinado, sem desculpas, sem surpresas',
  'Design estratégico pensado para converter visitantes em clientes',
  'SEO estruturado para você aparecer no Google e atrair clientes',
  'Entrega com suporte: o site no ar, testado e funcionando perfeitamente.',
];

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  backgroundColor: 'transparent',
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
  border: `1px solid ${colors.neutral.border}`,
  backgroundColor: colors.neutral.accordeon,
  fontSize: fontSizes.xs,
  fontWeight: 500,
  color: colors.text.primary,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 5vw, 4rem)',
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
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
  border: `1px solid ${colors.neutral.border}`,
  background: colors.neutral.accordeon,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[5],
};

const cardHighlightStyle: React.CSSProperties = {
  ...cardStyle,
  borderColor: 'rgba(102, 191, 130, 0.35)',
  boxShadow: '0 0 32px rgba(102, 191, 130, 0.12)',
  background: colors.background.gradient,
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 500,
  paddingBottom: spacing[4],
  color: colors.text.primary,
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
  color: colors.text.primary,
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
  background: 'rgba(255, 120, 120, 0.08)',
  color: 'rgba(255, 120, 120, 0.95)',
};

const iconPositiveStyle: React.CSSProperties = {
  ...iconWrapStyle,
  background: 'rgba(102, 191, 130, 0.2)',
  color: colors.blue.primary,
};

interface ComparisonProps {
  conteudo?: Record<string, unknown>;
}

const Comparison: React.FC<ComparisonProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];

  const badge = (conteudo?.badge != null ? String(conteudo.badge) : '') || 'Diferenciais';
  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Você já passou por isso\ncom outra empresa?';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Veja o que acontece na prática com a maioria das empresas do mercado, e por que líderes escolhem a Wefronti:';
  const outrasAgencias = (Array.isArray(conteudo?.outrasAgencias) ? (conteudo.outrasAgencias as string[]).map(String) : null) ?? OUTRAS_AGENCIAS;
  const wefronti = (Array.isArray(conteudo?.wefronti) ? (conteudo.wefronti as string[]).map(String) : null) ?? WEFRONTI;
  const tituloLines = titulo.split('\n');
  const ctaFinal = (conteudo?.ctaFinal != null ? String(conteudo.ctaFinal) : '') || 'Você já sabe o que não quer. Agora é hora de ter um site que realmente trabalha pelo seu negócio.';
  const botao = (conteudo?.botao != null ? String(conteudo.botao) : '') || 'Quero um site que vende';

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
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: colors.blue.primary,
              }}
            />
            {badge}
          </span>
          <h2 id="comparison-heading" style={{ ...titleStyle, textAlign: isMd ? 'center' : 'left' }}>
            {tituloLines.map((line, i, arr) => (
              <React.Fragment key={i}>{line}{i < arr.length - 1 ? <br /> : null}</React.Fragment>
            ))}
          </h2>
          <p style={{ margin: 0, fontSize: '1.3rem', color: colors.text.primary, opacity: 0.88, lineHeight: 1.5, textAlign: isMd ? 'center' : 'left', maxWidth: 640 }}>
            {subtitulo}
          </p>
        </div>

        <div style={gridLayout}>
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>99% de chance de você ter passado por isso:</h3>
            <ul style={listStyle} role="list">
              {outrasAgencias.map((text, i) => (
                <li key={i} style={itemStyle}>
                  <span style={iconNegativeStyle} aria-hidden>
                    <X size={18} strokeWidth={2.5} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={cardHighlightStyle}>
            <h3 style={cardTitleStyle}>Como é trabalhar com a Wefronti</h3>
            <ul style={listStyle} role="list">
              {wefronti.map((text, i) => (
                <li key={i} style={itemStyle}>
                  <span style={iconPositiveStyle} aria-hidden>
                    <CheckCircle2 size={22} />
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
            color: colors.text.primary,
            opacity: 0.92,
            maxWidth: 720,
          }}>
            {ctaFinal}
          </p>
          <ButtonCta label={botao} />
        </div>
      </div>
    </section>
  );
};

export default Comparison;
