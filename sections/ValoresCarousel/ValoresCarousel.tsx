import React from 'react';
import { theme } from '../../styles/theme';
import {
  Eye,
  ShieldCheck,
  Target,
  CalendarCheck,
  Headphones,
  Award,
  Handshake,
  Sparkles,
  Lock,
  CheckCircle2,
  Heart,
  Scale,
  Zap,
  Gauge,
  MessageSquare,
  Globe,
  Focus,
  FolderOpen,
  Package,
  ClipboardCheck,
  LifeBuoy,
  Calendar,
  MousePointerClick,
  HeartHandshake,
  Cpu,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const { colors, spacing, fontSizes, radii } = theme;

/** Valores alinhados ao posicionamento: propulsão, decolagem, Método Lunar, engenharia de conversão */
const VALORES: { label: string; Icon: LucideIcon }[] = [
  { label: 'Engenharia de conversão', Icon: Cpu },
  { label: 'Design de alto impacto', Icon: Sparkles },
  { label: 'Rota estratégica', Icon: Target },
  { label: 'Prazo garantido', Icon: CalendarCheck },
  { label: 'Alta performance', Icon: Zap },
  { label: 'Transparência', Icon: Eye },
  { label: 'Parceria de longo prazo', Icon: Handshake },
  { label: 'Método Lunar', Icon: Globe },
  { label: 'Sites que convertem', Icon: MousePointerClick },
  { label: 'Processo sem surpresas', Icon: ClipboardCheck },
  { label: 'Suporte pós-entrega', Icon: LifeBuoy },
  { label: 'Foco em resultado', Icon: Focus },
  { label: 'Sua marca em órbita', Icon: Award },
  { label: 'Organização e clareza', Icon: FolderOpen },
  { label: 'Atendimento humanizado', Icon: MessageSquare },
];

const wrapStyle: React.CSSProperties = {
  width: '100vw',
  position: 'relative' as const,
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  overflow: 'hidden',
  paddingTop: spacing[8],
  paddingBottom: spacing[8],
  zIndex: 10,
  minHeight: 120, // reserva espaço para evitar CLS (2 linhas de badges)
};

const trackStyle: React.CSSProperties = {
  display: 'flex',
  width: 'max-content',
  gap: spacing[8],
  willChange: 'transform',
  backfaceVisibility: 'hidden' as const,
};

const secondaryTrackStyle: React.CSSProperties = {
  ...trackStyle,
  marginTop: spacing[4],
};

const itemStyleBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  flexShrink: 0,
  padding: `${spacing[3]}px ${spacing[6]}px`,
  borderRadius: radii.full,
  border: `1px solid ${colors.neutral.border}`,
  boxShadow: '0 10px 28px rgba(0, 0, 0, 0.06)',
  fontSize: fontSizes.base,
  fontWeight: 500,
  color: colors.text.primary,
};

const iconStyle: React.CSSProperties = {
  flexShrink: 0,
  color: colors.blue.primary,
};

const ValoresCarousel: React.FC = () => {
  const items = [...VALORES, ...VALORES];
  const itemStyle: React.CSSProperties = {
    ...itemStyleBase,
    background: 'rgba(24, 24, 27, 0.6)',
    backdropFilter: 'saturate(150%) blur(14px)',
    WebkitBackdropFilter: 'saturate(150%) blur(14px)',
  };

  return (
    <div style={wrapStyle} role="region" aria-label="Valores e benefícios">
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes valores-carousel-scroll {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
@keyframes valores-carousel-scroll-reverse {
  0% { transform: translate3d(-50%, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .valores-carousel-track,
  .valores-carousel-track-reverse { animation: none !important; }
}
          `.trim(),
        }}
      />
      <div
        className="valores-carousel-track"
        style={{
          ...trackStyle,
          animation: 'valores-carousel-scroll 60s linear infinite',
        }}
        aria-hidden="true"
      >
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`} style={itemStyle}>
            <item.Icon size={20} strokeWidth={2} style={iconStyle} aria-hidden />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div
        className="valores-carousel-track-reverse"
        style={{
          ...secondaryTrackStyle,
          animation: 'valores-carousel-scroll-reverse 60s linear infinite',
        }}
        aria-hidden="true"
      >
        {items.map((item, i) => (
          <div key={`reverse-${item.label}-${i}`} style={itemStyle}>
            <item.Icon size={20} strokeWidth={2} style={iconStyle} aria-hidden />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValoresCarousel;
