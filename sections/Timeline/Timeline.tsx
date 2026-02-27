import React, { useRef, useState, useLayoutEffect } from 'react';
import { MessageCircle, ClipboardList, Code2, Rocket, Headphones } from 'lucide-react';
import { radii, theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

type StepIcon = React.ComponentType<{ size?: number; className?: string }>;

const TIMELINE_STEPS: { title: string; description: string; Icon: StepIcon }[] = [
  { title: 'Onboarding', description: 'Começamos com imersão no seu cenário para entender metas, público e oportunidades. Assim, definimos a direção certa da solução desde o primeiro passo.', Icon: MessageCircle },
  { title: 'Planejamento', description: 'Estruturamos a solução com foco em resultado: páginas, fluxos, conteúdo e CTAs organizados para transformar tráfego em oportunidade real de negócio.', Icon: ClipboardList },
  { title: 'Desenvolvimento', description: 'Implementamos com tecnologia robusta, performance alta e SEO técnico, garantindo uma base sólida para escalar sua presença digital com segurança.', Icon: Code2 },
  { title: 'Lançamento', description: 'Publicamos com validação completa, ajustes finais e monitoramento inicial para que sua solução entre no ar pronta para performar desde o dia um.', Icon: Rocket },
  { title: 'Suporte', description: 'Após o lançamento, seguimos evoluindo com otimizações contínuas, melhorias orientadas por dados e suporte próximo para manter crescimento consistente.', Icon: Headphones },
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

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  lineHeight: 1.55,
  color: colors.text.primary,
  opacity: 0.88,
  margin: 0,
  textAlign: 'center',
  maxWidth: 820,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
};

const DOT_SIZE = 14;
const DOT_ROW_HEIGHT = 14;
const LINE_TOP = DOT_ROW_HEIGHT / 2;
const TIMELINE_DOT_SOLID = '#5C9369';

const timelineWrapStyle: React.CSSProperties = {
  position: 'relative' as const,
  width: '100vw',
  marginLeft: '50%',
  transform: 'translateX(-50%)',
  paddingTop: 0,
};

const lineStyle: React.CSSProperties = {
  position: 'absolute' as const,
  left: 0,
  right: 0,
  top: LINE_TOP,
  height: 0,
  borderTop: '2px dashed rgba(0,0,0,0.15)',
  pointerEvents: 'none',
};

const stepsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: spacing[6],
  maxWidth: 1280,
  margin: '0 auto',
  listStyle: 'none',
  padding: 0,
  position: 'relative' as const,
  zIndex: 1,
};

const stepColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: spacing[3],
};

const dotRowWrapperStyle: React.CSSProperties = {
  height: DOT_ROW_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const dotStyle: React.CSSProperties = {
  width: DOT_SIZE,
  height: DOT_SIZE,
  borderRadius: '50%',
  backgroundColor: TIMELINE_DOT_SOLID,
 
};

const stepContentMaxWidth = 320;

const stepTitleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing[2],
  flexWrap: 'wrap' as const,
  maxWidth: stepContentMaxWidth,
};

const stepTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
  lineHeight: 1.3,
};

const stepIconStyle: React.CSSProperties = {
  flexShrink: 0,
  color: colors.blue.primary,
  display: 'inline-flex',
  alignItems: 'center',
  marginTop: 2,
};

const stepDescStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  lineHeight: 1.55,
  color: colors.text.primary,
  opacity: 0.88,
  margin: 0,
  maxWidth: stepContentMaxWidth,
};

interface TimelineProps {
  conteudo?: Record<string, unknown>;
}

