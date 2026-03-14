import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';
import ProjectCoverCard from '../../components/ProjectCoverCard';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

type ProjectItem = {
  name: string;
  description: string;
  imageSrc: string;
  projectUrl?: string;
};

const PROJECTS: ProjectItem[] = [
  {
    name: 'Aibazz',
    description: 'Site institucional com foco em conversão. Estrutura clara, carregamento rápido e design alinhado à identidade do negócio.',
    imageSrc: '/images/portfolio/aibazz.webp',
    projectUrl: 'https://aibazz.framer.ai/',
  },
  {
    name: 'R3 Digital',
    description: 'Site de serviços com estrutura profissional. Entrega rápida, atendimento próximo e resultado que gera contatos.',
    imageSrc: '/images/portfolio/r3-digital.webp',
    projectUrl: 'https://r3-digital.framer.ai/',
  },
];

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[24],
  paddingBottom: spacing[24],
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: colors.background.general,
};

const innerStyleBase: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[16],
  paddingLeft: spacing[8],
  paddingRight: spacing[8],
};

const badgeOuterStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: 6,
  borderRadius: 30,
  backgroundColor: '#040404',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  alignSelf: 'flex-start',
  width: 'fit-content',
};

const badgeInnerStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: 9999,
  background: 'linear-gradient(90deg, #49C0FF, #0280FF)',
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: '#fff',
};

const badgeOuterTextStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.secondary,
  margin: 0,
};

const titleStyle: React.CSSProperties = {
  fontSize: theme.sectionTitleFontSize,
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
};

const rowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[12],
  alignItems: 'center',
  minHeight: 0,
};

const rowStyleReversed: React.CSSProperties = {
  ...rowStyle,
  direction: 'rtl',
};

const imageWrapStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16/10',
  borderRadius: 24,
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.12)',
};

const contentWrapStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
  direction: 'ltr',
};

const projectNameStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
};

const projectDescStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.6,
  color: colors.text.secondary,
  margin: 0,
};

interface ProjectsSectionProps {
  conteudo?: Record<string, unknown>;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);

  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Alguns projetos que entregamos';
  const items = Array.isArray(conteudo?.projetos)
    ? (conteudo.projetos as ProjectItem[])
    : PROJECTS;

  const sectionPaddingX = isMd ? spacing[12] : spacing[4];
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: sectionPaddingX,
    paddingRight: sectionPaddingX,
  };

  const rowGridStyle: React.CSSProperties = isMd
    ? { gridTemplateColumns: '1fr 1fr' }
    : { gridTemplateColumns: '1fr', gap: spacing[6] };

  return (
    <section id="projetos" style={sectionStyle} aria-labelledby="projects-heading">
      <div
        style={{
          ...innerStyleBase,
          paddingLeft: isMd ? spacing[8] : 0,
          paddingRight: isMd ? spacing[8] : 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
          <div style={badgeOuterStyle} role="status" aria-label="Seção projetos">
            <span style={badgeInnerStyle}>Projetos</span>
            <span style={badgeOuterTextStyle}>Sites que desenvolvemos</span>
          </div>
          <h2 id="projects-heading" style={titleStyle}>
            {titulo}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          {items.map((project, index) => {
            const isReversed = index % 2 === 1;
            const rowLayout = isMd
              ? { ...rowStyle, ...rowGridStyle, ...(isReversed ? rowStyleReversed : {}) }
              : { ...rowStyle, ...rowGridStyle };

            return (
              <article
                key={project.name}
                style={rowLayout}
                aria-labelledby={`project-name-${index}`}
              >
                <div style={{ ...imageWrapStyle, direction: 'ltr' }}>
                  <ProjectCoverCard href={project.projectUrl} external={!!project.projectUrl}>
                    <img
                      src={project.imageSrc}
                      alt={`Capa do projeto ${project.name}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        filter: 'grayscale(100%)',
                      }}
                    />
                  </ProjectCoverCard>
                </div>
                <div style={contentWrapStyle}>
                  <h3 id={`project-name-${index}`} style={projectNameStyle}>
                    {project.name}
                  </h3>
                  <p style={projectDescStyle}>{project.description}</p>
                  {project.projectUrl && (
                    <div style={{ marginTop: spacing[2] }}>
                      <ButtonCta
                        href={project.projectUrl}
                        external
                        label={`Ver projeto ${project.name}`}
                        fullWidthOnMobile={!isMd}
                      >
                        Ver projeto
                      </ButtonCta>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
