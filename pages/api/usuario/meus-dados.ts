import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyUsuarioSessionToken, COOKIE_NAME } from '../../../lib/auth-usuario';
import { getUsuarioById } from '../../../lib/usuarioDb';
import { getClienteByEmail, updateClienteDadosParciais } from '../../../lib/clientDb';
import { updateUsuarioPerfil } from '../../../lib/usuarioDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getTokenFromCookie(req);
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }

  const payload = await verifyUsuarioSessionToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão expirada.' });
  }

  const usuario = await getUsuarioById(payload.usuarioId);
  if (!usuario?.email) {
    return res.status(401).json({ error: 'Usuário não encontrado.' });
  }

  const cliente = await getClienteByEmail(usuario.email);

  if (req.method === 'GET') {
    if (!cliente) {
      return res.status(200).json({ cliente: null });
    }
    return res.status(200).json({
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        cpf: cliente.cpf ?? '',
        celular: cliente.celular ?? '',
        razaoSocial: cliente.razaoSocial ?? '',
        cnpj: cliente.cnpj ?? '',
        site: cliente.site ?? '',
        enderecoLogradouro: cliente.enderecoLogradouro ?? '',
        enderecoNumero: cliente.enderecoNumero ?? '',
        enderecoComplemento: cliente.enderecoComplemento ?? '',
        enderecoBairro: cliente.enderecoBairro ?? '',
        enderecoCidade: cliente.enderecoCidade ?? '',
        enderecoUf: cliente.enderecoUf ?? '',
        enderecoCep: cliente.enderecoCep ?? '',
      },
    });
  }

  const body = req.body || {};
  const nome = str(body.nome)?.trim();
  const celular = str(body.celular);
  const cpf = str(body.cpf);
  const razaoSocial = str(body.razaoSocial)?.trim();
  const cnpj = str(body.cnpj);
  const site = str(body.site)?.trim();
  const enderecoLogradouro = str(body.enderecoLogradouro)?.trim();
  const enderecoNumero = str(body.enderecoNumero)?.trim();
  const enderecoComplemento = str(body.enderecoComplemento)?.trim();
  const enderecoBairro = str(body.enderecoBairro)?.trim();
  const enderecoCidade = str(body.enderecoCidade)?.trim();
  const enderecoUf = str(body.enderecoUf)?.trim();
  const enderecoCep = str(body.enderecoCep);

  const celularDigits = celular ? celular.replace(/\D/g, '') : undefined;
  const cpfDigits = cpf ? cpf.replace(/\D/g, '') : undefined;
  const cnpjDigits = cnpj ? cnpj.replace(/\D/g, '').slice(0, 14) : undefined;
  const cepDigits = enderecoCep ? enderecoCep.replace(/\D/g, '') : undefined;

  if (cliente) {
    await updateClienteDadosParciais(cliente.id, {
      nome: nome ?? undefined,
      cpf: cpfDigits || undefined,
      celular: celularDigits || undefined,
      razaoSocial: razaoSocial ?? undefined,
      cnpj: cnpjDigits || undefined,
      site: site || undefined,
      enderecoLogradouro: enderecoLogradouro ?? undefined,
      enderecoNumero: enderecoNumero ?? undefined,
      enderecoComplemento: enderecoComplemento ?? undefined,
      enderecoBairro: enderecoBairro ?? undefined,
      enderecoCidade: enderecoCidade ?? undefined,
      enderecoUf: enderecoUf ?? undefined,
      enderecoCep: cepDigits ?? undefined,
    });
  }

  await updateUsuarioPerfil(payload.usuarioId, {
    nomeCompleto: nome ?? undefined,
    celular: celularDigits ?? undefined,
    cpf: cpfDigits ?? undefined,
    enderecoLogradouro: enderecoLogradouro ?? undefined,
    enderecoNumero: enderecoNumero ?? undefined,
    enderecoComplemento: enderecoComplemento ?? undefined,
    enderecoBairro: enderecoBairro ?? undefined,
    enderecoCidade: enderecoCidade ?? undefined,
    enderecoUf: enderecoUf ?? undefined,
    enderecoCep: cepDigits ?? undefined,
  });

  return res.status(200).json({ ok: true });
}
