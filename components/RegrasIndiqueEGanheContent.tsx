import React from 'react';
import Link from 'next/link';
import { theme } from '../styles/theme';

const { colors, spacing, fontSizes } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
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

/** Conteúdo das regras do programa Indique e Ganhe (reutilizado na página pública e na área do usuário). */
export const RegrasIndiqueEGanheContent: React.FC = () => (
  <>
    <h1 style={titleStyle}>Regras do Programa Indique e Ganhe</h1>
    <p style={textStyle}>
      Estas regras explicam em detalhes como funciona o programa de indicação da Wefronti. Ao participar, você concorda com elas e com nossos{' '}
      <Link href="/termos-de-uso" style={linkStyle}>Termos de Uso</Link>.
    </p>

    <h2 style={sectionTitleStyle}>1. O que é o programa</h2>
    <p style={textStyle}>
      O <strong>Indique e Ganhe</strong> é um programa de indicação em que você, cadastrado na nossa plataforma, compartilha um link exclusivo com potenciais clientes. Quando uma pessoa indicada por você fechar um contrato de prestação de serviços com a Wefronti utilizando esse link, você recebe uma recompensa em dinheiro (comissão) sobre o valor do contrato.
    </p>

    <h2 style={sectionTitleStyle}>2. Quem pode participar</h2>
    <p style={textStyle}>
      Qualquer pessoa física que:
    </p>
    <ul style={listStyle}>
      <li>Tenha criado uma conta na área do programa (cadastro no site da Wefronti).</li>
      <li>Respeite estas regras e os Termos de Uso.</li>
      <li>Não esteja impedida por lei ou por decisão da Wefronti de participar.</li>
    </ul>
    <p style={textStyle}>
      A Wefronti pode recusar ou encerrar a participação de qualquer indicador que descumpra as regras ou pratique fraude.
    </p>

    <h2 style={sectionTitleStyle}>3. Como funciona</h2>
    <p style={textStyle}>
      <strong>Cadastro:</strong> Crie sua conta na área do programa. Após o login, você terá acesso ao seu <strong>link de indicação</strong> único (ex.: wefronti.com?ref=seu-codigo). Esse link identifica você como indicador.
    </p>
    <p style={textStyle}>
      <strong>Compartilhar:</strong> Envie seu link por e-mail, redes sociais, WhatsApp ou qualquer meio legítimo. A pessoa que clicar no link e, em seguida, fechar um contrato com a Wefronti será considerada sua indicada.
    </p>
    <p style={textStyle}>
      <strong>Contabilização:</strong> O site registra quantas pessoas acessaram seu link (número de “indicações” ou cliques). A comissão, porém, só é devida quando a indicação resulta em <strong>fechamento de contrato</strong> entre a Wefronti e o indicado (contrato de prestação de serviços efetivamente celebrado e em vigor conforme critérios da Wefronti).
    </p>

    <h2 style={sectionTitleStyle}>4. Recompensa (comissão)</h2>
    <p style={textStyle}>
      A comissão é de <strong>10% sobre o valor do contrato</strong> fechado com o indicado, nas condições e nos prazos definidos pela Wefronti. A Wefronti pode alterar esse percentual ou as condições de pagamento, com divulgação prévia aos participantes quando aplicável. O valor pode estar sujeito a retenções legais (ex.: impostos) conforme a legislação vigente.
    </p>

    <h2 style={sectionTitleStyle}>5. Como receber o pagamento</h2>
    <p style={textStyle}>
      Para receber a comissão, você precisa:
    </p>
    <ul style={listStyle}>
      <li>Manter sua conta ativa e em conformidade com as regras e os Termos de Uso.</li>
      <li>Preencher e manter atualizados seus dados cadastrais na área “Meus dados”, incluindo a <strong>chave PIX</strong> (e-mail, CPF, telefone ou chave aleatória) para que possamos realizar o repasse.</li>
      <li>Aguardar a confirmação pela Wefronti de que o contrato com o indicado foi efetivamente fechado e está em vigor, e que o pagamento da comissão está liberado.</li>
    </ul>
    <p style={textStyle}>
      O pagamento será feito via PIX na chave cadastrada, em periodicidade e prazos definidos pela Wefronti (por exemplo, mensal ou após a confirmação do contrato). A Wefronti não se responsabiliza por falhas no repasse decorrentes de dados incorretos ou desatualizados fornecidos pelo indicador.
    </p>

    <h2 style={sectionTitleStyle}>6. O que não é permitido</h2>
    <p style={textStyle}>
      É proibido e pode resultar em exclusão do programa e perda de comissões:
    </p>
    <ul style={listStyle}>
      <li><strong>Autoindicação:</strong> usar o próprio link para simular indicação ou criar contas falsas para indicar a si mesmo.</li>
      <li><strong>Múltiplas contas:</strong> criar mais de uma conta para acumular indicações ou burlar as regras.</li>
      <li><strong>Fraude:</strong> falsificar dados, cliques ou contratos; usar bots ou meios automatizados para acessar o link.</li>
      <li><strong>Spam ou abuso:</strong> enviar o link de forma massiva sem consentimento (spam) ou de modo que viole leis ou direitos de terceiros.</li>
      <li><strong>Induzir o indicado a mentir:</strong> combinar com o indicado para simular um contrato ou condição que não exista.</li>
    </ul>
    <p style={textStyle}>
      A Wefronti pode analisar cada indicação e recusar o pagamento ou encerrar a participação do indicador em caso de suspeita ou confirmação de irregularidade.
    </p>

    <h2 style={sectionTitleStyle}>7. Vínculo com a Wefronti</h2>
    <p style={textStyle}>
      A participação no programa não gera vínculo empregatício, societário ou de representação comercial com a Wefronti. O indicador atua em seu próprio nome; a Wefronti apenas reconhece a indicação e paga a comissão conforme estas regras.
    </p>

    <h2 style={sectionTitleStyle}>8. Alterações nas regras</h2>
    <p style={textStyle}>
      A Wefronti pode alterar estas regras a qualquer momento. Alterações relevantes serão divulgadas no site ou por e-mail quando possível. O uso continuado do programa após a divulgação constitui aceite das novas regras. Se você não concordar, pode encerrar sua participação deixando de usar o link e a área do programa.
    </p>

    <h2 style={sectionTitleStyle}>9. Dúvidas</h2>
    <p style={textStyle}>
      Para dúvidas sobre o programa ou estas regras, entre em contato:{' '}
      <a href="mailto:indicacao@wefronti.com" style={linkStyle}>indicacao@wefronti.com</a>. Para questões sobre seus dados pessoais, consulte nossa{' '}
      <Link href="/politica-privacidade" style={linkStyle}>Política de Privacidade</Link>.
    </p>
  </>
);
