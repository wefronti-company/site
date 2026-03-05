import React from 'react';
import { MapPin, Layers, PenLine, Gauge, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii } = theme;


/** Método LUNAR: 5 passos com título, subtítulo e descrição. */
const LUNAR_STEPS: { letter: string; title: string; subtitle: string; description: string; Icon: LucideIcon }[] = [
  { letter: 'L', title: 'Localização de Alvo', subtitle: 'Mapeamento', description: 'Antes da ignição, identificamos as coordenadas do seu cliente ideal. Onde eles estão? O que eles desejam? Escolhemos o "local de pouso" onde sua oferta terá menos resistência.', Icon: MapPin },
  { letter: 'U', title: 'Unidade de Comando', subtitle: 'UX & Estrutura', description: 'Desenhamos a interface de controle. É a arquitetura da página que garante que o visitante saiba exatamente o que fazer, sem distrações, guiado pela nossa tecnologia.', Icon: Layers },
  { letter: 'N', title: 'Núcleo de Persuasão', subtitle: 'Copywriting', description: 'Aqui instalamos o motor da nave. Criamos a narrativa e os gatilhos mentais que transformam um visitante curioso em um cliente decidido a fechar com você.', Icon: PenLine },
  { letter: 'A', title: 'Ajuste de Pressão', subtitle: 'Performance & Design', description: 'Lapidamos a estética e a velocidade. Garantimos que a página seja visualmente imponente e carregue instantaneamente, suportando qualquer volume de tráfego.', Icon: Gauge },
  { letter: 'R', title: 'Reentrada e Escala', subtitle: 'Otimização', description: 'Após o pouso (lançamento), monitoramos os sinais. Analisamos os dados de conversão para ajustar a rota e garantir que você escale seus resultados com segurança.', Icon: TrendingUp },
];

const sectionStyleBase: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  backgroundColor: colors.background.general,
  overflow: 'hidden',
};

/** Imagem de fundo da seção Método */
const metodoBgImageStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: 'url(/images/brand/background-metodo.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
};

/** Gradiente: preto no topo e na base, meio da imagem 100% visível */
const metodoGradientOverlayStyle: React.CSSProperties = {
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
  maxWidth: 1440,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[12],
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

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  lineHeight: 1.55,
  color: colors.text.primary,
  opacity: 0.88,
  margin: 0,
  textAlign: 'center',
  maxWidth: 960,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
};

const stepsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gridAutoRows: '1fr',
  alignItems: 'stretch',
  gap: spacing[6],
  maxWidth: 1440,
  margin: '0 auto',
  listStyle: 'none',
  padding: 0,
  position: 'relative' as const,
  zIndex: 1,
};

/** Card com efeito vidro (glass) para cada passo do LUNAR */
const cardGlassStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  gap: spacing[3],
  padding: spacing[6],
  borderRadius: radii.md + 8,
  border: '1px solid rgba(255, 255, 255, 0.22)',
  backgroundColor: 'rgba(24, 24, 27, 0.5)',
  backdropFilter: 'saturate(150%) blur(20px)',
  WebkitBackdropFilter: 'saturate(150%) blur(20px)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
  minHeight: 180,
  flex: 1,
  width: '100%',
  boxSizing: 'border-box',
};

const cardTitleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  flexWrap: 'wrap',
};

const cardIconWrapStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: colors.blue.primary,
  color: '#fff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.xl,
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
  lineHeight: 1.3,
};

const cardSubtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.blue.primary,
  margin: 0,
  lineHeight: 1.3,
  opacity: 0.95,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  lineHeight: 1.55,
  color: colors.text.primary,
  opacity: 0.9,
  margin: 0,
};

interface TimelineProps {
  conteudo?: Record<string, unknown>;
}

