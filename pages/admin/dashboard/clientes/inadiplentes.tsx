import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento } from '../../../../lib/clientDb';
import { AlertCircle } from 'lucide-react';
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

const badgeInadimplenteStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  backgroundColor: 'rgba(248, 113, 113, 0.15)',
  color: '#f87171',
  borderRadius: 8,
  fontSize: fontSizes.sm,
  fontWeight: 500,
};

const btnPagarStyle: React.CSSProperties = {
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

const ClientesInadiplentesPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [clientes, setClientes] = useState<ClienteComPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagando, setPagando] = useState<string | null>(null);
  const [desligando, setDesligando] = useState<string | null>(null);

  const load = () => {
    fetch('/api/clientes/inadimplentes')
      .then((r) => r.json())
      .then((data) => setClientes(Array.isArray(data) ? data : []))
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handlePagar = async (id: string) => {
    setPagando(id);
    try {
      const res = await fetch(`/api/clientes/${id}/pagar`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) {
        showError('Erro ao marcar pagamento.');
        return;
      }
      load();
      showSuccess('Pagamento registrado com sucesso.');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setPagando(null);
    }
  };

  const handleDesligar = async (id: string) => {
    setDesligando(id);
    try {
      const res = await fetch(`/api/clientes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 2 }),
      });
      if (!res.ok) {
        showError('Erro ao desligar cliente.');
        return;
      }
      load();
      showSuccess('Cliente marcado como desligado.');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setDesligando(null);
    }
  };

  return (
    <>
      <Head>
        <title>Clientes inadimplentes | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Clientes inadimplentes</h1>
        <p style={subtitleStyle}>
          Clientes com mensalidade não paga neste mês.
        </p>

        {loading ? (
          <p style={cardMetaStyle}>Carregando...</p>
        ) : clientes.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum cliente inadimplente.</p>
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
                <span style={cardLabelStyle}>{formatBRL(c.mensalidade)}</span>
                <span style={badgeInadimplenteStyle}>
                  <AlertCircle size={16} /> Não pago
                </span>
                <button
                  type="button"
                  style={btnPagarStyle}
                  onClick={() => handlePagar(c.id)}
                  disabled={!!pagando}
                >
                  {pagando === c.id ? 'Marcando...' : 'Marcar como pago'}
                </button>
                <button
                  type="button"
                  style={btnDesligarStyle}
                  onClick={() => handleDesligar(c.id)}
                  disabled={!!desligando}
                >
                  {desligando === c.id ? '...' : 'Marcar como desligado'}
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default ClientesInadiplentesPage;
