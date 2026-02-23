import type { NextApiRequest, NextApiResponse } from 'next';
import { getMetas, updateMetas } from '../../../lib/metasDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const metas = await getMetas();
    return res.status(200).json(metas);
  }
  if (req.method === 'PATCH' || req.method === 'PUT') {
    const body = req.body as Record<string, unknown>;
    const metas = await updateMetas({
      metaReceita: typeof body.metaReceita === 'number' ? body.metaReceita : undefined,
      metaClientes: typeof body.metaClientes === 'number' ? body.metaClientes : undefined,
    });
    return res.status(200).json(metas);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