const Timeline: React.FC<TimelineProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];
  const mobileWrapRef = useRef<HTMLDivElement>(null);
  const firstDotRef = useRef<HTMLDivElement>(null);
  const lastDotRef = useRef<HTMLDivElement>(null);
  const [mobileLineBounds, setMobileLineBounds] = useState({ top: 0, height: 0 });

  const badge = (conteudo?.badge != null ? String(conteudo.badge) : '') || 'Processo';
  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Um processo sem surpresas, do início ao resultado';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Cada fase do nosso processo foi pensada para eliminar retrabalho, garantir qualidade e entregar um site que trabalha por você todos os dias.';
  const botao = (conteudo?.botao != null ? String(conteudo.botao) : '') || 'Quero um site que vende';
  const passos = Array.isArray(conteudo?.passos) ? (conteudo.passos as { titulo?: string; descricao?: string }[]) : null;
  const steps = passos && passos.length > 0
    ? passos.map((p, i) => ({
        title: ((p.titulo != null ? String(p.titulo) : '') || (TIMELINE_STEPS[i]?.title ?? '')),
        description: ((p.descricao != null ? String(p.descricao) : '') || (TIMELINE_STEPS[i]?.description ?? '')),
        Icon: TIMELINE_STEPS[i]?.Icon ?? (() => null),
      }))
    : TIMELINE_STEPS;

  useLayoutEffect(() => {
    if (isMd) return;
    const wrap = mobileWrapRef.current;
    const first = firstDotRef.current;
    if (!wrap || !first) return;
    const last = lastDotRef.current ?? first;
    const wrapRect = wrap.getBoundingClientRect();
    const firstRect = first.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();
    const firstCenterY = firstRect.top - wrapRect.top + firstRect.height / 2;
    const lastTopY = lastRect.top - wrapRect.top;
    setMobileLineBounds({ top: firstCenterY, height: Math.max(0, lastTopY - firstCenterY) });
  }, [isMd]);

  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };

  if (!isMd) {
    const lineLeft = 7;
    const mobileLineStyle: React.CSSProperties = {
      position: 'absolute' as const,
      left: lineLeft,
      top: mobileLineBounds.top,
      height: mobileLineBounds.height,
      width: 0,
      borderLeft: '2px dashed rgba(0,0,0,0.15)',
      pointerEvents: 'none',
      zIndex: 0,
    };
    const mobileWrapStyle: React.CSSProperties = {
      position: 'relative' as const,
      paddingLeft: 0,
    };
    const mobileStepRowStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing[3],
      marginBottom: spacing[10],
    };
    const mobileDotWrapStyle: React.CSSProperties = {
      ...dotRowWrapperStyle,
      marginTop: 2,
      position: 'relative' as const,
      zIndex: 1,
    };
    const mobileStepIconStyle: React.CSSProperties = {
      ...stepIconStyle,
      marginTop: 0,
    };
    const mobileStepContentStyle: React.CSSProperties = {
      flex: 1,
      minWidth: 0,
      textAlign: 'left',
    };
    const mobileTitleRowStyle: React.CSSProperties = {
      ...stepTitleRowStyle,
      justifyContent: 'flex-start',
    };
    return (
      <section id="processo" style={sectionStyle} aria-labelledby="timeline-heading">
        <div style={innerStyleBase}>
          <div style={{
            ...headerStyle,
            alignItems: 'center',
          }}>
            <span style={badgeStyle} aria-hidden>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: TIMELINE_DOT_SOLID,
                }}
              />
              {badge}
            </span>
            <div style={{ maxWidth: 820, display: 'flex', flexDirection: 'column', gap: spacing[4], alignItems: 'center' }}>
              <h2 id="timeline-heading" style={{ ...titleStyle, textAlign: 'center' }}>
                {titulo}
              </h2>
              <p style={{ ...subtitleStyle, textAlign: 'center' }}>
                {subtitulo}
              </p>
            </div>
          </div>
          <div ref={mobileWrapRef} style={mobileWrapStyle}>
            <div style={mobileLineStyle} aria-hidden="true" />
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} role="list">
              {steps.map((step, index) => {
                const Icon = step.Icon;
                const isFirst = index === 0;
                const isLast = index === steps.length - 1;
                return (
                  <li key={index} style={mobileStepRowStyle}>
                    <div ref={isFirst ? firstDotRef : isLast ? lastDotRef : undefined} style={mobileDotWrapStyle}>
                      <span style={dotStyle} aria-hidden />
                    </div>
                    <div style={mobileStepContentStyle}>
                      <div style={mobileTitleRowStyle}>
                        <span style={mobileStepIconStyle} aria-hidden><Icon size={18} /></span>
                        <h3 style={stepTitleStyle}>{step.title}</h3>
                      </div>
                      <p style={{ ...stepDescStyle, maxWidth: 'none' }}>{step.description}</p>
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
    <section id="processo" style={sectionStyle} aria-labelledby="timeline-heading">
      <div style={innerStyleBase}>
        <div style={headerStyle}>
          <span style={badgeStyle} aria-hidden>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: TIMELINE_DOT_SOLID,
              }}
            />
            {badge}
          </span>
          <div style={{ maxWidth: 820, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[4] }}>
            <h2 id="timeline-heading" style={titleStyle}>
              {titulo}
            </h2>
            <p style={subtitleStyle}>
              {subtitulo}
            </p>
          </div>
        </div>

        <div style={timelineWrapStyle}>
          <div style={lineStyle} aria-hidden="true" />
          <ul style={stepsGridStyle} role="list">
            {steps.map((step, index) => {
              const Icon = step.Icon;
              return (
                <li key={index} style={stepColumnStyle}>
                  <div style={dotRowWrapperStyle}>
                    <span style={dotStyle} aria-hidden />
                  </div>
                  <div style={stepTitleRowStyle}>
                    <span style={stepIconStyle} aria-hidden><Icon size={18} /></span>
                    <h3 style={stepTitleStyle}>{step.title}</h3>
                  </div>
                  <p style={stepDescStyle}>{step.description}</p>
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
