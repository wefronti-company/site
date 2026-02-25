/**
 * Persistência de clientes no PostgreSQL (Neon).
 */

import { createHash } from 'crypto';
import { sql } from './db';
import { verifyCodigoAcesso, hashCodigoAcesso } from './auth';

export type ClienteStatus = 0 | 1 | 2; // 0=ativo, 1=inativo, 2=desligado

export type ClienteEtiqueta = 'ativo' | 'inadimplente' | 'desligado';

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  celular?: string;
  cargo?: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj?: string;
  ie?: string;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoUf?: string;
  enderecoCep?: string;
  telefoneEmpresa?: string;
  site?: string;
  ramo?: string;
  observacoes?: string;
  /** Serviço contratado: Site ou Landing Page */
  servicoTipo?: string;
  /** Cliente tem plano de manutenção */
  manutencao?: boolean;
  /** Preço do serviço em reais */
  precoServico?: number;
  /** Preço da manutenção em reais (quando manutencao=true) */
  precoManutencao?: number;
  /** Total mensal (apenas valor da manutenção; o que o cliente paga todo mês). Usado em receita e clientes ativos. */
  mensalidade: number;
  /** Forma de pagamento do projeto: 'cartao' | 'pix' | '50_50' (50% entrada, 50% entrega). */
  formaPagamentoProjeto?: string;
  /** Número de parcelas quando forma de pagamento é cartão. */
  parcelasCartao?: number;
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
    telefone: row.telefone ? String(row.telefone) : undefined,
    celular: row.celular ? String(row.celular) : undefined,
    cargo: row.cargo ? String(row.cargo) : undefined,
    razaoSocial: String(row.razao_social ?? ''),
    nomeFantasia: row.nome_fantasia ? String(row.nome_fantasia) : undefined,
    cnpj: row.cnpj ? String(row.cnpj) : undefined,
    ie: row.ie ? String(row.ie) : undefined,
    enderecoLogradouro: row.endereco_logradouro ? String(row.endereco_logradouro) : undefined,
    enderecoNumero: row.endereco_numero ? String(row.endereco_numero) : undefined,
    enderecoComplemento: row.endereco_complemento ? String(row.endereco_complemento) : undefined,
    enderecoBairro: row.endereco_bairro ? String(row.endereco_bairro) : undefined,
    enderecoCidade: row.endereco_cidade ? String(row.endereco_cidade) : undefined,
    enderecoUf: row.endereco_uf ? String(row.endereco_uf) : undefined,
    enderecoCep: row.endereco_cep ? String(row.endereco_cep) : undefined,
    telefoneEmpresa: row.telefone_empresa ? String(row.telefone_empresa) : undefined,
    site: row.site ? String(row.site) : undefined,
    ramo: row.ramo ? String(row.ramo) : undefined,
    observacoes: row.observacoes ? String(row.observacoes) : undefined,
    servicoTipo: row.servico_tipo ? String(row.servico_tipo) : undefined,
    manutencao: Boolean(row.manutencao),
    precoServico: (Number(row.preco_servico) || 0) / 100,
    precoManutencao: (Number(row.preco_manutencao) || 0) / 100,
    mensalidade: (Number(row.mensalidade) || 0) / 100,
    formaPagamentoProjeto: row.forma_pagamento_projeto ? String(row.forma_pagamento_projeto) : undefined,
    parcelasCartao: row.parcelas_cartao != null ? Number(row.parcelas_cartao) : undefined,
    status: (row.status as ClienteStatus) ?? 0,
    criadoEm,
  };
}

function rowToClienteComPagamento(row: Record<string, unknown>, mensalidadePaga: boolean, etiqueta?: ClienteEtiqueta): ClienteComPagamento {
  const c = rowToCliente(row);
  return { ...c, mensalidadePaga, etiqueta };
}

