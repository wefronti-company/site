import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyUsuarioSessionToken } from '../../../lib/auth-usuario';
import { COOKIE_NAME } from '../../../lib/auth-usuario';
import { getUsuarioById, getTotalIndicacoes } from '../../../lib/usuarioDb';

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

  const payload = await verifyUsuarioSessionToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão expirada.' });
  }

  const usuario = await getUsuarioById(payload.usuarioId);
  if (!usuario) {
    return res.status(401).json({ error: 'Usuário não encontrado.' });
  }

  const totalIndicacoes = await getTotalIndicacoes(usuario.id);

  return res.status(200).json({
    id: usuario.id,
    nomeCompleto: usuario.nomeCompleto,
    email: usuario.email,
    codigoReferencia: usuario.codigoReferencia,
    celular: usuario.celular ?? '',
    dataNascimento: usuario.dataNascimento ?? '',
    cpf: usuario.cpf ?? '',
    enderecoLogradouro: usuario.enderecoLogradouro ?? '',
    enderecoNumero: usuario.enderecoNumero ?? '',
    enderecoComplemento: usuario.enderecoComplemento ?? '',
    enderecoBairro: usuario.enderecoBairro ?? '',
    enderecoCidade: usuario.enderecoCidade ?? '',
    enderecoUf: usuario.enderecoUf ?? '',
    enderecoCep: usuario.enderecoCep ?? '',
    chavePix: usuario.chavePix ?? '',
    banco: usuario.banco ?? '',
    nomeTitular: usuario.nomeTitular ?? '',
    ativo: usuario.ativo !== false,
    totalIndicacoes,
  });
}
