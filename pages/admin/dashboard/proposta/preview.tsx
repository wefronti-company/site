import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { PropostaTemplate } from '../../../../components/proposta/PropostaTemplate';
import { theme } from '../../../../styles/theme';
import type { Proposal } from '../../../../lib/proposalData';

const { colors, spacing, fontSizes } = theme;
const PREVIEW_KEY = 'proposta-preview';

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

export default function PropostaPreviewPage() {
  const [proposal, setProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(PREVIEW_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw) as Proposal;
        setProposal(data);
      } catch {
        setProposal(null);
      }
    }
  }, []);

  if (!proposal) {
    return (
      <AdminLayout>
        <Head>
          <title>Preview da proposta | Wefronti</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <h1 style={pageTitleStyle}>Preview da proposta</h1>
        <p style={{ color: colors.text.light, padding: 24 }}>
          Nenhuma proposta para visualizar. Preencha o formulário em Nova proposta e clique em &quot;Ver proposta&quot;.
        </p>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Preview da proposta | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Preview da proposta</h1>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
          <PropostaTemplate proposal={proposal} showCountdown={false} />
        </div>
      </AdminLayout>
    </>
  );
}
