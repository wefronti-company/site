import React from 'react';
import Badge from '../../components/ui/Badge';
import WorldMap from '../../components/ui/WorldMap';
import TestimonialCard from '../../components/ui/TestimonialCard';

const Clients: React.FC = () => {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'CEO',
      company: 'TechStart Brasil',
      text: 'Trabalhar com esta equipe foi excepcional. Entregaram nosso aplicativo mobile antes do prazo e com qualidade superior ao esperado. Recomendo fortemente!',
      rating: 5,
    },
    {
      name: 'Marina Costa',
      role: 'Diretora de Marketing',
      company: 'Innovate Corp',
      text: 'O e-commerce desenvolvido superou todas as nossas expectativas. A experiência do usuário é impecável e as vendas aumentaram 150% no primeiro mês.',
      rating: 5,
    },
    {
      name: 'Roberto Almeida',
      role: 'Fundador',
      company: 'StartupXYZ',
      text: 'Equipe extremamente profissional e dedicada. Transformaram nossa ideia em um SaaS completo e escalável. O suporte pós-entrega é excelente.',
      rating: 5,
    },
    {
      name: 'Julia Santos',
      role: 'Gerente de Projetos',
      company: 'Digital Solutions',
      text: 'A landing page ficou incrível! O design moderno e responsivo nos ajudou a converter muito mais leads. Processo de desenvolvimento foi muito fluido.',
      rating: 5,
    },
    {
      name: 'André Ferreira',
      role: 'CTO',
      company: 'FinTech Pro',
      text: 'Desenvolvimento impecável do nosso sistema financeiro. Seguiram todas as melhores práticas de segurança e a integração com APIs foi perfeita.',
      rating: 5,
    },
    {
      name: 'Beatriz Lima',
      role: 'Product Owner',
      company: 'MedTech Health',
      text: 'Parceria excepcional do início ao fim. A metodologia ágil facilitou muito o acompanhamento e as entregas incrementais agregaram muito valor.',
      rating: 5,
    },
  ];

  return (
    <section 
      className="w-full py-20 md:py-32 bg-custom-white dark:bg-custom-black transition-colors border-b"
      style={{
        borderBottomColor: isDark ? '#141414' : '#D1D5DB'
      }}
    >
      <div className="px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-12 md:mb-16">
            <Badge icon="star" text="Casos de sucesso" />
            <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-gray-900 dark:text-white mt-6 mb-4">
              O que nossos clientes dizem sobre nós
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Clientes satisfeitos ao redor do mundo, conectados por nossas soluções digitais.
            </p>
          </div>

          {/* Mapa Mundial */}
          <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] mb-16 md:mb-20">
            <WorldMap />
          </div>

          {/* Depoimentos - Carrossel Infinito */}
          <div className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white mb-8 text-center">
              O que nossos clientes dizem
            </h3>
            
            <div className="relative overflow-hidden">
              {/* Container do carrossel */}
              <div className="flex gap-6 animate-scroll">
                {/* Primeiro conjunto de cards */}
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={`first-${index}`} {...testimonial} />
                ))}
                {/* Duplica os cards para efeito de loop infinito */}
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={`second-${index}`} {...testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Clients;
