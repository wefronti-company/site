/**
 * Persistência de clientes no PostgreSQL (Neon).
 */

import { sql } from './db';

export type ClienteStatus = 0 | 1 | 2; // 0=ativo, 1=inativo, 2=desligado

export type ClienteEtiqueta = 'ativo' | 'inadimplente' | 'desligado';

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  celular?: string;
  razaoSocial: string;
  cnpj?: string;
  site?: string;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoUf?: string;
  enderecoCep?: string;
  /** Total mensal em reais (valor da manutenção; o que o cliente paga todo mês). */
  mensalidade: number;
  /** Dia do mês para vencimento (1-31). Se não definido, usa o dia de criadoEm. */
  diaVencimento?: number;
  status: ClienteStatus;
  criadoEm: string;
}

export interface ClienteComPagamento extends Cliente {
  mensalidadePaga: boolean;
  etiqueta?: ClienteEtiqueta;
}

function getMesRef(): number {
  const d = new Date();
  return d.getFullYear() * 100 + (d.getMonth() + 1);
}

/** Dia de vencimento no mês (baseado na data de cadastro). */
function getDiaVencimento(criadoEm: string): number {
  const d = new Date(criadoEm);
  return isNaN(d.getTime()) ? 1 : d.getDate();
}

/** Data de vencimento para o mês (mesRef = AAAAMM). Se o dia não existir no mês, usa o último dia. */
function getDataVencimentoParaMesRef(criadoEm: string, mesRef: number): Date {
  const ano = Math.floor(mesRef / 100);
  const mes = mesRef % 100;
  const diaVenc = getDiaVencimento(criadoEm);
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const diaUsar = Math.min(diaVenc, ultimoDia);
  return new Date(ano, mes - 1, diaUsar);
}

/** Move para inativos (status 2) clientes com mensalidade > 0, sem pagamento no mês e vencimento + 5 dias já passou. */
export async function moveOverdueToInativos(mesRefParam?: number): Promise<void> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const mesRef = mesRefParam ?? getMesRef();
  const rows = await sql`
    SELECT c.id, c.criado_em
    FROM clientes c
    LEFT JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    WHERE c.status != 2 AND c.mensalidade > 0 AND p.id IS NULL
  `;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const cincoDiasMs = 5 * 24 * 60 * 60 * 1000;
  for (const r of rows as { id: string; criado_em: Date | string }[]) {
    const criadoEm = r.criado_em instanceof Date ? r.criado_em.toISOString() : String(r.criado_em ?? '');
    const venc = getDataVencimentoParaMesRef(criadoEm, mesRef);
    venc.setHours(0, 0, 0, 0);
    if (hoje.getTime() - venc.getTime() > cincoDiasMs) {
      await updateClienteStatus(r.id, 2);
    }
  }
}

function rowToCliente(row: Record<string, unknown>): Cliente {
  const criadoEm = row.criado_em instanceof Date
    ? row.criado_em.toISOString()
    : String(row.criado_em ?? '');
  return {
    id: String(row.id ?? ''),
    nome: String(row.nome ?? ''),
    email: String(row.email ?? ''),
    cpf: row.cpf ? String(row.cpf) : undefined,
    celular: row.celular ? String(row.celular) : undefined,
    razaoSocial: String(row.razao_social ?? ''),
    cnpj: row.cnpj ? String(row.cnpj) : undefined,
    site: row.site ? String(row.site) : undefined,
    enderecoLogradouro: row.endereco_logradouro ? String(row.endereco_logradouro) : undefined,
    enderecoNumero: row.endereco_numero ? String(row.endereco_numero) : undefined,
    enderecoComplemento: row.endereco_complemento ? String(row.endereco_complemento) : undefined,
    enderecoBairro: row.endereco_bairro ? String(row.endereco_bairro) : undefined,
    enderecoCidade: row.endereco_cidade ? String(row.endereco_cidade) : undefined,
    enderecoUf: row.endereco_uf ? String(row.endereco_uf) : undefined,
    enderecoCep: row.endereco_cep ? String(row.endereco_cep) : undefined,
    mensalidade: (Number(row.mensalidade) || 0) / 100,
    diaVencimento: row.dia_vencimento != null ? Math.min(31, Math.max(1, Number(row.dia_vencimento))) : undefined,
    status: (row.status as ClienteStatus) ?? 0,
    criadoEm,
  };
}

