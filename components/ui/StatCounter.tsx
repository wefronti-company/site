import React, { useState, useEffect } from 'react';
import { colors } from '../../styles/colors';

interface StatCounterProps {
  value: string;
  label: string;
}

const StatCounter: React.FC<StatCounterProps> = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const [isDark, setIsDark] = useState(false);
  
  // Extrai o número do value (exemplo: "6 anos" -> 6, "+100" -> 100)
  const targetNumber = parseInt(value.replace(/\D/g, ''));
  const prefix = value.match(/^\+/) ? '+' : '';
  const suffix = value.replace(/[\d\+]/g, '').trim();

  // Detecta tema
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Animação do contador
  useEffect(() => {
    // Aguarda um pouco antes de iniciar a animação (para splash screen)
    const delay = setTimeout(() => {
      let startTime: number;
      const duration = 2000; // 2 segundos

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * targetNumber);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, 4500); // Aguarda 4.5s (splash screen dura 4s)

    return () => clearTimeout(delay);
  }, [targetNumber]);

  return (
    <div 
      className="flex flex-col gap-1 px-6 py-4 bg-gray-100 dark:bg-[#1a1a1a] border transition-colors"
      style={{ 
        borderRadius: '7px',
        borderColor: isDark ? colors.borderDark : colors.borderLight
      }}
    >
      <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
        {prefix}{count}{suffix && ' ' + suffix}
      </div>
      <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
};

export default StatCounter;
