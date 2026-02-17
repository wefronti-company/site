import React, { useRef, useState, useLayoutEffect } from 'react';
import { MessageCircle, ClipboardList, Code2, Rocket, Headphones } from 'lucide-react';
import { radii, theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

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
  display: 'inline-flex',
  alignItems: 'center',
  marginTop: 2,
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
  const headerPaddingX = isMd ? spacing[12] : spacing[4];
  const mobileWrapRef = useRef<HTMLDivElement>(null);
  const firstDotRef = useRef<HTMLDivElement>(null);
  const lastDotRef = useRef<HTMLDivElement>(null);
  const [mobileLineBounds, setMobileLineBounds] = useState({ top: 0, height: 0 });

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
      borderLeft: '2px dashed rgba(255,255,255,0.25)',
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
            paddingLeft: isMd ? headerPaddingX : 0,
            paddingRight: isMd ? headerPaddingX : 0,
            alignItems: 'flex-start',
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
              Processo
            </span>
            <h2 id="timeline-heading" style={{ ...titleStyle, textAlign: 'left' }}>
              Do primeiro contato à entrega
            </h2>
          </div>
          <div ref={mobileWrapRef} style={mobileWrapStyle}>
            <div style={mobileLineStyle} aria-hidden="true" />
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} role="list">
              {TIMELINE_STEPS.map((step, index) => {
                const Icon = step.Icon;
                const isFirst = index === 0;
                const isLast = index === TIMELINE_STEPS.length - 1;
                return (
                  <li key={index} style={mobileStepRowStyle}>
                    <div ref={isFirst ? firstDotRef : isLast ? lastDotRef : undefined} style={mobileDotWrapStyle}>
                      <span className="timeline-dot-pulse" style={dotStyle} aria-hidden />
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
            <ButtonCta label="Solicitar orçamento" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="processo" style={sectionStyle} aria-labelledby="timeline-heading">
      <div style={innerStyleBase}>
        <div style={{ ...headerStyle, paddingLeft: isMd ? headerPaddingX : 0, paddingRight: isMd ? headerPaddingX : 0 }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: isMd ? spacing[12] : spacing[6] }}>
          <ButtonCta label="Solicitar orçamento" />
        </div>
      </div>
    </section>
  );
};

export default Timeline;
