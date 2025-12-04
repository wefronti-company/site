import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/colors';
import ButtonCta from '../../components/ui/ButtonCta';

const CTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
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
      className="w-full py-20 md:py-32 relative overflow-hidden border-t"
      style={{ backgroundColor: colors.blackColor, borderTopColor: colors.borderDark }}
    >
      {/* Container com borda gradiente */}
      <div className="px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative p-12 md:p-16 rounded-[10px] text-center border"
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{
              background: `linear-gradient(135deg, rgba(149, 160, 255, 0.1) 0%, rgba(200, 216, 255, 0.1) 100%)`,
              borderColor: colors.borderCta
            }}
          >
            {/* Título */}
            <motion.h2
              className="text-4xl md:text-4xl lg:text-5xl font-medium mb-4 bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
              Pronto para transformar sua ideia em realidade?
            </motion.h2>

            {/* Subtítulo */}
            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
              Vamos criar juntos um produto digital que vai elevar seu negócio ao próximo nível.
            </motion.p>

            {/* Botão CTA */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
            >
              <ButtonCta label="Iniciar um projeto" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
