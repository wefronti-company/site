import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { theme } from '../../styles/theme';

const { colors, spacing, fontSizes } = theme;

const ITEMS_PER_PAGE = 10;

const wrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing[2],
  flexWrap: 'wrap',
  marginTop: spacing[6],
};

const btnBaseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 36,
  height: 36,
  padding: `0 ${spacing[2]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  borderRadius: 8,
  cursor: 'pointer',
};

const btnArrowStyle: React.CSSProperties = {
  ...btnBaseStyle,
  color: colors.text.light,
  background: 'transparent',
  border: `1px solid ${colors.neutral.borderDark}`,
};

const btnPageStyle: React.CSSProperties = {
  ...btnBaseStyle,
  color: colors.blue.primary,
  backgroundColor: colors.admin.background,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: colors.blue.primary,
};

const btnActiveStyle: React.CSSProperties = {
  ...btnPageStyle,
  backgroundColor: colors.blue.primary,
  borderColor: colors.blue.primary,
  color: '#fff',
};

const btnDisabledStyle: React.CSSProperties = {
  ...btnArrowStyle,
  opacity: 0.5,
  cursor: 'not-allowed',
};

export const ADMIN_PAGINATION_LIMIT = ITEMS_PER_PAGE;

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

/** Retorna a fatia de itens para a página atual (10 itens por página). */
export function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * ITEMS_PER_PAGE;
  return items.slice(start, start + ITEMS_PER_PAGE);
}

/** Calcula o total de páginas. */
export function getTotalPages(totalItems: number): number {
  return Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, onPageChange }) => {
  const totalPages = getTotalPages(totalItems);
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const delta = 2; // páginas antes e depois da atual
  let start = Math.max(1, currentPage - delta);
  const end = Math.min(totalPages, currentPage + delta);
  if (end - start < delta * 2) start = Math.max(1, end - delta * 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav role="navigation" aria-label="Paginação" style={wrapStyle}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Página anterior"
        style={currentPage <= 1 ? btnDisabledStyle : btnArrowStyle}
      >
        <ChevronLeft size={18} aria-hidden />
      </button>
      {start > 1 && (
        <>
          <button type="button" onClick={() => onPageChange(1)} style={btnPageStyle} aria-label="Ir para página 1">
            1
          </button>
          {start > 2 && <span style={{ color: colors.text.light, opacity: 0.6, padding: `0 ${spacing[1]}px` }}>…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-label={p === currentPage ? `Página ${p} (atual)` : `Ir para página ${p}`}
          aria-current={p === currentPage ? 'page' : undefined}
          style={p === currentPage ? btnActiveStyle : btnPageStyle}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: colors.text.light, opacity: 0.6, padding: `0 ${spacing[1]}px` }}>…</span>}
          <button type="button" onClick={() => onPageChange(totalPages)} style={btnPageStyle} aria-label={`Ir para página ${totalPages}`}>
            {totalPages}
          </button>
        </>
      )}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Próxima página"
        style={currentPage >= totalPages ? btnDisabledStyle : btnArrowStyle}
      >
        <ChevronRight size={18} aria-hidden />
      </button>
    </nav>
  );
};

export default Pagination;
