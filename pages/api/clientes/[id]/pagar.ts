import type { NextApiRequest, NextApiResponse } from 'next';
import { registrarPagamento } from '../../../../lib/clientDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!id) return res.status(400).json({ error: 'ID inválido.' });
  const mesRef = typeof req.body?.mesRef === 'number' ? req.body.mesRef : undefined;
  await registrarPagamento(id, mesRef);
  return res.status(200).json({ ok: true });
}
