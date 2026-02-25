import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FileText, CreditCard, Calendar, Package, TrendingUp } from 'lucide-react';
import DashLayout from '../../../components/dash/DashLayout';
import { CircleProgressChart } from '../../../components/admin/CircleProgressChart';
import { theme } from '../../../styles/theme';
import { useDashUsuario } from '../../../contexts/DashUsuarioContext';

const { colors, spacing, fontSizes } = theme;

const cardWrapStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: spacing[6],
  marginBottom: spacing[6],
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(18, 18, 18, 0.4)',
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 16,
  padding: spacing[6],
  minHeight: 200,
  display: 'flex',
  flexDirection: 'column',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.7,
  margin: 0,
  marginBottom: spacing[4],
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
  fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.neutral.gray,
  margin: 0,
  marginBottom: spacing[1],
};

const valueStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  color: colors.text.light,
  margin: 0,
  fontWeight: 500,
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

function mesRefToLabel(mesRef: number): string {
  const y = Math.floor(mesRef / 100);
  const m = mesRef % 100;
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${monthNames[m - 1] ?? ''}/${y}`;
}

export default function DashDashboardPage() {
  const { usuario, loading } = useDashUsuario();
  const [contrato, setContrato] = useState<{
    cliente: {
      id: string;
      nome: string;
      email: string;
      nomeFantasia?: string;
      razaoSocial: string;
      servicoTipo: string | null;
      manutencao: boolean;
      precoServico: number;
      precoManutencao: number;
      mensalidade: number;
      progressoProjeto?: number;
    } | null;
    pagamentos: { mesRef: number; pagoEm: string; formaPagamento: 'pix' | 'cartao' | null }[];
  } | null>(null);

  useEffect(() => {
    if (!usuario?.id) return;
    fetch('/api/cliente/meu-contrato', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { cliente: null, pagamentos: [] }))
      .then((data) => setContrato(data))
      .catch(() => setContrato({ cliente: null, pagamentos: [] }));
  }, [usuario?.id]);

  if (!usuario) {
    return null;
  }

  const cliente = contrato?.cliente ?? null;
  const pagamentos = contrato?.pagamentos ?? [];

  return (
    <>
      <Head>
        <title>Dashboard | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <DashLayout>
        <section style={{ marginBottom: spacing[8] }}>
          {loading ? (
            <p style={{ color: colors.neutral.gray }}>Carregando...</p>
          ) : (
            <>
              <div style={cardWrapStyle}>
                <div style={cardStyle}>
                  <p style={cardTitleStyle}>
                    <TrendingUp size={18} aria-hidden />
                    Processo
                  </p>
                  <div style={cardBodyStyle}>
                    <CircleProgressChart
                      current={cliente?.progressoProjeto ?? 0}
                      goal={100}
                    />
                    <div style={cardRightStyle}>
                      <p style={cardTotalLabelStyle}>Andamento do projeto</p>
                      <p style={cardTotalValueStyle}>
                        {(cliente?.progressoProjeto ?? 0).toFixed(0)}% concluído
                      </p>
                      <p style={{ fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.6, margin: 0, marginTop: spacing[2] }}>
                        {cliente
                          ? `Seu ${cliente.servicoTipo === 'Landing Page' ? 'landing page' : 'site'} em produção.`
                          : 'Quando seu contrato estiver vinculado, você verá o progresso aqui.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={cardStyle}>
                  <p style={cardTitleStyle}>
                    <Package size={18} aria-hidden />
                    Serviço contratado
                  </p>
                  <div style={cardBodyStyle}>
                    <div style={cardRightStyle}>
                      <p style={cardTotalLabelStyle}>Tipo de serviço</p>
                      <p style={cardTotalValueStyle}>{cliente?.servicoTipo || (cliente ? 'Site' : '—')}</p>
                      <p style={{ fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.7, margin: 0, marginTop: spacing[2] }}>
                        {cliente ? `Manutenção: ${formatBRL(cliente.mensalidade)}/mês` : 'Nenhum contrato vinculado a esta conta.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!cliente && (
                <p style={{ fontSize: fontSizes.sm, color: colors.neutral.gray, padding: spacing[4], backgroundColor: 'rgba(18, 18, 18, 0.4)', border: `1px solid ${colors.neutral.borderDark}`, borderRadius: 8, marginBottom: spacing[6] }}>
                  Nenhum contrato encontrado para o e-mail desta conta. Se você já é cliente Wefronti, confira se o e-mail da sua conta é o mesmo cadastrado no seu contrato.
                </p>
              )}

              {cliente && (
                <>
                  <div style={{ ...cardStyle, marginBottom: spacing[4] }}>
                    <p style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
                      <CreditCard size={18} />
                      Valores
                    </p>
                    <p style={valueStyle}>Preço do serviço: {formatBRL(cliente.precoServico)}</p>
                    {cliente.manutencao && (
                      <p style={{ ...valueStyle, marginTop: spacing[2], fontWeight: 600 }}>Manutenção: {formatBRL(cliente.precoManutencao)}/mês</p>
                    )}
                  </div>

                  <div style={cardStyle}>
                    <p style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
                      <FileText size={18} />
                      Manutenção
                    </p>
                    <p style={valueStyle}>{cliente.manutencao ? 'Sim' : 'Não'}</p>
                  </div>

                  {pagamentos.length > 0 && (
                    <div style={cardStyle}>
                      <p style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
                        <Calendar size={18} />
                        Pagamentos realizados
                      </p>
                      <ul style={{ margin: 0, paddingLeft: spacing[6], color: colors.text.light, fontSize: fontSizes.sm }}>
                        {pagamentos.map((p) => (
                          <li key={p.mesRef} style={{ marginBottom: spacing[2] }}>
                            {mesRefToLabel(p.mesRef)}
                            {p.formaPagamento ? ` — ${p.formaPagamento === 'pix' ? 'PIX' : 'Cartão'}` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </DashLayout>
    </>
  );
}
