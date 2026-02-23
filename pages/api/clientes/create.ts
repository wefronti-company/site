import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { createCliente } from '../../../lib/clientDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as Record<string, unknown>;

  const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const razaoSocial = typeof body.razaoSocial === 'string' ? body.razaoSocial.trim() : '';

  if (!nome || !email || !razaoSocial) {
    return res.status(400).json({
      error: 'Preencha nome, e-mail e razão social.',
    });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  try {
    const cliente = await createCliente({
      nome,
      email,
      cpf: typeof body.cpf === 'string' ? body.cpf.replace(/\D/g, '').slice(0, 11) || undefined : undefined,
      telefone: typeof body.telefone === 'string' ? body.telefone.replace(/\D/g, '').slice(0, 11) || undefined : undefined,
      celular: typeof body.celular === 'string' ? body.celular.replace(/\D/g, '').slice(0, 11) || undefined : undefined,
      cargo: typeof body.cargo === 'string' ? body.cargo.trim() || undefined : undefined,
      razaoSocial,
      nomeFantasia: typeof body.nomeFantasia === 'string' ? body.nomeFantasia.trim() || undefined : undefined,
      cnpj: typeof body.cnpj === 'string' ? body.cnpj.replace(/\D/g, '').slice(0, 14) || undefined : undefined,
      ie: typeof body.ie === 'string' ? body.ie.trim() || undefined : undefined,
      enderecoLogradouro: typeof body.enderecoLogradouro === 'string' ? body.enderecoLogradouro.trim() || undefined : undefined,
      enderecoNumero: typeof body.enderecoNumero === 'string' ? body.enderecoNumero.trim() || undefined : undefined,
      enderecoComplemento: typeof body.enderecoComplemento === 'string' ? body.enderecoComplemento.trim() || undefined : undefined,
      enderecoBairro: typeof body.enderecoBairro === 'string' ? body.enderecoBairro.trim() || undefined : undefined,
      enderecoCidade: typeof body.enderecoCidade === 'string' ? body.enderecoCidade.trim() || undefined : undefined,
      enderecoUf: typeof body.enderecoUf === 'string' ? body.enderecoUf.trim().slice(0, 2).toUpperCase() || undefined : undefined,
      enderecoCep: typeof body.enderecoCep === 'string' ? body.enderecoCep.replace(/\D/g, '').slice(0, 8) || undefined : undefined,
      telefoneEmpresa: typeof body.telefoneEmpresa === 'string' ? body.telefoneEmpresa.replace(/\D/g, '').slice(0, 11) || undefined : undefined,
      site: typeof body.site === 'string' ? body.site.trim() || undefined : undefined,
      ramo: typeof body.ramo === 'string' ? body.ramo.trim() || undefined : undefined,
      observacoes: typeof body.observacoes === 'string' ? body.observacoes.trim() || undefined : undefined,
      servicoTipo: typeof body.servicoTipo === 'string' ? body.servicoTipo.trim() || undefined : undefined,
      manutencao: body.manutencao === true || body.manutencao === 'sim',
      precoServico: typeof body.precoServico === 'number' ? body.precoServico : (typeof body.precoServico === 'string' ? parseFloat(String(body.precoServico).replace(',', '.')) || undefined : undefined),
      precoManutencao: typeof body.precoManutencao === 'number' ? body.precoManutencao : (typeof body.precoManutencao === 'string' ? parseFloat(String(body.precoManutencao).replace(',', '.')) || undefined : undefined),
    });

    return res.status(201).json(cliente);
  } catch (e) {
    console.error('[clientes/create]', e);
    return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
  }
}
