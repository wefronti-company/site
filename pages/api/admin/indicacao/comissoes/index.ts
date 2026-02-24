/**
 * GET: lista comissões. POST: registrar pagamento de comissão (admin).
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySessionToken, COOKIE_NAME } from '../../../../../lib/auth';
import { createComissao, listComissoesForAdmin } from '../../../../../lib/comissaoDb';
import { getUsuarioByIdForAdmin } from '../../../../../lib/usuarioDb';
import { createNotificacao } from '../../../../../lib/notificacaoDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const PERCENTUAL_COMISSAO = 0.1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromCookie(req);
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  const payload = await verifySessionToken(token);
  if (!payload) return res.status(401).json({ error: 'Sessão inválida ou expirada' });

  if (req.method === 'GET') {
    try {
      const list = await listComissoesForAdmin();
      return res.status(200).json(list);
    } catch (e) {
      console.error('[admin/indicacao/comissoes GET]', e);
      return res.status(500).json({ error: 'Erro ao listar comissões.' });
    }
  }

  if (req.method === 'POST') {
    const body = req.body as Record<string, unknown>;
    const usuarioId = typeof body.usuarioId === 'string' ? body.usuarioId.trim() : '';
    const empresaIndicada = typeof body.empresaIndicada === 'string' ? body.empresaIndicada.trim() : '';
    const valorContrato = typeof body.valorContrato === 'number' ? body.valorContrato : parseFloat(String(body.valorContrato || '').replace(',', '.'));

    if (!usuarioId || !empresaIndicada) {
      return res.status(400).json({ error: 'Informe o participante e a empresa indicada.' });
    }
    if (!Number.isFinite(valorContrato) || valorContrato <= 0) {
      return res.status(400).json({ error: 'Valor do contrato inválido.' });
    }

    const usuario = await getUsuarioByIdForAdmin(usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Participante não encontrado.' });

    const valorComissao = Math.round(valorContrato * PERCENTUAL_COMISSAO * 100) / 100;

    try {
      const comissao = await createComissao(usuarioId, empresaIndicada, valorContrato, valorComissao);
      if (!comissao) {
        console.error('[admin/indicacao/comissoes POST] createComissao retornou null (verifique DATABASE_URL e se a tabela indicacao_comissoes existe)');
        return res.status(500).json({ error: 'Erro ao registrar comissão. Verifique se a migração do banco (indicacao_comissoes) foi executada e se DATABASE_URL está definida.' });
      }
      const valorStr = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorComissao);
      const notif = await createNotificacao(
        usuarioId,
        'comissao',
        'Comissão registrada',
        `Foi registrado um pagamento de comissão de ${valorStr} referente à indicação de ${empresaIndicada}. Confira em Minhas comissões.`
      );
      if (!notif) {
        console.error('[admin/indicacao/comissoes POST] falha ao criar notificação de comissão', { usuarioId, empresaIndicada });
      }
      return res.status(200).json(comissao);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[admin/indicacao/comissoes POST]', e);
      return res.status(500).json({
        error: process.env.NODE_ENV === 'development' ? `Erro ao registrar comissão: ${msg}` : 'Erro ao registrar comissão.',
      });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
