import type { NextApiRequest, NextApiResponse } from 'next';
import { getDashboardDados } from '../../lib/dashboardDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const dados = await getDashboardDados();
  return res.status(200).json(dados);
}
