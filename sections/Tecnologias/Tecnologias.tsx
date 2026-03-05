import React, { useState } from 'react';
import { SiAmazonwebservices, SiGo, SiDocker, SiNodedotjs, SiTypescript, SiReact } from 'react-icons/si';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const TECH_STACK: { key: string; label: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }[] = [
  { key: 'aws', label: 'AWS', Icon: SiAmazonwebservices },
  { key: 'go', label: 'Go', Icon: SiGo },
  { key: 'docker', label: 'Docker', Icon: SiDocker },
  { key: 'nodejs', label: 'Node.js', Icon: SiNodedotjs },
  { key: 'typescript', label: 'TypeScript', Icon: SiTypescript },
  { key: 'react', label: 'React', Icon: SiReact },
];

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

interface CompanyLogo {
  name: string;
  src: string;
  logoLarge?: boolean;
  /** Mercado Livre e Discord precisam de tamanho ainda maior */
  logoXLarge?: boolean;
}

/** Empresas com logos em /images/tecnologias/ (.svg) */
const ALL_COMPANIES: CompanyLogo[] = [
  { name: 'Mercado Livre', src: '/images/tecnologias/mercado-livre.svg', logoXLarge: true },
  { name: 'Stone', src: '/images/tecnologias/stone.svg' },
  { name: 'PicPay', src: '/images/tecnologias/picpay.svg' },
  { name: 'Netflix', src: '/images/tecnologias/netflix.svg' },
  { name: 'Airbnb', src: '/images/tecnologias/airbnb.svg' },
  { name: 'Uber', src: '/images/tecnologias/uber.svg' },
  { name: 'Spotify', src: '/images/tecnologias/spotify.svg', logoLarge: true },
  { name: 'PayPal', src: '/images/tecnologias/paypal.svg', logoLarge: true },
  { name: 'Discord', src: '/images/tecnologias/discord.svg', logoXLarge: true },
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

const BADGE_WIDTH = 150;
const BADGE_HEIGHT = 80;
const LOGO_SIZE = 56;
const LOGO_SIZE_LARGE = 66;
const LOGO_SIZE_XLARGE = 76;

const LogoBadge: React.FC<{ company: CompanyLogo; compact?: boolean }> = ({ company, compact }) => {
  const badgeW = compact ? 120 : BADGE_WIDTH;
  const badgeH = compact ? 64 : BADGE_HEIGHT;
  const logoSize = company.logoXLarge
    ? LOGO_SIZE_XLARGE
    : company.logoLarge
      ? LOGO_SIZE_LARGE
      : LOGO_SIZE;
  const logoSizeFinal = compact ? Math.min(logoSize, 48) : logoSize;
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.blue.primary;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.neutral.border;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: badgeW,
        height: badgeH,
        minWidth: badgeW,
        minHeight: badgeH,
        flexShrink: 0,
        overflow: 'hidden',
        padding: '12px 24px',
        backgroundColor: colors.text.primary,
        border: `1px solid ${colors.neutral.border}`,
        borderRadius: radii.full,
        cursor: 'default',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
    >
      {imgError ? (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#fff',
            opacity: 0.9,
            textAlign: 'center',
          }}
        >
          {company.name}
        </span>
      ) : (
        <img
          src={company.src}
          alt={`${company.name} — mesma stack que empresas de referência`}
          width={logoSizeFinal}
          height={logoSizeFinal}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            width: logoSizeFinal,
            height: logoSizeFinal,
            minWidth: logoSizeFinal,
            minHeight: logoSizeFinal,
            maxWidth: logoSizeFinal,
            maxHeight: logoSizeFinal,
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
};

const Tecnologias: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];

  const titleStyle: React.CSSProperties = {
    margin: 0,
    color: colors.text.primary,
    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    fontWeight: 400,
    textAlign: isMd ? 'left' : 'left',
  };

  const subtitleStyle: React.CSSProperties = {
    margin: 0,
    color: colors.text.primary,
    opacity: 0.88,
    fontSize: '1.15rem',
    lineHeight: 1.7,
    textAlign: isMd ? 'left' : 'left',
    maxWidth: isMd ? 480 : 860,
  };

  const glassStyle: React.CSSProperties = {
    backgroundColor: 'rgba(24, 24, 27, 0.6)',
    backdropFilter: 'saturate(150%) blur(16px)',
    WebkitBackdropFilter: 'saturate(150%) blur(16px)',
    border: `1px solid ${colors.neutral.border}`,
    borderRadius: 30,
    padding: spacing[10],
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: isMd ? 'row' : 'column',
    alignItems: isMd ? 'center' : 'stretch',
    gap: isMd ? spacing[12] : spacing[10],
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
  };

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
      <div style={glassStyle}>
        <div
          style={{
            flex: isMd ? '1 1 45%' : undefined,
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMd ? 'flex-start' : 'flex-start',
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
            Sites rápidos e estáveis
          </h2>
          <p style={subtitleStyle}>
            Usamos tecnologias modernas (React, Node.js, TypeScript) para que seu site carregue rápido,
            funcione em qualquer dispositivo e seja fácil de evoluir no futuro.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing[2],
              justifyContent: 'flex-start',
            }}
          >
            {TECH_STACK.map(({ key, label, Icon }) => (
              <span
                key={key}
                title={label}
                style={{
                  ...badgeStyle,
                  padding: `${spacing[2]}px ${spacing[3]}px`,
                  gap: spacing[2],
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} aria-hidden />
                <span style={{ fontSize: fontSizes.xs }}>{label}</span>
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            flex: isMd ? '1 1 55%' : undefined,
            display: 'grid',
            gridTemplateColumns: isMd ? 'repeat(3, minmax(140px, 1fr))' : 'repeat(2, 1fr)',
            columnGap: spacing[4],
            rowGap: spacing[6],
            justifyItems: isMd ? 'center' : 'start',
            alignItems: 'center',
            minWidth: 0,
          }}
        >
          {(isMd ? ALL_COMPANIES : ALL_COMPANIES.filter((c) => c.name !== 'Discord')).map((company) => (
            <LogoBadge key={company.name} company={company} compact={!isMd} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tecnologias;
