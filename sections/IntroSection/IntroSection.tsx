import React from 'react';
import { X } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO } from '../../lib/whatsapp';
import SectionSparkles from '../../components/SectionSparkles';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

/** Respiro entre Hero e Método: padding vertical generoso */
const SECTION_PADDING_V = 120;

const sectionStyle: React.CSSProperties = {
  width: '100%',
  paddingTop: SECTION_PADDING_V,
  paddingBottom: SECTION_PADDING_V,
  backgroundColor: colors.background.general,
  position: 'relative',
  overflow: 'hidden',
};

/** Imagem de fundo: alinhada à direita, dimensão ajustada para não dominar com o CTA em largura total */
const bgImageStyle: React.CSSProperties = {
  position: 'absolute',
  top: SECTION_PADDING_V,
  right: 0,
  bottom: SECTION_PADDING_V,
  width: '52%',
  maxWidth: 720,
  backgroundImage: 'url(/images/brand/background-intro.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  zIndex: 0,
};

/** Gradientes na mesma faixa da imagem: superior, inferior e lateral esquerda — transição suave */
const bgGradientStyle: React.CSSProperties = {
  position: 'absolute',
  top: SECTION_PADDING_V,
  right: 0,
  bottom: SECTION_PADDING_V,
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
  fontSize: theme.sectionTitleFontSize,
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

/** Destaque do título intro: brilho fixo (cor do botão), peso 400 */
const headingHighlightStyle: React.CSSProperties = {
  color: colors.blue.brillho,
  fontWeight: 400,
};

/** Wrapper dos problemas: largura acompanha o texto */
const problemsWrapStyle: React.CSSProperties = {
  width: 'fit-content',
  maxWidth: '100%',
};

const problemListStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
};

/** Card com efeito vidro desfocado para cada problema */
const problemGlassCardStyle: React.CSSProperties = {
  padding: spacing[4],
  borderRadius: 12,
  border: `1px solid rgba(255, 255, 255, 0.08)`,
  backgroundColor: 'rgba(24, 24, 27, 0.5)',
  backdropFilter: 'saturate(150%) blur(16px)',
  WebkitBackdropFilter: 'saturate(150%) blur(16px)',
  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.2)',
};

const problemItemRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: spacing[3],
};

/** Ícone X negativo (ativa o emocional do lead) */
const problemIconStyle: React.CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: '50%',
  background: 'rgba(239, 68, 68, 0.18)',
  color: 'rgba(239, 68, 68, 0.95)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: 2,
};

const problemItemStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.6,
  color: colors.text.secondary,
  margin: 0,
};

const subheadingStyle: React.CSSProperties = {
  fontSize: fontSizes.xl,
  fontWeight: 400,
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

/** Banner CTA: largura total, efeito vidro, copy à esquerda e botão à direita */
const ctaBannerStyle: React.CSSProperties = {
  gridColumn: '1 / -1',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing[6],
  flexWrap: 'wrap',
  padding: spacing[5],
  borderRadius: 12,
  border: '1px solid rgba(255, 255, 255, 0.08)',
  backgroundColor: 'rgba(24, 24, 27, 0.5)',
  backdropFilter: 'saturate(150%) blur(16px)',
  WebkitBackdropFilter: 'saturate(150%) blur(16px)',
  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.2)',
};

const ctaBannerCopyStyle: React.CSSProperties = {
  flex: '1 1 280px',
  fontSize: fontSizes.base,
  lineHeight: 1.5,
  color: colors.text.primary,
  margin: 0,
};

/** Dores de empresas sem site profissional ou com site que não converte */
const PROBLEMS: { text: string; highlight: string; suffix: string }[] = [
  { text: 'Combustível jogado fora: Você investe em anúncios, o visitante chega na página, mas a jornada termina ali. Cliques que não viram vendas são como combustível queimado sem ', highlight: 'sair da plataforma de lançamento', suffix: '.' },
  { text: 'Ruído na comunicação: Um layout amador transmite insegurança. Se o seu site não passa confiança imediata, o cliente aborta a missão e busca abrigo no concorrente. Credibilidade é o ', highlight: 'seu suporte de vida online', suffix: '.' },
  { text: 'Deriva digital:Sem um site estratégico, sua empresa é um satélite desligado: ninguém encontra, ninguém vê. ', highlight: 'Enquanto você flutua sem rumo, ', suffix: '.' },
];

interface IntroSectionProps {
  conteudo?: Record<string, unknown>;
}

const IntroSection: React.FC<IntroSectionProps> = ({ conteudo }) => {                                                                                                                       
  const isMd = useMediaQuery(theme.breakpoints.md);

  const heading = (conteudo?.heading != null ? String(conteudo.heading) : '') || 'Sua empresa merece um site ';
  const headingHighlight = (conteudo?.headingHighlight != null ? String(conteudo.headingHighlight) : '') || 'que venda de verdade';
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
      <SectionSparkles />
      <div style={gridLayout}>
        <div style={leftColumnStyle}>
          <h2 id="intro-heading" style={headingStyle}>
            {heading}
            <span style={headingHighlightStyle}>{headingHighlight}</span>
          </h2>

          <div style={problemsWrapStyle}>
            <ul style={problemListStyle} role="list">
              {problems.map((item, i) => (
                <li key={i}>
                  <div style={problemGlassCardStyle}>
                    <div style={problemItemRowStyle}>
                      <span style={problemIconStyle} aria-hidden>
                        <X size={14} strokeWidth={2.5} />
                      </span>
                      <p style={problemItemStyle}>
                        {(() => {
                          const text = item.text ?? '';
                          const highlight = item.highlight ?? '';
                          const suffix = item.suffix ?? '';
                          const highlightStyle = { color: colors.text.secondary, fontWeight: 400 as const };

                          const beforeColon = (s: string) => {
                            const idx = s.indexOf(':');
                            if (idx >= 0) return [s.slice(0, idx + 1), s.slice(idx + 1)] as const;
                            return [null, s] as const;
                          };

                          const [textBold, textRest] = beforeColon(text);
                          const [highlightBold, highlightRest] = beforeColon(highlight);

                          return (
                            <>
                              {textBold != null ? <strong>{textBold}</strong> : null}
                              {textRest}
                              <span style={highlightStyle}>
                                {highlightBold != null ? <strong>{highlightBold}</strong> : null}
                                {highlightRest}
                              </span>
                              {suffix}
                            </>
                          );
                        })()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ ...rightColumnStyle, display: isMd ? 'block' : 'none' }} aria-hidden />

        <div style={{
          ...ctaBannerStyle,
          flexDirection: isMd ? 'row' : 'column',
          alignItems: isMd ? 'center' : 'stretch',
          gap: isMd ? spacing[6] : spacing[4],
        }}>
          <p style={{ ...ctaBannerCopyStyle, flex: isMd ? '1 1 280px' : '0 0 auto' }}>
          Sites e landing pages para empresas que querem decolar. Com o Método LUNAR, aplicamos engenharia de conversão e design de alto impacto para sua marca vender mais online.
          </p>
          <ButtonCta
            href={buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO)}
            external
            label="Pedir orçamento"
            fullWidthOnMobile={!isMd}
          />
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
