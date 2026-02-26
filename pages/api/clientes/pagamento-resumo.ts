import type { NextApiRequest, NextApiResponse } from 'next';
import { getClientesAtivos, getClientesInadimplentes, getClientesQuePagaramEmData } from '../../../lib/clientDb';
import { getPagamentoResumoPorMes, getPagamentoResumoPorData, getMesRef, getPagamentosPorDia } from '../../../lib/metasDb';

function parseMesRef(queryMes: unknown): number {
  if (typeof queryMes === 'string') {
    const n = parseInt(queryMes, 10);
    if (!isNaN(n) && n >= 202001 && n <= 209912) return n;
  }
  return getMesRef();
}

function parseData(queryData: unknown): string | null {
  if (typeof queryData !== 'string') return null;
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(queryData.trim());
  if (!match) return null;
  const d = new Date(queryData + 'T12:00:00Z');
  return isNaN(d.getTime()) ? null : queryData.trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const dataFiltro = parseData(req.query.data);
  const mesRef = parseMesRef(req.query.mes);

  try {
    if (dataFiltro) {
      const [resumo, ativos] = await Promise.all([
        getPagamentoResumoPorData(dataFiltro),
        getClientesQuePagaramEmData(dataFiltro),
      ]);
      return res.status(200).json({
        ...resumo,
        ativos,
        inadimplentes: [],
        pagamentosPorDia: {},
      });
    }
    const [resumo, ativos, inadimplentes, pagamentosPorDia] = await Promise.all([
      getPagamentoResumoPorMes(mesRef),
      getClientesAtivos(mesRef),
      getClientesInadimplentes(mesRef),
      getPagamentosPorDia(mesRef),
    ]);
    return res.status(200).json({
      ...resumo,
      ativos,
      inadimplentes,
      pagamentosPorDia,
    });
  } catch (e) {
    console.error('[pagamento-resumo]', e);
    return res.status(500).json({ error: 'Erro ao buscar dados.' });
  }
}
