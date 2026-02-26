import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../components/admin/AdminLayout';
import { theme } from '../../../styles/theme';
import { Wallet, Clock, Users } from 'lucide-react';

const { colors, spacing, fontSizes } = theme;

/** Verde: dinheiro recebido */
const COR_RECEITA = '#22c55e';
/** Amarelo: a receber */
const COR_A_RECEBER = '#eab308';
/** Azul: clientes ativos */
const COR_CLIENTES = colors.blue.primary;

interface DashboardDados {
  receitaTotalMes: { valor: number; meta: number };
  clientesAtivos: { total: number; meta: number };
  aReceber: number;
}

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const cardWrapStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: spacing[6],
  marginTop: spacing[6],
};

const cardStyle: React.CSSProperties = {
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 16,
  padding: spacing[6],
  minHeight: 140,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
};

const cardValueStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  fontWeight: 600,
  margin: 0,
};

const cardHintStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.text.light,
  opacity: 0.6,
  margin: 0,
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

const DEFAULT_DADOS: DashboardDados = {
  receitaTotalMes: { valor: 0, meta: 0 },
  clientesAtivos: { total: 0, meta: 0 },
  aReceber: 0,
};

const AdminDashboardPage: React.FC = () => {
  const [dados, setDados] = useState<DashboardDados>(DEFAULT_DADOS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((data) => setDados(data))
      .catch(() => setDados(DEFAULT_DADOS))
      .finally(() => setLoading(false));
  }, []);

  const { receitaTotalMes, clientesAtivos, aReceber } = dados;

  return (
    <>
      <Head>
        <title>Dashboard | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Visão geral</h1>
        <div style={cardWrapStyle}>
          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Wallet size={20} aria-hidden style={{ color: COR_RECEITA }} />
              Receita do mês
            </p>
            <p style={{ ...cardValueStyle, color: COR_RECEITA }}>
              {loading ? '—' : formatBRL(receitaTotalMes.valor)}
            </p>
            <p style={cardHintStyle}>Total recebido em mensalidades este mês</p>
          </div>

          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Clock size={20} aria-hidden style={{ color: COR_A_RECEBER }} />
              A receber
            </p>
            <p style={{ ...cardValueStyle, color: COR_A_RECEBER }}>
              {loading ? '—' : formatBRL(aReceber)}
            </p>
            <p style={cardHintStyle}>Previsão com base nas mensalidades ainda não pagas</p>
          </div>

          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Users size={20} aria-hidden style={{ color: COR_CLIENTES }} />
              Clientes ativos
            </p>
            <p style={{ ...cardValueStyle, color: COR_CLIENTES }}>
              {loading ? '—' : clientesAtivos.total}
            </p>
            <p style={cardHintStyle}>Com manutenção mensal e pagamento em dia este mês</p>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboardPage;
