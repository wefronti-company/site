import React from 'react';
import {
  SiNodedotjs,
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiPostgresql,
  SiDocker,
  SiAmazonwebservices,
  SiCloudflare,
  SiVercel,
} from 'react-icons/si';
import type { IconType } from 'react-icons';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

interface TechItem {
  name: string;
  Icon: IconType;
  brandColor: string;
}

const OUTER_RING: TechItem[] = [
  { name: 'Node.js', Icon: SiNodedotjs, brandColor: '#339933' },
  { name: 'React', Icon: SiReact, brandColor: '#61DAFB' },
  { name: 'TypeScript', Icon: SiTypescript, brandColor: '#3178C6' },
  { name: 'Next.js', Icon: SiNextdotjs, brandColor: '#111827' },
  { name: 'PostgreSQL', Icon: SiPostgresql, brandColor: '#4169E1' },
];

const INNER_RING: TechItem[] = [
  { name: 'Docker', Icon: SiDocker, brandColor: '#2496ED' },
  { name: 'AWS', Icon: SiAmazonwebservices, brandColor: '#FF9900' },
  { name: 'Cloudflare', Icon: SiCloudflare, brandColor: '#F38020' },
  { name: 'Vercel', Icon: SiVercel, brandColor: '#111827' },
];

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  backgroundColor: 'transparent',
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
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: colors.text.primary,
  fontSize: 'clamp(2rem, 5vw, 4rem)',
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  fontWeight: 400,
  textAlign: 'center',
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: colors.text.primary,
  opacity: 0.88,
  fontSize: '1.15rem',
  lineHeight: 1.7,
  textAlign: 'center',
  maxWidth: 860,
};

const orbitCardStyle = (size: number): React.CSSProperties => ({
  width: `min(100%, ${size + spacing[10] * 2}px)`,
  aspectRatio: '1 / 1',
  margin: '0 auto',
  borderRadius: '50%',
  border: `1px solid ${colors.neutral.border}`,
  background: 'rgba(255, 255, 255, 0.45)',
  backdropFilter: 'saturate(140%) blur(12px)',
  WebkitBackdropFilter: 'saturate(140%) blur(12px)',
  padding: spacing[8],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
});

const innerOrbitWrapStyle = (size: number): React.CSSProperties => ({
  width: size,
  height: size,
  position: 'relative',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

interface TechNodeProps {
  item: TechItem;
  angle: number;
  radius: number;
  size: number;
  labelClassName: string;
}

const TechNode: React.FC<TechNodeProps> = ({ item, angle, radius, size, labelClassName }) => {
  const theta = (angle * Math.PI) / 180;
  const x = Math.cos(theta) * radius;
  const y = Math.sin(theta) * radius;
  const BrandIcon = item.Icon;

  return (
    <div
      className="tech-orbit-item"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
    >
      <span
        className={labelClassName}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: '50%',
          border: `1px solid ${colors.neutral.border}`,
          background: 'rgba(255, 255, 255, 0.52)',
          backdropFilter: 'saturate(150%) blur(12px)',
          WebkitBackdropFilter: 'saturate(150%) blur(12px)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.05)',
          color: colors.text.primary,
          lineHeight: 0,
          fontSize: fontSizes.sm,
          fontWeight: 600,
        }}
        aria-label={item.name}
        title={item.name}
      >
        <BrandIcon
          size={size <= 46 ? 22 : 25}
          color={item.brandColor}
          aria-hidden
          style={{ display: 'block' }}
        />
      </span>
    </div>
  );
};

const Tecnologias: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];
  const orbitalSize = isMd ? 520 : 340;
  const centerSize = isMd ? 120 : 88;
  const outerRingInset = isMd ? 40 : 28;
  const innerRingInset = isMd ? 112 : 82;
  const outerRingRadius = orbitalSize / 2 - outerRingInset;
  const innerRingRadius = orbitalSize / 2 - innerRingInset;

  return (
    <section
      id="tecnologias"
      aria-labelledby="tecnologias-heading"
      style={{
        ...sectionStyleBase,
        paddingLeft: headerPaddingX,
        paddingRight: headerPaddingX,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes tech-orbit-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes tech-orbit-counter {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            @keyframes tech-orbit-rotate-reverse {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            @keyframes tech-orbit-counter-reverse {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .tech-orbit-rotating {
              animation: tech-orbit-rotate 38s linear infinite;
              transform-origin: center center;
            }
            .tech-orbit-rotating-reverse {
              animation: tech-orbit-rotate-reverse 28s linear infinite;
              transform-origin: center center;
            }
            .tech-orbit-item-label {
              animation: tech-orbit-counter 38s linear infinite;
            }
            .tech-orbit-item-label-reverse {
              animation: tech-orbit-counter-reverse 28s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .tech-orbit-rotating,
              .tech-orbit-rotating-reverse,
              .tech-orbit-item-label,
              .tech-orbit-item-label-reverse {
                animation: none !important;
              }
            }
          `.trim(),
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: containerMaxWidth.wide,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[10],
        }}
      >
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[6],
          }}
        >
          <span style={badgeStyle} aria-hidden>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#5C9369',
              }}
            />
            Tecnologia
          </span>
          <h2 id="tecnologias-heading" style={titleStyle}>
            Engenharia pronta para escalar
          </h2>
          <p style={subtitleStyle}>
            Para as soluções da Wefronti, esta stack entrega performance, estabilidade e velocidade
            de evolução: ideal para sites de conversão, sistemas internos, integrações e produtos
            SaaS.
          </p>
        </header>

        <div style={orbitCardStyle(orbitalSize)}>
          <div style={innerOrbitWrapStyle(orbitalSize)}>
            <div className="tech-orbit-rotating" style={{ position: 'absolute', inset: 0 }}>
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: outerRingInset,
                  borderRadius: '50%',
                  border: `1.5px solid ${colors.neutral.border}`,
                }}
              />
              {OUTER_RING.map((tech, index) => (
                <TechNode
                  key={tech.name}
                  item={tech}
                  angle={(360 / OUTER_RING.length) * index - 90}
                  radius={outerRingRadius}
                  size={isMd ? 58 : 52}
                  labelClassName="tech-orbit-item-label"
                />
              ))}
            </div>

            <div className="tech-orbit-rotating-reverse" style={{ position: 'absolute', inset: 0 }}>
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: innerRingInset,
                  borderRadius: '50%',
                  border: `1.5px solid ${colors.neutral.border}`,
                  opacity: 0.9,
                }}
              />
              {INNER_RING.map((tech, index) => (
                <TechNode
                  key={tech.name}
                  item={tech}
                  angle={(360 / INNER_RING.length) * index - 90}
                  radius={innerRingRadius}
                  size={isMd ? 54 : 46}
                  labelClassName="tech-orbit-item-label-reverse"
                />
              ))}
            </div>

            <div
              style={{
                width: centerSize,
                height: centerSize,
                borderRadius: '50%',
                border: `1px solid ${colors.neutral.border}`,
                background: 'rgba(255, 255, 255, 0.68)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <img
                src="/images/brand/isotipo-wefronti.webp"
                alt="Isotipo Wefronti"
                width={isMd ? 52 : 40}
                height={isMd ? 52 : 40}
                loading="lazy"
                decoding="async"
                style={{
                  width: isMd ? 52 : 40,
                  height: isMd ? 52 : 40,
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tecnologias;
