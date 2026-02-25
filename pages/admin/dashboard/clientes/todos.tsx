import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../../components/admin/AdminLayout';
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
  display: 'flex',
  alignItems: 'center',
  gap: spacing[8],
  flex: 1,
  minWidth: 0,
};

const cardColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  minWidth: 0,
  paddingRight: spacing[4],
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
};

const cardUfStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
  minWidth: 32,
};

const btnDetalhesStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.blue.primary,
  background: 'transparent',
  border: `1px solid ${colors.blue.primary}`,
  borderRadius: 6,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
};

const toggleWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
  fontSize: fontSizes.sm,
  color: colors.text.light,
};

const toggleTrackStyle = (active: boolean): React.CSSProperties => ({
  width: 44,
  height: 24,
  borderRadius: 12,
  backgroundColor: active ? colors.blue.primary : 'rgba(255,255,255,0.2)',
  cursor: 'pointer',
  position: 'relative' as const,
  flexShrink: 0,
  border: 'none',
  padding: 0,
});

const toggleThumbStyle = (active: boolean): React.CSSProperties => ({
  position: 'absolute' as const,
  top: 2,
  left: active ? 22 : 2,
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: '#fff',
  transition: 'left 0.2s ease',
});

let cacheClientesTodos: ClienteComPagamento[] | null = null;

const ClientesTodosPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [clientes, setClientes] = useState<ClienteComPagamento[]>(() => cacheClientesTodos ?? []);
  const [loading, setLoading] = useState(() => !cacheClientesTodos);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/clientes/todos')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        cacheClientesTodos = list;
        setClientes(list);
      })
      .catch(() => {
        if (!cacheClientesTodos) setClientes([]);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load({ silent: !!cacheClientesTodos });
  }, []);

  const handleToggle = async (id: string, currentStatus: number) => {
    const novoStatus = currentStatus === 2 ? 0 : 2;
    setToggling(id);
    try {
      const res = await fetch(`/api/clientes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!res.ok) {
        showError('Erro ao atualizar status.');
        return;
      }
      setClientes((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, status: novoStatus } : c));
        cacheClientesTodos = next;
        return next;
      });
      showSuccess(novoStatus === 0 ? 'Cliente ativo' : 'Cliente inativo');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setToggling(null);
    }
  };

  return (
    <>
      <Head>
        <title>Todos os clientes | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Todos os clientes</h1>
        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.35 }} />
          </div>
        ) : clientes.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum cliente cadastrado.</p>
        ) : (
          <div style={listStyle}>
            {clientes.map((c) => {
              const isAtivo = c.status !== 2;
              return (
                <div key={c.id} style={cardStyle}>
                  <div style={cardLeftStyle}>
                    <div style={avatarStyle}>{getIniciais(c)}</div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>Nome do cliente</span>
                      <span style={cardMetaStyle}>{c.nome}</span>
                    </div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>E-mail</span>
                      <span style={cardMetaStyle}>{c.email}</span>
                    </div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>UF</span>
                      <span style={cardUfStyle}>{c.enderecoUf || '—'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                    <div style={toggleWrapStyle}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isAtivo}
                        aria-label={isAtivo ? 'Ativo (manutenção)' : 'Desativado (sem manutenção)'}
                        disabled={!!toggling}
                        onClick={() => handleToggle(c.id, c.status)}
                        style={toggleTrackStyle(isAtivo)}
                      >
                        <span style={toggleThumbStyle(isAtivo)} />
                      </button>
                      <span style={cardMetaStyle}>Ativo</span>
                    </div>
                    <Link
                      href={`/admin/dashboard/clientes/${c.id}/detalhes`}
                      style={btnDetalhesStyle}
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default ClientesTodosPage;
