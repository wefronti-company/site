import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento, ClienteEtiqueta } from '../../../../lib/clientDb';

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

const ClientesTodosPage: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteComPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState<string | null>(null);

  const load = () => {
    fetch('/api/clientes/todos')
      .then((r) => r.json())
      .then((data) => setClientes(Array.isArray(data) ? data : []))
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (id: string, status: number) => {
    setAtualizando(id);
    try {
      await fetch(`/api/clientes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      load();
    } finally {
      setAtualizando(null);
    }
  };

  return (
    <>
      <Head>
        <title>Todos os clientes | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Todos os clientes</h1>
        <p style={subtitleStyle}>
          Listagem completa com etiqueta de status.
        </p>

        {loading ? (
          <p style={cardMetaStyle}>Carregando...</p>
        ) : clientes.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum cliente cadastrado.</p>
        ) : (
          <div style={listStyle}>
            {clientes.map((c) => (
              <div key={c.id} style={cardStyle}>
                <div style={cardInfoStyle}>
                  <span style={cardLabelStyle}>{empresaLabel(c)}</span>
                  <span style={cardMetaStyle}>{c.nome} · {c.email}</span>
                </div>
                {c.mensalidade > 0 && (
                  <span style={cardLabelStyle}>{formatBRL(c.mensalidade)}/mês</span>
                )}
                <span style={etiquetaStyles[c.etiqueta ?? 'ativo']}>
                  {etiquetaLabels[c.etiqueta ?? 'ativo']}
                </span>
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
