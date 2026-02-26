import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Pagination, { paginate } from '../../../../components/admin/Pagination';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento } from '../../../../lib/clientDb';

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
  display: 'grid',
  gridTemplateColumns: '44px minmax(100px, 1fr) minmax(150px, 1.5fr) minmax(90px, 1fr) minmax(100px, 1fr)',
  alignItems: 'center',
  columnGap: spacing[8],
  flex: 1,
  minWidth: 0,
};

const cardColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  minWidth: 0,
  overflow: 'hidden',
};

const avatarStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  backgroundColor: 'rgba(53, 152, 255, 0.2)',
  border: `1px solid ${colors.blue.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: fontSizes.base,
  fontWeight: 600,
  color: colors.blue.primary,
  flexShrink: 0,
};

function getIniciais(c: ClienteComPagamento): string {
  const n = (c.nome || '').trim();
  if (!n) return (c.email || '?').charAt(0).toUpperCase();
  const palavras = n.split(/\s+/).filter(Boolean);
  if (palavras.length === 1) return palavras[0].charAt(0).toUpperCase();
  return (palavras[0].charAt(0) + palavras[palavras.length - 1].charAt(0)).toUpperCase();
}

const cardLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.text.light,
};

const cardMetaStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.7,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function getDiaVencimento(criadoEm: string): number {
  const d = new Date(criadoEm);
  return isNaN(d.getTime()) ? 1 : d.getDate();
}

function getVencimentoDia(criadoEm: string, diaVencimento?: number): number {
  const diaVenc = (diaVencimento != null && diaVencimento >= 1 && diaVencimento <= 31)
    ? diaVencimento
    : getDiaVencimento(criadoEm);
  const hoje = new Date();
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  return Math.min(diaVenc, ultimoDia);
}

function getVencimentoFormatado(criadoEm: string, diaVencimento?: number): string {
  const dia = getVencimentoDia(criadoEm, diaVencimento);
  return `Dia ${dia}`;
}

const badgeEmDiaStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: '#34D399',
  backgroundColor: '#1D3323',
  border: '1px solid rgba(52, 211, 153, 0.4)',
  borderRadius: 6,
};

const badgeEmAtrasoStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  backgroundColor: 'rgba(239, 68, 68, 0.15)',
  color: '#f87171',
  border: '1px solid rgba(239, 68, 68, 0.4)',
  borderRadius: 6,
};

let cacheClientesManutencao: ClienteComPagamento[] | null = null;

const ClientesManutencaoPage: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteComPagamento[]>(() => cacheClientesManutencao ?? []);
  const [loading, setLoading] = useState(() => !cacheClientesManutencao);
  const [page, setPage] = useState(1);

  const load = (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/clientes/manutencao')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        cacheClientesManutencao = list;
        setClientes(list);
      })
      .catch(() => {
        if (!cacheClientesManutencao) setClientes([]);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load({ silent: !!cacheClientesManutencao });
  }, []);

  const totalPages = Math.max(1, Math.ceil(clientes.length / 10));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  return (
    <>
      <Head>
        <title>Manutenção | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Manutenção</h1>
        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.35 }} />
          </div>
        ) : clientes.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum cliente com manutenção ativa.</p>
        ) : (
          <>
            <div style={listStyle}>
              {paginate(clientes, page).map((c) => (
                <div key={c.id} style={cardStyle}>
                  <div style={cardLeftStyle}>
                    <div style={avatarStyle}>{getIniciais(c)}</div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>Nome do cliente</span>
                      <span style={cardMetaStyle}>{c.nome}</span>
                    </div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>E-mail</span>
                      <span style={cardMetaStyle} title={c.email}>{c.email}</span>
                    </div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>Manutenção</span>
                      <span style={cardMetaStyle}>{formatBRL(c.mensalidade)}</span>
                    </div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>Vencimento</span>
                      <span style={cardMetaStyle}>{getVencimentoFormatado(c.criadoEm, c.diaVencimento)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                    {c.etiqueta === 'inadimplente' ? (
                      <span style={badgeEmAtrasoStyle}>Em atraso</span>
                    ) : (
                      <span style={badgeEmDiaStyle}>Em dia</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalItems={clientes.length}
              onPageChange={setPage}
            />
          </>
        )}
      </AdminLayout>
    </>
  );
};

export default ClientesManutencaoPage;
