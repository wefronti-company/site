import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento } from '../../../../lib/clientDb';
import { CheckCircle } from 'lucide-react';

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

const badgePagoStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  backgroundColor: 'rgba(34, 197, 94, 0.15)',
  color: '#4ade80',
  borderRadius: 8,
  fontSize: fontSizes.sm,
  fontWeight: 500,
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function empresaLabel(c: ClienteComPagamento): string {
  return c.nomeFantasia || c.razaoSocial || '—';
}

const btnDesligarStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: '#9ca3af',
  background: 'transparent',
  border: '1px solid rgba(156, 163, 175, 0.5)',
  borderRadius: 6,
  cursor: 'pointer',
};

const ClientesAtivosPage: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteComPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState<string | null>(null);

  const load = () => {
    fetch('/api/clientes/ativos')
      .then((r) => r.json())
      .then((data) => setClientes(Array.isArray(data) ? data : []))
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDesligar = async (id: string) => {
    setAtualizando(id);
    try {
      await fetch(`/api/clientes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 2 }),
      });
      load();
    } finally {
      setAtualizando(null);
    }
  };

  return (
    <>
      <Head>
        <title>Clientes ativos | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Clientes ativos</h1>
        <p style={subtitleStyle}>
          Clientes recorrentes com mensalidade paga neste mês.
        </p>

        {loading ? (
          <p style={cardMetaStyle}>Carregando...</p>
        ) : clientes.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum cliente ativo no momento.</p>
        ) : (
          <div style={listStyle}>
            {clientes.map((c) => (
              <div key={c.id} style={cardStyle}>
                <div style={cardInfoStyle}>
                  <span style={cardLabelStyle}>{empresaLabel(c)}</span>
                  <span style={cardMetaStyle}>{c.nome} · {c.email}</span>
                </div>
                <span style={cardLabelStyle}>{formatBRL(c.mensalidade)}</span>
                <span style={badgePagoStyle}>
                  <CheckCircle size={16} /> Pago no mês
                </span>
                <button
                  type="button"
                  style={btnDesligarStyle}
                  onClick={() => handleDesligar(c.id)}
                  disabled={!!atualizando}
                >
                  {atualizando === c.id ? '...' : 'Marcar como desligado'}
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default ClientesAtivosPage;
