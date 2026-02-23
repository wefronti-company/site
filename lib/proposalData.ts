/**
 * Dados de propostas comerciais.
 * Por enquanto mock/storage estático.
 * Futuro: substituir por API/banco.
 */

export interface ProposalItem {
  descricao: string;
  valor: number;
}

export interface Proposal {
  slug: string;
  codigo: string; // Código único da proposta (ex: PROP-20250214-A7B2)
  cliente: string;
  empresa?: string;
  enviadoEm: string; // ISO date - início das 24h
  itens: ProposalItem[];
  observacoes?: string;
  linkAtivo?: boolean; // false = link indisponível
}

function gerarCodigoProposta(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `PROP-${y}${m}${d}-${suffix}`;
}

let PROPOSALS: Proposal[] = [
  {
    slug: 'empresa01',
    codigo: 'PROP-20250214-EX01',
    cliente: 'João Silva',
    empresa: 'Empresa Exemplo LTDA',
    enviadoEm: new Date().toISOString(),
    itens: [
      { descricao: 'Desenvolvimento de site institucional', valor: 3500 },
      { descricao: 'Manutenção mensal (12 meses)', valor: 300 },
    ],
    observacoes: 'Proposta válida por 24 horas após o envio.',
  },
];

export const PROPOSAL_VALID_HOURS = 24;

export function getProposalBySlug(slug: string): Proposal | null {
  return PROPOSALS.find((p) => p.slug === slug) ?? null;
}

export function addProposal(proposal: Omit<Proposal, 'enviadoEm' | 'codigo'>): Proposal {
  const full: Proposal = {
    ...proposal,
    codigo: gerarCodigoProposta(),
    enviadoEm: new Date().toISOString(),
  };
  PROPOSALS = [...PROPOSALS.filter((p) => p.slug !== full.slug), full];
  return full;
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
