import React, { useEffect, useRef } from 'react';
import { colors } from '../../styles/colors';
import { Cloud, Code, Layout, LayoutDashboard, Server, ShoppingCart, Monitor } from 'lucide-react';

const services = [
 
  { 
    name: 'SISTEMA', 
    icon: <Server />
  },
  { 
    name: 'SAAS', 
    icon: <Cloud />
  },
  { 
    name: 'DASHBOARD', 
    icon: <LayoutDashboard />
  },
  { 
    name: 'E-COMMERCE', 
    icon: <ShoppingCart />
  },
  { 
    name: 'API', 
    icon: <Code />
  },
  { 
    name: 'WEBSITE', 
    icon: <Monitor />
  },

];

const ServiceIcon: React.FC<{ icon: React.ReactNode; index: number }> = ({ icon, index }) => {
  return (
    <div 
      className="flex items-center justify-center"
      style={{
        width: '1rem',
        height: '1rem',
        flexShrink: 0,
        color: colors.purple.tertiary,
      }}
    >
      <div className="w-4 h-4 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};

const ServicesCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const speed = 0.5; // Pixels por frame

    const animate = () => {
      scrollPosition -= speed; // Move da direita para esquerda (visual: esquerda para direita)

      // Calcula a largura de um conjunto completo de serviços
      const scrollWidth = scrollContainer.scrollWidth / 3; // Dividido por 3 porque temos 3 conjuntos

      // Reseta a posição quando um conjunto completo passar
      if (Math.abs(scrollPosition) >= scrollWidth) {
        scrollPosition = 0;
      }

      scrollContainer.style.transform = `translateX(${scrollPosition}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Triplica os serviços para criar efeito infinito sem quebras
  const displayServices = [...services, ...services, ...services];

  return (
    <section
      aria-label="services-carousel"
      className="w-full overflow-hidden"
     
    >
      <div className="w-full max-w-none mx-auto py-4 md:py-8 px-0">
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-center whitespace-nowrap will-change-transform"
            style={{ transition: 'none', gap: '0' }}
          >
            {displayServices.map((service, idx) => (
              <div key={`${service.name}-${idx}`} className="flex items-center gap-2 md:gap-3 px-3 md:px-6">
                <ServiceIcon icon={service.icon} index={idx} />
                <div 
                  className="text-sm md:text-sm"
                  style={{ 
                    color: colors.text.light,
                    fontWeight: 100,
                    letterSpacing: '0.08em'
                  }}
                >
                  {service.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel;
