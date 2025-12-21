import React from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import ButtonCta from '../components/ui/ButtonCta';
import { colors } from '../styles/colors';

const NotFound: React.FC = () => {
  return (
    <>
      <SEO title="404 |Página não encontrada" description="Ops, a página que você está procurando não existe." noindex />

      <main className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden" style={{ backgroundColor: colors.blackColor }}>

        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 text-center">
            
            {/* Badge adaptado da seção Clients */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: colors.gradientOne }} />
                    <stop offset="100%" style={{ stopColor: colors.gradientTwo }} />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" stroke="url(#errorGradient)" strokeWidth="2" fill="none"/>
                <path d="M12 8v4m0 4h.01" stroke="url(#errorGradient)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-xs md:text-sm font-regular text-white whitespace-nowrap">
                Erro 404
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight max-w-[1400px] bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent pb-2">
              Página não encontrada
            </h1>

            <p className="text-base md:text-lg text-white/90 max-w-[650px] leading-relaxed">
              Parece que você se desviou um pouco do caminho. A página que você procura foi movida, renomeada ou nunca existiu.
            </p>

            <div className="flex items-center gap-4 mt-4">
              <a href="https://wefronti.com" target="_blank" rel="noopener noreferrer">
                <ButtonCta label="Ir para wefronti.com" />
              </a>
            </div>

            <div className="mt-2 text-xs text-white/60">
              Caso precise, envie um e-mail para <a href="mailto:projetos@wefronti.com" className="underline text-white/90">projetos@wefronti.com</a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
