import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { theme } from '../styles/theme';
import { useMediaQuery } from '../hooks/useMediaQuery';

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

const titleStyle: React.CSSProperties = {
  fontSize: fontSizes['4xl'],
  fontWeight: 400,
  lineHeight: 1.2,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[6],
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.xl,
  fontWeight: 500,
  color: colors.text.light,
  margin: 0,
  marginTop: spacing[8],
  marginBottom: spacing[3],
};

const textStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.7,
  color: colors.text.light,
  opacity: 0.9,
  margin: 0,
  marginBottom: spacing[4],
};

const listStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: spacing[4],
  paddingLeft: spacing[6],
  color: colors.text.light,
  opacity: 0.9,
  lineHeight: 1.7,
};

const linkStyle: React.CSSProperties = {
  color: colors.blue.primary,
  textDecoration: 'none',
};

const PoliticaPrivacidade: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const paddingX = isMd ? spacing[12] : spacing[4];

  return (
    <>
      <SEO
        title="Política de Privacidade"
        description="Política de Privacidade e uso de cookies da Wefronti."
        canonical="/politica-privacidade"
        noindex
      />

      <main style={pageStyle}>
        <article style={getContainerStyle(paddingX)}>
          
          <h1 style={titleStyle}>Política de Privacidade</h1>
          <p style={textStyle}>
            Esta política descreve como a Wefronti trata informações em conformidade com a LGPD (Lei nº 13.709/2018).
          </p>

          <h2 style={sectionTitleStyle}>1. Cookies</h2>
          <p style={textStyle}>
            Utilizamos cookies para:
          </p>
          <ul style={listStyle}>
            <li><strong>Essenciais:</strong> funcionamento básico do site.</li>
            <li><strong>Análise (opcional):</strong> Google Analytics para entender como os visitantes usam o site. Só são ativados com seu consentimento.</li>
          </ul>
          <p style={textStyle}>
            Você pode alterar suas preferências de cookies a qualquer momento pelo banner na tela.
          </p>

          <h2 style={sectionTitleStyle}>2. Dados coletados</h2>
          <p style={textStyle}>
            Não coletamos dados pessoais por meio de formulários. O contato é feito diretamente via WhatsApp, conforme o link disponível no site. Dados técnicos (endereço IP, navegador) podem ser registrados automaticamente pelo Analytics, quando você aceita cookies de análise.
          </p>

          <h2 style={sectionTitleStyle}>3. Contato</h2>
          <p style={textStyle}>
            Para dúvidas sobre esta política ou seus dados, entre em contato:{' '}
            <a href="mailto:privacidade@wefronti.com" style={linkStyle}>privacidade@wefronti.com</a>
          </p>
          <Link href="/" style={backLinkStyle} aria-label="Voltar ao início">
            <ArrowLeft size={18} strokeWidth={2} aria-hidden />
            Voltar ao início
          </Link>
        </article>
      </main>
    </>
  );
};

export default PoliticaPrivacidade;
