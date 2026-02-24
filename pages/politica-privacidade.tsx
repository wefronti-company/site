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
            <strong>Visitantes do site:</strong> não coletamos dados pessoais por meio de formulários de contato no site institucional; o contato é feito diretamente via WhatsApp. Dados técnicos (endereço IP, navegador) podem ser registrados pelo Analytics quando você aceita cookies de análise.
          </p>
          <p style={textStyle}>
            <strong>Usuários cadastrados (programa “Indique e Ganhe”):</strong> ao criar conta e usar a área logada, coletamos e armazenamos: nome completo, e-mail, senha (criptografada), código de referência para o link de indicação e, quando você preenche seu perfil, celular, data de nascimento, CPF, endereço (logradouro, número, complemento, bairro, cidade, UF, CEP) e chave PIX para eventual pagamento de comissões. Também registramos acessos ao seu link de indicação (para contagem de indicações e operação do programa).
          </p>
          <p style={textStyle}>
            Esses dados são utilizados para: gestão da sua conta, operação do programa de indicação, contato sobre o programa e, quando aplicável, pagamento de comissões. O tratamento está em conformidade com a LGPD e com nossa base legal (execução de contrato/relacionamento e consentimento quando cabível).
          </p>

          <h2 style={sectionTitleStyle}>3. Compartilhamento e retenção</h2>
          <p style={textStyle}>
            Não vendemos seus dados. Podemos compartilhar informações com prestadores de serviço que nos auxiliam na operação do site e do programa (por exemplo, hospedagem, e-mail, banco de dados), sob obrigação de confidencialidade. Mantemos os dados pelo tempo necessário para cumprir as finalidades descritas e obrigações legais.
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
