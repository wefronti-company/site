import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyClienteSessionToken, COOKIE_NAME } from '../../../lib/auth-cliente';
import { getClienteById, updateClientePainelDados } from '../../../lib/clientDb';

function getTokenFromCookie(req: NextApiRequest) {
  const c = req.headers.cookie;
  if (!c) return null;
  const m = c.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  const token = getTokenFromCookie(req);
  if (!token) return res.status(401).json({ error: 'Não autenticado.' });
  const payload = await verifyClienteSessionToken(token);
  if (!payload) return res.status(401).json({ error: 'Sessão expirada.' });
  const cliente = await getClienteById(payload.clienteId);

  if (req.method === 'GET') {
    if (!cliente) return res.status(200).json({ cliente: null });
    return res.status(200).json({
      cliente: {
        id: cliente.id, nome: cliente.nome, email: cliente.email,
        cpf: cliente.cpf ?? '', celular: cliente.celular ?? '', razaoSocial: cliente.razaoSocial ?? '',
        cnpj: cliente.cnpj ?? '', site: cliente.site ?? '',
        enderecoLogradouro: cliente.enderecoLogradouro ?? '', enderecoNumero: cliente.enderecoNumero ?? '',
        enderecoComplemento: cliente.enderecoComplemento ?? '', enderecoBairro: cliente.enderecoBairro ?? '',
        enderecoCidade: cliente.enderecoCidade ?? '', enderecoUf: cliente.enderecoUf ?? '', enderecoCep: cliente.enderecoCep ?? '',
      },
    });
  }

  const b = req.body || {};
  const nome = str(b.nome)?.trim(), celular = str(b.celular), cpf = str(b.cpf), razaoSocial = str(b.razaoSocial)?.trim();
  const cnpj = str(b.cnpj), site = str(b.site)?.trim();
  const enderecoLogradouro = str(b.enderecoLogradouro)?.trim(), enderecoNumero = str(b.enderecoNumero)?.trim();
  const enderecoComplemento = str(b.enderecoComplemento)?.trim(), enderecoBairro = str(b.enderecoBairro)?.trim();
  const enderecoCidade = str(b.enderecoCidade)?.trim(), enderecoUf = str(b.enderecoUf)?.trim(), enderecoCep = str(b.enderecoCep);

  const celD = celular ? celular.replace(/\D/g, '') : undefined;
  const cpfD = cpf ? cpf.replace(/\D/g, '') : undefined;
  const cnpjD = cnpj ? cnpj.replace(/\D/g, '').slice(0, 14) : undefined;
  const cepD = enderecoCep ? enderecoCep.replace(/\D/g, '') : undefined;

  if (cliente) {
    await updateClientePainelDados(cliente.id, {
      nome: nome ?? undefined, cpf: cpfD || undefined, celular: celD || undefined,
      razaoSocial: razaoSocial ?? undefined, cnpj: cnpjD || undefined, site: site || undefined,
      enderecoLogradouro: enderecoLogradouro ?? undefined, enderecoNumero: enderecoNumero ?? undefined,
      enderecoComplemento: enderecoComplemento ?? undefined, enderecoBairro: enderecoBairro ?? undefined,
      enderecoCidade: enderecoCidade ?? undefined, enderecoUf: enderecoUf ?? undefined, enderecoCep: cepD ?? undefined,
    });
  }
  return res.status(200).json({ ok: true });
}
