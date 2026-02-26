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

const TermosDeUso: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const paddingX = isMd ? spacing[12] : spacing[4];

  return (
    <>
      <SEO
        title="Termos de Uso"
        description="Termos de Uso do site da Wefronti."
        canonical="/termos-de-uso"
        noindex
      />

      <main style={pageStyle}>
        <article style={getContainerStyle(paddingX)}>
          <h1 style={titleStyle}>Termos de Uso</h1>
          <p style={textStyle}>
            Ao acessar o site da Wefronti e utilizar nossos serviços (incluindo o envio do formulário de dados), você concorda com estes Termos de Uso. Leia-os com atenção.
          </p>

          <h2 style={sectionTitleStyle}>1. Aceite</h2>
          <p style={textStyle}>
            O uso do site wefronti.com e dos serviços vinculados (incluindo o envio do formulário disponível no site) implica a aceitação integral destes Termos. Se você não concordar, não utilize o site nem envie o formulário.
          </p>

          <h2 style={sectionTitleStyle}>2. Formulário e finalidade dos dados</h2>
          <p style={textStyle}>
            O formulário disponível no site coleta dados pessoais e da empresa (nome, e-mail, CPF, celular, razão social, CNPJ, endereço completo, entre outros) para agilizar o processo de contratação e as questões burocráticas da relação comercial: elaboração e gestão de contratos de prestação de serviços, emissão de notas fiscais, cobrança e demais obrigações legais e fiscais. O cliente não possui painel ou área para login; o envio serve apenas para repasse das informações à Wefronti. O tratamento desses dados está em conformidade com a LGPD e com nossa{' '}
            <Link href="/politica-privacidade" style={linkStyle}>Política de Privacidade</Link>. Ao enviar o formulário, você declara que as informações fornecidas são verdadeiras e autoriza seu uso para as finalidades descritas.
          </p>

          <h2 style={sectionTitleStyle}>3. Uso do site</h2>
          <p style={textStyle}>
            Você se compromete a utilizar o site de forma lícita, sem fraudes, abusos ou condutas que prejudiquem a Wefronti ou terceiros. É vedado o uso para fins ilícitos, spam, disseminação de malware ou violação de direitos de terceiros.
          </p>

          <h2 style={sectionTitleStyle}>4. Propriedade intelectual</h2>
          <p style={textStyle}>
            O conteúdo do site (textos, imagens, logotipos, layout) é de propriedade da Wefronti ou de licenciadores. É vedada a cópia, reprodução ou uso comercial sem autorização prévia.
          </p>

          <h2 style={sectionTitleStyle}>5. Lei aplicável e foro</h2>
          <p style={textStyle}>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir conflitos relativos a estes Termos ou ao uso do site, fica eleito o foro da comarca em que a Wefronti tenha sua sede.
          </p>

          <h2 style={sectionTitleStyle}>6. Contato</h2>
          <p style={textStyle}>
            Dúvidas sobre estes Termos:{' '}
            <a href="mailto:termos@wefronti.com" style={linkStyle}>termos@wefronti.com</a>. Para questões sobre privacidade e dados pessoais, consulte nossa{' '}
            <Link href="/politica-privacidade" style={linkStyle}>Política de Privacidade</Link>.
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

export default TermosDeUso;