function rowToClienteComPagamento(row: Record<string, unknown>, mensalidadePaga: boolean, etiqueta?: ClienteEtiqueta): ClienteComPagamento {
  const c = rowToCliente(row);
  return { ...c, mensalidadePaga, etiqueta };
}

const TIMEZONE_SP = 'America/Sao_Paulo';

/** Ano, mês e dia atuais no fuso de São Paulo. */
function getHojeSaoPaulo(): { ano: number; mes: number; dia: number } {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_SP,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [ano, mes, dia] = f.format(new Date()).split('-').map(Number);
  return { ano, mes, dia };
}

/** Data de vencimento do mês atual (usando dia_vencimento ou dia de criado_em). Usa fuso São Paulo. */
function getDataVencimentoMesAtual(criadoEm: string, diaVencimento?: number): Date {
  const { ano, mes } = getHojeSaoPaulo();
  const diaPadrao = (() => {
    const d = new Date(criadoEm);
    return isNaN(d.getTime()) ? 1 : d.getDate();
  })();
  const diaVenc = (diaVencimento != null && diaVencimento >= 1 && diaVencimento <= 31)
    ? diaVencimento
    : diaPadrao;
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const dia = Math.min(diaVenc, ultimoDia);
  const venc = new Date(ano, mes - 1, dia);
  venc.setHours(0, 0, 0, 0);
  return venc;
}

/** True se a data de vencimento do mês atual já passou. Usa fuso São Paulo para "hoje". */
function isVencido(criadoEm: string, diaVencimento?: number): boolean {
  const { ano, mes, dia } = getHojeSaoPaulo();
  const hoje = new Date(ano, mes - 1, dia);
  hoje.setHours(0, 0, 0, 0);
  const venc = getDataVencimentoMesAtual(criadoEm, diaVencimento);
  return hoje.getTime() > venc.getTime();
}

/** Clientes com preço e dia de vencimento definidos (manutenção ativa), com status de pagamento do mês. */
export async function getClientesManutencao(): Promise<ClienteComPagamento[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const mesRef = getMesRef();
  const rows = await sql`
    SELECT c.*, (p.id IS NOT NULL) AS pago
    FROM clientes c
    LEFT JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    WHERE c.status != 2 AND c.mensalidade > 0
      AND c.dia_vencimento IS NOT NULL AND c.dia_vencimento >= 1 AND c.dia_vencimento <= 31
    ORDER BY c.razao_social
  `;
  return (rows as (Record<string, unknown> & { pago: boolean })[]).map((r) => {
    const { pago, ...rest } = r;
    const c = rowToCliente(rest);
    const pagoBool = !!r.pago;
    const emDia = pagoBool || !isVencido(c.criadoEm, c.diaVencimento);
    return rowToClienteComPagamento(rest, pagoBool, emDia ? 'ativo' : 'inadimplente');
  });
}

/** Clientes com manutenção em atraso (não pagaram e vencimento já passou). */
export async function getClientesFatura(): Promise<ClienteComPagamento[]> {
  const todos = await getClientesManutencao();
  return todos.filter((c) => !c.mensalidadePaga && isVencido(c.criadoEm, c.diaVencimento));
}

/** Clientes com contrato e manutenção mensal ativa (pagam por mês). Usado por pagamento-resumo. */
export async function getClientesAtivos(mesRefParam?: number): Promise<ClienteComPagamento[]> {
  return getClientesManutencao();
}

