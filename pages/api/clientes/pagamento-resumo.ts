import type { NextApiRequest, NextApiResponse } from 'next';
import { getClientesAtivos, getClientesInadimplentes } from '../../../lib/clientDb';
import { getPagamentoResumoPorMes, getMesRef } from '../../../lib/metasDb';

function parseMesRef(queryMes: unknown): number {
  if (typeof queryMes === 'string') {
    const n = parseInt(queryMes, 10);
    if (!isNaN(n) && n >= 202001 && n <= 209912) return n;
  }
  return getMesRef();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const mesRef = parseMesRef(req.query.mes);
  try {
    const [resumo, ativos, inadimplentes] = await Promise.all([
      getPagamentoResumoPorMes(mesRef),
      getClientesAtivos(mesRef),
      getClientesInadimplentes(mesRef),
    ]);
    return res.status(200).json({
      ...resumo,
      ativos,
      inadimplentes,
    });
  } catch (e) {
    console.error('[pagamento-resumo]', e);
    return res.status(500).json({ error: 'Erro ao buscar dados.' });
  }
}
