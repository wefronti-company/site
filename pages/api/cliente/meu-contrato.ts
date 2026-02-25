import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyClienteSessionToken, COOKIE_NAME } from '../../../lib/auth-cliente';
import { getClienteById, getPagamentosByClienteId } from '../../../lib/clientDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getTokenFromCookie(req);
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }

  const payload = await verifyClienteSessionToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão expirada.' });
  }

  const cliente = await getClienteById(payload.clienteId);
  if (!cliente) {
    return res.status(200).json({ cliente: null, pagamentos: [] });
  }

  const pagamentos = await getPagamentosByClienteId(cliente.id);
  const raw = cliente as { progressoProjeto?: number };

  return res.status(200).json({
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      nomeFantasia: cliente.nomeFantasia,
      razaoSocial: cliente.razaoSocial,
      servicoTipo: cliente.servicoTipo ?? null,
      manutencao: cliente.manutencao ?? false,
      precoServico: cliente.precoServico ?? 0,
      precoManutencao: cliente.precoManutencao ?? 0,
      mensalidade: cliente.mensalidade ?? 0,
      progressoProjeto: raw.progressoProjeto ?? 0,
      formaPagamentoProjeto: cliente.formaPagamentoProjeto ?? null,
    },
    pagamentos,
  });
}

