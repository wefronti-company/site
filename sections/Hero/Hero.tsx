import React from 'react';
import { colors } from '../../styles/colors';
import AnimatedGridBackground from '../../components/effects/AnimatedGridBackground';
import InteractiveDashboard from '../../components/ui/InteractiveDashboard';
import ButtonCta from '../../components/ui/ButtonCta';
import Badge from '../../components/ui/Badge';
import StatCounter from '../../components/ui/StatCounter';

const Hero: React.FC = () => {
  return (
    <section className="w-full h-auto md:h-[90vh] bg-custom-white dark:bg-custom-black transition-colors duration-300 relative overflow-hidden">
      {/* Animated Grid Background - Positioned absolutely to cover entire section */}
      <div className="absolute inset-0">
        <AnimatedGridBackground />
      </div>
      
      <div className="px-4 md:px-8 lg:px-16 relative z-10 md:h-full">
        <div className="w-full max-w-[1400px] mx-auto md:h-full flex items-center py-20 md:py-0">
          {/* Layout: 70% Left / 30% Right */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
            
            {/* Left Side - 70% */}
            <div className="w-full lg:w-[60%] flex flex-col gap-6">
              <Badge text="O melhor da tecnologia e IA para seu produto." icon="star" />
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 dark:text-white leading-tight">
                Projetamos produtos com propósito, pronto para gerar receita.
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Acabe com os projetos engavetados: Lançamos sua plataforma de alta performance desenhada para ser um ativo financeiro para o seu seu negócio, entregando sua visão em tempo recorde.  </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <ButtonCta label="Iniciar um projeto" variant="primary" />
              </div>

              {/* Stats Counters */}
              <div className="flex flex-wrap gap-8 mt-4">
                <StatCounter value="6 anos" label="no mercado" />
                <StatCounter value="+100" label="projetos entregues" />
              </div>
            </div>

            {/* Right Side - 30% */}
            <div className="w-full lg:w-[40%] flex items-center justify-center">
              {/* Interactive Dashboard */}
              <div className="w-full h-full min-h-[500px] lg:min-h-[600px]">
                <InteractiveDashboard />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
