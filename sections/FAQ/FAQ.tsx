import React from 'react';
import dynamic from 'next/dynamic';
import Badge from '../../components/ui/Badge';
import { useQuoteModal } from '../../contexts/QuoteModalContext';

const AnimatedGridBackground = dynamic(
  () => import('../../components/effects/AnimatedGridBackground'),
  { ssr: false }
);

const FAQ: React.FC = () => {
  const [isDark, setIsDark] = React.useState(false);
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const { openModal } = useQuoteModal();

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: 'Quanto tempo leva para desenvolver meu projeto?',
      answer: 'O prazo varia conforme a complexidade. Sites e landing pages mais básicos podem levar de semanas ou entre 1 e 2 meses, enquanto aplicativos mobile, SaaS e sistemas customizados podem levar de 3 a 6 meses. Trabalhamos com metodologia ágil, entregando funcionalidades incrementalmente para você acompanhar o progresso.'
    },
    {
      question: 'Qual é o investimento necessário para criar meu produto?',
      answer: 'O investimento depende do escopo, funcionalidades e tecnologias envolvidas. Após entender suas necessidades, preparamos uma proposta detalhada com valores transparentes. Oferecemos opções flexíveis de pagamento e garantimos que cada real investido traga retorno real para seu negócio.'
    },
    {
      question: 'Vocês oferecem suporte após a entrega do projeto?',
      answer: 'Sim! Oferecemos acompanhamento pós-entrega e planos de manutenção mensal. Isso inclui correções de bugs, atualizações de segurança, melhorias de performance e suporte técnico. Queremos garantir que seu produto continue funcionando perfeitamente e evoluindo com seu negócio.'
    },
    {
      question: 'Como funciona o processo de desenvolvimento?',
      answer: 'Seguimos uma metodologia ágil com sprints semanais. Começamos com discovery para entender seu negócio, depois criamos protótipos, desenvolvemos em ciclos curtos com entregas frequentes, e realizamos testes contínuos. Você participa ativamente, validando cada etapa e ajustando o rumo quando necessário.'
    },
    {
      question: 'Posso fazer alterações durante o desenvolvimento?',
      answer: 'Absolutamente! A metodologia ágil foi criada justamente para isso. A cada sprint você pode sugerir ajustes, priorizar novas funcionalidades ou mudar de direção. Mantemos flexibilidade para adaptar o projeto às suas necessidades em evolução, sempre de forma transparente sobre impactos em prazo e custo.'
    },
    {
      question: 'Vocês trabalham com quais tecnologias?',
      answer: 'Utilizamos tecnologias modernas e comprovadas: React, Next.js, TypeScript para front-end; Node.js, para back-end; Flutter para mobile; AWS para cloud. Escolhemos o stack ideal para cada projeto considerando escalabilidade, performance, segurança e custo-benefício a longo prazo.'
    },
    {
      question: 'Como garantem a qualidade e segurança do produto?',
      answer: 'Aplicamos as melhores práticas de engenharia de software: code review em todo código, testes automatizados, integração contínua, monitoramento de performance. Na segurança, implementamos autenticação robusta, criptografia de dados, proteção contra vulnerabilidades comuns e conformidade com LGPD. Qualidade não é negociável.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-20 md:py-32 bg-custom-white dark:bg-custom-black transition-colors relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <AnimatedGridBackground />
      </div>

      <div className="px-4 md:px-8 lg:px-16 relative z-10">
        <div className="w-full max-w-[900px] mx-auto">
          
          {/* Cabeçalho */}
          <div className="text-left md:text-center mb-12 md:mb-16">
            <Badge icon="help" text="Perguntas Frequentes" />
            <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-gray-900 dark:text-white mt-6 mb-4">
              Tudo o que você precisa saber
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl md:mx-auto">
              Reunimos as dúvidas mais comuns sobre nossos serviços e processos.
            </p>
          </div>

          {/* Lista de FAQs */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border transition-colors"
                style={{
                  borderColor: isDark ? '#141414' : '#D1D5DB',
                  borderRadius: '7px',
                  backgroundColor: isDark ? '#010101' : '#f7f7f7',
                }}
              >
                {/* Pergunta */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-200 hover:opacity-80"
                >
                  <span className="text-base md:text-lg font-medium text-gray-900 dark:text-white pr-4">
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
                    style={{ color: isDark ? '#f7f7f7' : '#010101' }}
                  >
                    <polyline
                      points="6 9 12 15 18 9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Resposta */}
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: openIndex === index ? '500px' : '0',
                    opacity: openIndex === index ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-5">
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
              Ainda tem dúvidas? Estamos aqui para ajudar!
            </p>
            <button
              onClick={openModal}
              className="px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: '#3B82F6',
                borderRadius: '7px',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
              }}
            >
              Fale com nosso time
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
