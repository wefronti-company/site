import React, { useEffect, useRef } from 'react';
import { colors } from '../../styles/colors';

const services = [
  { name: 'App Mobile', icon: '📱' },
  { name: 'Sistema Web', icon: '🌐' },
  { name: 'SaaS', icon: '☁️' },
  { name: 'Dashboard', icon: '📊' },
  { name: 'E-commerce', icon: '🛒' },
  { name: 'API Integration', icon: '🔌' },
];

const ServiceIcon: React.FC<{ icon: string; index: number }> = ({ icon, index }) => {
  // Alterna entre os dois gradientes
  const isGradientOne = index % 2 === 0;
  const bgColor = isGradientOne ? colors.gradientOne : colors.gradientTwo;
  
  return (
    <div 
      className="flex items-center justify-center rounded-full"
      style={{
        width: '48px',
        height: '48px',
        backgroundColor: bgColor,
        flexShrink: 0
      }}
    >
      <span style={{ fontSize: '24px' }}>{icon}</span>
    </div>
  );
};

const MovingWords: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let lastScroll = window.scrollY;

    const onFrame = () => {
      const rect = container.getBoundingClientRect();
      // use the container center as reference
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, 1 - (rect.top + rect.height / 2) / viewportHeight));

      // compute translateX from progress (-distance .. distance) in alternating direction
      const distance = 120; // px max shift
      const offset = (progress - 0.5) * 2 * distance; // -distance..distance

      // baseOffset moves the whole ticker slightly to the left so the first word
      // appears partly cut off and gives the effect of words flowing out of the sides.
      const baseOffset = 84; // px - tweak this if you want more/less cutoff

      // Use scroll delta for slight parallax
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;

      // Combine offsets
      (content.style as any).transform = `translateX(${-baseOffset - offset - delta * 0.3}px)`;

      rafRef.current = requestAnimationFrame(onFrame);
    };

    rafRef.current = requestAnimationFrame(onFrame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Duplica a lista de serviços para criar o efeito infinito
  const displayServices = [...services, ...services, ...services];

  return (
    <section
      aria-label="services-ticker"
      ref={containerRef}
      className="w-full overflow-hidden"
      style={{ backgroundColor: colors.blackColor }}
    >
      {/* Full width container */}
      <div className="w-screen max-w-none mx-auto py-12 md:py-16 px-0">
        <div className="relative overflow-hidden">
          <div
            ref={contentRef}
            className="flex items-center gap-6 whitespace-nowrap transition-transform will-change-transform"
          >
            {displayServices.map((service, idx) => (
              <div key={`${service.name}-${idx}`} className="flex items-center gap-4 mr-8 md:mr-12">
                <ServiceIcon icon={service.icon} index={idx} />
                <div 
                  style={{ 
                    color: colors.whiteColor,
                    fontWeight: 500,
                    fontSize: '1.125rem'
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

export default MovingWords;
