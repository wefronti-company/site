import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyUsuarioSessionToken } from '../../../lib/auth-usuario';
import { COOKIE_NAME } from '../../../lib/auth-usuario';
import { updateUsuarioPerfil } from '../../../lib/usuarioDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function normalizeWhatsappForStorage(value: string | undefined): string | undefined {
  if (typeof value !== 'string') return undefined;
  const digits = value.replace(/\D/g, '');
  if (!digits) return undefined;
  const local = digits.startsWith('55') && digits.length >= 12 ? digits.slice(2) : digits;
  return `55${local}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
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

  const body = req.body || {};
  const str = (v: unknown) => (typeof v === 'string' ? v : undefined);

  await updateUsuarioPerfil(payload.usuarioId, {
    nomeCompleto: str(body.nomeCompleto),
    celular: str(body.celular),
    dataNascimento: str(body.dataNascimento),
    cpf: str(body.cpf),
    enderecoLogradouro: str(body.enderecoLogradouro),
    enderecoNumero: str(body.enderecoNumero),
    enderecoComplemento: str(body.enderecoComplemento),
    enderecoBairro: str(body.enderecoBairro),
    enderecoCidade: str(body.enderecoCidade),
    enderecoUf: str(body.enderecoUf),
    enderecoCep: str(body.enderecoCep),
    chavePix: str(body.chavePix),
    banco: str(body.banco),
    nomeTitular: str(body.nomeTitular),
    whatsappNumero: normalizeWhatsappForStorage(str(body.whatsappNumero)),
    whatsappMensagem: str(body.whatsappMensagem),
  });

  return res.status(200).json({ ok: true });
}
