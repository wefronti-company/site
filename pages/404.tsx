import React from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import ButtonCta from '../components/ui/ButtonCta';
import { colors } from '../styles/colors';

const NotFound: React.FC = () => {
  return (
    <>
      <SEO title="404 | Página não encontrada" description="Ops, a página que você está procurando não existe." noindex />

      <main className="min-h-screen flex items-center justify-center px-8 md:px-16 lg:px-24 py-12 relative overflow-hidden" style={{ backgroundColor: colors.background.dark }}>
        <div className="container-narrow mx-auto flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Badge igual ao FAQ */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded w-fit" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              {/* Ícone Box igual FAQ */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: colors.icons.light }}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              <span className="text-xs md:text-sm font-regular text-white whitespace-nowrap">
                Erro 404
              </span>
            </div>

            {/* Título igual ao h1 da Hero */}
            <h1 className="text-4xl md:text-4xl lg:text-5xl font-light leading-tight mb-2" style={{ color: colors.text.light }}>
              Página não encontrada
            </h1>

            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '650px' }}>
              Parece que você se desviou um pouco do caminho. A página que você procura foi movida, renomeada ou nunca existiu.
            </p>

            <div className="flex items-center gap-4 mt-4">
              <ButtonCta label="Ir para wefronti.com" onClick={() => window.location.href = 'https://wefronti.com'} />
            </div>

            
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
