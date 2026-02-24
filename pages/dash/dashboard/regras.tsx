import React from 'react';
import Head from 'next/head';
import DashLayout from '../../../components/dash/DashLayout';
import { RegrasIndiqueEGanheContent } from '../../../components/RegrasIndiqueEGanheContent';

const articleStyle: React.CSSProperties = {
  width: '100%',
  margin: 0,
};

export default function DashRegrasPage() {
  return (
    <>
      <Head>
        <title>Regras do Programa | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <DashLayout>
        <article style={articleStyle}>
          <RegrasIndiqueEGanheContent />
        </article>
      </DashLayout>
    </>
  );
}
