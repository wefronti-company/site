import React from 'react';
import dynamic from 'next/dynamic';
import { colors } from '../../styles/colors';
import InteractiveDashboard from '../../components/ui/InteractiveDashboard';
import ButtonCta from '../../components/ui/ButtonCta';
import Badge from '../../components/ui/Badge';
import StatCounter from '../../components/ui/StatCounter';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AnimatedGridBackground = dynamic(
  () => import('../../components/effects/AnimatedGridBackground'),
  { ssr: false }
);

const Hero: React.FC = () => {
  const [isDark, setIsDark] = React.useState(false);
  const { openModal } = useQuoteModal();
  const { t } = useLanguage();

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <section 
        className="w-full h-auto md:h-[90vh] bg-custom-white dark:bg-custom-black transition-colors duration-300 relative overflow-hidden border-b"
        style={{
          borderBottomColor: isDark ? '#141414' : '#D1D5DB'
        }}
      >
        {/* Animated Grid Background - Desktop only para performance */}
        <div className="absolute inset-0 hidden lg:block">
          <AnimatedGridBackground />
        </div>
        
        <div className="px-4 md:px-8 lg:px-16 relative z-10 md:h-full">
          <div className="w-full max-w-[1400px] mx-auto md:h-full flex items-center py-20 md:py-0">
            {/* Layout: 70% Left / 30% Right */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
              
              {/* Left Side - 70% */}
              <div className="w-full lg:w-[60%] flex flex-col gap-6">
                <Badge text={t.hero.badge} icon="star" />
                
                <h1 className="text-5xl md:text-6xl lg:text-6xl font-medium text-gray-900 dark:text-white leading-tight">
                  {t.hero.title}
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  {t.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <ButtonCta 
                    label={t.hero.cta} 
                    variant="primary"
                    onClick={openModal}
                  />
                </div>

                {/* Stats Counters */}
                <div className="flex flex-wrap gap-8 mt-4 mb-8 lg:mb-0">
                  <StatCounter value="50+" label={t.hero.stats.projects} />
                  <StatCounter value="30+" label={t.hero.stats.clients} />
                  <StatCounter value="98%" label={t.hero.stats.satisfaction} />
                </div>
              </div>

              {/* Right Side - 30% - Desktop only para performance mobile */}
              <div className="hidden lg:flex lg:w-[40%] items-center justify-center">
                {/* Interactive Dashboard */}
                <div className="w-full h-full min-h-[600px]">
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
