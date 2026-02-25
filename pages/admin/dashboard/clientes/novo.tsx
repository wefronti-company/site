import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { ClienteForm, clienteToFormValues, type ClienteFormValues } from '../../../../components/admin/ClienteForm';

const { colors, spacing, fontSizes } = theme;

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const emptyValues = clienteToFormValues(null);

const ClienteNovoPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<ClienteFormValues>(emptyValues);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.nome.trim() || !values.email.trim() || !values.razaoSocial.trim()) {
      showError('Preencha nome, e-mail e razão social.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/clientes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: values.nome.trim(),
          email: values.email.trim().toLowerCase(),
          telefone: values.telefone.trim() || undefined,
          celular: values.celular.replace(/\D/g, '') || undefined,
          cargo: values.cargo.trim() || undefined,
          razaoSocial: values.razaoSocial.trim(),
          nomeFantasia: values.nomeFantasia.trim() || undefined,
          cnpj: values.cnpj.replace(/\D/g, '').slice(0, 14) || undefined,
          ie: values.ie.trim() || undefined,
          ramo: values.ramo.trim() || undefined,
          servicoTipo: values.servicoTipo.trim() || undefined,
          manutencao: values.manutencao === 'sim',
          precoServico: values.precoServico ? parseFloat(values.precoServico.replace(',', '.')) || undefined : undefined,
          precoManutencao: values.manutencao === 'sim' && values.precoManutencao ? parseFloat(values.precoManutencao.replace(',', '.')) || undefined : undefined,
          telefoneEmpresa: values.telefoneEmpresa.replace(/\D/g, '') || undefined,
          site: values.site.trim() || undefined,
          enderecoLogradouro: values.enderecoLogradouro.trim() || undefined,
          enderecoNumero: values.enderecoNumero.trim() || undefined,
          enderecoComplemento: values.enderecoComplemento.trim() || undefined,
          enderecoBairro: values.enderecoBairro.trim() || undefined,
          enderecoCidade: values.enderecoCidade.trim() || undefined,
          enderecoUf: values.enderecoUf.trim() || undefined,
          enderecoCep: values.enderecoCep.replace(/\D/g, '').slice(0, 8) || undefined,
          observacoes: values.observacoes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Erro ao cadastrar cliente.');
        return;
      }
      showSuccess('Cliente cadastrado com sucesso.');
      setValues(emptyValues);
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cadastrar cliente | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Cadastrar cliente</h1>
        <ClienteForm
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Cadastrar cliente"
        />
      </AdminLayout>
    </>
  );
};

export default ClienteNovoPage;
