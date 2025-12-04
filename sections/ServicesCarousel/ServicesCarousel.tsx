import React, { useEffect, useRef } from 'react';
import { colors } from '../../styles/colors';

const services = [
  { 
    name: 'App Mobile', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    )
  },
  { 
    name: 'Sistema Web', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    )
  },
  { 
    name: 'SaaS', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
    )
  },
  { 
    name: 'Dashboard', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
  },
  { 
    name: 'E-commerce', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    )
  },
  { 
    name: 'API Integration', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    )
  },
  { 
    name: 'Site', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    )
  },
  { 
    name: 'Checkout Page', 
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    )
  },
];

const ServiceIcon: React.FC<{ icon: React.ReactNode; index: number }> = ({ icon, index }) => {
  return (
    <div 
      className="flex items-center justify-center rounded-full border"
      style={{
        width: '2.75rem',
        height: '2.75rem',
        background: `linear-gradient(135deg, ${colors.gradientOne} 0%, ${colors.gradientTwo} 100%)`,
        borderColor: colors.borderDark,
        borderWidth: '1px',
        flexShrink: 0,
        color: colors.blackColor
      }}
    >
      <div className="w-5 h-5 flex items-center justify-center">
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
      className="w-full overflow-hidden border-t border-b"
      style={{ 
        backgroundColor: colors.blackColor,
        borderColor: colors.borderDark
      }}
    >
      <div className="w-screen max-w-none mx-auto py-8 md:py-10 px-0">
        <div className="relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex items-center whitespace-nowrap will-change-transform"
            style={{ transition: 'none', gap: '0' }}
          >
            {displayServices.map((service, idx) => (
              <div key={`${service.name}-${idx}`} className="flex items-center gap-3 md:gap-4 px-4 md:px-8">
                <ServiceIcon icon={service.icon} index={idx} />
                <div 
                  className="text-base md:text-lg"
                  style={{ 
                    color: colors.whiteColor,
                    fontWeight: 500,
                    letterSpacing: '-0.01em'
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
