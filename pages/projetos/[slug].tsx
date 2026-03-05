import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { getProjectBySlug, getAllProjectSlugs, type Project } from '../../data/projects';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink } from 'lucide-react';
import SEO from '../../components/SEO';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: 'transparent',
  paddingTop: 64,
  paddingBottom: spacing[16],
};

const getContainerStyle = (paddingX: number): React.CSSProperties => ({
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  paddingLeft: paddingX,
  paddingRight: paddingX,
});

const backLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  marginBottom: spacing[8],
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  opacity: 0.88,
  textDecoration: 'none',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
  marginBottom: spacing[2],
};

const clientStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  color: colors.text.primary,
  opacity: 0.7,
  margin: 0,
  marginBottom: spacing[12],
};

const coverWrapStyle: React.CSSProperties = {
  position: 'relative' as const,
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: 24,
  overflow: 'hidden',
  border: `1px solid ${colors.neutral.border}`,
  marginBottom: spacing[12],
};

const coverImageStyle: React.CSSProperties = {
  objectFit: 'cover' as const,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
  marginBottom: spacing[6],
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  lineHeight: 1.7,
  color: colors.text.primary,
  opacity: 0.9,
  margin: 0,
  marginBottom: spacing[8],
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: spacing[3],
  fontSize: '1.1rem',
  lineHeight: 1.6,
  color: colors.text.primary,
  opacity: 0.9,
};

const checkIconStyle: React.CSSProperties = {
  flexShrink: 0,
  color: colors.blue.primary,
  marginTop: 2,
};

const ctaWrapStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: spacing[6],
  marginTop: spacing[12],
  paddingTop: spacing[12],
  borderTop: `1px solid ${colors.neutral.border}`,
};

const btnPrimaryStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '14px 28px',
  fontSize: fontSizes.base,
  fontWeight: 500,
  borderRadius: radii.full,
  backgroundColor: colors.blue.primary,
  color: colors.text.primary,
  border: `1px solid ${colors.blue.primary}`,
  textDecoration: 'none',
  cursor: 'pointer',
};

const btnSecondaryStyle: React.CSSProperties = {
  ...btnPrimaryStyle,
  backgroundColor: 'transparent',
  borderColor: colors.neutral.border,
};

const sectionBlockStyle: React.CSSProperties = {
  marginBottom: spacing[12],
};

export async function getStaticPaths() {
  const slugs = getAllProjectSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);
  if (!project) {
    return { notFound: true };
  }
  return { props: { project } };
}

const ProjectPage: React.FC<{ project: Project }> = ({ project }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const paddingX = isMd ? spacing[12] : spacing[4];
  return (
    <>
      <SEO
        title={project.name}
        description={project.description}
        canonical={`/projetos/${project.slug}`}
      />
      <div style={pageStyle}>
        <main style={getContainerStyle(paddingX)}>
          <Link href="/#solucoes" style={backLinkStyle} aria-label="Voltar">
            <ArrowLeft size={18} strokeWidth={2} aria-hidden />
            Voltar
          </Link>

          <h1 style={titleStyle}>{project.name}</h1>
          {project.client && <p style={clientStyle}>{project.client}</p>}

          <div style={coverWrapStyle}>
            <Image
              src={project.cover}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              style={coverImageStyle}
              priority
            />
          </div>

          <section style={sectionBlockStyle} aria-labelledby="desafios-heading">
            <h2 id="desafios-heading" style={sectionTitleStyle}>
              Desafios
            </h2>
            <ul style={listStyle} role="list">
              {project.challenges.map((text, i) => (
                <li key={i} style={listItemStyle}>
                  <span style={checkIconStyle} aria-hidden>
                    <CheckCircle2 size={20} strokeWidth={2} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section style={sectionBlockStyle} aria-labelledby="solucao-heading">
            <h2 id="solucao-heading" style={sectionTitleStyle}>
              Solução
            </h2>
            <p style={paragraphStyle}>{project.solution}</p>
          </section>

          {project.results && (
            <section style={sectionBlockStyle} aria-labelledby="resultados-heading">
              <h2 id="resultados-heading" style={sectionTitleStyle}>
                Resultados
              </h2>
              <p style={paragraphStyle}>{project.results}</p>
            </section>
          )}

          <div style={ctaWrapStyle}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={btnPrimaryStyle}
                aria-label={`Ver site ${project.name} (abre em nova aba)`}
              >
                Ver site no ar
                <ExternalLink size={18} strokeWidth={2.5} aria-hidden />
              </a>
            )}
            <a
              href="/#cta"
              style={btnSecondaryStyle}
              aria-label="Solicitar orçamento"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/#cta';
              }}
            >
              Solicitar orçamento
              <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden />
            </a>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectPage;
