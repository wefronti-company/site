import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../../components/admin/AdminLayout';
import { theme } from '../../../../../styles/theme';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { ClienteForm, clienteToFormValues, type ClienteFormValues } from '../../../../../components/admin/ClienteForm';

const { colors, spacing, fontSizes } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[6],
};

const EditarClientePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { showSuccess, showError } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [values, setValues] = useState<ClienteFormValues>(clienteToFormValues(null));

  useEffect(() => {
    if (typeof id !== 'string') return;
    fetch(`/api/clientes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showError(data.error || 'Cliente não encontrado.');
          return;
        }
        setValues(clienteToFormValues(data));
      })
      .catch(() => showError('Erro ao carregar cliente.'))
      .finally(() => setLoadingData(false));
  }, [id, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof id !== 'string') return;
    if (!values.nome.trim() || !values.email.trim() || !values.razaoSocial.trim()) {
      showError('Preencha nome, e-mail e razão social.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: values.nome.trim(),
          email: values.email.trim().toLowerCase(),
          cpf: values.cpf.replace(/\D/g, '') || undefined,
          telefone: values.telefone.replace(/\D/g, '') || undefined,
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
        showError(data.error || 'Erro ao atualizar cliente.');
        return;
      }
      showSuccess('Cliente atualizado com sucesso.');
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <Head>
          <title>Editar cliente | Wefronti Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout>
          <p style={{ color: colors.text.light, opacity: 0.7 }}>Carregando...</p>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Editar cliente | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Editar cliente</h1>

        <ClienteForm
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Atualizar"
        />
      </AdminLayout>
    </>
  );
};

export default EditarClientePage;
