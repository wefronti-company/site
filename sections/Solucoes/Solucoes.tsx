import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Globe, Layout, MousePointer2, Package, Plug, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FiFigma } from 'react-icons/fi';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;
const LIVE_ACCENT = '#7ad49dAF';
const LIVE_ACCENT_SOLID = '#5C9369';
const LIVE_TEXT_MUTED = '#6BB58A';
const LIVE_SURFACE = '#F8FFFB';

const SOLUCOES: {
  titulo: string;
  descricao: string;
  Icon: LucideIcon;
  slug: string;
}[] = [
  {
    titulo: 'Desenvolvimento Web',
    descricao: 'Sites institucionais, landing pages e e-commerce. Desenvolvemos experiências rápidas, responsivas e otimizadas para converter visitantes em clientes.',
    Icon: Globe,
    slug: 'desenvolvimento-web',
  },
  {
    titulo: 'Softwares e sistemas',
    descricao: 'Sistemas sob medida, ERPs, CRMs e aplicações web para automatizar processos e escalar sua operação.',
    Icon: Layout,
    slug: 'softwares-e-sistemas',
  },
  {
    titulo: 'Micro-saas',
    descricao: 'Produtos digitais e software como serviço. Criamos soluções escaláveis para validar e monetizar sua ideia no mercado.',
    Icon: Package,
    slug: 'micro-saas',
  },
  {
    titulo: 'Design UI-UX',
    descricao: 'Interfaces intuitivas e experiências pensadas no usuário. Prototipação e design em Figma para produtos que encantam e convertem.',
    Icon: FiFigma as unknown as LucideIcon,
    slug: 'design-ui-ux',
  },
  {
    titulo: 'Integração e APIs',
    descricao: 'Conectamos seus sistemas, automações e fluxos de dados. APIs, webhooks e integrações para um ecossistema unificado.',
    Icon: Plug,
    slug: 'integracao-e-apis',
  },
  {
    titulo: 'Manutenção e suporte',
    descricao: 'Suporte contínuo, evolução de projetos e monitoramento. Seu sistema seguro, atualizado e performando no dia a dia.',
    Icon: Wrench,
    slug: 'manutencao-e-suporte',
  },
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

/** Palavra destacada no título: serif italic (mesmo estilo da Hero) */
const highlightWordStyle: React.CSSProperties = {
  color: '#5c9369AF',
};

function renderSolucoesTitle(text: string): React.ReactNode {
  const regex = /(soluções?)/gi;
  const parts = text.split(regex);
  return parts.map((part, i) =>
    /^soluções?$/i.test(part) ? (
      <span key={`h-${i}-${part}`} style={highlightWordStyle}>{part}</span>
    ) : (
      <React.Fragment key={`h-${i}`}>{part}</React.Fragment>
    )
  );
}

const introStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  lineHeight: 1.65,
  color: colors.text.primary,
  opacity: 0.88,
  margin: 0,
  textAlign: 'center',
  maxWidth: 900,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: spacing[6],
  width: '100%',
};

const cardStyle: React.CSSProperties = {
  borderRadius: 30,
  border: `1px solid ${colors.neutral.border}`,
  backgroundColor: colors.neutral.accordeon,
  padding: spacing[6],
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[8],
};

const liveBrowserStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: 16,
  border: `1px solid ${colors.neutral.border}`,
  background: colors.text.primary,
  backgroundClip: 'padding-box',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateRows: '24px minmax(0, 1fr)',
};

const liveBrowserTopStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 10px',
  borderBottom: '1px solid rgba(212, 232, 208, 0.24)',
  background: colors.text.primary,
};

const liveDotStyle: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#D1D5DB',
};

const liveBodyStyle: React.CSSProperties = {
  position: 'relative',
  padding: spacing[2],
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr) auto',
  gap: spacing[2],
  background: colors.text.primary,
};

const liveHeroBlockStyle: React.CSSProperties = {
  borderRadius: 10,
  background: `linear-gradient(120deg, ${LIVE_ACCENT} 0%, rgba(122,212,157,0.18) 100%)`,
  border: `1px solid ${LIVE_ACCENT}`,
  padding: '10px 12px',
  display: 'grid',
  gap: 6,
};

