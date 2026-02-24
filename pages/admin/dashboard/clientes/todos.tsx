import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento, ClienteEtiqueta } from '../../../../lib/clientDb';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const { colors, spacing, fontSizes } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[2],
};

const subtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  color: colors.text.light,
  opacity: 0.7,
  margin: 0,
  marginBottom: spacing[6],
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
  padding: spacing[4],
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing[4],
};

const cardInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
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
};

const etiquetaStyles: Record<ClienteEtiqueta, React.CSSProperties> = {
  ativo: {
    display: 'inline-flex',
    padding: `${spacing[2]}px ${spacing[3]}px`,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    color: '#4ade80',
    borderRadius: 8,
    fontSize: fontSizes.sm,
    fontWeight: 500,
  },
  inadimplente: {
    display: 'inline-flex',
    padding: `${spacing[2]}px ${spacing[3]}px`,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    color: '#f87171',
    borderRadius: 8,
    fontSize: fontSizes.sm,
    fontWeight: 500,
  },
  desligado: {
    display: 'inline-flex',
    padding: `${spacing[2]}px ${spacing[3]}px`,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    color: '#9ca3af',
    borderRadius: 8,
    fontSize: fontSizes.sm,
    fontWeight: 500,
  },
};

const etiquetaLabels: Record<ClienteEtiqueta, string> = {
  ativo: 'Cliente ativo',
  inadimplente: 'Cliente inadimplente',
  desligado: 'Cliente desligado',
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function empresaLabel(c: ClienteComPagamento): string {
  return c.nomeFantasia || c.razaoSocial || '—';
}

function getIniciais(c: ClienteComPagamento): string {
  const label = empresaLabel(c);
  if (!label || label === '—') return '?';
  const palavras = label.trim().split(/\s+/);
  if (palavras.length === 1) return palavras[0].charAt(0).toUpperCase();
  return (palavras[0].charAt(0) + palavras[1].charAt(0)).toUpperCase();
}

const avatarStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  backgroundColor: colors.neutral.borderDark,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: fontSizes.base,
  fontWeight: 600,
  color: colors.text.light,
  flexShrink: 0,
};

const btnStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.text.light,
  background: 'transparent',
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  cursor: 'pointer',
  opacity: 0.8,
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

let cacheClientesTodos: ClienteComPagamento[] | null = null;

const ClientesTodosPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [clientes, setClientes] = useState<ClienteComPagamento[]>(() => cacheClientesTodos ?? []);
  const [loading, setLoading] = useState(() => !cacheClientesTodos);
  const [atualizando, setAtualizando] = useState<string | null>(null);

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

  const handleStatus = async (id: string, status: number) => {
    setAtualizando(id);
    try {
      const res = await fetch(`/api/clientes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        showError('Erro ao atualizar status.');
        return;
      }
      load();
      showSuccess(status === 2 ? 'Cliente marcado como desligado.' : 'Cliente reativado com sucesso.');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setAtualizando(null);
    }
  };

  return (
    <>
      <Head>
        <title>Todos os clientes | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Todos os clientes</h1>
        <p style={subtitleStyle}>
          Listagem completa com etiqueta de status.
        </p>

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
            {clientes.map((c) => (
              <div key={c.id} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4], flex: 1, minWidth: 0 }}>
                  <div style={avatarStyle}>{getIniciais(c)}</div>
                  <div style={cardInfoStyle}>
                    <span style={cardLabelStyle}>{empresaLabel(c)}</span>
                    <span style={cardMetaStyle}>{c.nome} · {c.email}</span>
                  </div>
                </div>
                {c.mensalidade > 0 && (
                  <span style={cardLabelStyle}>{formatBRL(c.mensalidade)}/mês</span>
                )}
                <span style={etiquetaStyles[c.etiqueta ?? 'ativo']}>
                  {etiquetaLabels[c.etiqueta ?? 'ativo']}
                </span>
                <Link
                  href={`/admin/dashboard/clientes/${c.id}/editar`}
                  style={btnDetalhesStyle}
                >
                  Ver detalhes
                </Link>
                {c.etiqueta === 'desligado' ? (
                  <button
                    type="button"
                    style={btnStyle}
                    onClick={() => handleStatus(c.id, 0)}
                    disabled={!!atualizando}
                  >
                    {atualizando === c.id ? '...' : 'Reativar'}
                  </button>
                ) : (
                  <button
                    type="button"
                    style={{ ...btnStyle, color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.5)' }}
                    onClick={() => handleStatus(c.id, 2)}
                    disabled={!!atualizando}
                  >
                    {atualizando === c.id ? '...' : 'Marcar como desligado'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default ClientesTodosPage;
