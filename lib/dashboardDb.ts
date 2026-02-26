/**
 * Dados consolidados do dashboard (sem tabela de metas).
 */

import { sql } from './db';

export function getMesRef(): number {
  const d = new Date();
  return d.getFullYear() * 100 + (d.getMonth() + 1);
}

export interface DashboardDados {
  receitaTotalMes: { valor: number; meta: number };
  clientesAtivos: { total: number; meta: number };
  aReceber: number;
}

export async function getDashboardDados(): Promise<DashboardDados> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const mesRef = getMesRef();

  const receitaRows = await sql`
    SELECT COALESCE(SUM(c.mensalidade), 0) AS total
    FROM clientes c
    INNER JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
  `;
  const receitaCentavos = Number((receitaRows[0] as { total: number })?.total ?? 0);
  const receitaReais = receitaCentavos / 100;

  const clientesRows = await sql`
    SELECT COUNT(*)::int AS total
    FROM clientes c
    INNER JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    WHERE c.status != 2 AND c.mensalidade > 0
  `;
  const clientesTotal = Number((clientesRows[0] as { total: number })?.total ?? 0);

  const aReceberRows = await sql`
    SELECT COALESCE(SUM(c.mensalidade), 0) AS total
    FROM clientes c
    LEFT JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    WHERE c.status != 2 AND c.mensalidade > 0 AND p.id IS NULL
  `;
  const aReceberCentavos = Number((aReceberRows[0] as { total: number })?.total ?? 0);
  const aReceberReais = aReceberCentavos / 100;

  return {
    receitaTotalMes: { valor: receitaReais, meta: 0 },
    clientesAtivos: { total: clientesTotal, meta: 0 },
    aReceber: aReceberReais,
  };
}

export interface PagamentoResumoMes {
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
}

export async function getPagamentoResumoPorMes(mesRef: number): Promise<PagamentoResumoMes> {
  if (!sql) throw new Error('Banco de dados não configurado.');

  const ano = Math.floor(mesRef / 100);
  const mes = mesRef % 100;
  const nomeMes = new Date(ano, mes - 1, 1).toLocaleString('pt-BR', { month: 'long' });

  const receitaRows = await sql`
    SELECT COALESCE(SUM(c.mensalidade), 0) AS total
    FROM clientes c
    INNER JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    WHERE c.status != 2
  `;
  const receitaCentavos = Number((receitaRows[0] as { total: number })?.total ?? 0);
  const receitaRecebida = receitaCentavos / 100;

  const aReceberRows = await sql`
    SELECT COALESCE(SUM(c.mensalidade), 0) AS total
    FROM clientes c
    LEFT JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    WHERE c.status != 2 AND c.mensalidade > 0 AND p.id IS NULL
  `;
  const aReceberCentavos = Number((aReceberRows[0] as { total: number })?.total ?? 0);
  const aReceberReais = aReceberCentavos / 100;

  const countRows = await sql`
    SELECT
      COUNT(*) FILTER (WHERE p.id IS NOT NULL)::int AS pagos,
      COUNT(*) FILTER (WHERE p.id IS NULL AND c.mensalidade > 0)::int AS pendentes,
      COUNT(*) FILTER (WHERE c.mensalidade > 0)::int AS total
    FROM clientes c
    LEFT JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    WHERE c.status != 2 AND c.mensalidade > 0
  `;
  const r = countRows[0] as { pagos: number; pendentes: number; total: number };
  const clientesPagos = r?.pagos ?? 0;
  const clientesPendentes = r?.pendentes ?? 0;
  const totalClientes = r?.total ?? 0;

  return {
    mesRef,
    ano,
    mes,
    nomeMes: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1),
    receitaRecebida,
    aReceber: aReceberReais,
    totalEsperado: receitaRecebida + aReceberReais,
    clientesPagos,
    clientesPendentes,
    totalClientes,
  };
}

export async function getPagamentoResumoPorData(dataStr: string): Promise<PagamentoResumoMes> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const dataDate = new Date(dataStr + 'T12:00:00Z');
  if (isNaN(dataDate.getTime())) throw new Error('Data inválida');
  const ano = dataDate.getUTCFullYear();
  const mes = dataDate.getUTCMonth() + 1;
  const mesRef = ano * 100 + mes;
  const nomeMes = new Date(ano, mes - 1, 1).toLocaleString('pt-BR', { month: 'long' });

  const receitaRows = await sql`
    SELECT COALESCE(SUM(c.mensalidade), 0) AS total
    FROM clientes c
    INNER JOIN pagamentos_mensalidade p ON p.cliente_id = c.id
    WHERE c.status != 2 AND (p.pago_em AT TIME ZONE 'America/Sao_Paulo')::date = ${dataStr}::date
  `;
  const receitaCentavos = Number((receitaRows[0] as { total: number })?.total ?? 0);
  const receitaRecebida = receitaCentavos / 100;

  const countRows = await sql`
    SELECT COUNT(*)::int AS pagos
    FROM pagamentos_mensalidade p
    INNER JOIN clientes c ON c.id = p.cliente_id
    WHERE c.status != 2 AND (p.pago_em AT TIME ZONE 'America/Sao_Paulo')::date = ${dataStr}::date
  `;
  const clientesPagos = Number((countRows[0] as { pagos: number })?.pagos ?? 0);

  return {
    mesRef,
    ano,
    mes,
    nomeMes: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1),
    receitaRecebida,
    aReceber: 0,
    totalEsperado: receitaRecebida,
    clientesPagos,
    clientesPendentes: 0,
    totalClientes: clientesPagos,
  };
}

export async function getPagamentosPorDia(mesRef: number): Promise<Record<number, number>> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT EXTRACT(DAY FROM pago_em)::int AS dia, COUNT(*)::int AS total
    FROM pagamentos_mensalidade
    WHERE mes_ref = ${mesRef}
    GROUP BY EXTRACT(DAY FROM pago_em)
  `;
  const out: Record<number, number> = {};
  for (const r of rows as { dia: number; total: number }[]) {
    out[r.dia] = r.total;
  }
  return out;
}
