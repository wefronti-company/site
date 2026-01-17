import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/colors';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Logo from '../../components/ui/Logo';

const benefits = [
  'Soluções digitais sob medida, adaptadas à realidade de cada negócio',
  'Arquitetura pensada para segurança, escala e evolução contínua',
  'Processos flexíveis, sem soluções genéricas ou engessadas',
  'Foco em estabilidade, performance e operação em produção',
  'Comunicação clara e acompanhamento próximo durante todo o projeto',
  'Tecnologia alinhada a objetivos estratégicos, não apenas entrega técnica',
  'Capacidade de atuar desde projetos simples até soluções complexas',
  'Código organizado, documentado e preparado para crescimento',
  'Visão de longo prazo, evitando retrabalho e dependência técnica'
];

  // Competitors will show the "engessado" (bureaucratic/hard) process markers (mostly negatives)
  const competitors = [
    { name: 'Mercado tradicional' }
  ];

const Comparative: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.18 });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="comparative" className="w-full py-12 md:py-16" style={{ backgroundColor: colors.background.light }}>
      <div className="relative z-[20] px-0 sm:px-1 md:px-2 lg:px-4">
        <div className="w-full max-w-none mx-auto pt-6 md:pt-10">

          {/* Header */}
          <div className="w-full max-w-none mx-auto grid grid-cols-1 items-center gap-6 px-4 md:px-0 mb-6">
            <div className="w-full max-w-3xl mx-auto text-center">
              <div className="mb-4 flex justify-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-md" style={{ background: colors.purple.tertiary }}>
                  <span className="text-sm font-medium" style={{ color: colors.purple.secondary, textTransform: 'none' }}>Diferenciais estratégicos</span>
                </div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.5, delay: 0.02 }}
                className="display-heading text-center w-full mt-0"
                style={{ color: colors.text.dark, fontSize: 'clamp(1.75rem, 4vw, 4.5rem)', lineHeight: 1.04, textTransform: 'none' }}
              >
                Comparativo estratégico — o que entregamos vs o que o mercado tradicional entrega
              </motion.h2>

              <p className="mt-4 text-base md:text-lg text-center" style={{ color: colors.text.dark }}>
                À esquerda: soluções sob medida, foco em resultado e operação. À direita: processos engessados, entregas genéricas e retrabalho.
              </p>
            </div>
          </div>

          {/* Grid: left big list, right competitor columns */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6 }}
            className="w-full px-4 md:px-0">

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Left card */}
              <div className="md:col-span-7 bg-white rounded-md shadow-md p-6">
                <div className="flex flex-col gap-6">
                  {/* Logo */}
                  <div className="">
                    <Logo isDark className="h-8" />
                  </div>

                  {/* Benefits list */}
                  <div className="flex-1">
                    <ul className="space-y-4">
                      {benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: colors.purple.tertiary, color: colors.purple.secondary }}>
                            <FaCheck className="w-4 h-4" />
                          </div>
                          <div className="text-sm" style={{ color: colors.text.dark }}>{b}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right: competitors area */}
              <div className="md:col-span-5">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div />
                  <div className="flex gap-4 w-full justify-end text-sm font-semibold" style={{ color: colors.text.dark }}>
                    {competitors.map((c, idx) => (
                      <div key={idx} className="text-right w-24">{c.name}</div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {competitors.map((c, idx) => (
                    <div key={idx} className="bg-[#0f2b29] text-white rounded-md p-6 flex flex-col items-center">
                      <div className="text-sm font-semibold mb-4">{c.name}</div>
                      <div className="w-full flex-1 flex items-center justify-center">
                        <ul className="space-y-6 w-full">
                          {benefits.map((_, j) => (
                            <li key={j} className="flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#ff3b61', color: '#fff' }}>
                                <FaTimes className="w-3 h-3" />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Comparative;
