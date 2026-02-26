import type { NextApiRequest, NextApiResponse } from 'next';
import isEmail from 'validator/lib/isEmail';
import { getClienteById, updateCliente } from '../../../../lib/clientDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!id) return res.status(400).json({ error: 'ID inválido.' });

  if (req.method === 'GET') {
    try {
      const cliente = await getClienteById(id);
      if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado.' });
      return res.status(200).json(cliente);
    } catch (e) {
      console.error('[clientes/[id] GET]', e);
      return res.status(500).json({ error: 'Erro ao buscar cliente.' });
    }
  }

  if (req.method === 'PATCH') {
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
      const cliente = await updateCliente(id, {
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
        mensalidade: typeof body.mensalidade === 'number' ? body.mensalidade : (typeof body.mensalidade === 'string' ? parseFloat(String(body.mensalidade).replace(',', '.')) : undefined),
        diaVencimento: (() => {
          const n = typeof body.diaVencimento === 'number' ? body.diaVencimento : (typeof body.diaVencimento === 'string' ? parseInt(String(body.diaVencimento), 10) : NaN);
          return Number.isInteger(n) && n >= 1 && n <= 31 ? n : undefined;
        })(),
        servicoTipo: typeof body.servicoTipo === 'string' ? body.servicoTipo.trim() || undefined : undefined,
        manutencao: body.manutencao === true || body.manutencao === 'sim',
        precoServico: typeof body.precoServico === 'number' ? body.precoServico : (typeof body.precoServico === 'string' ? parseFloat(String(body.precoServico).replace(',', '.')) || undefined : undefined),
        precoManutencao: typeof body.precoManutencao === 'number' ? body.precoManutencao : (typeof body.precoManutencao === 'string' ? parseFloat(String(body.precoManutencao).replace(',', '.')) || undefined : undefined),
        formaPagamentoProjeto: typeof body.formaPagamentoProjeto === 'string' && /^(cartao|pix|50_50)$/.test(body.formaPagamentoProjeto) ? body.formaPagamentoProjeto : undefined,
        parcelasCartao: (() => {
          const n = typeof body.parcelasCartao === 'number' ? body.parcelasCartao : (typeof body.parcelasCartao === 'string' ? parseInt(String(body.parcelasCartao), 10) : NaN);
          return Number.isInteger(n) && n >= 1 && n <= 12 ? n : undefined;
        })(),
      });

      if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado.' });
      return res.status(200).json(cliente);
    } catch (e) {
      console.error('[clientes/[id] PATCH]', e);
      return res.status(500).json({ error: 'Erro ao atualizar cliente.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
