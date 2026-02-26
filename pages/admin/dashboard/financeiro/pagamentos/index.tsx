import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../../../components/admin/AdminLayout';
import { theme } from '../../../../../styles/theme';
import type { ClienteComPagamento } from '../../../../../lib/clientDb';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { ChevronLeft, ChevronRight, Filter, FileDown, AlertCircle, Wallet, CheckCircle2, Clock } from 'lucide-react';

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

function getDataHojeStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

function getDiaVencimento(criadoEm: string): number {
  const d = new Date(criadoEm);
  return isNaN(d.getTime()) ? 1 : d.getDate();
}

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

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: spacing[6],
};

const summaryGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: spacing[4],
  marginBottom: spacing[6],
};

const summaryCardStyle: React.CSSProperties = {
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 12,
  padding: spacing[4],
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
  backgroundColor: 'rgba(53, 152, 255, 0.2)',
  border: `1px solid ${colors.blue.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.blue.primary,
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

export default function FinanceiroPagamentosPage() {
  const { showSuccess, showError } = useSnackbar();
  const [mesRef, setMesRef] = useState(getMesRefAtual);
  const [dataFiltro, setDataFiltro] = useState<string>(() => getDataHojeStr());
  const [dados, setDados] = useState<PagamentoResumo | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const [y, m] = dataFiltro.split('-').map(Number);
    const mesRef = y * 100 + m;
    fetch(`/api/clientes/pagamento-resumo?mes=${mesRef}`)
      .then((r) => r.json())
      .then((data) => setDados(data))
      .catch(() => setDados(null))
      .finally(() => setLoading(false));
  }, [dataFiltro]);

  useEffect(() => {
    load();
  }, [load]);

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

  const hoje = new Date();
  const diaAtual = hoje.getDate();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();
  const anoSelecionado = dados?.ano ?? anoAtual;

  const filtroRef = useRef<HTMLDivElement>(null);
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [mesCalendario, setMesCalendario] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  useEffect(() => {
    if (calendarioAberto && dataFiltro) {
      const [ano, mes] = dataFiltro.split('-').map(Number);
      setMesCalendario(new Date(ano, mes - 1, 1));
    }
  }, [calendarioAberto, dataFiltro]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filtroRef.current && !filtroRef.current.contains(e.target as Node)) {
        setCalendarioAberto(false);
      }
    };
    if (calendarioAberto) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [calendarioAberto]);

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const anoCal = mesCalendario.getFullYear();
  const mesCal = mesCalendario.getMonth();
  const primeiroDia = new Date(anoCal, mesCal, 1).getDay();
  const ultimoDia = new Date(anoCal, mesCal + 1, 0).getDate();
  const celulas: (number | null)[] = [];
  for (let i = 0; i < primeiroDia; i++) celulas.push(null);
  for (let d = 1; d <= ultimoDia; d++) celulas.push(d);

  const handleSelecionarDia = (dia: number) => {
    const ano = anoCal;
    const mes = mesCal + 1;
    const dataStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const novoMesRef = ano * 100 + mes;
    setMesRef(novoMesRef);
    setDataFiltro(dataStr);
    setCalendarioAberto(false);
    setLoading(true);
    fetch(`/api/clientes/pagamento-resumo?mes=${novoMesRef}`)
      .then((r) => r.json())
      .then((data) => setDados(data))
      .catch(() => setDados(null))
      .finally(() => setLoading(false));
  };

  const navMesCal = (delta: number) => {
    setMesCalendario((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  };

  const nomeMesCal = mesCalendario.toLocaleString('pt-BR', { month: 'long' });
  const ehHoje = (dia: number) =>
    diaAtual === dia && mesAtual === mesCal + 1 && anoAtual === anoCal;
  const ehSelecionado = (dia: number) => {
    const [y, m, d] = dataFiltro.split('-').map(Number);
    return y === anoCal && m === mesCal + 1 && d === dia;
  };

  return (
    <>
      <Head>
        <title>Pagamentos | Financeiro | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4], flexWrap: 'wrap', marginBottom: spacing[4] }}>
          <h1 style={{ ...pageTitleStyle, marginBottom: 0 }}>Pagamentos</h1>
          <div ref={filtroRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setCalendarioAberto((v) => !v)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2]}px ${spacing[3]}px`,
                borderRadius: 12,
                border: `1px solid ${colors.neutral.borderDark}`,
                background: colors.admin.inactive,
                color: colors.text.light,
                fontSize: fontSizes.sm,
                cursor: 'pointer',
              }}
            >
              <Filter size={18} aria-hidden />
              Filtro
            </button>
            {calendarioAberto && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: spacing[2],
                  padding: spacing[4],
                  backgroundColor: colors.admin.inactive,
                  border: `1px solid ${colors.neutral.borderDark}`,
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  zIndex: 50,
                  minWidth: 280,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
                  <button type="button" onClick={() => navMesCal(-1)} style={{ background: 'none', border: 'none', color: colors.text.light, cursor: 'pointer', padding: spacing[2], opacity: 0.8 }} aria-label="Mês anterior">
                    <ChevronLeft size={20} />
                  </button>
                  <span style={{ fontSize: fontSizes.base, fontWeight: 600, color: colors.text.light, textTransform: 'capitalize' }}>
                    {nomeMesCal} {anoCal}
                  </span>
                  <button type="button" onClick={() => navMesCal(1)} style={{ background: 'none', border: 'none', color: colors.text.light, cursor: 'pointer', padding: spacing[2], opacity: 0.8 }} aria-label="Próximo mês">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: spacing[3] }}>
                  {diasSemana.map((d) => (
                    <div key={d} style={{ fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.7, textAlign: 'center', padding: spacing[1] }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {celulas.map((dia, i) =>
                    dia === null ? (
                      <div key={`e-${i}`} />
                    ) : (
                      <button
                        key={dia}
                        type="button"
                        onClick={() => handleSelecionarDia(dia)}
                        style={{
                          width: 32,
                          height: 32,
                          padding: 0,
                          border: ehHoje(dia) && !ehSelecionado(dia)
                            ? `2px solid ${colors.blue.primary}`
                            : ehSelecionado(dia)
                              ? 'none'
                              : '2px solid transparent',
                          borderRadius: 8,
                          fontSize: fontSizes.sm,
                          fontWeight: ehSelecionado(dia) ? 700 : 500,
                          color: ehSelecionado(dia) ? '#fff' : colors.text.light,
                          background: ehSelecionado(dia) ? colors.blue.primary : 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        {dia}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cards de resumo */}
        {loading ? (
          <div style={{ ...summaryGridStyle, minHeight: 100, opacity: 0.6 }} />
        ) : dados ? (
          <div style={summaryGridStyle}>
            <div style={summaryCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
                <Wallet size={18} color="#4ade80" />
                <span style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.8 }}>Recebido</span>
              </div>
              <p style={{ margin: 0, fontSize: fontSizes.xl, fontWeight: 700, color: '#4ade80' }}>
                {formatBRL(dados.receitaRecebida)}
              </p>
            </div>
            <div style={summaryCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
                <Clock size={18} color={dados.aReceber > 0 ? '#f87171' : colors.text.light} />
                <span style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.8 }}>A receber</span>
              </div>
              <p style={{ margin: 0, fontSize: fontSizes.xl, fontWeight: 700, color: dados.aReceber > 0 ? '#f87171' : colors.text.light }}>
                {formatBRL(dados.aReceber)}
              </p>
            </div>
            <div style={summaryCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
                <CheckCircle2 size={18} color="#34D399" />
                <span style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.8 }}>Quitados</span>
              </div>
              <p style={{ margin: 0, fontSize: fontSizes.xl, fontWeight: 700, color: colors.text.light }}>
                {dados.clientesPagos} cliente(s)
              </p>
              <p style={{ margin: 0, marginTop: spacing[1], fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.7 }}>
                {formatBRL(dados.receitaRecebida)}
              </p>
            </div>
            <div style={summaryCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
                <AlertCircle size={18} color="#f87171" />
                <span style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.8 }}>Faltam pagar</span>
              </div>
              <p style={{ margin: 0, fontSize: fontSizes.xl, fontWeight: 700, color: colors.text.light }}>
                {dados.clientesPendentes} cliente(s)
              </p>
              <p style={{ margin: 0, marginTop: spacing[1], fontSize: fontSizes.sm, color: '#f87171' }}>
                {formatBRL(dados.aReceber)}
              </p>
            </div>
          </div>
        ) : null}

        <div style={gridStyle}>
          {/* Cobrança */}
          <div style={cardBaseStyle}>
            <h2 style={cardTitleStyle}>
              <AlertCircle size={20} strokeWidth={2} />
              Cobrança
            </h2>
            {loading ? (
              <div style={{ height: 140, borderRadius: 12, backgroundColor: colors.admin.inactive, opacity: 0.45 }} />
            ) : dados ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <p style={{ margin: 0, fontSize: fontSizes.xl, fontWeight: 700, color: colors.text.light }}>
                  {dados.clientesPendentes} cliente(s) com pendências
                </p>
                <Link
                  href="/admin/dashboard/clientes/inadiplentes"
                  style={{ ...btnStyle, alignSelf: 'flex-start', textDecoration: 'none' }}
                >
                  Fazer cobrança
                </Link>
              </div>
            ) : (
              <p style={{ color: colors.text.light, opacity: 0.7 }}>Sem dados.</p>
            )}
          </div>

          {/* Relatórios */}
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
                    <span style={{ fontSize: fontSizes.base, fontWeight: 600, color: '#4ade80' }}>{formatBRL(dados.receitaRecebida)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.8 }}>A receber</span>
                    <span style={{ fontSize: fontSizes.base, fontWeight: 600, color: dados.aReceber > 0 ? '#f87171' : colors.text.light }}>{formatBRL(dados.aReceber)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing[2], borderTop: `1px solid ${colors.neutral.borderDark}` }}>
                    <span style={{ fontSize: fontSizes.sm, fontWeight: 600, color: colors.text.light }}>Total esperado</span>
                    <span style={{ fontSize: fontSizes.lg, fontWeight: 700, color: colors.text.light }}>{formatBRL(dados.totalEsperado)}</span>
                  </div>
                </div>
                <button type="button" style={{ ...btnStyle, alignSelf: 'flex-start', marginTop: spacing[2] }} onClick={handleExportar}>Exportar planilha (CSV)</button>
              </div>
            ) : (
              <p style={{ color: colors.text.light, opacity: 0.7 }}>Sem dados.</p>
            )}
          </div>
        </div>

      </AdminLayout>
    </>
  );
}
