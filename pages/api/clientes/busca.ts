import type { NextApiRequest, NextApiResponse } from 'next';
import { buscarClientes } from '../../../lib/clientDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (!q) {
    return res.status(200).json([]);
  }
  try {
    const clientes = await buscarClientes(q);
    return res.status(200).json(clientes);
  } catch (e) {
    console.error('[clientes/busca]', e);
    return res.status(500).json({ error: 'Erro ao buscar clientes.' });
  }
}
