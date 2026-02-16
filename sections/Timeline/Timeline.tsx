import React from 'react';
import { MessageCircle, ClipboardList, Code2, Rocket, Headphones } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

type StepIcon = React.ComponentType<{ size?: number; className?: string }>;

const TIMELINE_STEPS: { title: string; description: string; Icon: StepIcon }[] = [
  { title: 'Onboarding', description: 'Alinhamos expectativas, entendemos seu negócio e definimos o briefing do projeto.', Icon: MessageCircle },
  { title: 'Planejamento', description: 'Desenhamos a estratégia e arquitetura de conversão.', Icon: ClipboardList },
  { title: 'Desenvolvimento', description: 'Construção do site com as melhores práticas, performance e SEO em mente.', Icon: Code2 },
  { title: 'Lançamento', description: 'Colocamos tudo no ar, pronto para converter.', Icon: Rocket },
  { title: 'Suporte', description: 'Suporte pós-entrega e melhorias contínuas para o site gerar resultado.', Icon: Headphones },
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
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[12],
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[4]}px`,
  borderRadius: 6,
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

const DOT_SIZE = 14;
const DOT_ROW_HEIGHT = 14;
const LINE_TOP = DOT_ROW_HEIGHT / 2;

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
  borderTop: '2px dashed rgba(255,255,255,0.25)',
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
  backgroundColor: colors.blue.primary,
  boxShadow: `0 0 12px ${colors.blue.primary}`,
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
  color: colors.text.light,
  margin: 0,
  lineHeight: 1.3,
};

const stepIconStyle: React.CSSProperties = {
  flexShrink: 0,
  color: colors.blue.primary,
};

const stepDescStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  lineHeight: 1.55,
  color: colors.text.light,
  opacity: 0.88,
  margin: 0,
  maxWidth: stepContentMaxWidth,
};

const Timeline: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[6];

  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };

  if (!isMd) {
    return (
      <section id="processo" style={sectionStyle} aria-labelledby="timeline-heading">
        <div style={innerStyleBase}>
          <div style={{ ...headerStyle, paddingLeft: headerPaddingX, paddingRight: headerPaddingX }}>
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
              Processo
            </span>
            <h2 id="timeline-heading" style={titleStyle}>
              Do primeiro contato à entrega
            </h2>
          </div>
          <ul style={{ ...stepsGridStyle, gridTemplateColumns: '1fr', gap: spacing[8] }} role="list">
            {TIMELINE_STEPS.map((step, index) => {
              const Icon = step.Icon;
              return (
                <li key={index} style={stepColumnStyle}>
                  <div style={dotRowWrapperStyle}>
                    <span className="timeline-dot-pulse" style={dotStyle} aria-hidden />
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
      </section>
    );
  }

  return (
    <section id="processo" style={sectionStyle} aria-labelledby="timeline-heading">
      <div style={innerStyleBase}>
        <div style={{ ...headerStyle, paddingLeft: headerPaddingX, paddingRight: headerPaddingX }}>
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
            Processo
          </span>
          <h2 id="timeline-heading" style={titleStyle}>
            Do primeiro contato à entrega
          </h2>
        </div>

        <div style={timelineWrapStyle}>
          <div style={lineStyle} aria-hidden="true" />
          <ul style={stepsGridStyle} role="list">
            {TIMELINE_STEPS.map((step, index) => {
              const Icon = step.Icon;
              return (
                <li key={index} style={stepColumnStyle}>
                  <div style={dotRowWrapperStyle}>
                    <span className="timeline-dot-pulse" style={dotStyle} aria-hidden />
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
      </div>
    </section>
  );
};

export default Timeline;
