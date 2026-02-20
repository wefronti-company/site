import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { projects } from '../../data/projects';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const CURSOR_SIZE = 48;

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

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  lineHeight: 1.55,
  color: colors.text.light,
  opacity: 0.88,
  margin: 0,
  textAlign: 'center',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: spacing[6],
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const gridStyleMobile: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: spacing[6],
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const cardStyle: React.CSSProperties = {
  borderRadius: 30,
  border: `1px solid ${colors.neutral.borderDark}`,
  overflow: 'hidden',
  background: colors.background.dark,
  display: 'flex',
  flexDirection: 'column',
  textDecoration: 'none',
  color: 'inherit',
};

const coverWrapStyle: React.CSSProperties = {
  position: 'relative' as const,
  width: '100%',
  aspectRatio: '16 / 9',
  overflow: 'hidden',
};

const coverImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  display: 'block',
};

const cardFooterStyle: React.CSSProperties = {
  padding: spacing[4],
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  lineHeight: 1.3,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  lineHeight: 1.5,
  color: colors.text.light,
  opacity: 0.8,
  margin: 0,
};

const Portfolio: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];
  const [cursor, setCursor] = useState({ x: 0, y: 0, hoveredIndex: -1 });

  const handleCardMouseEnter = useCallback((e: React.MouseEvent, index: number) => {
    setCursor({ x: e.clientX, y: e.clientY, hoveredIndex: index });
  }, []);
  const handleCardMouseLeave = useCallback(() => setCursor((c) => ({ ...c, hoveredIndex: -1 })), []);
  const handleCardMouseMove = useCallback((e: React.MouseEvent) => {
    setCursor((c) => (c.hoveredIndex >= 0 ? { ...c, x: e.clientX, y: e.clientY } : c));
  }, []);

  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };

  /** Em telas maiores, mesmo recuo horizontal da seção Contato (padding das colunas) */
  const grid = isMd
    ? { ...gridStyle, paddingLeft: headerPaddingX, paddingRight: headerPaddingX }
    : { ...gridStyleMobile, paddingLeft: 0, paddingRight: 0 };

  return (
    <section id="portfolio" style={sectionStyle} aria-labelledby="portfolio-heading">
      <div style={innerStyleBase}>
        <div style={{
          ...headerStyle,
          alignItems: isMd ? 'center' : 'flex-start',
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
            Portfólio
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMd ? 'center' : 'flex-start', gap: spacing[4], width: '100%', maxWidth: 880 }}>
            <h2 id="portfolio-heading" style={{ ...titleStyle, textAlign: isMd ? 'center' : 'left' }}>
              Veja o que entregamos para nossos clientes
            </h2>
            <p style={{ ...subtitleStyle, textAlign: isMd ? 'center' : 'left', maxWidth: 560 }}>
              Conheça alguns dos projetos que desenvolvemos e imagine o que podemos fazer pelo seu negócio.
            </p>
          </div>
        </div>
        <ul style={grid} role="list">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Link
                href={`/projetos/${project.slug}`}
                style={{
                  ...cardStyle,
                  cursor: cursor.hoveredIndex === index ? 'none' : undefined,
                }}
                aria-label={`Ver detalhes do projeto ${project.name}`}
                onMouseEnter={(e) => handleCardMouseEnter(e, index)}
                onMouseLeave={handleCardMouseLeave}
                onMouseMove={handleCardMouseMove}
              >
                <div style={coverWrapStyle}>
                  <Image
                    src={project.cover}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    style={coverImageStyle}
                  />
                </div>
                <div style={cardFooterStyle}>
                  <h3 style={cardTitleStyle}>{project.name}</h3>
                  <p style={cardDescStyle}>{project.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {cursor.hoveredIndex >= 0 && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            left: cursor.x,
            top: cursor.y,
            width: CURSOR_SIZE,
            height: CURSOR_SIZE,
            marginLeft: -CURSOR_SIZE / 2,
            marginTop: -CURSOR_SIZE / 2,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <ArrowUpRight size={22} color={colors.text.light} strokeWidth={2.5} />
        </div>
      )}
    </section>
  );
};

export default Portfolio;
