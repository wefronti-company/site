/**
 * GET: detalhes de um participante (inclui banidos). PATCH: atualizar perfil ou ativo (admin).
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySessionToken, COOKIE_NAME } from '../../../../../lib/auth';
import {
  getUsuarioByIdForAdmin,
  updateUsuarioPerfilByAdmin,
  setUsuarioAtivo,
  type UpdateUsuarioPerfilInput,
} from '../../../../../lib/usuarioDb';
import { createNotificacao } from '../../../../../lib/notificacaoDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!id) return res.status(400).json({ error: 'ID inválido.' });

  const token = getTokenFromCookie(req);
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  const payload = await verifySessionToken(token);
  if (!payload) return res.status(401).json({ error: 'Sessão inválida ou expirada' });

  if (req.method === 'GET') {
    const usuario = await getUsuarioByIdForAdmin(id);
    if (!usuario) return res.status(404).json({ error: 'Participante não encontrado.' });
    return res.status(200).json(usuario);
  }

  if (req.method === 'PATCH') {
    const body = req.body as Record<string, unknown>;

    if (typeof body.ativo === 'boolean') {
      const before = await getUsuarioByIdForAdmin(id);
      const ok = await setUsuarioAtivo(id, body.ativo);
      if (!ok) return res.status(404).json({ error: 'Participante não encontrado.' });
      if (body.ativo === false && before?.ativo !== false) {
        const notif = await createNotificacao(
          id,
          'banimento',
          'Conta suspensa',
          'Sua conta no programa Indique e Ganhe foi suspensa. Seu link de indicação ficou indisponível. Em caso de dúvidas, fale com suporte@wefronti.com.'
        );
        if (!notif) {
          console.error('[admin/indicacao/participantes PATCH] falha ao criar notificação de banimento', { usuarioId: id });
        }
      } else if (body.ativo === true && before?.ativo === false) {
        const notif = await createNotificacao(
          id,
          'status_usuario',
          'Conta liberada',
          'Sua conta foi liberada novamente e seu link de indicação voltou a ficar disponível.'
        );
        if (!notif) {
          console.error('[admin/indicacao/participantes PATCH] falha ao criar notificação de reativação', { usuarioId: id });
        }
      }
    }

    const input: UpdateUsuarioPerfilInput = {};
    if (typeof body.nomeCompleto === 'string') input.nomeCompleto = body.nomeCompleto.trim().slice(0, 200) || undefined;
    if (typeof body.celular === 'string') input.celular = body.celular.trim().slice(0, 20) || undefined;
    if (typeof body.dataNascimento === 'string') input.dataNascimento = body.dataNascimento.trim().slice(0, 10) || undefined;
    if (typeof body.cpf === 'string') input.cpf = body.cpf.replace(/\D/g, '').slice(0, 14) || undefined;
    if (typeof body.enderecoLogradouro === 'string') input.enderecoLogradouro = body.enderecoLogradouro.trim().slice(0, 150) || undefined;
    if (typeof body.enderecoNumero === 'string') input.enderecoNumero = body.enderecoNumero.trim().slice(0, 20) || undefined;
    if (typeof body.enderecoComplemento === 'string') input.enderecoComplemento = body.enderecoComplemento.trim().slice(0, 80) || undefined;
    if (typeof body.enderecoBairro === 'string') input.enderecoBairro = body.enderecoBairro.trim().slice(0, 80) || undefined;
    if (typeof body.enderecoCidade === 'string') input.enderecoCidade = body.enderecoCidade.trim().slice(0, 80) || undefined;
    if (typeof body.enderecoUf === 'string') input.enderecoUf = body.enderecoUf.trim().toUpperCase().slice(0, 2) || undefined;
    if (typeof body.enderecoCep === 'string') input.enderecoCep = body.enderecoCep.replace(/\D/g, '').slice(0, 10) || undefined;
    if (typeof body.chavePix === 'string') input.chavePix = body.chavePix.trim().slice(0, 255) || undefined;
    if (typeof body.banco === 'string') input.banco = body.banco.trim().slice(0, 100) || undefined;
    if (typeof body.nomeTitular === 'string') input.nomeTitular = body.nomeTitular.trim().slice(0, 200) || undefined;

    if (Object.keys(input).length > 0) {
      await updateUsuarioPerfilByAdmin(id, input);
    }

    const updated = await getUsuarioByIdForAdmin(id);
    return res.status(200).json(updated ?? {});
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
