import type { NextApiRequest, NextApiResponse } from 'next';
import { updateClienteStatus } from '../../../../lib/clientDb';
import type { ClienteStatus } from '../../../../lib/clientDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!id) return res.status(400).json({ error: 'ID inválido.' });
  const status = req.body?.status;
  if (typeof status !== 'number' || ![0, 1, 2].includes(status)) {
    return res.status(400).json({ error: 'Status inválido. Use 0 (ativo), 1 (inativo) ou 2 (desligado).' });
  }
  await updateClienteStatus(id, status as ClienteStatus);
  return res.status(200).json({ ok: true });
}
