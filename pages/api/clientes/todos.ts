import type { NextApiRequest, NextApiResponse } from 'next';
import { getClientesTodos } from '../../../lib/clientDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const clientes = await getClientesTodos();
  return res.status(200).json(clientes);
}
