import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Pagination, { paginate } from '../../../../components/admin/Pagination';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento } from '../../../../lib/clientDb';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { AlertTriangle } from 'lucide-react';

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
  gridTemplateColumns: '44px minmax(100px, 1fr) minmax(150px, 1.5fr) minmax(48px, 0.5fr) minmax(90px, 1fr) minmax(90px, 1fr)',
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

const cardUfStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
  minWidth: 32,
};

const badgeMensalidadeNaoPagaStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: '#9ca3af',
  backgroundColor: '#1f2937',
  border: '1px solid rgba(156, 163, 175, 0.4)',
  borderRadius: 6,
};

const btnReativarStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.blue.primary,
  background: 'transparent',
  border: `1px solid ${colors.blue.primary}`,
  borderRadius: 6,
  cursor: 'pointer',
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function getDiaVencimento(criadoEm: string): number {
  const d = new Date(criadoEm);
  return isNaN(d.getTime()) ? 1 : d.getDate();
}

function getVencimentoFormatado(criadoEm: string): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth() + 1;
  const diaVenc = getDiaVencimento(criadoEm);
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const dia = Math.min(diaVenc, ultimoDia);
  const dd = String(dia).padStart(2, '0');
  const mm = String(mes).padStart(2, '0');
  return `${dd}/${mm}/${ano}`;
}

function getIniciais(c: ClienteComPagamento): string {
  const n = (c.nome || '').trim();
  if (!n) return (c.email || '?').charAt(0).toUpperCase();
  const palavras = n.split(/\s+/).filter(Boolean);
  if (palavras.length === 1) return palavras[0].charAt(0).toUpperCase();
  return (palavras[0].charAt(0) + palavras[palavras.length - 1].charAt(0)).toUpperCase();
}

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

let cacheClientesDesligados: ClienteComPagamento[] | null = null;

const ClientesDesligadosPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [clientes, setClientes] = useState<ClienteComPagamento[]>(() => cacheClientesDesligados ?? []);
  const [loading, setLoading] = useState(() => !cacheClientesDesligados);
  const [atualizando, setAtualizando] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const load = (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/clientes/desligados')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        cacheClientesDesligados = list;
        setClientes(list);
      })
      .catch(() => {
        if (!cacheClientesDesligados) setClientes([]);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load({ silent: !!cacheClientesDesligados });
  }, []);

  const totalPages = Math.max(1, Math.ceil(clientes.length / 10));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const handleReativar = async (id: string) => {
    setAtualizando(id);
    try {
      const res = await fetch(`/api/clientes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 0 }),
      });
      if (!res.ok) {
        showError('Erro ao reativar cliente.');
        return;
      }
      load();
      showSuccess('Cliente reativado com sucesso.');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setAtualizando(null);
    }
  };

  return (
    <>
      <Head>
        <title>Clientes inativos | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Clientes inativos</h1>
        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.35 }} />
          </div>
        ) : clientes.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum cliente inativo.</p>
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
                    <span style={cardLabelStyle}>UF</span>
                    <span style={cardUfStyle}>{c.enderecoUf || '—'}</span>
                  </div>
                  <div style={cardColStyle}>
                    <span style={cardLabelStyle}>Manutenção</span>
                    <span style={cardMetaStyle}>{formatBRL(c.mensalidade)}</span>
                  </div>
                  <div style={cardColStyle}>
                    <span style={cardLabelStyle}>Vencimento</span>
                    <span style={cardMetaStyle}>{getVencimentoFormatado(c.criadoEm)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                  <span style={badgeMensalidadeNaoPagaStyle}>
                  <AlertTriangle size={16} /> Mensalidade não paga
                </span>
                  <button
                    type="button"
                    style={btnReativarStyle}
                    onClick={() => handleReativar(c.id)}
                    disabled={!!atualizando}
                  >
                    {atualizando === c.id ? '...' : 'Reativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination currentPage={page} totalItems={clientes.length} onPageChange={setPage} />
          </>
        )}
      </AdminLayout>
    </>
  );
};

export default ClientesDesligadosPage;