const Timeline: React.FC<TimelineProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];

  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Método LUNAR';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Da localização do seu cliente ideal ao pouso e à escala: uma metodologia em 5 fases para levar sua oferta ao destino certo.';
  const botao = (conteudo?.botao != null ? String(conteudo.botao) : '') || 'Pedir orçamento';
  const passos = Array.isArray(conteudo?.passos) ? (conteudo.passos as { letra?: string; titulo?: string; subtitulo?: string; descricao?: string }[]) : null;
  const steps =
    passos && passos.length >= 5
      ? passos.slice(0, 5).map((p, i) => ({
          letter: (p.letra != null ? String(p.letra) : '') || LUNAR_STEPS[i].letter,
          title: (p.titulo != null ? String(p.titulo) : '') || LUNAR_STEPS[i].title,
          subtitle: (p.subtitulo != null ? String(p.subtitulo) : '') || LUNAR_STEPS[i].subtitle,
          description: (p.descricao != null ? String(p.descricao) : '') || LUNAR_STEPS[i].description,
          Icon: LUNAR_STEPS[i].Icon,
        }))
      : LUNAR_STEPS;

  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };

  if (!isMd) {
    const mobileWrapStyle: React.CSSProperties = {
      position: 'relative' as const,
      paddingLeft: 0,
    };
    const mobileStepRowStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[4],
      marginBottom: spacing[10],
    };
    return (
      <section id="metodocore" style={sectionStyle} aria-labelledby="timeline-heading">
        <div style={metodoBgImageStyle} aria-hidden />
        <div style={metodoGradientOverlayStyle} aria-hidden />
        <div style={innerStyleBase}>
          <div
            style={{
              ...headerStyle,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: 960,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[4],
                alignItems: 'flex-start',
              }}
            >
              <h2 id="timeline-heading" style={{ ...titleStyle, textAlign: 'left' }}>
                {titulo}
              </h2>
              <p style={{ ...subtitleStyle, textAlign: 'left' }}>
                {subtitulo}
              </p>
            </div>
          </div>
          <div style={mobileWrapStyle}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} role="list">
              {steps.map((step, index) => {
                const IconComponent = step.Icon;
                return (
                  <li key={index} style={mobileStepRowStyle}>
                    <div style={{ ...cardGlassStyle, minHeight: 'auto' }}>
                      <div style={cardTitleRowStyle}>
                        <span style={cardIconWrapStyle} aria-hidden>
                          <IconComponent size={22} strokeWidth={2} />
                        </span>
                        <div>
                          <h3 style={cardTitleStyle}>{step.title}</h3>
                          {step.subtitle ? <p style={cardSubtitleStyle}>{step.subtitle}</p> : null}
                        </div>
                      </div>
                      <p style={cardDescStyle}>{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: isMd ? spacing[12] : spacing[6] }}>
            <ButtonCta label={botao} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="metodocore" style={sectionStyle} aria-labelledby="timeline-heading">
      <div style={metodoBgImageStyle} aria-hidden />
      <div style={metodoGradientOverlayStyle} aria-hidden />
      <div style={innerStyleBase}>
        <div
          style={{
            ...headerStyle,
            alignItems: isMd ? 'center' : 'flex-start',
          }}
        >
          <div
            style={{
              maxWidth: 960,
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMd ? 'center' : 'flex-start',
              gap: spacing[4],
            }}
          >
            <h2
              id="timeline-heading"
              style={{ ...titleStyle, textAlign: isMd ? 'center' : 'left' }}
            >
              {titulo}
            </h2>
            <p
              style={{
                ...subtitleStyle,
                textAlign: isMd ? 'center' : 'left',
              }}
            >
              {subtitulo}
            </p>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%' }}>
          <ul style={stepsGridStyle} role="list">
            {steps.map((step, index) => {
              const IconComponent = step.Icon;
              return (
                <li key={index} style={{ display: 'flex', minHeight: 0 }}>
                  <div style={cardGlassStyle}>
                    <div style={cardTitleRowStyle}>
                      <span style={cardIconWrapStyle} aria-hidden>
                        <IconComponent size={22} strokeWidth={2} />
                      </span>
                      <div>
                        <h3 style={cardTitleStyle}>{step.title}</h3>
                        {step.subtitle ? <p style={cardSubtitleStyle}>{step.subtitle}</p> : null}
                      </div>
                    </div>
                    <p style={cardDescStyle}>{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: isMd ? spacing[12] : spacing[6] }}>
          <ButtonCta label={botao} />
        </div>
      </div>
    </section>
  );
};

export default Timeline;