/** Clientes que registraram pagamento em uma data específica (YYYY-MM-DD). */
export async function getClientesQuePagaramEmData(dataStr: string): Promise<ClienteComPagamento[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT c.*, TRUE AS pago
    FROM clientes c
    INNER JOIN pagamentos_mensalidade p ON p.cliente_id = c.id
    WHERE c.status != 2 AND (p.pago_em AT TIME ZONE 'America/Sao_Paulo')::date = ${dataStr}::date
    ORDER BY c.razao_social
  `;
  return (rows as (Record<string, unknown> & { pago: boolean })[]).map((r) => {
    const { pago, ...rest } = r;
    return rowToClienteComPagamento(rest, !!pago, 'ativo');
  });
}

export async function getClientesDesligados(): Promise<ClienteComPagamento[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT c.*, FALSE AS pago
    FROM clientes c
    WHERE c.status = 2
    ORDER BY c.razao_social
  `;
  return (rows as Record<string, unknown>[]).map((r) => rowToClienteComPagamento(r, false, 'desligado'));
}

export async function buscarClientes(termo: string): Promise<Cliente[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const q = String(termo || '').trim();
  if (!q || q.length < 1) return [];
  const pattern = `%${q}%`;
  const digitsOnly = q.replace(/\D/g, '');
  const digitsPattern = digitsOnly.length >= 2 ? `%${digitsOnly}%` : null;
  const rows = digitsPattern
    ? await sql`
        SELECT * FROM clientes
        WHERE
          nome ILIKE ${pattern}
          OR razao_social ILIKE ${pattern}
          OR email ILIKE ${pattern}
          OR (cpf IS NOT NULL AND regexp_replace(cpf, '[^0-9]', '', 'g') LIKE ${digitsPattern})
          OR (cnpj IS NOT NULL AND regexp_replace(cnpj, '[^0-9]', '', 'g') LIKE ${digitsPattern})
        ORDER BY razao_social
        LIMIT 10
      `
    : await sql`
        SELECT * FROM clientes
        WHERE
          nome ILIKE ${pattern}
          OR razao_social ILIKE ${pattern}
          OR email ILIKE ${pattern}
        ORDER BY razao_social
        LIMIT 10
      `;
  return (rows as Record<string, unknown>[]).map((r) => rowToCliente(r));
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT * FROM clientes WHERE id = ${id}
  `;
  const row = rows[0] as Record<string, unknown> | undefined;
  return row ? rowToCliente(row) : null;
}

/** Hub do cliente: busca cliente pelo e-mail (para vincular conta logada ao contrato). */
export async function getClienteByEmail(email: string): Promise<Cliente | null> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return null;
  const rows = await sql`
    SELECT * FROM clientes WHERE LOWER(TRIM(email)) = ${normalized} LIMIT 1
  `;
  const row = rows[0] as Record<string, unknown> | undefined;
  return row ? rowToCliente(row) : null;
}

export interface PagamentoMensalidadeItem {
  mesRef: number;
  pagoEm: string;
  formaPagamento: 'pix' | 'cartao' | null;
}

/** Lista pagamentos de mensalidade do cliente (para hub). */
export async function getPagamentosByClienteId(clienteId: string): Promise<PagamentoMensalidadeItem[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  try {
    const rows = await sql`
      SELECT mes_ref, pago_em, forma_pagamento
      FROM pagamentos_mensalidade
      WHERE cliente_id = ${clienteId}
      ORDER BY mes_ref DESC
      LIMIT 60
    `;
    return (rows as Record<string, unknown>[]).map((r) => ({
      mesRef: Number(r.mes_ref),
      pagoEm: r.pago_em instanceof Date ? (r.pago_em as Date).toISOString() : String(r.pago_em ?? ''),
      formaPagamento: r.forma_pagamento === 'pix' || r.forma_pagamento === 'cartao' ? (r.forma_pagamento as 'pix' | 'cartao') : null,
    }));
  } catch {
    const rows = await sql`
      SELECT mes_ref, pago_em
      FROM pagamentos_mensalidade
      WHERE cliente_id = ${clienteId}
      ORDER BY mes_ref DESC
      LIMIT 60
    `;
    return (rows as Record<string, unknown>[]).map((r) => ({
      mesRef: Number(r.mes_ref),
      pagoEm: r.pago_em instanceof Date ? (r.pago_em as Date).toISOString() : String(r.pago_em ?? ''),
      formaPagamento: null as 'pix' | 'cartao' | null,
    }));
  }
}

export async function getClientesTodos(): Promise<ClienteComPagamento[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT * FROM clientes
    ORDER BY status, razao_social
  `;
  return (rows as Record<string, unknown>[]).map((r) => {
    const c = rowToCliente(r);
    const etiqueta: ClienteEtiqueta = c.status === 2 ? 'desligado' : 'ativo';
    return rowToClienteComPagamento(r, false, etiqueta);
  });
}

