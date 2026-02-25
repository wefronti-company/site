import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../components/admin/AdminLayout';
import { CircleProgressChart } from '../../../components/admin/CircleProgressChart';
import { theme } from '../../../styles/theme';
import { DollarSign, Users, Wallet } from 'lucide-react';

const { colors, spacing, fontSizes } = theme;

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
  minHeight: 260,
  display: 'flex',
  flexDirection: 'column',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.7,
  margin: 0,
  marginBottom: spacing[2],
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
};

const cardBodyStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: spacing[6],
};

const cardRightStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  flex: 1,
};

const cardTotalLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.text.light,
  opacity: 0.7,
  margin: 0,
};

const cardTotalValueStyle: React.CSSProperties = {
  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
};

const cardMetaLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.text.light,
  opacity: 0.6,
  margin: 0,
  marginTop: spacing[2],
};

const cardMetaValueStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  fontWeight: 500,
  color: colors.text.light,
  opacity: 0.9,
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
              <DollarSign size={18} aria-hidden />
              Receita total do mês
            </p>
            <div style={cardBodyStyle}>
              <CircleProgressChart
                current={receitaTotalMes.valor}
                goal={receitaTotalMes.meta}
              />
              <div style={cardRightStyle}>
                <p style={cardTotalLabelStyle}>Total até o momento</p>
                <p style={cardTotalValueStyle}>{formatBRL(receitaTotalMes.valor)}</p>
                <p style={cardMetaLabelStyle}>Meta de receita</p>
                <p style={cardMetaValueStyle}>{formatBRL(receitaTotalMes.meta)}</p>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Users size={18} aria-hidden />
              Clientes ativos
            </p>
            <div style={cardBodyStyle}>
              <CircleProgressChart
                current={clientesAtivos.total}
                goal={clientesAtivos.meta}
              />
              <div style={cardRightStyle}>
                <p style={cardTotalLabelStyle}>Total até o momento</p>
                <p style={cardTotalValueStyle}>{clientesAtivos.total}</p>
                <p style={cardMetaLabelStyle}>Meta de clientes</p>
                <p style={cardMetaValueStyle}>{clientesAtivos.meta}</p>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Wallet size={18} aria-hidden />
              A receber
            </p>
            <div style={cardBodyStyle}>
              <div style={cardRightStyle}>
                <p style={cardTotalLabelStyle}>Manutenções em aberto</p>
                <p style={cardTotalValueStyle}>{formatBRL(aReceber)}</p>
                <p style={cardMetaLabelStyle}>Baseado nas manutenções dos clientes que ainda não pagaram este mês</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboardPage;
