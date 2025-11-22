import React from 'react';
import Badge from '../../components/ui/Badge';
import ServiceCard from '../../components/ui/ServiceCard';

const Services: React.FC = () => {
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

  const services = [
    {
      title: 'Aplicativo Mobile, Software, Saas.',
      description: 'Criação de sistemas, plataformas, áreas de membros e aplicações web.',
      features: [
        'Integrações API',
        'Tecnologias modernas',
        'Sistema escalável',
        'Acompanhamento pós entrega',
        '100% personalizado'
      ],
      timeline: 'Prazo: 3 à 6 meses'
    },
    {
      title: 'Site, Landing Page, E-commerce.',
      description: 'Desenvolvimento web para sites institucionais e loja virtual.',
      features: [
        'Responsivo para todas as telas',
        'Design que retém e converte',
        'Manutenção mensal',
        'Estratégias de conversão',
        '100% otimizado'
      ],
      timeline: 'Prazo: 1 à 2 meses'
    }
  ];

  const teamRoles = [
    'Product Owner',
    'Scrum Master',
    'Designer UI/UX',
    'Desenvolvedor Back-end / Front-end'
  ];

  return (
    <section 
      className="w-full py-20 md:py-32 bg-custom-white dark:bg-custom-black transition-colors border-t border-b"
      style={{
        borderTopColor: isDark ? '#141414' : '#D1D5DB',
        borderBottomColor: isDark ? '#141414' : '#D1D5DB'
      }}
    >
      <div className="px-4 md:px-8 lg:px-16">
        <div className="w-full max-w-[1400px] mx-auto">
          
          {/* Left Side - Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Badge text="Nossos serviços" icon="rocket" />
              
              <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-gray-900 dark:text-white leading-tight">
                Tecnologia e design para colocar seu projeto no ar e gerar receita.
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Equipe pronta para atender sua demanda.
              </p>

              <div className="flex flex-col gap-3 mt-4">
                {teamRoles.map((role, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      className="text-blue-500 flex-shrink-0"
                    >
                      <polyline points="9 11 12 14 22 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-base md:text-lg text-gray-700 dark:text-gray-300">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Service Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  timeline={service.timeline}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
