import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { CreditCard, Wallet, Calendar, Banknote, FileText } from 'lucide-react';
import DashLayout from '../../../components/dash/DashLayout';
import { theme } from '../../../styles/theme';
import { useDashUsuario } from '../../../contexts/DashUsuarioContext';

const { colors, spacing, fontSizes } = theme;

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(18, 18, 18, 0.4)',
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 16,
  padding: spacing[6],
  marginBottom: spacing[4],
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

const labelStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
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

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}

function getMesRefAtual(): number {
  const d = new Date();
  return d.getFullYear() * 100 + (d.getMonth() + 1);
}

function mesRefToLabel(mesRef: number): string {
  const y = Math.floor(mesRef / 100);
  const m = mesRef % 100;
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return `${monthNames[m - 1] ?? ''} ${y}`;
}

function mesRefToLabelShort(mesRef: number): string {
  const y = Math.floor(mesRef / 100);
  const m = mesRef % 100;
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${monthNames[m - 1] ?? ''}/${y}`;
}

function labelFormaPagamentoProjeto(forma: string | null): string {
  if (!forma) return 'Não informado';
  if (forma === 'cartao') return 'Cartão de crédito';
  if (forma === 'pix') return 'PIX';
  if (forma === '50_50') return '50% na entrada e 50% na entrega';
  return forma;
}

export default function DashFinanceiroPage() {
  const { usuario, loading } = useDashUsuario();
  const [contrato, setContrato] = useState<{
    cliente: {
      id: string;
      precoServico: number;
      precoManutencao: number;
      mensalidade: number;
      formaPagamentoProjeto?: string | null;
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
        <title>Financeiro | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <DashLayout>
        <section style={{ marginBottom: spacing[8] }}>
          {loading ? (
            <p style={{ color: colors.neutral.gray }}>Carregando...</p>
          ) : !cliente ? (
            <p style={{ fontSize: fontSizes.sm, color: colors.neutral.gray, padding: spacing[4], backgroundColor: 'rgba(18, 18, 18, 0.4)', border: `1px solid ${colors.neutral.borderDark}`, borderRadius: 8 }}>
              Nenhum contrato encontrado para o e-mail desta conta. As informações de pagamento aparecerão aqui quando houver um contrato vinculado.
            </p>
          ) : (
            <>
              <div style={cardStyle}>
                <p style={cardTitleStyle}>
                  <Banknote size={18} aria-hidden />
                  Pagamento do projeto
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing[6] }}>
                  <div>
                    <p style={labelStyle}>Valor do serviço</p>
                    <p style={valueStyle}>{formatBRL(cliente.precoServico)}</p>
                  </div>
                  <div>
                    <p style={labelStyle}>Forma de pagamento</p>
                    <p style={valueStyle}>
                      {labelFormaPagamentoProjeto(cliente.formaPagamentoProjeto ?? null)}
                    </p>
                    {(cliente.formaPagamentoProjeto === '50_50') && (
                      <p style={{ fontSize: fontSizes.xs, color: colors.neutral.gray, margin: 0, marginTop: spacing[2] }}>
                        Metade na assinatura do contrato e metade na entrega do projeto.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {cliente.mensalidade > 0 && (
                <div style={cardStyle}>
                  <p style={cardTitleStyle}>
                    <Wallet size={18} aria-hidden />
                    Manutenção
                  </p>
                  <p style={labelStyle}>Valor mensal</p>
                  <p style={valueStyle}>{formatBRL(cliente.mensalidade)}</p>
                </div>
              )}

              {cliente.mensalidade > 0 && (() => {
                const mesAtual = getMesRefAtual();
                const mesPago = pagamentos.some((p) => p.mesRef === mesAtual);
                return (
                  <div style={cardStyle}>
                    <p style={cardTitleStyle}>
                      <FileText size={18} aria-hidden />
                      Pagar manutenção
                    </p>
                    {mesPago ? (
                      <p style={{ fontSize: fontSizes.sm, color: '#34D399', margin: 0 }}>
                        Manutenção de {mesRefToLabel(mesAtual)} está quitada.
                      </p>
                    ) : (
                      <>
                        <p style={{ fontSize: fontSizes.sm, color: colors.text.light, margin: 0, marginBottom: spacing[2] }}>
                          Cobrança em aberto: <strong>{mesRefToLabel(mesAtual)}</strong> — {formatBRL(cliente.mensalidade)}
                        </p>
                        <div style={{ padding: spacing[3], backgroundColor: 'rgba(53, 152, 255, 0.08)', border: `1px solid rgba(53, 152, 255, 0.3)`, borderRadius: 8, marginTop: spacing[2] }}>
                          <p style={{ margin: 0, marginBottom: spacing[2], fontSize: fontSizes.sm, color: colors.text.light }}>
                            <Banknote size={16} style={{ verticalAlign: 'middle', marginRight: spacing[1] }} />
                            Boleto (PIX no boleto)
                          </p>
                          <p style={{ margin: 0, fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.8 }}>
                            Você pode pagar por boleto e optar por PIX no boleto. Em breve o link será disponibilizado aqui.
                          </p>
                          <button
                            type="button"
                            disabled
                            style={{
                              marginTop: spacing[3],
                              padding: `${spacing[2]}px ${spacing[3]}px`,
                              fontSize: fontSizes.sm,
                              fontWeight: 500,
                              color: colors.text.light,
                              backgroundColor: colors.neutral.borderDark,
                              border: `1px solid ${colors.neutral.borderDark}`,
                              borderRadius: 6,
                              cursor: 'not-allowed',
                              opacity: 0.8,
                            }}
                          >
                            Ver boleto / Pagar com PIX (em breve)
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              <div style={cardStyle}>
                <p style={cardTitleStyle}>
                  <Calendar size={18} aria-hidden />
                  Pagamentos realizados
                </p>
                {pagamentos.length === 0 ? (
                  <p style={{ fontSize: fontSizes.sm, color: colors.neutral.gray, margin: 0 }}>
                    Nenhum pagamento de manutenção registrado até o momento.
                  </p>
                ) : (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {pagamentos.map((p) => (
                      <li
                        key={p.mesRef}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing[4],
                          padding: `${spacing[3]}px 0`,
                          borderBottom: `1px solid ${colors.neutral.borderDark}`,
                        }}
                      >
                        <span style={{ flex: '0 0 80px', fontSize: fontSizes.sm, color: colors.text.light, fontWeight: 500 }}>
                          {mesRefToLabelShort(p.mesRef)}
                        </span>
                        <span style={{ fontSize: fontSizes.sm, color: colors.neutral.gray }}>
                          {formatDate(p.pagoEm)}
                        </span>
                        {p.formaPagamento && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: spacing[1], fontSize: fontSizes.sm, color: colors.text.light }}>
                            {p.formaPagamento === 'pix' ? (
                              <>PIX</>
                            ) : (
                              <><CreditCard size={14} aria-hidden /> Cartão</>
                            )}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
      </DashLayout>
    </>
  );
}
