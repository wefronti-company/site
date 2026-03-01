import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

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

const LogoBadge: React.FC<{ company: CompanyLogo }> = ({ company }) => {
  const logoSize = company.logoXLarge
    ? LOGO_SIZE_XLARGE
    : company.logoLarge
      ? LOGO_SIZE_LARGE
      : LOGO_SIZE;
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
        width: BADGE_WIDTH,
        height: BADGE_HEIGHT,
        minWidth: BADGE_WIDTH,
        minHeight: BADGE_HEIGHT,
        flexShrink: 0,
        overflow: 'hidden',
        padding: '12px 24px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'saturate(150%) blur(14px)',
        WebkitBackdropFilter: 'saturate(150%) blur(14px)',
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
            color: colors.text.primary,
            opacity: 0.7,
            textAlign: 'center',
          }}
        >
          {company.name}
        </span>
      ) : (
        <img
          src={company.src}
          alt={`${company.name} — mesma stack que empresas de referência`}
          width={logoSize}
          height={logoSize}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            width: logoSize,
            height: logoSize,
            minWidth: logoSize,
            minHeight: logoSize,
            maxWidth: logoSize,
            maxHeight: logoSize,
            objectFit: 'contain',
            filter: 'grayscale(0.15)',
            opacity: 0.92,
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
    textAlign: isMd ? 'left' : 'center',
  };

  const subtitleStyle: React.CSSProperties = {
    margin: 0,
    color: colors.text.primary,
    opacity: 0.88,
    fontSize: '1.15rem',
    lineHeight: 1.7,
    textAlign: isMd ? 'left' : 'center',
    maxWidth: isMd ? 480 : 860,
  };

  const glassStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
            alignItems: isMd ? 'flex-start' : 'center',
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
            A mesma stack das grandes empresas
          </h2>
          <p style={subtitleStyle}>
            Node.js, React, TypeScript e Next.js — tecnologias que sustentam Netflix, Uber, Airbnb
            e milhares de empresas de referência. A Wefronti entrega performance, estabilidade e
            evolução contínua.
          </p>
        </div>

        <div
          style={{
            flex: isMd ? '1 1 55%' : undefined,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(140px, 1fr))',
            columnGap: spacing[4],
            rowGap: spacing[6],
            justifyItems: 'center',
            alignItems: 'center',
          }}
        >
          {ALL_COMPANIES.map((company) => (
            <LogoBadge key={company.name} company={company} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tecnologias;
