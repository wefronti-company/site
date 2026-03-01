import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyUsuarioSessionToken, COOKIE_NAME } from '../../../lib/auth-usuario';
import { updateUsuarioPerfil } from '../../../lib/usuarioDb';
import { sanitizeTextForStorage, sanitizeAlphanumeric } from '../../../lib/sanitize-server';

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
  const safe = (v: string | undefined, max = 200) =>
    v ? sanitizeTextForStorage(v).slice(0, max) : undefined;

  const cel = str(body.celular);
  const cep = str(body.enderecoCep);
  const uf = str(body.enderecoUf);

  await updateUsuarioPerfil(payload.usuarioId, {
    nomeCompleto: safe(str(body.nomeCompleto), 150),
    celular: cel,
    dataNascimento: str(body.dataNascimento),
    cpf: str(body.cpf),
    enderecoLogradouro: safe(str(body.enderecoLogradouro), 200),
    enderecoNumero: safe(str(body.enderecoNumero), 20),
    enderecoComplemento: safe(str(body.enderecoComplemento), 100),
    enderecoBairro: safe(str(body.enderecoBairro), 100),
    enderecoCidade: safe(str(body.enderecoCidade), 100),
    enderecoUf: uf ? sanitizeAlphanumeric(uf, 2).toUpperCase() : undefined,
    enderecoCep: cep,
    chavePix: safe(str(body.chavePix), 100),
    banco: safe(str(body.banco), 100),
    nomeTitular: safe(str(body.nomeTitular), 150),
    whatsappNumero: normalizeWhatsappForStorage(str(body.whatsappNumero)),
    whatsappMensagem: safe(str(body.whatsappMensagem), 500),
  });

  return res.status(200).json({ ok: true });
}
