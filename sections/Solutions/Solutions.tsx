import React, { useEffect, useRef, useState } from 'react';
import { color, motion } from 'framer-motion';
import { colors } from '../../styles/colors';
import { Check, ShoppingCart, BarChart2, Code, ArrowUpRight, CheckCheckIcon } from 'lucide-react';

const Solutions: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((([entry]) => {
      setIsVisible(entry.isIntersecting);
    }) as IntersectionObserverCallback, { threshold: 0.2 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="w-full py-12 md:py-20"
      style={{ backgroundColor: colors.background.light }}
    >
      <div className="relative z-[20] px-0 sm:px-1 md:px-2 lg:px-4">
        <div className="w-full max-w-none mx-auto">

          {/* Header: badge (width = card 1) + title/subtitle — match hero alignment */}
          <div className="w-full max-w-none mx-auto grid grid-cols-1 md:grid-cols-12 items-center gap-6 px-4 md:px-0">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-4 flex items-start"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                <CheckCheckIcon className="w-4 h-4" style={{ color: colors.text.dark }} strokeWidth={2} />
                <span className="text-sm font-medium uppercase" style={{ color: colors.text.dark }}>VEJA COMO PODEMOS LHE AJUDAR</span>
              </div>
            </motion.div>

            <div className="md:col-span-8">
              <motion.h2
                initial={{ opacity: 0, x: 10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="text-3xl md:text-5xl lg:text-[74px] font-light uppercase leading-tight"
                style={{ color: colors.text.dark }}
              >
                Soluções digitais pensadas para atender diferentes necessidades do negócio
              </motion.h2>

              
            </div>
          </div>

          {/* Three cards aligned left-to-right */}
          <motion.div
            className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch md:-mx-2 lg:-mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Card 1 - Sites & E-commerce */}
            <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: colors.green.tertiary }}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8" style={{ color: '#0e2b20' }} />
                </div>
                <div className="text-sm text-black-700">01.</div>
              </div>

              <h3 className="mt-8 text-lg md:text-2xl lg:text-3xl font-regular uppercase" style={{ color: '#0e2b20' }}>SITES E E-COMMERCE</h3>
              <p className="mt-4 text-base md:text-lg text-gray-800 max-w-md">Sites institucionais modernos e lojas virtuais completas com checkout otimizado, gestão de produtos e integrações de pagamento.</p>

              <a href="/solucoes/sites" className="mt-6 text-base font-medium inline-flex items-center gap-2" style={{ color: colors.text.dark }}>Saiba mais <ArrowUpRight className="w-4 h-4" style={{ color: colors.text.dark }} /></a>
            </div>

            {/* Card 2 - SaaS & Dashboard */}
            <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: colors.green.secondary }}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <BarChart2 className="w-8 h-8" style={{ color: colors.green.primary }} />
                </div>
                <div className="text-sm text-white/60">02.</div>
              </div>

              <h3 className="mt-8 text-lg md:text-2xl lg:text-3xl font-regular uppercase" style={{ color: colors.green.primary }}>SAAS & DASHBOARD</h3>
              <p className="mt-4 text-base md:text-lg text-gray-200 max-w-md">Plataformas como serviço prontas para escalar e painéis analíticos interativos para visualizar dados e métricas em tempo real.</p>

              <a href="/solucoes/saas" className="mt-6 text-base font-medium inline-flex items-center gap-2" style={{ color: colors.whiteColor }}>Saiba mais <ArrowUpRight className="w-4 h-4" style={{ color: colors.whiteColor }} /></a>
            </div>

            {/* Card 3 - API & Sistemas (light) */}
            <div className="p-10 md:p-14 flex flex-col justify-center" style={{ background: colors.green.primary }}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Code className="w-8 h-8" style={{ color: colors.green.secondary }} />
                </div>
                <div className="text-sm text-gray-700">03.</div>
              </div>

              <h3 className="mt-8 text-lg md:text-2xl lg:text-3xl font-regular uppercase" style={{ color: '#12201a' }}>API & SISTEMAS</h3>
              <p className="mt-4 text-base md:text-lg text-gray-800 max-w-md">Integrações seguras com APIs, além de sistemas web robustos para conectar e automatizar processos do negócio.</p>

              <a href="/solucoes/api" className="mt-6 text-base font-medium inline-flex items-center gap-2" style={{ color: colors.text.dark }}>Saiba mais <ArrowUpRight className="w-4 h-4" style={{ color: colors.text.dark }} /></a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Solutions;
