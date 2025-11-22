import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoPhase, setLogoPhase] = useState('enter'); // enter -> hold -> exit
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Atualiza o progresso de 0 a 100% em 4 segundos
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 40); // 4000ms / 100 = 40ms por 1%

    // Logo aparece e cresce (0-1s)
    const holdTimer = setTimeout(() => {
      setLogoPhase('hold');
    }, 1000);

    // Logo começa a sair (3s)
    const exitTimer = setTimeout(() => {
      setLogoPhase('exit');
    }, 3000);

    // Remove splash completamente (4s)
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-custom-black transition-opacity duration-1000 ${
        logoPhase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Efeito de fundo animado */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradiente radial animado */}
        <div
          className={`absolute inset-0 transition-all duration-[2000ms] ${
            logoPhase === 'hold' ? 'opacity-20' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Logo container */}
      <div className="relative z-10">
        <div
          className={`transition-all duration-1000 ease-out ${
            logoPhase === 'enter'
              ? 'scale-0 opacity-0'
              : logoPhase === 'hold'
              ? 'scale-100 opacity-100'
              : 'scale-110 opacity-0'
          }`}
        >
          <Image
            src="/images/isologo-white.webp"
            alt="Logo"
            width={160}
            height={160}
            className="w-32 h-auto md:w-40"
            priority
          />
        </div>

        {/* Barra de carregamento abaixo do logo */}
        <div
          className={`mt-8 transition-all duration-1000 delay-500 ${
            logoPhase === 'hold' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Container da barra */}
          <div className="w-48 md:w-56 mx-auto">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Porcentagem */}
            <p className="text-white/40 text-xs text-center mt-3 font-light tabular-nums">
              {Math.floor(progress)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
