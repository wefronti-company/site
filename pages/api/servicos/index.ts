import type { NextApiRequest, NextApiResponse } from 'next';
import { getServicos, createServico } from '../../../lib/servicosDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const servicos = await getServicos();
    return res.status(200).json(servicos);
  }
  if (req.method === 'POST') {
    const body = req.body as Record<string, unknown>;
    const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
    if (!nome) {
      return res.status(400).json({ error: 'Nome do serviço é obrigatório.' });
    }
    const servico = await createServico(nome);
    return res.status(201).json(servico);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
