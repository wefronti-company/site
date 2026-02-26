import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Pagination, { paginate } from '../../../../components/admin/Pagination';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento } from '../../../../lib/clientDb';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

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
  gridTemplateColumns: '44px minmax(100px, 1fr) minmax(150px, 1.5fr)',
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

const btnMarcarPagoStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[4]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: '#fff',
  backgroundColor: colors.blue.primary,
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

let cacheClientesFatura: ClienteComPagamento[] | null = null;

const ClientesFaturaPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [clientes, setClientes] = useState<ClienteComPagamento[]>(() => cacheClientesFatura ?? []);
  const [loading, setLoading] = useState(() => !cacheClientesFatura);
  const [page, setPage] = useState(1);
  const [marcando, setMarcando] = useState<string | null>(null);

  const load = (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/clientes/fatura')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        cacheClientesFatura = list;
        setClientes(list);
      })
      .catch(() => {
        if (!cacheClientesFatura) setClientes([]);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load({ silent: !!cacheClientesFatura });
  }, []);

  const handleMarcarPago = async (clienteId: string) => {
    setMarcando(clienteId);
    try {
      const res = await fetch(`/api/clientes/${clienteId}/pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('Erro ao marcar como pago');
      showSuccess('Pagamento registrado. Cliente removido da fatura.');
      load();
    } catch {
      showError('Erro ao registrar pagamento. Tente novamente.');
    } finally {
      setMarcando(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(clientes.length / 10));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  return (
    <>
      <Head>
        <title>Fatura | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Fatura</h1>
        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.35 }} />
          </div>
        ) : clientes.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum cliente com mensalidade em atraso.</p>
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
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                    <span style={badgeEmAtrasoStyle}>Mensalidade em atraso</span>
                    <button
                      type="button"
                      onClick={() => handleMarcarPago(c.id)}
                      disabled={marcando === c.id}
                      style={{
                        ...btnMarcarPagoStyle,
                        opacity: marcando === c.id ? 0.6 : 1,
                      }}
                    >
                      {marcando === c.id ? 'Salvando...' : 'Marcar como pago'}
                    </button>
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

export default ClientesFaturaPage;
