import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Pagination, { paginate } from '../../../../components/admin/Pagination';
import { theme } from '../../../../styles/theme';
import type { RequestRow } from '../../../../lib/requestDb';
import { CheckCircle } from 'lucide-react';

const { colors, spacing, fontSizes } = theme;

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[3],
};

const cardStyle: React.CSSProperties = {
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 12,
  padding: spacing[5],
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing[5],
};

const cardLeftStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  flex: 1,
  minWidth: 0,
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.text.light,
};

const cardMetaStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[1]}px ${spacing[3]}px`,
  borderRadius: 6,
  backgroundColor: 'rgba(34, 197, 94, 0.15)',
  border: `1px solid rgba(34, 197, 94, 0.5)`,
  color: '#22c55e',
  fontSize: fontSizes.xs,
  fontWeight: 500,
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getNomeCompleto(r: RequestRow): string {
  return [r.nome, r.sobrenome].filter(Boolean).join(' ').trim() || r.email;
}

const RespondidosPage: React.FC = () => {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/requests?status=respondido')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setRequests(list);
      })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(requests.length / 10));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  return (
    <>
      <Head>
        <title>Orçamentos respondidos | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Orçamentos respondidos</h1>
        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.35 }} />
          </div>
        ) : requests.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum orçamento respondido.</p>
        ) : (
          <>
            <div style={listStyle}>
              {paginate(requests, page).map((r) => (
                <div key={r.id} style={cardStyle}>
                  <div style={cardLeftStyle}>
                    <span style={cardLabelStyle}>{getNomeCompleto(r)}</span>
                    <span style={cardMetaStyle}>{r.email}</span>
                    <span style={{ ...cardMetaStyle, fontSize: fontSizes.xs, opacity: 0.6 }}>
                      Respondido em {r.respondido_em ? formatDateTime(r.respondido_em) : '—'}
                    </span>
                  </div>
                  <span style={badgeStyle}>
                    <CheckCircle size={14} strokeWidth={2} aria-hidden />
                    Respondido
                  </span>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalItems={requests.length}
              onPageChange={setPage}
            />
          </>
        )}
      </AdminLayout>
    </>
  );
};

export default RespondidosPage;
