import React from 'react';
import dynamic from 'next/dynamic';
import Badge from '../../components/ui/Badge';
import TestimonialCard from '../../components/ui/TestimonialCard';
import { useLanguage } from '../../contexts/LanguageContext';

// Lazy load do WorldMap com SSR desabilitado (melhora performance)
const WorldMap = dynamic(() => import('../../components/ui/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Carregando mapa...</div>
    </div>
  ),
});

const Clients: React.FC = () => {
  const [isDark, setIsDark] = React.useState(false);
  const { t } = useLanguage();

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

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
            <Badge icon="heart" text={t.clients.badge} />
            <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-gray-900 dark:text-white mt-6 mb-4">
              {t.clients.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl md:mx-auto">
              {t.clients.subtitle}
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
            {t.clients.testimonials.map((testimonial, index) => (
              <TestimonialCard key={`first-${index}`} {...testimonial} rating={5} image={`/images/depoimento-${index + 1}.webp`} />
            ))}
            {/* Segunda cópia - para loop infinito */}
            {t.clients.testimonials.map((testimonial, index) => (
              <TestimonialCard key={`second-${index}`} {...testimonial} rating={5} image={`/images/depoimento-${index + 1}.webp`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
