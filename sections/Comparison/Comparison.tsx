import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { X, CheckCircle2 } from 'lucide-react';
import ButtonCta from '../../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO } from '../../lib/whatsapp';
import SectionSparkles from '../../components/SectionSparkles';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const OUTRAS_AGENCIAS: string[] = [
  'Projeto que não sai do papel: Você paga e o freelancer some ou demora meses para entregar um rascunho.',
  'Site lento ou quebrado no celular: Entregam algo bonito no PDF, mas na prática não carrega ou não funciona em todos os dispositivos.',
  'Prazos que esticam sem fim: Prometem 2 semanas e viram 3 meses. Sua campanha ou lançamento fica parado.',
  'Site preso a eles: Você não tem acesso, não sabe onde está hospedado e depende deles para qualquer mudança.',
];

const WEFRONTI: string[] = [
  'Entrega no prazo: Definimos data no início. Site ou landing page no ar quando combinado.',
  'Transparência: Você acompanha o andamento e recebe o que foi acordado, sem surpresas.',
  'Design que converte: Layout profissional, responsivo e focado no que importa para o seu negócio.',
  'Seu site, seu domínio: Você recebe acessos e o site fica no seu nome. Sem mensalidade obrigatória nossa.',
];

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'transparent',
};

/** Imagem de fundo da seção */
const comparisonBgImageStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: 'url(/images/brand/background-hero.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
};

/** Gradiente: preto no topo e na base, meio da imagem visível */
const comparisonGradientOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(to bottom, ${colors.background.general} 0%, ${colors.background.general} 18%, transparent 38%, transparent 62%, ${colors.background.general} 82%, ${colors.background.general} 100%)`,
  zIndex: 1,
  pointerEvents: 'none',
};

const innerStyleBase: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
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
  fontSize: theme.sectionTitleFontSize,
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
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backgroundColor: 'rgba(24, 24, 27, 0.5)',
  backdropFilter: 'saturate(150%) blur(20px)',
  WebkitBackdropFilter: 'saturate(150%) blur(20px)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[5],
};

const cardHighlightStyle: React.CSSProperties = {
  ...cardStyle,
  borderColor: 'rgba(212, 105, 62, 0.4)',
  boxShadow: '0 0 32px rgba(212, 105, 62, 0.15), 0 4px 24px rgba(0, 0, 0, 0.2)',
  backgroundColor: 'rgba(24, 24, 27, 0.55)',
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
  background: 'rgba(212, 105, 62, 0.2)',
  color: colors.blue.primary,
};

interface ComparisonProps {
  conteudo?: Record<string, unknown>;
}

const Comparison: React.FC<ComparisonProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];

  const badge = (conteudo?.badge != null ? String(conteudo.badge) : '') || 'Diferenciais';
  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Por que escolher a Wefronti para o seu site?';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Sites e landing pages que ficam no ar, no prazo, no seu domínio. Sem enrolação, sem surpresa.';
  const outrasAgencias = (Array.isArray(conteudo?.outrasAgencias) ? (conteudo.outrasAgencias as string[]).map(String) : null) ?? OUTRAS_AGENCIAS;
  const wefronti = (Array.isArray(conteudo?.wefronti) ? (conteudo.wefronti as string[]).map(String) : null) ?? WEFRONTI;
  const tituloLines = titulo.split('\n');
  const ctaFinal = (conteudo?.ctaFinal != null ? String(conteudo.ctaFinal) : '') || 'Quer um site ou landing page que entregue de verdade? Vamos conversar.';
  const botao = (conteudo?.botao != null ? String(conteudo.botao) : '') || 'Pedir orçamento';

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
      <div style={comparisonBgImageStyle} aria-hidden />
      <div style={comparisonGradientOverlayStyle} aria-hidden />
      <SectionSparkles />
      <div style={innerStyleBase}>
        <div style={{
          ...headerStyle,
          paddingLeft: isMd ? headerPaddingX : 0,
          paddingRight: isMd ? headerPaddingX : 0,
          alignItems: isMd ? 'center' : 'flex-start',
        }}>
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
            <h3 style={cardTitleStyle}>Sem o Método LUNAR</h3>
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
            <h3 style={cardTitleStyle}>Com o Método LUNAR</h3>
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
          alignItems: isMd ? 'center' : 'stretch',
          gap: isMd ? spacing[6] : spacing[4],
          marginTop: isMd ? spacing[12] : spacing[8],
          textAlign: isMd ? 'center' : 'left',
          width: isMd ? undefined : '100%',
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
          <ButtonCta
            href={buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO)}
            external
            label={botao}
            fullWidthOnMobile={!isMd}
          />
        </div>
      </div>
    </section>
  );
};

export default Comparison;
