import React from 'react';
import { colors } from '../styles/colors';
import AnimatedGridBackground from './AnimatedGridBackground';

const Hero: React.FC = () => {
  return (
    <section className="w-full min-h-screen bg-custom-white dark:bg-custom-black transition-colors duration-300 relative overflow-hidden">
      {/* Animated Grid Background - Positioned absolutely to cover entire section */}
      <div className="absolute inset-0">
        <AnimatedGridBackground />
      </div>
      
      <div className="px-4 md:px-8 lg:px-16 relative z-10">
        <div className="w-full max-w-[1400px] mx-auto min-h-screen flex flex-col justify-center py-20">
          {/* Hero Content */}
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Transforme suas ideias em realidade digital
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Criamos experiências digitais excepcionais que conectam marcas aos seus públicos de forma autêntica e impactante.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                className="px-8 py-4 text-base font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/95 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                style={{ borderRadius: '7px' }}
              >
                Iniciar um projeto
              </button>
              
              <button
                className="px-8 py-4 text-base font-semibold bg-gray-200 dark:bg-[#1a1a1a] text-black dark:text-white hover:bg-gray-300 dark:hover:bg-[#2a2a2a] active:scale-95 transition-all duration-200"
                style={{ borderRadius: '7px' }}
              >
                Ver nosso portfólio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
