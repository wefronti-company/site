import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ButtonCta from '../../components/ui/ButtonCta';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { colors } from '../../styles/colors';

const Sobre: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="w-full py-12 md:py-20 transition-colors"
      style={{ backgroundColor: colors.background.dark }}
    >
      <div className="px-8 md:px-16 lg:px-24">
        <div className="w-full max-w-3xl md:max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Foto à esquerda, alinhada com a seção, border radius suave */}
            <div className="order-2 lg:order-1 flex justify-start">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="w-72 h-72 md:w-[420px] md:h-[420px] rounded-2xl overflow-hidden border-4 border-white/10 shadow-lg group"
              >
                <img
                  src="/images/site/witor-linhares.webp"
                  alt="Witor Linhares"
                  className="w-full h-full object-cover filter grayscale transition-all duration-500 group-hover:filter-none"
                  style={{ filter: 'grayscale(1)', transition: 'filter 0.5s' }}
                  onMouseOver={e => (e.currentTarget.style.filter = 'none')}
                  onMouseOut={e => (e.currentTarget.style.filter = 'grayscale(1)')}
                />
              </motion.div>
            </div>
            {/* Texto à esquerda */}
            <div className="order-1 lg:order-2 flex flex-col justify-center">
              <motion.h2
                className="text-4xl md:text-4xl lg:text-5xl font-regular mb-4"
                style={{ color: colors.text.light }}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              >
                Quem conduz os projetos
              </motion.h2>
              <motion.p
                className="text-lg leading-relaxed mb-6"
                style={{ color: colors.text.light }}
                
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
              >
                Meu nome é Witor Linhares.
                Sou o diretor responsável pela condução dos projetos e pelas decisões estratégicas da empresa.

                Acredito que tecnologia não deve ser um risco para o negócio, mas uma alavanca clara de crescimento.
                Por isso, participo diretamente das definições, acompanho os processos e assumo a responsabilidade pelos resultados entregues.

                Não trabalhamos com promessas. Trabalhamos com contexto, decisão e execução responsável.
              </motion.p>
              <div className="flex flex-row gap-4">
                <a href="https://instagram.com/witorlinhares" target="_blank" rel="noopener noreferrer">
                  <ButtonCta className="flex items-center justify-center w-12 h-12 p-0">
                    <FaInstagram className="w-6 h-6" />
                  </ButtonCta>
                </a>
                <a href="https://linkedin.com/in/witorlinhares" target="_blank" rel="noopener noreferrer">
                  <ButtonCta className="flex items-center justify-center w-12 h-12 p-0">
                    <FaLinkedin className="w-6 h-6" />
                  </ButtonCta>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
