/**
 * Persistência de propostas no PostgreSQL (Neon).
 * Estrutura reflete os campos do formulário Nova proposta.
 */

import { sql } from './db';
import type { Proposal, ProposalItem } from './proposalData';

export const PROPOSAL_VALID_HOURS = 24;

function gerarCodigoProposta(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i++)
    suffix += chars[Math.floor(Math.random() * chars.length)];
  return `PROP-${y}${m}${d}-${suffix}`;
}

const SERVICO_LABELS: Record<number, string> = { 0: 'Site', 1: 'Landing Page' };

type PropostaRow = {
  slug: string;
  codigo: string;
  empresa: string;
  cliente: string;
  servico: number;
  preco: number;
  manutencao: boolean;
  preco_manutencao: number;
  enviado_em: Date | string;
};

function rowToProposal(row: PropostaRow): Proposal {
  const enviadoEm =
    typeof row.enviado_em === 'string'
      ? row.enviado_em
      : (row.enviado_em as Date).toISOString();

  const precoReais = (Number(row.preco) || 0) / 100;
  const precoManutencaoReais = (Number(row.preco_manutencao) || 0) / 100;
  const temManutencao = row.manutencao === true && precoManutencaoReais > 0;
  const servicoLabel = SERVICO_LABELS[row.servico] ?? 'Site';

  const itens: ProposalItem[] = [
    { descricao: servicoLabel, valor: precoReais },
    ...(temManutencao ? [{ descricao: 'Manutenção', valor: precoManutencaoReais }] : []),
  ];

  return {
    slug: row.slug,
    codigo: row.codigo,
    cliente: row.cliente,
    empresa: row.empresa,
    enviadoEm,
    itens,
    observacoes: 'Proposta válida por 24 horas após o envio.',
  };
}

export async function getProposalBySlug(slug: string): Promise<Proposal | null> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT slug, codigo, empresa, cliente, servico, preco, manutencao, preco_manutencao, enviado_em
    FROM propostas
    WHERE slug = ${slug}
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  return rowToProposal(row as PropostaRow);
}

export interface UpsertProposalInput {
  slug: string;
  empresa: string;
  cliente: string;
  servico: string;
  preco: number;
  manutencao: '' | 'sim';
  precoManutencao: number;
}

export async function upsertProposal(input: UpsertProposalInput): Promise<Proposal> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const codigo = gerarCodigoProposta();
  const enviadoEm = new Date().toISOString();

  const servicoInt = input.servico === 'Landing Page' ? 1 : 0;
  const precoCentavos = Math.round(input.preco * 100);
  const precoManutencaoCentavos = Math.round(input.precoManutencao * 100);
  const manutencaoBool = input.manutencao === 'sim';

  await sql`
    INSERT INTO propostas (slug, codigo, empresa, cliente, servico, preco, manutencao, preco_manutencao, enviado_em)
    VALUES (
      ${input.slug.slice(0, 120)},
      ${codigo},
      ${input.empresa.trim().slice(0, 150)},
      ${input.cliente.trim().slice(0, 150)},
      ${servicoInt},
      ${precoCentavos},
      ${manutencaoBool},
      ${precoManutencaoCentavos},
      ${enviadoEm}::timestamptz
    )
    ON CONFLICT (slug) DO UPDATE SET
      codigo = EXCLUDED.codigo,
      empresa = EXCLUDED.empresa,
      cliente = EXCLUDED.cliente,
      servico = EXCLUDED.servico,
      preco = EXCLUDED.preco,
      manutencao = EXCLUDED.manutencao,
      preco_manutencao = EXCLUDED.preco_manutencao,
      enviado_em = EXCLUDED.enviado_em
  `;

  return rowToProposal({
    slug: input.slug,
    codigo,
    empresa: input.empresa.trim(),
    cliente: input.cliente.trim(),
    servico: servicoInt,
    preco: precoCentavos,
    manutencao: manutencaoBool,
    preco_manutencao: precoManutencaoCentavos,
    enviado_em: enviadoEm,
  });
}

export async function getProposalsAtivas(): Promise<Proposal[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT slug, codigo, empresa, cliente, servico, preco, manutencao, preco_manutencao, enviado_em
    FROM propostas
    WHERE enviado_em > NOW() - INTERVAL '24 hours'
    ORDER BY enviado_em DESC
  `;
  return (rows as PropostaRow[]).map(rowToProposal);
}

export async function getProposalsExpiradas(): Promise<Proposal[]> {
  if (!sql) throw new Error('Banco de dados não configurado.');
  const rows = await sql`
    SELECT slug, codigo, empresa, cliente, servico, preco, manutencao, preco_manutencao, enviado_em
    FROM propostas
    WHERE enviado_em <= NOW() - INTERVAL '24 hours'
    ORDER BY enviado_em DESC
  `;
  return (rows as PropostaRow[]).map(rowToProposal);
}

export function isProposalExpired(proposal: Proposal): boolean {
  const sent = new Date(proposal.enviadoEm).getTime();
  const now = Date.now();
  return now - sent > PROPOSAL_VALID_HOURS * 60 * 60 * 1000;
}

export function getRemainingMs(proposal: Proposal): number {
  const sent = new Date(proposal.enviadoEm).getTime();
  const expiresAt = sent + PROPOSAL_VALID_HOURS * 60 * 60 * 1000;
  return Math.max(0, expiresAt - Date.now());
}
