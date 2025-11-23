import React from 'react';
import Badge from '../../components/ui/Badge';
import ProjectCard from '../../components/ui/ProjectCard';
import VehicleTrackingMap from '../../components/ui/VehicleTrackingMap';
import CheckoutAnimation from '../../components/ui/CheckoutAnimation';
import HealthDashboard from '../../components/ui/HealthDashboard';

const Projects: React.FC = () => {
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

  const projects = [
    {
      title: 'Saúde Plus',
      description: 'Saas de gestão para clínicas médicas, com agendamento online, prontuário eletrônico e telemedicina integrada.',
      category: 'Dashboard',
      tags: ['Dashboard', 'Analytics', 'Real-time'],
      technologies: {
        frontend: ['Next.js 16', 'React 19', 'Tailwind CSS 4'],
        backend: ['Node.js', 'PostgreSQL', 'Prisma ORM'],
      },
      customContent: <HealthDashboard />,
    },
    {
      title: 'Fleet Tracker',
      description: 'Sistema avançado de rastreamento de veículos em tempo real com geolocalização, alertas e relatórios.',
      category: 'Rastreio',
      tags: ['GPS', 'Tempo Real', 'Relatórios'],
      technologies: {
        frontend: ['React', 'Mapbox GL', 'Socket.io'],
        backend: ['Python', 'FastAPI', 'Redis', 'PostgreSQL'],
      },
      customContent: <VehicleTrackingMap />,
    },
    {
      title: 'Smart Checkout',
      description: 'Página de checkout otimizada com múltiplos métodos de pagamento, validação em tempo real e conversão elevada.',
      category: 'Fintech',
      tags: ['Checkout', 'Pagamentos', 'Conversão'],
      technologies: {
        frontend: ['React', 'Formik', 'Framer Motion'],
        backend: ['Node.js', 'Stripe', 'PayPal API'],
      },
      customContent: <CheckoutAnimation />,
    },
  ];

  return (
    <section 
      id="projects"
      className="w-full py-20 md:py-32 bg-custom-white dark:bg-custom-black transition-colors border-t border-b"
      style={{
        borderTopColor: isDark ? '#141414' : '#D1D5DB',
        borderBottomColor: isDark ? '#141414' : '#D1D5DB'
      }}
    >
      <div className="px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-left md:text-center mb-12 md:mb-16">
            <Badge icon="trophy" text="Portfólio" />
            <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-gray-900 dark:text-white mt-6 mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl md:mx-auto">
              Soluções completas e prontas para produção, desenvolvidas com as melhores tecnologias do mercado.
            </p>
          </div>

          {/* Grid de Projetos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
