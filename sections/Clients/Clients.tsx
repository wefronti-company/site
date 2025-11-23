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
      image: '/images/depoimento-1.webp',
    },
    {
      name: 'Marina Costa',
      role: 'Diretora de Marketing',
      company: 'Innovate Corp',
      text: 'O e-commerce desenvolvido superou todas as nossas expectativas. A experiência do usuário é impecável e as vendas aumentaram 150% no primeiro mês.',
      rating: 5,
      image: '/images/depoimento-2.webp',
    },
    {
      name: 'Roberto Almeida',
      role: 'Fundador',
      company: 'StartupXYZ',
      text: 'Equipe extremamente profissional e dedicada. Transformaram nossa ideia em um SaaS completo e escalável. O suporte pós-entrega é excelente.',
      rating: 5,
      image: '/images/depoimento-3.webp',
    },
    {
      name: 'Julia Santos',
      role: 'Gerente de Projetos',
      company: 'Digital Solutions',
      text: 'A landing page ficou incrível! O design moderno e responsivo nos ajudou a converter muito mais leads. Processo de desenvolvimento foi muito fluido.',
      rating: 5,
      image: '/images/depoimento-5.webp',
    },
    {
      name: 'André Ferreira',
      role: 'CTO',
      company: 'FinTech Pro',
      text: 'Desenvolvimento impecável do nosso sistema financeiro. Seguiram todas as melhores práticas de segurança e a integração com APIs foi perfeita.',
      rating: 5,
      image: '/images/depoimento-4.webp',
    },
  ];

  return (
    <section 
      id="clients"
      className="w-full py-20 md:py-32 bg-custom-white dark:bg-custom-black transition-colors border-b relative overflow-hidden"
      style={{
        borderBottomColor: isDark ? '#141414' : '#D1D5DB'
      }}
    >
      {/* Mapa Mundial como background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-[500px] md:h-[600px] lg:h-[700px]">
          <WorldMap />
        </div>
        {/* Gradiente superior */}
        <div 
          className="absolute top-0 left-0 right-0 h-48 md:h-64 pointer-events-none"
          style={{
            background: isDark 
              ? 'linear-gradient(to bottom, #010101 0%, rgba(1, 1, 1, 0.8) 50%, transparent 100%)'
              : 'linear-gradient(to bottom, #f7f7f7 0%, rgba(247, 247, 247, 0.8) 50%, transparent 100%)'
          }}
        />
        {/* Gradiente inferior */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-48 md:h-64 pointer-events-none"
          style={{
            background: isDark 
              ? 'linear-gradient(to top, #010101 0%, rgba(1, 1, 1, 0.8) 50%, transparent 100%)'
              : 'linear-gradient(to top, #f7f7f7 0%, rgba(247, 247, 247, 0.8) 50%, transparent 100%)'
          }}
        />
      </div>

      {/* Cabeçalho */}
      <div className="px-4 md:px-8 lg:px-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-left md:text-center mb-[-180px] md:mb-[-220px] lg:mb-[-250px]">
            <Badge icon="heart" text="Depoimentos" />
            <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-gray-900 dark:text-white mt-6 mb-4">
              O que nossos clientes dizem sobre nós
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl md:mx-auto">
              Clientes satisfeitos ao redor do mundo, conectados por nossas soluções digitais.
            </p>
          </div>
        </div>
      </div>

      {/* Espaçamento para o mapa */}
      <div className="h-[500px] md:h-[600px] lg:h-[700px]" />

      {/* Depoimentos - Carrossel Infinito - Full Width */}
      <div className="mt-[-80px] md:mt-[-100px] relative z-10">
        <div className="relative overflow-hidden">
          {/* Container do carrossel */}
          <div className="flex gap-6 animate-scroll">
            {/* Primeira cópia */}
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`first-${index}`} {...testimonial} />
            ))}
            {/* Segunda cópia - para loop infinito */}
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`second-${index}`} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