export async function getClientesAtivos(mesRefParam?: number): Promise<ClienteComPagamento[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const mesRef = mesRefParam ?? getMesRef();
  await moveOverdueToInativos(mesRef);
  const rows = await sql`
    SELECT c.*, (p.id IS NOT NULL) AS pago
    FROM clientes c
    LEFT JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    WHERE c.status != 2
    ORDER BY c.nome_fantasia, c.razao_social
  `;
  return (rows as (Record<string, unknown> & { pago: boolean })[]).map((r) => {
    const { pago, ...rest } = r;
    return rowToClienteComPagamento(rest, !!pago, 'ativo');
  });
}

export async function getClientesInadimplentes(mesRefParam?: number): Promise<ClienteComPagamento[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const mesRef = mesRefParam ?? getMesRef();
  const rows = await sql`
    SELECT c.*, FALSE AS pago
    FROM clientes c
    LEFT JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    WHERE c.status != 2 AND c.mensalidade > 0 AND p.id IS NULL
    ORDER BY c.nome_fantasia, c.razao_social
  `;
  return (rows as Record<string, unknown>[]).map((r) => rowToClienteComPagamento(r, false, 'inadimplente'));
}

export async function getClientesDesligados(): Promise<ClienteComPagamento[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT c.*, FALSE AS pago
    FROM clientes c
    WHERE c.status = 2
    ORDER BY c.nome_fantasia, c.razao_social
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
          OR nome_fantasia ILIKE ${pattern}
          OR razao_social ILIKE ${pattern}
          OR email ILIKE ${pattern}
          OR (cpf IS NOT NULL AND regexp_replace(cpf, '[^0-9]', '', 'g') LIKE ${digitsPattern})
          OR (cnpj IS NOT NULL AND regexp_replace(cnpj, '[^0-9]', '', 'g') LIKE ${digitsPattern})
        ORDER BY nome_fantasia NULLS LAST, razao_social
        LIMIT 10
      `
    : await sql`
        SELECT * FROM clientes
        WHERE
          nome ILIKE ${pattern}
          OR nome_fantasia ILIKE ${pattern}
          OR razao_social ILIKE ${pattern}
          OR email ILIKE ${pattern}
        ORDER BY nome_fantasia NULLS LAST, razao_social
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
  const mesRef = getMesRef();
  const rows = await sql`
    SELECT c.*, (p.id IS NOT NULL) AS pago
    FROM clientes c
    LEFT JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    ORDER BY c.status, c.nome_fantasia, c.razao_social
  `;
  return (rows as (Record<string, unknown> & { pago: boolean })[]).map((r) => {
    const { pago, ...rest } = r;
    const c = rowToCliente(rest);
    const pagoBool = !!r.pago;
    let etiqueta: ClienteEtiqueta;
    if (c.status === 2) etiqueta = 'desligado';
    else if (c.mensalidade > 0 && !pagoBool) etiqueta = 'inadimplente';
    else etiqueta = 'ativo';
    return rowToClienteComPagamento(rest, pagoBool, etiqueta);
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
  telefone?: string;
  celular?: string;
  cargo?: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj?: string;
  ie?: string;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoUf?: string;
  enderecoCep?: string;
  telefoneEmpresa?: string;
  site?: string;
  ramo?: string;
  observacoes?: string;
  /** Tipo de serviço: 'Site' ou 'Landing Page' */
  servicoTipo?: string;
  /** Cliente tem manutenção */
  manutencao?: boolean;
  /** Preço do serviço em reais */
  precoServico?: number;
  /** Preço da manutenção em reais (quando manutencao=true) */
  precoManutencao?: number;
  /** Total mensal (calculado: apenas precoManutencao quando manutencao; valor que o cliente paga todo mês). Usado em receita. */
  mensalidade?: number;
  /** Forma de pagamento do projeto: 'cartao' | 'pix' | '50_50' */
  formaPagamentoProjeto?: string;
  /** Número de parcelas quando forma de pagamento é cartão */
  parcelasCartao?: number;
}

function trimSlice(str: string | undefined, max: number): string | null {
  if (!str || !str.trim()) return null;
  return str.trim().slice(0, max) || null;
}

function computeMensalidade(input: CreateClienteInput): number {
  if (input.mensalidade != null && input.mensalidade > 0) return input.mensalidade;
  // Mensalidade = apenas o valor da manutenção (não inclui o valor do projeto)
  const precoManutencao = input.manutencao ? (input.precoManutencao ?? 0) : 0;
  return precoManutencao;
}

export async function createCliente(input: CreateClienteInput): Promise<Cliente> {
  if (!sql) throw new Error('Banco de dados não configurado.');

  const mensalidadeReais = computeMensalidade(input);
  const mensalidadeCentavos = Math.round(mensalidadeReais * 100);
  const precoServicoCentavos = Math.round((input.precoServico ?? 0) * 100);
  const precoManutencaoCentavos = Math.round((input.precoManutencao ?? 0) * 100);
  const servicoTipo = trimSlice(input.servicoTipo, 50) ?? null;
  const manutencao = Boolean(input.manutencao);

  const rows = await sql`
    INSERT INTO clientes (
      nome, email, cpf, telefone, celular, cargo,
      razao_social, nome_fantasia, cnpj, ie,
      endereco_logradouro, endereco_numero, endereco_complemento,
      endereco_bairro, endereco_cidade, endereco_uf, endereco_cep,
      telefone_empresa, site, ramo, observacoes,
      servico_tipo, manutencao, preco_servico, preco_manutencao, mensalidade, forma_pagamento_projeto
    )
    VALUES (
      ${trimSlice(input.nome, 150) ?? ''},
      ${trimSlice(input.email, 254) ?? ''},
      ${trimSlice(input.cpf, 14)},
      ${trimSlice(input.telefone, 20)},
      ${trimSlice(input.celular, 20)},
      ${trimSlice(input.cargo, 80)},
      ${trimSlice(input.razaoSocial, 200) ?? ''},
      ${trimSlice(input.nomeFantasia, 150)},
      ${trimSlice(input.cnpj, 18)},
      ${trimSlice(input.ie, 25)},
      ${trimSlice(input.enderecoLogradouro, 150)},
      ${trimSlice(input.enderecoNumero, 20)},
      ${trimSlice(input.enderecoComplemento, 80)},
      ${trimSlice(input.enderecoBairro, 80)},
      ${trimSlice(input.enderecoCidade, 80)},
      ${input.enderecoUf ? (trimSlice(input.enderecoUf, 2)?.toUpperCase() ?? null) : null},
      ${trimSlice(input.enderecoCep, 10)},
      ${trimSlice(input.telefoneEmpresa, 20)},
      ${trimSlice(input.site, 200)},
      ${trimSlice(input.ramo, 100)},
      ${trimSlice(input.observacoes, 500)},
      ${servicoTipo}, ${manutencao}, ${precoServicoCentavos}, ${precoManutencaoCentavos}, ${mensalidadeCentavos},
      ${trimSlice(input.formaPagamentoProjeto, 20)}
    )
    RETURNING id, nome, email, cpf, telefone, celular, cargo,
      razao_social, nome_fantasia, cnpj, ie,
      endereco_logradouro, endereco_numero, endereco_complemento,
      endereco_bairro, endereco_cidade, endereco_uf, endereco_cep,
      telefone_empresa, site, ramo, observacoes,
      servico_tipo, manutencao, preco_servico, preco_manutencao, mensalidade, forma_pagamento_projeto, status, criado_em
  `;

  const row = rows[0] as Record<string, unknown>;
  return rowToCliente(row);
}

export async function updateCliente(id: string, input: CreateClienteInput): Promise<Cliente | null> {
  if (!sql) throw new Error('Banco de dados não configurado.');

  const mensalidadeReais = computeMensalidade(input);
  const mensalidadeCentavos = Math.round(mensalidadeReais * 100);
  const precoServicoCentavos = Math.round((input.precoServico ?? 0) * 100);
  const precoManutencaoCentavos = Math.round((input.precoManutencao ?? 0) * 100);
  const servicoTipo = trimSlice(input.servicoTipo, 50) ?? null;
  const manutencao = Boolean(input.manutencao);

  const rows = await sql`
    UPDATE clientes SET
      nome = ${trimSlice(input.nome, 150) ?? ''},
      email = ${trimSlice(input.email, 254) ?? ''},
      cpf = ${trimSlice(input.cpf, 14)},
      telefone = ${trimSlice(input.telefone, 20)},
      celular = ${trimSlice(input.celular, 20)},
      cargo = ${trimSlice(input.cargo, 80)},
      razao_social = ${trimSlice(input.razaoSocial, 200) ?? ''},
      nome_fantasia = ${trimSlice(input.nomeFantasia, 150)},
      cnpj = ${trimSlice(input.cnpj, 18)},
      ie = ${trimSlice(input.ie, 25)},
      endereco_logradouro = ${trimSlice(input.enderecoLogradouro, 150)},
      endereco_numero = ${trimSlice(input.enderecoNumero, 20)},
      endereco_complemento = ${trimSlice(input.enderecoComplemento, 80)},
      endereco_bairro = ${trimSlice(input.enderecoBairro, 80)},
      endereco_cidade = ${trimSlice(input.enderecoCidade, 80)},
      endereco_uf = ${input.enderecoUf ? (trimSlice(input.enderecoUf, 2)?.toUpperCase() ?? null) : null},
      endereco_cep = ${trimSlice(input.enderecoCep, 10)},
      telefone_empresa = ${trimSlice(input.telefoneEmpresa, 20)},
      site = ${trimSlice(input.site, 200)},
      ramo = ${trimSlice(input.ramo, 100)},
      observacoes = ${trimSlice(input.observacoes, 500)},
      servico_tipo = ${servicoTipo},
      manutencao = ${manutencao},
      preco_servico = ${precoServicoCentavos},
      preco_manutencao = ${precoManutencaoCentavos},
      mensalidade = ${mensalidadeCentavos},
      forma_pagamento_projeto = ${trimSlice(input.formaPagamentoProjeto, 20)},
      parcelas_cartao = ${input.parcelasCartao != null && input.parcelasCartao >= 1 ? input.parcelasCartao : null}
    WHERE id = ${id}
    RETURNING id, nome, email, cpf, telefone, celular, cargo,
      razao_social, nome_fantasia, cnpj, ie,
      endereco_logradouro, endereco_numero, endereco_complemento,
      endereco_bairro, endereco_cidade, endereco_uf, endereco_cep,
      telefone_empresa, site, ramo, observacoes,
      servico_tipo, manutencao, preco_servico, preco_manutencao, mensalidade, forma_pagamento_projeto, parcelas_cartao, status, criado_em
  `;

  const row = rows[0] as Record<string, unknown> | undefined;
  return row ? rowToCliente(row) : null;
}

/** Dados editáveis pelo cliente no painel (Meus dados). */
export interface PainelDadosInput {
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

/** Atualiza apenas os campos editáveis pelo painel do cliente (não altera serviço, preços, etc.). */
export async function updateClientePainelDados(clienteId: string, input: PainelDadosInput): Promise<void> {
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

// --- Autenticação do painel (login por cliente) ---

/** Retorna id, email e hash para login. Não expõe hash no tipo Cliente. */
export async function getClienteLoginByEmail(email: string): Promise<{ id: string; email: string; codigoAcessoHash: string | null } | null> {
  if (!sql) return null;
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return null;
  try {
    const rows = await sql`
      SELECT id, email, codigo_acesso_hash
      FROM clientes
      WHERE LOWER(TRIM(email)) = ${normalized}
      LIMIT 1
    `;
    const row = (Array.isArray(rows) ? rows[0] : rows?.[0]) as { id: string; email: string; codigo_acesso_hash: string | null } | undefined;
    if (!row) return null;
    return {
      id: String(row.id),
      email: String(row.email),
      codigoAcessoHash: row.codigo_acesso_hash != null && row.codigo_acesso_hash !== '' ? String(row.codigo_acesso_hash) : null,
    };
  } catch {
    return null;
  }
}

export async function verifyClienteSenha(email: string, senha: string): Promise<Cliente | null> {
  const login = await getClienteLoginByEmail(email);
  if (!login?.codigoAcessoHash || !verifyCodigoAcesso(senha, login.codigoAcessoHash)) return null;
  return getClienteById(login.id);
}

/** Cria conta do painel (cliente com email e senha). razao_social vazio. */
export async function createClienteConta(nomeCompleto: string, email: string, senhaHash: string): Promise<Cliente | null> {
  if (!sql) return null;
  const nome = String(nomeCompleto || '').trim().slice(0, 150);
  const emailNorm = String(email || '').trim().toLowerCase();
  if (!emailNorm || !nome) return null;
  const existing = await getClienteByEmail(emailNorm);
  if (existing) return null;
  try {
    const rows = await sql`
      INSERT INTO clientes (nome, email, razao_social, codigo_acesso_hash, mensalidade, status)
      VALUES (${nome}, ${emailNorm}, '', ${senhaHash}, 0, 0)
      RETURNING *
    `;
    const row = (Array.isArray(rows) ? rows[0] : rows?.[0]) as Record<string, unknown> | undefined;
    return row ? rowToCliente(row) : null;
  } catch {
    return null;
  }
}

function hashCodigoReset(codigo: string): string {
  return createHash('sha256').update(codigo).digest('hex');
}

export async function createResetCodigoCliente(clienteId: string): Promise<string> {
  if (!sql) throw new Error('Banco não configurado');
  const codigo = String(Math.floor(100000 + Math.random() * 900000));
  const codigoHash = hashCodigoReset(codigo);
  const expiraEm = new Date(Date.now() + 60 * 60 * 1000);
  await sql`DELETE FROM cliente_reset_tokens WHERE cliente_id = ${clienteId}`;
  await sql`
    INSERT INTO cliente_reset_tokens (cliente_id, token, expira_em)
    VALUES (${clienteId}, ${codigoHash}, ${expiraEm})
  `;
  return codigo;
}

export async function validarCodigoResetCliente(email: string, codigo: string): Promise<string | null> {
  if (!sql || !codigo || codigo.length !== 6) return null;
  const codigoHash = hashCodigoReset(codigo);
  const emailNorm = email.trim().toLowerCase();
  const rows = await sql`
    SELECT r.cliente_id
    FROM cliente_reset_tokens r
    JOIN clientes c ON c.id = r.cliente_id AND LOWER(TRIM(c.email)) = ${emailNorm}
    WHERE r.token = ${codigoHash}
      AND r.usado = false
      AND r.expira_em > NOW()
    LIMIT 1
  `;
  const row = (Array.isArray(rows) ? rows[0] : rows?.[0]) as { cliente_id: string } | undefined;
  return row ? row.cliente_id : null;
}

export async function consumirCodigoEAtualizarSenhaCliente(
  email: string,
  codigo: string,
  novaSenhaHash: string
): Promise<boolean> {
  if (!sql || !codigo || codigo.length !== 6) return false;
  const codigoHash = hashCodigoReset(codigo);
  const emailNorm = email.trim().toLowerCase();
  const rows = await sql`
    UPDATE cliente_reset_tokens r
    SET usado = true
    FROM clientes c
    WHERE r.cliente_id = c.id
      AND LOWER(TRIM(c.email)) = ${emailNorm}
      AND r.token = ${codigoHash}
      AND r.usado = false
      AND r.expira_em > NOW()
    RETURNING r.cliente_id
  `;
  const clienteId = (Array.isArray(rows) ? rows[0] : rows?.[0]) as { cliente_id?: string } | undefined;
  if (!clienteId?.cliente_id) return false;
  await sql`
    UPDATE clientes
    SET codigo_acesso_hash = ${novaSenhaHash}
    WHERE id = ${clienteId.cliente_id}
  `;
  return true;
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