const liveSkeletonLineStyle = (width: string): React.CSSProperties => ({
  width,
  height: 6,
  borderRadius: 999,
  background: 'rgba(255, 255, 255, 0.2)',
});

const liveProductsRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[2],
};

const liveProductCardStyle: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${colors.neutral.border}`,
  background: LIVE_SURFACE,
  padding: spacing[2],
  display: 'grid',
  gap: 6,
};

const liveThumbStyle: React.CSSProperties = {
  width: '100%',
  height: 34,
  borderRadius: 6,
  background: LIVE_ACCENT,
};

const livePriceStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: LIVE_TEXT_MUTED,
  lineHeight: 1,
};

const liveCtaStyle: React.CSSProperties = {
  borderRadius: 999,
  border: `1px solid ${LIVE_ACCENT}`,
  background: 'rgba(122,212,157,0.2)',
  color: LIVE_TEXT_MUTED,
  fontSize: 9,
  fontWeight: 600,
  padding: '3px 8px',
  justifySelf: 'start',
};

const livePedidoBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  right: spacing[3],
  bottom: spacing[3],
  borderRadius: 999,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  color: LIVE_TEXT_MUTED,
  fontSize: 10,
  fontWeight: 600,
  padding: '4px 10px',
};

const liveWebHeroBlockStyle: React.CSSProperties = {
  borderRadius: 10,
  background: colors.text.primary,
  border: `1px solid ${LIVE_ACCENT}`,
  padding: '10px 12px',
  display: 'grid',
  gap: 6,
};

const liveWebProductCardStyle: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: spacing[2],
  display: 'grid',
  gap: 6,
};

const liveWebPriceStyle: React.CSSProperties = {
  ...livePriceStyle,
  color: LIVE_TEXT_MUTED,
};

const liveWebCtaStyle: React.CSSProperties = {
  ...liveCtaStyle,
  color: LIVE_TEXT_MUTED,
};

const liveWebPedidoBadgeStyle: React.CSSProperties = {
  ...livePedidoBadgeStyle,
  color: LIVE_TEXT_MUTED,
};

const liveSystemKpisStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: spacing[2],
};

const liveSystemKpiCardStyle: React.CSSProperties = {
  borderRadius: 8,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: '6px 8px',
  display: 'grid',
  gap: 4,
};

const liveSystemKpiValueStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: LIVE_TEXT_MUTED,
  lineHeight: 1,
};

const liveSystemChartStyle: React.CSSProperties = {
  height: 56,
  borderRadius: 10,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: '8px 10px',
  display: 'flex',
  alignItems: 'flex-end',
  gap: 6,
};

const liveSystemBarStyle: React.CSSProperties = {
  width: 10,
  borderRadius: 4,
  background: LIVE_ACCENT,
};

const liveSystemFlowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: 8,
};

const liveSystemNodeStyle: React.CSSProperties = {
  width: 16,
  height: 16,
  borderRadius: '50%',
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
};

const liveSystemFlowLineStyle: React.CSSProperties = {
  height: 2,
  borderRadius: 999,
  background: LIVE_ACCENT,
  transformOrigin: 'left center',
};

const liveApiHeaderStyle: React.CSSProperties = {
  borderRadius: 8,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: '6px 8px',
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  gap: spacing[2],
};

const liveApiPillStyle: React.CSSProperties = {
  borderRadius: 999,
  border: `1px solid ${LIVE_ACCENT}`,
  background: 'rgba(122,212,157,0.2)',
  color: LIVE_TEXT_MUTED,
  fontSize: 9,
  fontWeight: 600,
  padding: '2px 8px',
};

const liveApiFlowAreaStyle: React.CSSProperties = {
  position: 'relative',
  height: 86,
  borderRadius: 10,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  overflow: 'hidden',
};

const liveApiServiceCardStyle = (left: string, top: string, width: string): React.CSSProperties => ({
  position: 'absolute',
  left,
  top,
  width,
  borderRadius: 7,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: '4px 6px',
  display: 'grid',
  gap: 4,
});

const liveApiSystemCardStyle: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 64,
  borderRadius: 8,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: '5px 7px',
  display: 'grid',
  gap: 4,
};

const liveApiConnectorStyle = (left: string, top: string, width: string, rotateDeg: number): React.CSSProperties => ({
  position: 'absolute',
  left,
  top,
  width,
  height: 2,
  borderRadius: 999,
  background: LIVE_ACCENT,
  transform: `rotate(${rotateDeg}deg)`,
  transformOrigin: 'left center',
});

const liveApiPacketStyle = (left: string, top: string, rotateDeg: number): React.CSSProperties => ({
  position: 'absolute',
  left,
  top,
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: LIVE_TEXT_MUTED,
  boxShadow: `0 0 0 3px ${LIVE_ACCENT}`,
  transform: `rotate(${rotateDeg}deg)`,
  transformOrigin: 'left center',
});

const liveApiStatusRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  gap: spacing[2],
  minHeight: 22,
};

const liveSupportGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[2],
};

const liveSupportCardStyle: React.CSSProperties = {
  borderRadius: 8,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: '6px 8px',
  display: 'grid',
  gap: 4,
};

const liveSupportValueStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: LIVE_TEXT_MUTED,
  lineHeight: 1,
};

const liveSupportStatusListStyle: React.CSSProperties = {
  display: 'grid',
  gap: 6,
  borderRadius: 10,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: '8px 10px',
};

const liveSupportStatusRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: 6,
};

const liveSupportDotStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: LIVE_ACCENT,
  boxShadow: `0 0 0 4px ${LIVE_ACCENT}`,
};

const liveSaasPlansRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[2],
};

const liveSaasPlanCardStyle: React.CSSProperties = {
  borderRadius: 8,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: '6px 8px',
  display: 'grid',
  gap: 4,
};

const liveSaasMrrStyle: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: '8px 10px',
  display: 'grid',
  gap: 6,
};

const liveSaasValueStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: LIVE_TEXT_MUTED,
  lineHeight: 1,
};

const liveSaasSparklineWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: 4,
  height: 34,
};

const liveSaasSparkStyle: React.CSSProperties = {
  width: 6,
  borderRadius: 999,
  background: LIVE_ACCENT,
};

const liveFigmaBoardStyle: React.CSSProperties = {
  position: 'relative',
  height: 88,
  borderRadius: 10,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  overflow: 'hidden',
};

const liveFigmaFrameStyle = (left: string, top: string, w: string, h: string): React.CSSProperties => ({
  position: 'absolute',
  left,
  top,
  width: w,
  height: h,
  borderRadius: 8,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  padding: 6,
  display: 'grid',
  gap: 4,
});

const liveFigmaNodeStyle = (left: string, top: string): React.CSSProperties => ({
  position: 'absolute',
  left,
  top,
  width: 10,
  height: 10,
  borderRadius: '50%',
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
});

const liveFigmaDraggableStyle: React.CSSProperties = {
  position: 'absolute',
  left: 78,
  top: 56,
  minWidth: 44,
  borderRadius: 6,
  border: `1px solid ${LIVE_ACCENT}`,
  background: colors.text.primary,
  color: LIVE_TEXT_MUTED,
  fontSize: 9,
  fontWeight: 600,
  padding: '3px 8px',
  lineHeight: 1,
};

const liveFigmaCursorStyle: React.CSSProperties = {
  position: 'absolute',
  left: 70,
  top: 66,
  color: LIVE_TEXT_MUTED,
  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.12))',
};

const iconWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: radii.full,
  border: `1px solid ${colors.neutral.border}`,
  background: colors.neutral.borderLight,
  flexShrink: 0,
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.xl,
  fontWeight: 400,
  color: colors.text.primary,
  margin: 0,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.6,
  color: colors.text.secondary,
  margin: 0,
  flex: 1,
};

interface SolucoesProps {
  conteudo?: Record<string, unknown>;
}

const Solucoes: React.FC<SolucoesProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const sectionPaddingX = isMd ? spacing[12] : spacing[4];

  const badge = (conteudo?.badge != null ? String(conteudo.badge) : '') || 'Soluções';
  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Nossas soluções';
  const intro = (conteudo?.intro != null ? String(conteudo.intro) : '') || 'Desenvolvimento web, softwares, design, integração e suporte. Tudo o que sua empresa precisa para crescer no digital.';

  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: sectionPaddingX,
    paddingRight: sectionPaddingX,
  };

  const gridLayout: React.CSSProperties = isMd
    ? { ...gridStyle, gridTemplateColumns: 'repeat(3, 1fr)' }
    : { ...gridStyle, gridTemplateColumns: '1fr' };

  const renderCardVisual = (slug: string, titulo: string) => {
    if (slug === 'softwares-e-sistemas') {
      return (
        <motion.div
          style={liveBrowserStyle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={liveBrowserTopStyle}>
              <span style={liveDotStyle} />
              <span style={liveDotStyle} />
              <span style={liveDotStyle} />
            </div>
            <div style={liveBodyStyle}>
              <div style={liveSystemKpisStyle}>
                <div style={liveSystemKpiCardStyle}>
                  <div style={liveSkeletonLineStyle('65%')} />
                  <motion.span
                    style={liveSystemKpiValueStyle}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    +28%
                  </motion.span>
                </div>
                <div style={liveSystemKpiCardStyle}>
                  <div style={liveSkeletonLineStyle('58%')} />
                  <motion.span
                    style={liveSystemKpiValueStyle}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  >
                    132
                  </motion.span>
                </div>
                <div style={liveSystemKpiCardStyle}>
                  <div style={liveSkeletonLineStyle('52%')} />
                  <motion.span
                    style={liveSystemKpiValueStyle}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  >
                    99.9%
                  </motion.span>
                </div>
              </div>
              <div style={liveSystemChartStyle}>
                {[22, 30, 18, 38, 28, 46, 36].map((bar, idx) => (
                  <motion.div
                    key={`bar-${idx}`}
                    style={{ ...liveSystemBarStyle, height: bar }}
                    animate={{ height: [bar - 6, bar + 4, bar - 2, bar] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.08 }}
                  />
                ))}
              </div>
              <div style={liveSystemFlowStyle}>
                <span style={liveSystemNodeStyle} />
                <motion.span
                  style={liveSystemFlowLineStyle}
                  animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span style={liveSystemNodeStyle} />
              </div>
            </div>
        </motion.div>
      );
    }

    if (slug === 'micro-saas') {
      return (
        <motion.div
          style={liveBrowserStyle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={liveBrowserTopStyle}>
              <span style={liveDotStyle} />
              <span style={liveDotStyle} />
              <span style={liveDotStyle} />
            </div>
            <div style={liveBodyStyle}>
              <div style={liveSaasPlansRowStyle}>
                <div style={liveSaasPlanCardStyle}>
                  <div style={liveSkeletonLineStyle('64%')} />
                  <motion.span
                    style={liveApiPillStyle}
                    animate={{ opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Basic
                  </motion.span>
                </div>
                <div style={liveSaasPlanCardStyle}>
                  <div style={liveSkeletonLineStyle('58%')} />
                  <motion.span
                    style={liveApiPillStyle}
                    animate={{ opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  >
                    Pro
                  </motion.span>
                </div>
              </div>
              <div style={liveSaasMrrStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 8 }}>
                  <div style={liveSkeletonLineStyle('48%')} />
                  <motion.span
                    style={liveSaasValueStyle}
                    animate={{ opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    R$ 12.4k
                  </motion.span>
                </div>
                <div style={liveSaasSparklineWrapStyle}>
                  {[10, 14, 12, 17, 16, 22, 20].map((h, idx) => (
                    <motion.span
                      key={`spark-${idx}`}
                      style={{ ...liveSaasSparkStyle, height: h }}
                      animate={{ height: [h - 3, h + 3, h] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.09 }}
                    />
                  ))}
                </div>
              </div>
              <motion.div
                style={livePedidoBadgeStyle}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                +3 assinaturas
              </motion.div>
            </div>
        </motion.div>
      );
    }

    if (slug === 'design-ui-ux') {
      return (
        <motion.div
          style={liveBrowserStyle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={liveBrowserTopStyle}>
              <span style={liveDotStyle} />
              <span style={liveDotStyle} />
              <span style={liveDotStyle} />
            </div>
            <div style={liveBodyStyle}>
              <div style={liveApiHeaderStyle}>
                <div style={liveSkeletonLineStyle('60%')} />
                <span style={liveApiPillStyle}>Figma</span>
              </div>
              <div style={liveFigmaBoardStyle}>
                <div style={liveFigmaFrameStyle('8px', '10px', '64px', '76px')}>
                  <div style={liveSkeletonLineStyle('80%')} />
                  <div style={liveSkeletonLineStyle('62%')} />
                  <div style={{ ...liveThumbStyle, height: 26 }} />
                </div>
                <div style={liveFigmaFrameStyle('130px', '16px', '64px', '66px')}>
                  <div style={liveSkeletonLineStyle('72%')} />
                  <div style={{ ...liveThumbStyle, height: 30 }} />
                </div>
                <span style={liveFigmaNodeStyle('70px', '42px')} />
                <span style={liveFigmaNodeStyle('124px', '42px')} />
                <motion.span
                  style={liveFigmaDraggableStyle}
                  animate={{ x: [0, 22, 46, 22, 0], y: [0, -8, -14, -8, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  mover
                </motion.span>
                <motion.span
                  style={liveFigmaCursorStyle}
                  animate={{ x: [0, 22, 46, 22, 0], y: [0, -8, -14, -8, 0], rotate: [0, -2, -4, -2, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden
                >
                  <MousePointer2 size={14} strokeWidth={2.2} />
                </motion.span>
              </div>
              <div style={liveApiStatusRowStyle}>
                <div style={liveSkeletonLineStyle('52%')} />
                <motion.span
                  style={liveApiPillStyle}
                  animate={{ opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Design UI/UX
                </motion.span>
              </div>
            </div>            
        </motion.div>
      );
    }

    if (slug === 'manutencao-e-suporte') {
      return (
        <motion.div
          style={liveBrowserStyle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={liveBrowserTopStyle}>
              <span style={liveDotStyle} />
              <span style={liveDotStyle} />
              <span style={liveDotStyle} />
            </div>
            <div style={liveBodyStyle}>
              <div style={liveSupportGridStyle}>
                <div style={liveSupportCardStyle}>
                  <div style={liveSkeletonLineStyle('62%')} />
                  <motion.span
                    style={liveSupportValueStyle}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    99.98%
                  </motion.span>
                </div>
                <div style={liveSupportCardStyle}>
                  <div style={liveSkeletonLineStyle('56%')} />
                  <motion.span
                    style={liveSupportValueStyle}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  >
                    0 críticos
                  </motion.span>
                </div>
              </div>
              <div style={liveSupportStatusListStyle}>
                {['API gateway', 'Banco principal', 'Checkout'].map((service, idx) => (
                  <div key={service} style={liveSupportStatusRowStyle}>
                    <motion.span
                      style={liveSupportDotStyle}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }}
                    />
                    <span style={{ ...liveSkeletonLineStyle('72%'), width: '100%' }}>{/* placeholder */}</span>
                    <motion.span
                      style={liveApiPillStyle}
                      animate={{ opacity: [0.75, 1, 0.75] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }}
                    >
                      OK
                    </motion.span>
                  </div>
                ))}
              </div>
              <motion.div
                style={livePedidoBadgeStyle}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
              >
                +7 alertas resolvidos
              </motion.div>
            </div>
        </motion.div>
      );
    }

    if (slug === 'integracao-e-apis') {
      return (
        <motion.div
          style={liveBrowserStyle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={liveBrowserTopStyle}>
              <span style={liveDotStyle} />
              <span style={liveDotStyle} />
              <span style={liveDotStyle} />
            </div>
            <div style={liveBodyStyle}>
              <div style={liveApiHeaderStyle}>
                <div style={liveSkeletonLineStyle('68%')} />
                <span style={liveApiPillStyle}>API</span>
              </div>
              <div style={liveApiFlowAreaStyle}>
                <div style={liveApiServiceCardStyle('8px', '12px', '52px')}>
                  <div style={liveSkeletonLineStyle('78%')} />
                  <div style={liveSkeletonLineStyle('58%')} />
                </div>
                <div style={liveApiSystemCardStyle}>
                  <div style={liveSkeletonLineStyle('62%')} />
                  <div style={{ ...liveThumbStyle, height: 14 }} />
                </div>
                <div style={liveApiServiceCardStyle('140px', '10px', '52px')}>
                  <div style={liveSkeletonLineStyle('74%')} />
                  <div style={liveSkeletonLineStyle('52%')} />
                </div>
                <div style={liveApiServiceCardStyle('140px', '56px', '52px')}>
                  <div style={liveSkeletonLineStyle('70%')} />
                  <div style={liveSkeletonLineStyle('50%')} />
                </div>
                <motion.span
                  style={liveApiConnectorStyle('60px', '31px', '45px', -8)}
                  animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.span
                  style={liveApiConnectorStyle('108px', '34px', '32px', -12)}
                  animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                />
                <motion.span
                  style={liveApiConnectorStyle('108px', '57px', '32px', 14)}
                  animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
                />
                <motion.span
                  style={liveApiPacketStyle('66px', '28px', -8)}
                  animate={{ x: [0, 26, 40], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.span
                  style={liveApiPacketStyle('106px', '31px', -12)}
                  animate={{ x: [0, 22, 30], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
                />
                <motion.span
                  style={liveApiPacketStyle('106px', '54px', 14)}
                  animate={{ x: [0, 22, 30], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
                />
                <motion.span
                  style={{ ...liveApiPillStyle, position: 'absolute', left: 75, top: 70 }}
                  animate={{ opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Conectado
                </motion.span>
              </div>
              <div style={liveApiStatusRowStyle}>
                <div style={liveSkeletonLineStyle('56%')} />
                <motion.span
                  style={liveApiPillStyle}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Online
                </motion.span>
              </div>
            </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        style={liveBrowserStyle}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={liveBrowserTopStyle}>
          <span style={liveDotStyle} />
          <span style={liveDotStyle} />
          <span style={liveDotStyle} />
        </div>
        <div style={liveBodyStyle}>
          <div style={liveWebHeroBlockStyle}>
            <div style={liveSkeletonLineStyle('72%')} />
            <div style={liveSkeletonLineStyle('48%')} />
            <motion.div
              style={liveWebCtaStyle}
              animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              Comprar
            </motion.div>
          </div>
          <div style={liveProductsRowStyle}>
            <div style={liveWebProductCardStyle}>
              <div style={liveThumbStyle} />
              <div style={liveSkeletonLineStyle('78%')} />
              <motion.span
                style={liveWebPriceStyle}
                animate={{ opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                R$ 149
              </motion.span>
            </div>
            <div style={liveWebProductCardStyle}>
              <div style={liveThumbStyle} />
              <div style={liveSkeletonLineStyle('64%')} />
              <motion.span
                style={liveWebPriceStyle}
                animate={{ opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              >
                R$ 239
              </motion.span>
            </div>
          </div>
          <motion.div
            style={liveWebPedidoBadgeStyle}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            +1 pedido
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="solucoes" style={sectionStyle} aria-labelledby="solucoes-heading">
      <div style={innerStyleBase}>
        <div style={headerStyle}>
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[4] }}>
            <h2 id="solucoes-heading" style={titleStyle}>
              {renderSolucoesTitle(titulo)}
            </h2>
            <p style={introStyle}>{intro}</p>
          </div>
        </div>

        <div style={gridLayout}>
          {SOLUCOES.map((item) => (
            <div key={item.slug} style={cardStyle}>
              {renderCardVisual(item.slug, item.titulo)}
              <div style={cardHeaderStyle}>
                <div style={iconWrapStyle}>
                  <item.Icon size={24} color="#059669" strokeWidth={1.8} />
                </div>
                <h3 style={cardTitleStyle}>{item.titulo}</h3>
              </div>
              <p style={cardDescStyle}>{item.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solucoes;