export async function updateClienteStatus(clienteId: string, status: ClienteStatus): Promise<void> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  await sql`
    UPDATE clientes SET status = ${status} WHERE id = ${clienteId}
  `;
}

export async function registrarPagamento(clienteId: string, mesRef?: number): Promise<void> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const ref = mesRef ?? getMesRef();
  await sql`
    INSERT INTO pagamentos_mensalidade (cliente_id, mes_ref)
    VALUES (${clienteId}, ${ref})
    ON CONFLICT (cliente_id, mes_ref) DO NOTHING
  `;
}

export interface CreateClienteInput {
  nome: string;
  email: string;
  cpf?: string;
  celular?: string;
  razaoSocial: string;
  cnpj?: string;
  site?: string;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoUf?: string;
  enderecoCep?: string;
  /** Total mensal em reais (valor da manutenção). */
  mensalidade?: number;
  /** Dia do mês para vencimento (1-31). Opcional. */
  diaVencimento?: number;
}

function trimSlice(str: string | undefined, max: number): string | null {
  if (!str || !str.trim()) return null;
  return str.trim().slice(0, max) || null;
}

function computeMensalidade(input: CreateClienteInput): number {
  return input.mensalidade ?? 0;
}

export async function createCliente(input: CreateClienteInput): Promise<Cliente> {
  if (!sql) throw new Error('Banco de dados não configurado.');

  const mensalidadeCentavos = Math.round((computeMensalidade(input) || 0) * 100);

  const rows = await sql`
    INSERT INTO clientes (
      nome, email, cpf, celular,
      razao_social, cnpj, site,
      endereco_logradouro, endereco_numero, endereco_complemento,
      endereco_bairro, endereco_cidade, endereco_uf, endereco_cep,
      mensalidade, dia_vencimento
    )
    VALUES (
      ${trimSlice(input.nome, 150) ?? ''},
      ${trimSlice(input.email, 254) ?? ''},
      ${trimSlice(input.cpf, 14)},
      ${trimSlice(input.celular, 20)},
      ${trimSlice(input.razaoSocial, 200) ?? ''},
      ${trimSlice(input.cnpj, 18)},
      ${trimSlice(input.site, 200)},
      ${trimSlice(input.enderecoLogradouro, 150)},
      ${trimSlice(input.enderecoNumero, 20)},
      ${trimSlice(input.enderecoComplemento, 80)},
      ${trimSlice(input.enderecoBairro, 80)},
      ${trimSlice(input.enderecoCidade, 80)},
      ${input.enderecoUf ? (trimSlice(input.enderecoUf, 2)?.toUpperCase() ?? null) : null},
      ${trimSlice(input.enderecoCep, 10)},
      ${mensalidadeCentavos},
      ${input.diaVencimento != null && input.diaVencimento >= 1 && input.diaVencimento <= 31 ? input.diaVencimento : null}
    )
    RETURNING *
  `;

  const row = rows[0] as Record<string, unknown>;
  return rowToCliente(row);
}

