'use client';

import React from 'react';

interface ProjectCoverCardProps {
  children: React.ReactNode;
  href?: string;
  /** Abre o link em nova aba (target="_blank") */
  external?: boolean;
  /** ID único para evitar conflito entre múltiplos cards na página */
  id?: string;
}

/**
 * Card de capa do projeto.
 */
const ProjectCoverCard: React.FC<ProjectCoverCardProps> = ({
  children,
  href,
  external = false,
}) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    ...(href && { cursor: 'pointer' }),
  };

  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href
    ? { href, ...(external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}) }
    : {};

  return (
    <Wrapper {...wrapperProps} className="project-cover-card" style={containerStyle}>
      {children}
    </Wrapper>
  );
};

export default ProjectCoverCard;
