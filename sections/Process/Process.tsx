import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/colors';
import { Users, FileText, Monitor, Code, TestTube, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Alinhamento estratégico',
    description: 'Conversamos sobre seu negócio, objetivos e desafios. Entendemos suas necessidades e definimos juntos a melhor solução.',
    icon: Users
  },
  {
    number: '02',
    title: 'Proposta personalizada',
    description: 'Criamos uma proposta sob medida com investimento transparente, prazos realistas e tudo detalhado para sua aprovação.',
    icon: FileText
  },
  {
    number: '03',
    title: 'Design e validação',
    description: 'Criamos protótipos visuais do seu produto. Você aprova cada detalhe antes de começarmos o desenvolvimento.',
    icon: Monitor
  },
  {
    number: '04',
    title: 'Desenvolvimento',
    description: 'Transformamos o design aprovado em realidade. Você acompanha o progresso e recebe atualizações regulares.',
    icon: Code
  },
  {
    number: '05',
    title: 'Testes e ajustes',
    description: 'Testamos tudo com atenção aos detalhes. Garantimos que seu produto funcione perfeitamente antes do lançamento.',
    icon: TestTube
  },
  {
    number: '06',
    title: 'Lançamento',
    description: 'Colocamos seu produto no ar e treinamos sua equipe. Você recebe suporte completo para começar com segurança.',
    icon: Rocket
  }
];

const Process: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorDirection, setCursorDirection] = useState<'up' | 'down' | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleCarouselMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    
    const rect = carouselRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const middleY = rect.height / 2;

    if (mouseY < middleY && currentIndex > 0) {
      setCursorDirection('up');
    } else if (mouseY >= middleY && currentIndex < steps.length - 1) {
      setCursorDirection('down');
    } else {
      setCursorDirection(null);
    }
  };

  const handleCarouselClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    
    const rect = carouselRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const middleY = rect.height / 2;

    if (mouseY < middleY) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="w-full py-12 md:py-20 transition-colors"
      style={{ backgroundColor: colors.whiteColor, borderBottom: `1px solid ${colors.borderLight}` }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16">
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Header */}
            <div className="text-left">
              <motion.div 
                className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-md border"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderColor: colors.borderLight,
                  borderRadius: '5px'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: colors.gradientOne }} />
                      <stop offset="100%" style={{ stopColor: colors.gradientTwo }} />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="10" stroke="url(#processGradient)" strokeWidth="2" fill="none"/>
                  <polyline points="12 6 12 12 16 14" stroke="url(#processGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs md:text-sm font-regular whitespace-nowrap" style={{ color: colors.blackColor }}>
                  Como Funciona
                </span>
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-4xl lg:text-5xl font-medium mt-6 mb-4"
                style={{ color: colors.blackColor }}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              >
                Da ideia ao lançamento
              </motion.h2>
              
              <motion.p 
                className="text-lg leading-relaxed mb-8"
                style={{ color: colors.blackColor, opacity: 0.7 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              >
                Um processo simples e transparente para transformar sua visão em um produto digital de sucesso
              </motion.p>

              {/* Progress Indicator */}
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gradientOne} 0%, ${colors.gradientTwo} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 h-1 rounded-full bg-gray-200">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gradientOne} 0%, ${colors.gradientTwo} 100%)`,
                    }}
                    animate={{
                      width: `${((currentIndex + 1) / steps.length) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.blackColor, opacity: 0.5 }}
                >
                  {String(steps.length).padStart(2, '0')}
                </span>
              </motion.div>
            </div>

            {/* Right Side - Vertical Carousel */}
            <motion.div
              className="relative flex items-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            >
              <div
                ref={carouselRef}
                className="relative overflow-hidden flex-1"
                style={{
                  height: '220px',
                  borderRadius: '5px',
                }}
                onMouseMove={handleCarouselMouseMove}
                onMouseLeave={() => setCursorDirection(null)}
                onClick={handleCarouselClick}
              >
                {/* Cards Container */}
                <motion.div
                  className="absolute w-full"
                  animate={{
                    y: `-${currentIndex * 220}px`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 0.8,
                  }}
                >
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="w-full relative"
                      style={{
                        height: '220px',
                        padding: '0',
                      }}
                    >
                      <div
                        className="h-full w-full p-5 flex flex-col relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${colors.gradientOne}10 0%, ${colors.gradientTwo}10 100%)`,
                          border: `1px solid ${colors.borderLight}`,
                          borderRadius: '5px',
                        }}
                      >
                        {/* Icon + Title - horizontal layout */}
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${colors.gradientOne} 0%, ${colors.gradientTwo} 100%)`,
                              borderRadius: '5px',
                              color: colors.whiteColor,
                            }}
                          >
                            <step.icon 
                              size={24}
                              style={{ color: colors.whiteColor }}
                            />
                          </div>

                          <h3
                            className="text-2xl font-medium"
                            style={{ color: colors.blackColor }}
                          >
                            {step.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p
                          className="text-lg leading-relaxed"
                          style={{
                            color: colors.blackColor,
                            opacity: 0.7,
                          }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Navigation Arrows - on the side */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    borderRadius: '5px',
                    background: `linear-gradient(135deg, ${colors.gradientOne} 0%, ${colors.gradientTwo} 100%)`,
                    boxShadow: `0 4px 12px ${colors.gradientOne}30`,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={colors.whiteColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === steps.length - 1}
                  className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    borderRadius: '5px',
                    background: `linear-gradient(135deg, ${colors.gradientOne} 0%, ${colors.gradientTwo} 100%)`,
                    boxShadow: `0 4px 12px ${colors.gradientOne}30`,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={colors.whiteColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
      </div>
    </section>
  );
};

export default Process;
