import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import ButtonCta from '../components/ui/ButtonCta';
import { RegrasIndiqueEGanheContent } from '../components/RegrasIndiqueEGanheContent';
import { theme } from '../styles/theme';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { toDashUrl } from '../lib/dash-url';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  paddingTop: 140,
  paddingBottom: spacing[16],
  backgroundColor: colors.background.dark,
};

const getContainerStyle = (paddingX: number): React.CSSProperties => ({
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  paddingLeft: paddingX,
  paddingRight: paddingX,
});

const ctaWrapStyle: React.CSSProperties = {
  marginTop: spacing[8],
  marginBottom: spacing[8],
};

const backLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  paddingTop: spacing[16],
  marginBottom: spacing[8],
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.88,
  textDecoration: 'none',
};

const IndiqueEGanheRegras: React.FC = () => {
  const router = useRouter();
  const isMd = useMediaQuery(theme.breakpoints.md);
  const paddingX = isMd ? spacing[12] : spacing[4];

  return (
    <>
      <SEO
        title="Regras do Programa Indique e Ganhe"
        description="Regras detalhadas do programa de indicação da Wefronti: como participar, como receber e o que não é permitido."
        canonical="/indique-e-ganhe-regras"
        noindex
      />

      <main style={pageStyle}>
        <article style={getContainerStyle(paddingX)}>
          <RegrasIndiqueEGanheContent />
          <div style={ctaWrapStyle}>
            <ButtonCta label="Criar conta grátis" onClick={() => router.push(toDashUrl('/'))} />
          </div>
          <Link href="/" style={backLinkStyle} aria-label="Voltar ao início">
            <ArrowLeft size={18} strokeWidth={2} aria-hidden />
            Voltar ao início
          </Link>
        </article>
      </main>
    </>
  );
};

export default IndiqueEGanheRegras;