export async function updateCliente(id: string, input: CreateClienteInput): Promise<Cliente | null> {
  if (!sql) throw new Error('Banco de dados não configurado.');

  const mensalidadeCentavos = Math.round((computeMensalidade(input) ?? 0) * 100);

  const rows = await sql`
    UPDATE clientes SET
      nome = ${trimSlice(input.nome, 150) ?? ''},
      email = ${trimSlice(input.email, 254) ?? ''},
      cpf = ${trimSlice(input.cpf, 14)},
      celular = ${trimSlice(input.celular, 20)},
      razao_social = ${trimSlice(input.razaoSocial, 200) ?? ''},
      cnpj = ${trimSlice(input.cnpj, 18)},
      site = ${trimSlice(input.site, 200)},
      endereco_logradouro = ${trimSlice(input.enderecoLogradouro, 150)},
      endereco_numero = ${trimSlice(input.enderecoNumero, 20)},
      endereco_complemento = ${trimSlice(input.enderecoComplemento, 80)},
      endereco_bairro = ${trimSlice(input.enderecoBairro, 80)},
      endereco_cidade = ${trimSlice(input.enderecoCidade, 80)},
      endereco_uf = ${input.enderecoUf ? (trimSlice(input.enderecoUf, 2)?.toUpperCase() ?? null) : null},
      endereco_cep = ${trimSlice(input.enderecoCep, 10)},
      mensalidade = ${mensalidadeCentavos},
      dia_vencimento = ${input.diaVencimento != null && input.diaVencimento >= 1 && input.diaVencimento <= 31 ? input.diaVencimento : null}
    WHERE id = ${id}
    RETURNING *
  `;

  const row = rows[0] as Record<string, unknown> | undefined;
  return row ? rowToCliente(row) : null;
}

/** Atualiza dados parciais do cliente (nome, contato, endereço). Usado por api/usuario/meus-dados. */
export interface ClienteDadosParciaisInput {
  nome?: string;
  cpf?: string;
  celular?: string;
  razaoSocial?: string;
  cnpj?: string;
  site?: string;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoUf?: string;
  enderecoCep?: string;
}

export async function updateClienteDadosParciais(clienteId: string, input: ClienteDadosParciaisInput): Promise<void> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const nome = trimSlice(input.nome, 150) ?? '';
  const razaoSocial = trimSlice(input.razaoSocial, 200) ?? '';
  const uf = input.enderecoUf ? (trimSlice(input.enderecoUf, 2)?.toUpperCase() ?? null) : null;
  await sql`
    UPDATE clientes SET
      nome = ${nome},
      cpf = ${trimSlice(input.cpf, 14)},
      celular = ${trimSlice(input.celular, 20)},
      razao_social = ${razaoSocial},
      cnpj = ${trimSlice(input.cnpj, 18)},
      site = ${trimSlice(input.site, 200)},
      endereco_logradouro = ${trimSlice(input.enderecoLogradouro, 150)},
      endereco_numero = ${trimSlice(input.enderecoNumero, 20)},
      endereco_complemento = ${trimSlice(input.enderecoComplemento, 80)},
      endereco_bairro = ${trimSlice(input.enderecoBairro, 80)},
      endereco_cidade = ${trimSlice(input.enderecoCidade, 80)},
      endereco_uf = ${uf},
      endereco_cep = ${trimSlice(input.enderecoCep, 10)}
    WHERE id = ${clienteId}
  `;
}

/** Remove a conta do cliente (exclusão definitiva). */
export async function deleteCliente(clienteId: string): Promise<boolean> {
  if (!sql) return false;
  const rows = await sql`
    DELETE FROM clientes WHERE id = ${clienteId}
    RETURNING id
  `;
  return (Array.isArray(rows) ? rows : rows ?? []).length > 0;
}
