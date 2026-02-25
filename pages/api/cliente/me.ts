import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyClienteSessionToken, COOKIE_NAME } from '../../../lib/auth-cliente';
import { getClienteById } from '../../../lib/clientDb';

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
    return res.status(401).json({ error: 'Cliente não encontrado.' });
  }

  return res.status(200).json({
    id: cliente.id,
    nomeCompleto: cliente.nome,
    email: cliente.email,
    celular: cliente.celular ?? '',
    cpf: cliente.cpf ?? '',
    enderecoLogradouro: cliente.enderecoLogradouro ?? '',
    enderecoNumero: cliente.enderecoNumero ?? '',
    enderecoComplemento: cliente.enderecoComplemento ?? '',
    enderecoBairro: cliente.enderecoBairro ?? '',
    enderecoCidade: cliente.enderecoCidade ?? '',
    enderecoUf: cliente.enderecoUf ?? '',
    enderecoCep: cliente.enderecoCep ?? '',
  });
}
