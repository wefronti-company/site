import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../../../../components/admin/AdminLayout';
import { theme } from '../../../../../styles/theme';
import { formatCpf, formatCelular, formatCep, formatCnpj } from '../../../../../lib/formatMask';
import { ArrowLeft } from 'lucide-react';

const { colors, spacing, fontSizes } = theme;

const sectionStyle: React.CSSProperties = {
  marginBottom: spacing[8],
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: spacing[4],
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
};

const labelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.text.light,
  opacity: 0.8,
};

const valueStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  color: colors.text.light,
  padding: `${spacing[3]}px ${spacing[4]}px`,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
};

const linkVoltarStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  color: colors.blue.primary,
  textDecoration: 'none',
  fontSize: fontSizes.sm,
  fontWeight: 500,
  marginTop: spacing[8],
};

interface ClienteDados {
  id: string;
  nome?: string;
  email?: string;
  cpf?: string;
  celular?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  site?: string;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoUf?: string;
  enderecoCep?: string;
}

function formatCpfDisplay(v: string | undefined): string {
  if (!v) return '—';
  const d = v.replace(/\D/g, '');
  if (d.length !== 11) return v;
  return formatCpf(v);
}

function formatCelularDisplay(v: string | undefined): string {
  if (!v) return '—';
  const d = v.replace(/\D/g, '');
  if (d.length < 10) return v;
  return formatCelular(v);
}

function formatCnpjDisplay(v: string | undefined): string {
  if (!v) return '—';
  const d = v.replace(/\D/g, '');
  if (d.length !== 14) return v;
  return formatCnpj(v);
}

function formatCepDisplay(v: string | undefined): string {
  if (!v) return '—';
  const d = v.replace(/\D/g, '');
  if (d.length !== 8) return v;
  return formatCep(v);
}

export default function ClienteDetalhesPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<ClienteDados | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id !== 'string') return;
    setLoading(true);
    setError(null);
    fetch(`/api/clientes/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Cliente não encontrado.');
        return r.json();
      })
      .then((data) => setCliente(data))
      .catch((e) => setError(e.message || 'Erro ao carregar.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Detalhes do cliente | Wefronti</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout>
          <div style={{ height: 200, borderRadius: 12, backgroundColor: colors.admin.inactive, border: `1px solid ${colors.neutral.borderDark}`, opacity: 0.5 }} />
        </AdminLayout>
      </>
    );
  }

  if (error || !cliente) {
    return (
      <>
        <Head>
          <title>Detalhes do cliente | Wefronti</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout>
          <p style={{ color: colors.neutral.gray }}>{error || 'Cliente não encontrado.'}</p>
          <Link href="/admin/dashboard/clientes/todos" style={{ ...linkVoltarStyle, marginTop: 0 }}>
            <ArrowLeft size={18} /> Voltar aos clientes
          </Link>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Detalhes do cliente | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <section style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Dados do contato</h3>
          <div style={formGridStyle}>
            <div style={fieldStyle}>
              <span style={labelStyle}>Nome completo</span>
              <div style={valueStyle}>{cliente.nome || '—'}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>E-mail</span>
              <div style={valueStyle}>{cliente.email || '—'}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>CPF</span>
              <div style={valueStyle}>{formatCpfDisplay(cliente.cpf)}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Celular</span>
              <div style={valueStyle}>{formatCelularDisplay(cliente.celular)}</div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Dados da empresa</h3>
          <div style={{ ...formGridStyle, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div style={fieldStyle}>
              <span style={labelStyle}>Nome da empresa</span>
              <div style={valueStyle}>{cliente.razaoSocial || cliente.nomeFantasia || '—'}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>CNPJ</span>
              <div style={valueStyle}>{formatCnpjDisplay(cliente.cnpj)}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Site</span>
              <div style={valueStyle}>{cliente.site || '—'}</div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Endereço</h3>
          <div style={{ ...formGridStyle, gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div style={fieldStyle}>
              <span style={labelStyle}>CEP</span>
              <div style={valueStyle}>{formatCepDisplay(cliente.enderecoCep)}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Logradouro</span>
              <div style={valueStyle}>{cliente.enderecoLogradouro || '—'}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Número</span>
              <div style={valueStyle}>{cliente.enderecoNumero || '—'}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Complemento</span>
              <div style={valueStyle}>{cliente.enderecoComplemento || '—'}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Bairro</span>
              <div style={valueStyle}>{cliente.enderecoBairro || '—'}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Cidade</span>
              <div style={valueStyle}>{cliente.enderecoCidade || '—'}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>UF</span>
              <div style={valueStyle}>{cliente.enderecoUf || '—'}</div>
            </div>
          </div>
        </section>

        <Link href="/admin/dashboard/clientes/todos" style={linkVoltarStyle}>
          <ArrowLeft size={18} /> Voltar aos clientes
        </Link>
      </AdminLayout>
    </>
  );
}
