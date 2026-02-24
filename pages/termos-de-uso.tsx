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
        description="Termos de Uso do site e do programa de indicação da Wefronti."
        canonical="/termos-de-uso"
        noindex
      />

      <main style={pageStyle}>
        <article style={getContainerStyle(paddingX)}>
          <h1 style={titleStyle}>Termos de Uso</h1>
          <p style={textStyle}>
            Ao acessar o site da Wefronti e/ou criar uma conta na área do programa de indicação, você concorda com estes Termos de Uso. Leia-os com atenção.
          </p>

          <h2 style={sectionTitleStyle}>1. Aceite</h2>
          <p style={textStyle}>
            O uso do site wefronti.com e dos serviços vinculados (incluindo cadastro, área logada e programa de indicação) implica a aceitação integral destes Termos. Se você não concordar, não utilize o site nem se cadastre.
          </p>

          <h2 style={sectionTitleStyle}>2. Uso do site e da área logada</h2>
          <p style={textStyle}>
            Você se compromete a utilizar o site e a área restrita de forma lícita, sem fraudes, abusos ou condutas que prejudiquem a Wefronti ou terceiros. É vedado o uso para fins ilícitos, spam, disseminação de malware ou violação de direitos de terceiros. Você é responsável pela confidencialidade da sua senha e por todas as atividades realizadas em sua conta.
          </p>

          <h2 style={sectionTitleStyle}>3. Programa de indicação (“Indique e Ganhe”)</h2>
          <p style={textStyle}>
            O programa permite que usuários cadastrados compartilhem um link de indicação. Quando um indicado fechar contrato com a Wefronti utilizando esse link, o indicador poderá receber a recompensa conforme as regras vigentes do programa (por exemplo, percentual sobre o valor). A Wefronti reserva-se o direito de:
          </p>
          <ul style={listStyle}>
            <li>Alterar as regras, percentuais e condições do programa, com divulgação prévia quando aplicável.</li>
            <li>Recusar ou cancelar indicações em caso de fraude, múltiplas contas, uso indevido do link ou desrespeito a estes Termos.</li>
            <li>Exigir o preenchimento de dados cadastrais (incluindo dados bancários/PIX) para pagamento das comissões.</li>
          </ul>
          <p style={textStyle}>
            O pagamento das comissões está sujeito à confirmação do contrato com o indicado e às políticas internas da Wefronti. O indicador não estabelece vínculo empregatício com a Wefronti em razão do programa.
          </p>

          <h2 style={sectionTitleStyle}>4. Conta e senha</h2>
          <p style={textStyle}>
            O cadastro é pessoal e intransferível. Você deve informar dados verdadeiros e atualizados. A Wefronti pode encerrar ou suspender contas em caso de violação destes Termos, fraude ou por decisão administrativa, sem prejuízo de outras medidas legais.
          </p>

          <h2 style={sectionTitleStyle}>5. Propriedade intelectual</h2>
          <p style={textStyle}>
            O conteúdo do site (textos, imagens, logotipos, layout) é de propriedade da Wefronti ou de licenciadores. É vedada a cópia, reprodução ou uso comercial sem autorização prévia.
          </p>

          <h2 style={sectionTitleStyle}>6. Lei aplicável e foro</h2>
          <p style={textStyle}>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir conflitos relativos a estes Termos ou ao uso do site, fica eleito o foro da comarca em que a Wefronti tenha sua sede.
          </p>

          <h2 style={sectionTitleStyle}>7. Contato</h2>
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
