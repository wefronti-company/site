'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { theme } from '../styles/theme';

const { colors, fontSizes } = theme;

interface ProjectCoverCardProps {
  children: React.ReactNode;
  href?: string;
  /** Abre o link em nova aba (target="_blank") */
  external?: boolean;
  /** ID único para evitar conflito entre múltiplos cards na página */
  id?: string;
}

const cursorSize = 120;

const cursorCircleStyle: React.CSSProperties = {
  position: 'fixed',
  width: cursorSize,
  height: cursorSize,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  zIndex: 99999,
  backgroundColor: 'rgba(24, 24, 27, 0.4)',
  backdropFilter: 'saturate(150%) blur(16px)',
  WebkitBackdropFilter: 'saturate(150%) blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
  color: colors.text.primary,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  transform: 'translate(-50%, -50%)',
  transition: 'opacity 0.15s ease',
};

/**
 * Card de capa do projeto com cursor customizado (círculo com efeito vidro e "Ver projeto")
 * apenas em dispositivos com hover (desktop). Ao sair do card, o cursor volta ao normal.
 */
const ProjectCoverCard: React.FC<ProjectCoverCardProps> = ({
  children,
  href,
  external = false,
  id: propId,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hasHover, setHasHover] = useState(true);
  const idRef = useRef(propId ?? `project-cover-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover)');
    setHasHover(mq.matches);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!hasHover) return;
    setIsHovering(true);
  }, [hasHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  const containerStyle: React.CSSProperties = {
    cursor: hasHover && isHovering ? 'none' : undefined,
    position: 'relative',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  };

  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href
    ? { href, ...(external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}) }
    : {};

  const cursorEl =
    typeof document !== 'undefined' && hasHover && isHovering ? (
      createPortal(
        <div
          key={idRef.current}
          aria-hidden
          style={{
            ...cursorCircleStyle,
            left: cursorPos.x,
            top: cursorPos.y,
          }}
        >
          Ver projeto
        </div>,
        document.body,
      )
    ) : null;

  return (
    <>
      <Wrapper
        {...wrapperProps}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={containerStyle}
      >
        {children}
      </Wrapper>
      {cursorEl}
    </>
  );
};

export default ProjectCoverCard;
