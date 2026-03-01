/**
 * API para registrar eventos de segurança (chamada pelo middleware).
 * Protegida por header X-Security-Log-Secret.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { insertSecurityEvent } from '../../../lib/securityEventsDb';

const SECRET = process.env.SECURITY_LOG_SECRET || 'dev-internal-secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = req.headers['x-security-log-secret'];
  if (secret !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = req.body as Record<string, unknown>;
  const tipo = typeof body.tipo === 'string' ? body.tipo.slice(0, 64) : '';
  const ip = typeof body.ip === 'string' ? body.ip.slice(0, 64) : undefined;
  const path = typeof body.path === 'string' ? body.path.slice(0, 512) : undefined;
  const user_agent = typeof body.user_agent === 'string' ? body.user_agent : undefined;
  const detalhes = typeof body.detalhes === 'string' ? body.detalhes.slice(0, 500) : undefined;

  if (!tipo) {
    return res.status(400).json({ error: 'tipo é obrigatório' });
  }

  try {
    await insertSecurityEvent({ tipo, ip, path, user_agent, detalhes });
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[security-event]', e);
    return res.status(500).json({ error: 'Erro ao registrar evento' });
  }
}
