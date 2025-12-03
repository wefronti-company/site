import React from 'react';
import Badge from '../../components/ui/Badge';
import ButtonCta from '../../components/ui/ButtonCta';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import { colors } from '../../styles/colors';

const FAQ: React.FC = () => {
 const [openIndex, setOpenIndex] = React.useState<number | null>(0);

 const toggleFAQ = (index: number) => {
 setOpenIndex(openIndex === index ? null : index);
 };

 return (
 <section 
 id="faq" 
 className="w-full py-20 md:py-0 md:h-screen md:w-screen md:flex md:items-center transition-colors relative overflow-hidden"
 style={{ backgroundColor: colors.blackColor }}
 >
 <div className="px-4 md:px-8 lg:px-16 relative z-10 w-full">
 <div className="w-full max-w-[1200px] mx-auto">
 
 {/* Layout: Título à esquerda, Accordion à direita */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
 
 {/* Coluna Esquerda - Título */}
 <div className="lg:col-span-4">
 <h2 
 className="text-4xl md:text-5xl lg:text-6xl font-medium"
 style={{ color: colors.whiteColor }}
 >
 Perguntas Frequentes
 </h2>
 </div>

 {/* Coluna Direita - Accordion */}
 <div className="lg:col-span-8 space-y-4">
 {[
 {
 question: 'Quanto tempo leva para desenvolver um projeto?',
 answer: 'O prazo varia conforme a complexidade. Landing pages e sites institucionais ficam prontos em 1-2 meses. Sistemas SaaS e aplicativos mobile levam de 3-6 meses. Após uma reunião inicial, apresentamos um cronograma detalhado com todas as etapas e prazos.'
 },
 {
 question: 'Qual o investimento necessário para começar?',
 answer: 'O investimento varia de acordo com o escopo do projeto. Sites e landing pages começam a partir de R$ 5.000. Sistemas SaaS e aplicativos têm valores personalizados baseados nas funcionalidades necessárias. Oferecemos propostas transparentes e detalhadas antes de iniciar.'
 },
 {
 question: 'Vocês oferecem suporte após a entrega?',
 answer: 'Sim! Oferecemos 30 dias de garantia gratuita para correções de bugs. Também disponibilizamos planos de manutenção mensal que incluem updates, monitoramento, backups, suporte técnico e pequenas melhorias. O suporte garante que seu projeto continue funcionando perfeitamente.'
 },
 {
 question: 'Posso acompanhar o desenvolvimento do projeto?',
 answer: 'Absolutamente! Trabalhamos com metodologia ágil (Scrum) com sprints de 2 semanas. Você terá acesso a reuniões de planejamento, reviews semanais, ambiente de homologação para testes e comunicação direta via Slack/WhatsApp. Total transparência em todas as etapas.'
 },
 {
 question: 'Quais tecnologias vocês utilizam?',
 answer: 'Utilizamos as tecnologias mais modernas e confiáveis do mercado. Frontend: React, Next.js, TypeScript, Tailwind CSS. Backend: Node.js, Python, PostgreSQL, MongoDB. Mobile: React Native, Flutter. Cloud: AWS, Vercel, Google Cloud. Escolhemos a stack ideal para cada projeto.'
 },
 {
 question: 'Como garantem a qualidade e segurança do código?',
 answer: 'Aplicamos as melhores práticas de engenharia de software: code review em todo código, testes automatizados, integração contínua, monitoramento de performance. Na segurança, implementamos autenticação robusta, criptografia de dados, proteção contra vulnerabilidades comuns e conformidade com LGPD. Qualidade não é negociável.'
 }
 ].map((faq, index) => (
 <div
 key={index}
 className="border transition-colors"
 style={{
 borderColor: colors.borderDark,
 borderRadius: '7px',
 backgroundColor: colors.blackColor,
 }}
 >
 {/* Pergunta */}
 <button
 onClick={() => toggleFAQ(index)}
 className="w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-200 hover:opacity-80"
 >
 <span 
 className="text-base md:text-lg font-medium pr-4"
 style={{ color: colors.whiteColor }}
 >
 {faq.question}
 </span>
 <svg
 width="24"
 height="24"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 className={`flex-shrink-0 transition-transform duration-300 ${
 openIndex === index ? 'rotate-180' : ''
 }`}
 style={{ color: colors.whiteColor }}
 >
 <polyline
 points="6 9 12 15 18 9"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 </button>


 <div
 className="overflow-hidden transition-all duration-300"
 style={{
 maxHeight: openIndex === index ? '500px' : '0',
 opacity: openIndex === index ? 1 : 0,
 }}
 >
 <div className="px-6 pb-5">
 <p 
 className="text-base leading-relaxed"
 style={{ color: colors.whiteColor, opacity: 0.8 }}
 >
 {faq.answer}
 </p>
 </div>
 </div>
 </div>
 ))}
 </div>

 </div>

 {/* Call to Action */}
 
 </div>
 </div>
 </section>
 );
};

export default FAQ;
