import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento } from '../../../../lib/clientDb';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { ChevronLeft, ChevronRight, Calendar, FileDown, AlertCircle } from 'lucide-react';

const { colors, spacing, fontSizes } = theme;

interface PagamentoResumo {
  mesRef: number;
  ano: number;
  mes: number;
  nomeMes: string;
  receitaRecebida: number;
  aReceber: number;
  totalEsperado: number;
  clientesPagos: number;
  clientesPendentes: number;
  totalClientes: number;
  ativos: ClienteComPagamento[];
  inadimplentes: ClienteComPagamento[];
}

function getMesRefFromDate(d: Date): number {
  return d.getFullYear() * 100 + (d.getMonth() + 1);
}

function getMesRefAtual(): number {
  return getMesRefFromDate(new Date());
}

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

/** Dia de vencimento baseado na data de cadastro (contrato/PIX). */
function getDiaVencimento(criadoEm: string): number {
  const d = new Date(criadoEm);
  return isNaN(d.getTime()) ? 1 : d.getDate();
}

/**
 * Retorna dias em atraso (positivo) ou dias até vencer (negativo).
 * Baseado no vencimento do mês selecionado = dia do cadastro.
 */
function getDiasEmAtraso(cliente: ClienteComPagamento, mesRef: number): number {
  const hoje = new Date();
  const ano = Math.floor(mesRef / 100);
  const mes = mesRef % 100;
  const diaVenc = getDiaVencimento(cliente.criadoEm);
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const diaUsar = Math.min(diaVenc, ultimoDia);
  const dataVenc = new Date(ano, mes - 1, diaUsar);
  const hojeInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const vencInicio = new Date(dataVenc.getFullYear(), dataVenc.getMonth(), dataVenc.getDate());
  const diffMs = hojeInicio.getTime() - vencInicio.getTime();
  return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}

function formatStatusVencimento(cliente: ClienteComPagamento, mesRef: number): string {
  const dias = getDiasEmAtraso(cliente, mesRef);
  if (dias > 0) return `${dias} ${dias === 1 ? 'dia' : 'dias'} em atraso`;
  if (dias === 0) return 'Vence hoje';
  return `Vence em ${Math.abs(dias)} ${Math.abs(dias) === 1 ? 'dia' : 'dias'}`;
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: spacing[6],
};

const cardBaseStyle: React.CSSProperties = {
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 12,
  padding: spacing[6],
  minHeight: 200,
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
};

const avatarStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: colors.neutral.borderDark,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.text.light,
  flexShrink: 0,
};

const btnStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.xs,
  fontWeight: 500,
  color: colors.blue.primary,
  background: 'transparent',
  border: `1px solid ${colors.blue.primary}`,
  borderRadius: 6,
  cursor: 'pointer',
};

const ClientesPagamentoPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [mesRef, setMesRef] = useState(getMesRefAtual);
  const [dados, setDados] = useState<PagamentoResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagando, setPagando] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/clientes/pagamento-resumo?mes=${mesRef}`)
      .then((r) => r.json())
      .then((data) => setDados(data))
      .catch(() => setDados(null))
      .finally(() => setLoading(false));
  }, [mesRef]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePagar = async (id: string) => {
    setPagando(id);
    try {
      const res = await fetch(`/api/clientes/${id}/pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesRef }),
      });
      if (!res.ok) {
        showError('Erro ao marcar pagamento.');
        return;
      }
      load();
      showSuccess('Pagamento registrado.');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setPagando(null);
    }
  };

  const handleExportar = () => {
    if (!dados) return;
    const linhas: string[] = ['Cliente;Email;Valor;Status'];
    const add = (c: ClienteComPagamento, status: string) => {
      linhas.push(`${empresaLabel(c)};${c.email};${formatBRL(c.mensalidade)};${status}`);
    };
    dados.ativos.forEach((c) => add(c, 'Pago'));
    dados.inadimplentes.forEach((c) => add(c, 'Pendente'));
    const csv = linhas.join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pagamentos-${dados.mesRef}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Planilha exportada.');
  };

  const avancarMes = () => {
    const ano = Math.floor(mesRef / 100);
    const mes = mesRef % 100;
    if (mes === 12) setMesRef((ano + 1) * 100 + 1);
    else setMesRef(mesRef + 1);
  };

  const voltarMes = () => {
    const ano = Math.floor(mesRef / 100);
    const mes = mesRef % 100;
    if (mes === 1) setMesRef((ano - 1) * 100 + 12);
    else setMesRef(mesRef - 1);
  };

  const hoje = new Date();
  const diaAtual = hoje.getDate();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();
  const mesSelecionado = dados?.mes ?? mesAtual;
  const anoSelecionado = dados?.ano ?? anoAtual;

  return (
    <>
      <Head>
        <title>Pagamentos | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <div style={gridStyle}>
          {/* Card 1: Calendário */}
          <div style={cardBaseStyle}>
            <h2 style={cardTitleStyle}>
              <Calendar size={20} strokeWidth={2} />
              Calendário
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing[4],
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: 200,
                }}
              >
                <button
                  type="button"
                  onClick={voltarMes}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.text.light,
                    cursor: 'pointer',
                    padding: spacing[2],
                    opacity: 0.8,
                  }}
                  aria-label="Mês anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <span
                  style={{
                    fontSize: fontSizes.lg,
                    fontWeight: 600,
                    color: colors.text.light,
                    textTransform: 'capitalize',
                  }}
                >
                  {dados?.nomeMes ?? '-'} {anoSelecionado}
                </span>
                <button
                  type="button"
                  onClick={avancarMes}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.text.light,
                    cursor: 'pointer',
                    padding: spacing[2],
                    opacity: 0.8,
                  }}
                  aria-label="Próximo mês"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <div
                style={{
                  fontSize: fontSizes['3xl'],
                  fontWeight: 700,
                  color: colors.text.light,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {String(diaAtual).padStart(2, '0')}/
                {String(mesAtual).padStart(2, '0')}/{anoAtual}
              </div>
              <p style={{ margin: 0, fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.7 }}>
                Data de hoje
              </p>
            </div>
          </div>

          {/* Card 2: Fechamento do mês */}
          <div style={cardBaseStyle}>
            <h2 style={cardTitleStyle}>Fechamento do mês</h2>
            {loading ? (
              <div style={{ height: 140, borderRadius: 12, backgroundColor: colors.admin.inactive, opacity: 0.45 }} />
            ) : dados ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <p style={{ margin: 0, fontSize: fontSizes.base, color: colors.text.light }}>
                  <strong>{dados.clientesPagos}</strong> de <strong>{dados.totalClientes}</strong>{' '}
                  clientes pagaram
                </p>
                {dados.inadimplentes.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], maxHeight: 160, overflowY: 'auto' }}>
                    <span style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.8 }}>
                      Pendentes:
                    </span>
                    {dados.inadimplentes.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: spacing[2],
                          padding: spacing[2],
                          backgroundColor: 'rgba(248, 113, 113, 0.08)',
                          borderRadius: 8,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], minWidth: 0 }}>
                          <div style={avatarStyle}>{getIniciais(c)}</div>
                          <div style={{ minWidth: 0 }}>
                            <span style={{ fontSize: fontSizes.sm, fontWeight: 500, color: colors.text.light, display: 'block' }}>
                              {empresaLabel(c)}
                            </span>
                            <span style={{ fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.7 }}>
                              {formatBRL(c.mensalidade)} · {formatStatusVencimento(c, mesRef)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          style={btnStyle}
                          onClick={() => handlePagar(c.id)}
                          disabled={!!pagando}
                        >
                          {pagando === c.id ? '...' : 'Marcar pago'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: fontSizes.sm, color: '#4ade80' }}>
                    Todos os clientes pagaram este mês.
                  </p>
                )}
              </div>
            ) : (
              <p style={{ color: colors.text.light, opacity: 0.7 }}>Sem dados.</p>
            )}
          </div>

          {/* Card 3: Cobrança */}
          <div style={cardBaseStyle}>
            <h2 style={cardTitleStyle}>
              <AlertCircle size={20} strokeWidth={2} />
              Cobrança
            </h2>
            {loading ? (
              <div style={{ height: 140, borderRadius: 12, backgroundColor: colors.admin.inactive, opacity: 0.45 }} />
            ) : dados ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                {dados.inadimplentes.length > 0 ? (
                  <>
                    <p style={{ margin: 0, fontSize: fontSizes.sm, color: colors.text.light }}>
                      <strong>{dados.inadimplentes.length}</strong> cliente(s) inadimplente(s)
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], maxHeight: 140, overflowY: 'auto' }}>
                      {dados.inadimplentes.map((c) => (
                        <div
                          key={c.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: spacing[2],
                            padding: spacing[2],
                            border: `1px solid ${colors.neutral.borderDark}`,
                            borderRadius: 8,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], minWidth: 0 }}>
                            <div style={avatarStyle}>{getIniciais(c)}</div>
                            <div style={{ minWidth: 0 }}>
                              <span style={{ fontSize: fontSizes.sm, fontWeight: 500, color: colors.text.light, display: 'block' }}>
                                {empresaLabel(c)}
                              </span>
                              <span style={{ fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.7 }}>
                                {c.email}
                              </span>
                              <span
                                style={{
                                  fontSize: fontSizes.xs,
                                  color: getDiasEmAtraso(c, mesRef) > 0 ? '#f87171' : 'rgba(156, 163, 175, 0.9)',
                                  display: 'block',
                                  marginTop: 2,
                                }}
                              >
                                {formatStatusVencimento(c, mesRef)}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                            <span style={{ fontSize: fontSizes.sm, fontWeight: 600, color: colors.text.light }}>
                              {formatBRL(c.mensalidade)}
                            </span>
                            <button
                              type="button"
                              style={btnStyle}
                              onClick={() => handlePagar(c.id)}
                              disabled={!!pagando}
                            >
                              {pagando === c.id ? '...' : 'Pagar'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p style={{ margin: 0, fontSize: fontSizes.sm, color: '#4ade80' }}>
                    Nenhum cliente pendente de cobrança.
                  </p>
                )}
              </div>
            ) : (
              <p style={{ color: colors.text.light, opacity: 0.7 }}>Sem dados.</p>
            )}
          </div>

          {/* Card 4: Relatórios */}
          <div style={cardBaseStyle}>
            <h2 style={cardTitleStyle}>
              <FileDown size={20} strokeWidth={2} />
              Relatórios
            </h2>
            {loading ? (
              <div style={{ height: 140, borderRadius: 12, backgroundColor: colors.admin.inactive, opacity: 0.45 }} />
            ) : dados ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.8 }}>Recebido</span>
                    <span style={{ fontSize: fontSizes.base, fontWeight: 600, color: '#4ade80' }}>
                      {formatBRL(dados.receitaRecebida)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.8 }}>A receber</span>
                    <span style={{ fontSize: fontSizes.base, fontWeight: 600, color: dados.aReceber > 0 ? '#f87171' : colors.text.light }}>
                      {formatBRL(dados.aReceber)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: spacing[2],
                      borderTop: `1px solid ${colors.neutral.borderDark}`,
                    }}
                  >
                    <span style={{ fontSize: fontSizes.sm, fontWeight: 600, color: colors.text.light }}>Total esperado</span>
                    <span style={{ fontSize: fontSizes.lg, fontWeight: 700, color: colors.text.light }}>
                      {formatBRL(dados.totalEsperado)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  style={{
                    ...btnStyle,
                    alignSelf: 'flex-start',
                    marginTop: spacing[2],
                  }}
                  onClick={handleExportar}
                >
                  Exportar planilha (CSV)
                </button>
              </div>
            ) : (
              <p style={{ color: colors.text.light, opacity: 0.7 }}>Sem dados.</p>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ClientesPagamentoPage;
