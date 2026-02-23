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
  /** Total mensal (precoServico + precoManutencao quando aplicável). Usado em receita e clientes ativos. */
  mensalidade: number;
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
  const rows = await sql`
    SELECT c.*, (p.id IS NOT NULL) AS pago
    FROM clientes c
    LEFT JOIN pagamentos_mensalidade p ON p.cliente_id = c.id AND p.mes_ref = ${mesRef}
    WHERE c.status != 2 AND c.mensalidade > 0 AND p.id IS NOT NULL
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

export async function getClienteById(id: string): Promise<Cliente | null> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT * FROM clientes WHERE id = ${id}
  `;
  const row = rows[0] as Record<string, unknown> | undefined;
  return row ? rowToCliente(row) : null;
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
  /** Total mensal (calculado: precoServico + precoManutencao se manutencao). Usado em receita. */
  mensalidade?: number;
}

function trimSlice(str: string | undefined, max: number): string | null {
  if (!str || !str.trim()) return null;
  return str.trim().slice(0, max) || null;
}

function computeMensalidade(input: CreateClienteInput): number {
  const precoServico = input.precoServico ?? 0;
  const precoManutencao = (input.manutencao ? (input.precoManutencao ?? 0) : 0);
  const computed = precoServico + precoManutencao;
  return input.mensalidade != null && input.mensalidade > 0 ? input.mensalidade : computed;
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
      servico_tipo, manutencao, preco_servico, preco_manutencao, mensalidade
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
      ${servicoTipo}, ${manutencao}, ${precoServicoCentavos}, ${precoManutencaoCentavos}, ${mensalidadeCentavos}
    )
    RETURNING id, nome, email, cpf, telefone, celular, cargo,
      razao_social, nome_fantasia, cnpj, ie,
      endereco_logradouro, endereco_numero, endereco_complemento,
      endereco_bairro, endereco_cidade, endereco_uf, endereco_cep,
      telefone_empresa, site, ramo, observacoes,
      servico_tipo, manutencao, preco_servico, preco_manutencao, mensalidade, status, criado_em
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
      mensalidade = ${mensalidadeCentavos}
    WHERE id = ${id}
    RETURNING id, nome, email, cpf, telefone, celular, cargo,
      razao_social, nome_fantasia, cnpj, ie,
      endereco_logradouro, endereco_numero, endereco_complemento,
      endereco_bairro, endereco_cidade, endereco_uf, endereco_cep,
      telefone_empresa, site, ramo, observacoes,
      servico_tipo, manutencao, preco_servico, preco_manutencao, mensalidade, status, criado_em
  `;

  const row = rows[0] as Record<string, unknown> | undefined;
  return row ? rowToCliente(row) : null;
}
