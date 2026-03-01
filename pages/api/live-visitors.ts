/**
 * API pública: visitantes únicos nos últimos 5 minutos.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getLiveVisitorCount } from '../../lib/siteViewsDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const count = await getLiveVisitorCount(5);
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({ count });
  } catch (e) {
    console.error('[live-visitors]', e);
    return res.status(500).json({ count: 0 });
  }
}
