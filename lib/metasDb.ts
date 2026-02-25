/**
 * Metas do dashboard e dados consolidados.
 */

import { sql } from './db';

export interface Metas {
  metaReceita: number;
  metaClientes: number;
}

export function getMesRef(): number {
  const d = new Date();
  return d.getFullYear() * 100 + (d.getMonth() + 1);
}

function getMesRefFromDate(d: Date): number {
  return d.getFullYear() * 100 + (d.getMonth() + 1);
}

export interface DashboardDados {
  receitaTotalMes: { valor: number; meta: number };
  clientesAtivos: { total: number; meta: number };
  aReceber: number; // soma mensalidades dos inadimplentes (baseado em clientes ativos)
}

export async function getDashboardDados(): Promise<DashboardDados> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const mesRef = getMesRef();
  const metas = await getMetas();

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
    receitaTotalMes: { valor: receitaReais, meta: metas.metaReceita },
    clientesAtivos: { total: clientesTotal, meta: metas.metaClientes },
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

/** Quantidade de pagamentos registrados por dia do mês (para o mes_ref). Chave = dia 1..31, valor = quantidade. */
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

export async function getMetas(): Promise<Metas> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT meta_receita, meta_clientes FROM metas WHERE id = 1 LIMIT 1
  `;
  const r = rows[0] as { meta_receita: number; meta_clientes: number } | undefined;
  return {
    metaReceita: (r?.meta_receita ?? 0) / 100,
    metaClientes: r?.meta_clientes ?? 0,
  };
}

export async function updateMetas(input: Partial<Metas>): Promise<Metas> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const atuais = await getMetas();
  const metaReceitaCentavos = input.metaReceita != null ? Math.round(input.metaReceita * 100) : Math.round(atuais.metaReceita * 100);
  const metaClientes = input.metaClientes ?? atuais.metaClientes;

  await sql`
    UPDATE metas SET meta_receita = ${metaReceitaCentavos}, meta_clientes = ${metaClientes}
    WHERE id = 1
  `;
  return getMetas();
}
