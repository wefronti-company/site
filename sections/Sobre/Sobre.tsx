import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ButtonCta from '../../components/ui/ButtonCta';
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
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Foto à esquerda, alinhada com a seção, border radius suave */}
            <div className="order-2 flex justify-start">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="w-48 h-48 md:w-72 md:h-72 overflow-hidden flex items-center justify-center"
                style={{ borderRadius: '9999px', background: colors.background.dark }}
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-3/4 h-3/4 flex items-center justify-center"
                >
                  <img
                    src="/images/icons/icon-circle.png"
                    alt="Ícone Wefronti"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
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
                Com funciona.
              </motion.h2>
              <motion.div
                className="text-lg font-regular leading-relaxed mb-6"
                style={{ color: colors.text.dark , opacity: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
              >
                <p className="mb-4">
                  Na Wefronti, nosso trabalho começa antes do código. Iniciamos pela compreensão do contexto, dos processos e das necessidades do negócio, garantindo que cada solução seja construída com critério técnico e visão de longo prazo.
                </p>
                <p className="mb-4">
                  Atuamos no desenvolvimento de sistemas, plataformas e produtos digitais que fazem parte da operação das empresas. Não tratamos projetos como experimentos, nem tecnologia como promessa. Cada entrega carrega responsabilidade técnica, continuidade e compromisso com o negócio que ela sustenta.
                </p>
                <p className="mb-4">
                  Trabalhamos de forma próxima aos clientes, analisando restrições, objetivos e fluxos operacionais, para construir soluções que funcionem no dia a dia, apoiem decisões e permitam crescimento com consistência e controle.
                </p>
                <p>
                  Atendemos empresas que entendem que tecnologia não é um fim, mas um meio para manter a operação funcionando, evoluir com segurança e gerar valor real ao longo do tempo.
                </p>
              </motion.div>
              <div className="flex flex-row gap-4 mt-4">
                <ButtonCta onClick={() => (window.location.href = 'mailto:projetos@wefronti.com')}>
                  Iniciar conversa
                </ButtonCta>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
