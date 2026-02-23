import type { NextApiRequest, NextApiResponse } from 'next';
import { getProposalsExpiradas } from '../../../lib/proposalDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const propostas = await getProposalsExpiradas();
  return res.status(200).json(propostas);
}
