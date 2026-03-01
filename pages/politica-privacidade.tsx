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
  backgroundColor: 'transparent',
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
  color: colors.text.primary,
  opacity: 0.88,
  textDecoration: 'none',
};

const titleStyle: React.CSSProperties = {
  fontSize: fontSizes['4xl'],
  fontWeight: 400,
  lineHeight: 1.2,
  color: colors.text.primary,
  margin: 0,
  marginBottom: spacing[6],
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.xl,
  fontWeight: 500,
  color: colors.text.primary,
  margin: 0,
  marginTop: spacing[8],
  marginBottom: spacing[3],
};

const textStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.7,
  color: colors.text.primary,
  opacity: 0.9,
  margin: 0,
  marginBottom: spacing[4],
};

const listStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: spacing[4],
  paddingLeft: spacing[6],
  color: colors.text.primary,
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
        description="Política de Privacidade da Wefronti – como tratamos os dados coletados nos formulários do site."
        canonical="/politica-privacidade"
        noindex
      />

      <main style={pageStyle}>
        <article style={getContainerStyle(paddingX)}>

          <h1 style={titleStyle}>Política de Privacidade</h1>
          <p style={textStyle}>
            Esta política descreve como a Wefronti trata informações em conformidade com a LGPD (Lei nº 13.709/2018).
          </p>

          <h2 style={sectionTitleStyle}>1. Por que coletamos dados dos formulários</h2>
          <p style={textStyle}>
            Os formulários do site foram criados para facilitar o contato e o pedido de orçamento. Cada formulário coleta apenas os dados necessários para a finalidade indicada:
          </p>
          <ul style={listStyle}>
            <li>
              <strong>Formulário de contato:</strong> nome, sobrenome, e-mail, assunto e mensagem — para responder suas dúvidas e solicitações enviadas pela página de contato.
            </li>
            <li>
              <strong>Formulário de orçamento (página de preços):</strong> nome, sobrenome, e-mail, WhatsApp, faixa de investimento, tipo de projeto e contexto — para elaborar propostas comerciais e entrar em contato para conversar sobre seu projeto.
            </li>
          </ul>
          <p style={textStyle}>
            Ao enviar qualquer formulário, você declara que as informações fornecidas são verdadeiras e autoriza seu uso para as finalidades descritas. O tratamento está em conformidade com a LGPD, com base na execução de contrato/relacionamento contratual e no seu consentimento ao enviar o formulário.
          </p>

          <h2 style={sectionTitleStyle}>2. Dados técnicos e navegação</h2>
          <p style={textStyle}>
            Podemos registrar dados técnicos de navegação (por exemplo, endereço IP, páginas visitadas) para fins de segurança e melhoria do site. Não vendemos esses dados.
          </p>

          <h2 style={sectionTitleStyle}>3. Compartilhamento e retenção</h2>
          <p style={textStyle}>
            Não vendemos seus dados. Podemos compartilhar informações com prestadores de serviço que nos auxiliam na operação do site e dos serviços (por exemplo, hospedagem, e-mail, banco de dados), sob obrigação de confidencialidade. Mantemos os dados pelo tempo necessário para cumprir as finalidades descritas e obrigações legais.
          </p>

          <h2 style={sectionTitleStyle}>4. Seus direitos (LGPD)</h2>
          <p style={textStyle}>
            Você pode solicitar acesso, correção, exclusão, portabilidade ou revisão do tratamento dos seus dados pessoais, nos termos da LGPD. Para exercer esses direitos ou tirar dúvidas sobre esta política, entre em contato pelo e-mail abaixo.
          </p>

          <h2 style={sectionTitleStyle}>5. Contato</h2>
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
