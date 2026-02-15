import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { colors } from '../styles/colors';

const Footer = dynamic(() => import('../sections/Footer'), { ssr: false });

const PoliticaPrivacidade: React.FC = () => {
  return (
    <>
      <Head>
        <title>Política de Privacidade | Wefronti</title>
        <meta name="description" content="Política de Privacidade e proteção de dados pessoais da Wefronti de acordo com a LGPD" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>


      <div className="min-h-screen" style={{ backgroundColor: colors.background.dark }}>
        <main className="pb-16 px-8 md:px-16 lg:px-24" style={{ paddingTop: '180px' }}>
          <div className="container-narrow mx-auto">
            
            {/* Header */}
            <div className="mb-12">
              <h1 
                className="text-4xl md:text-4xl lg:text-5xl font-regular mb-4"
                style={{ color: colors.text.light }}
              >
                Política de Privacidade e Termos de Uso
              </h1>
              <p className="text-sm font-regular" style={{ color: colors.text.light, opacity: 0.6 }}>
                Última atualização: 21 de janeiro de 2026
              </p>
            </div>

            {/* Conteúdo */}
            <div className="space-y-12">
              
              {/* Introdução */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  1. Introdução
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    A <strong>Wefronti</strong> está comprometida com a proteção da privacidade e dos dados pessoais de seus clientes, usuários e visitantes.
                  </p>
                  <p>
                    Esta Política de Privacidade e Termos de Uso descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a <strong>Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)</strong> e demais legislações aplicáveis.
                  </p>
                  <p>
                    Ao utilizar nosso site e serviços, você concorda com os termos desta política.
                  </p>
                </div>
              </section>

              {/* Coleta de Dados */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  2. Dados Coletados
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    Coletamos apenas os dados estritamente necessários para prestar nossos serviços:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Dados de identificação:</strong> Nome completo e e-mail</li>
                    <li><strong>Dados de contato:</strong> Telefone</li>
                    <li><strong>Dados profissionais:</strong> Nome da empresa</li>
                    <li><strong>Dados do projeto:</strong> Investimento disponível, tipo de projeto desejado, urgência e detalhes do projeto</li>
                    <li><strong>Dados técnicos:</strong> Endereço IP, tipo de navegador, data e hora de acesso</li>
                  </ul>
                  <p className="mt-4 font-regular" style={{ color: colors.text.light }}>
                    Os dados são coletados através do formulário de contato em nossa página principal para que possamos elaborar propostas comerciais personalizadas e entrar em contato sobre sua solicitação.
                  </p>
                  <p className="mt-4">
                    <strong>Não coletamos dados sensíveis</strong> como origem racial, convicções religiosas, filiação sindical, dados genéticos ou biométricos.
                  </p>
                </div>
              </section>

              {/* Uso dos Dados */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  3. Finalidade do Tratamento de Dados
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    Utilizamos seus dados pessoais exclusivamente para:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Entrar em contato sobre sua solicitação de orçamento</li>
                    <li>Elaborar propostas comerciais personalizadas</li>
                    <li>Prestar os serviços contratados</li>
                    <li>Enviar comunicações relacionadas aos nossos serviços (com seu consentimento)</li>
                    <li>Cumprir obrigações legais e regulatórias</li>
                    <li>Melhorar a experiência do usuário em nosso site</li>
                    <li>Prevenir fraudes e garantir a segurança</li>
                  </ul>
                  <p className="mt-4 font-regular">
                    Não compartilhamos, vendemos ou alugamos seus dados pessoais para terceiros para fins comerciais ou de marketing.
                  </p>
                </div>
              </section>

              {/* Compartilhamento */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  4. Compartilhamento de Dados
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    <strong>Seus dados NÃO são compartilhados com terceiros</strong>, exceto nas seguintes situações estritamente necessárias:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Provedores de infraestrutura:</strong> Serviços de hospedagem como Vercel e Neon Database que armazenam dados em servidores seguros</li>
                    <li><strong>Obrigação legal:</strong> Quando exigido por autoridades judiciais ou governamentais</li>
                    <li><strong>Proteção de direitos:</strong> Para defender nossos direitos legais em processos judiciais</li>
                  </ul>
                  <p className="mt-4">
                    Todos os provedores são contratados sob rigorosos termos de confidencialidade e conformidade com a LGPD.
                  </p>
                </div>
              </section>

              {/* Segurança */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  5. Segurança dos Dados
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    Implementamos medidas técnicas e organizacionais para proteger seus dados:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Criptografia:</strong> Conexões HTTPS com TLS/SSL e criptografia de dados sensíveis</li>
                    <li><strong>Sanitização:</strong> Validação e limpeza de todos os inputs do usuário</li>
                    <li><strong>Proteção SQL Injection:</strong> Uso de prepared statements</li>
                    <li><strong>Rate Limiting:</strong> Proteção contra ataques automatizados</li>
                    <li><strong>Firewall:</strong> Bloqueio de requisições maliciosas</li>
                    <li><strong>Backup:</strong> Cópias de segurança regulares</li>
                    <li><strong>Acesso restrito:</strong> Apenas colaboradores autorizados acessam dados pessoais</li>
                  </ul>
                </div>
              </section>

              {/* Direitos do Titular */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  6. Seus Direitos pela LGPD
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    De acordo com a LGPD, você tem direito a:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                    <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou incorretos</li>
                    <li><strong>Anonimização:</strong> Solicitar anonimização de dados desnecessários</li>
                    <li><strong>Eliminação:</strong> Solicitar exclusão de dados tratados com seu consentimento</li>
                    <li><strong>Portabilidade:</strong> Solicitar transferência de dados para outro fornecedor</li>
                    <li><strong>Revogação de consentimento:</strong> Retirar consentimento a qualquer momento</li>
                    <li><strong>Oposição:</strong> Se opor ao tratamento de dados</li>
                  </ul>
                  <p className="mt-4">
                    Para exercer seus direitos, entre em contato: <a href="mailto:privacidade@wefronti.com" style={{ color: colors.text.dark }}>privacidade@wefronti.com</a>
                  </p>
                </div>
              </section>

              {/* Retenção */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  7. Retenção de Dados
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    Mantemos seus dados pessoais apenas pelo tempo necessário para:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Cumprir as finalidades descritas nesta política</li>
                    <li>Atender obrigações legais (prazos fiscais e contábeis)</li>
                    <li>Exercer direitos em processos judiciais</li>
                  </ul>
                  <p className="mt-4">
                    Após o período de retenção, os dados são permanentemente excluídos ou anonimizados.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  8. Cookies e Tecnologias de Rastreamento
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    Nosso site utiliza cookies para melhorar sua experiência:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Cookies necessários:</strong> Essenciais para o funcionamento básico do site</li>
                    <li><strong>Cookies de preferência:</strong> Armazenam suas escolhas (idioma, região)</li>
                    <li><strong>Cookies analíticos:</strong> Google Analytics para entender como você usa o site (apenas com seu consentimento)</li>
                  </ul>
                  <p className="mt-4">
                    Você pode gerenciar suas preferências de cookies através do banner de consentimento que aparece na primeira visita ao site. Você pode configurar seu navegador para bloquear cookies, mas isso pode afetar a funcionalidade do site.
                  </p>
                </div>
              </section>


              {/* Propriedade Intelectual */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  10. Propriedade Intelectual
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    Todo o conteúdo do site (textos, imagens, logotipos, código-fonte) é de propriedade exclusiva da Wefronti e protegido por leis de direitos autorais.
                  </p>
                  <p>
                    É proibida a reprodução, distribuição ou modificação sem autorização prévia.
                  </p>
                </div>
              </section>

              {/* Alterações */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  11. Alterações na Política
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    Podemos atualizar esta política periodicamente. Alterações significativas serão comunicadas por e-mail ou notificação no site.
                  </p>
                  <p>
                    Recomendamos revisar esta página regularmente.
                  </p>
                </div>
              </section>

              {/* Legislação */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  12. Legislação Aplicável
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    Esta política é regida pelas leis brasileiras, especialmente:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)</li>
                    <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
                    <li>Código de Defesa do Consumidor (Lei nº 8.078/1990)</li>
                  </ul>
                </div>
              </section>

              {/* Contato */}
              <section>
                <h2 className="text-2xl font-regular mb-4" style={{ color: colors.text.light }}>
                  13. Contato e Encarregado de Dados
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  <p>
                    Para dúvidas, solicitações ou exercer seus direitos sobre dados pessoais, entre em contato:
                  </p>
                  <div className="mt-4 p-6" style={{ backgroundColor: colors.neutral.accordeon, border: `1px solid ${colors.neutral.borderDark}`, borderRadius: '10px' }}>
                    <p className="font-regular mb-2">Wefronti Tecnologia Ltda</p>
                    <p>CNPJ: 64.507.638/0001-04</p>
                    <p>E-mail: <a href="mailto:privacidade@wefronti.com" style={{ color: colors.text.dark }}>privacidade@wefronti.com</a></p>
                    <p>Endereço: Avenida Cristovao Colombo, 2144, Sala 408 Andar 3, Floresta, Porto Alegre, RS</p>
                  </div>
                  <p className="mt-4">
                    Responderemos sua solicitação em até <strong>15 dias úteis</strong>, conforme estabelecido pela LGPD.
                  </p>
                </div>
              </section>

              {/* Aceite */}
          

            </div>
          </div>
        </main>


      </div>
    </>
  );
};

export default PoliticaPrivacidade;
