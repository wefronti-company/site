import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsuarioByCodigoReferenciaIncludeInativo, validarCodigoReferencia } from '../../../lib/usuarioDb';
import { DEFAULT_WHATSAPP_NUMBER } from '../../../lib/whatsapp';

function toInternationalWhatsapp(value: string | undefined): string {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return DEFAULT_WHATSAPP_NUMBER;
  if (digits.startsWith('55')) return digits;
  return `55${digits}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ref = typeof req.query.ref === 'string' ? req.query.ref.trim().toLowerCase() : '';
  if (!ref || !validarCodigoReferencia(ref)) {
    return res.status(400).json({ error: 'Código de referência inválido.' });
  }

  const usuario = await getUsuarioByCodigoReferenciaIncludeInativo(ref);
  if (!usuario || !usuario.ativo) {
    return res.status(404).json({ error: 'Link indisponível.' });
  }

  return res.status(200).json({
    nome: usuario.nomeCompleto || '',
    whatsappNumero: toInternationalWhatsapp(usuario.whatsappNumero),
    whatsappMensagem: usuario.whatsappMensagem || '',
  });
}

