import React from 'react';
import { colors } from '../../styles/colors';
import Badge from '../../components/ui/Badge';
import ButtonCta from '../../components/ui/ButtonCta';
import { useQuoteModal } from '../../contexts/QuoteModalContext';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  timeline: string;
  price?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, features, timeline, price }) => {
  const [isDark, setIsDark] = React.useState(false);
  const { openModal } = useQuoteModal();

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
    <div 
      className="flex flex-col gap-6 p-8 bg-gray-100 dark:bg-[#1a1a1a] border transition-all hover:scale-[1.02] duration-300"
      style={{ 
        borderRadius: '7px',
        borderColor: isDark ? colors.borderDark : colors.borderLight
      }}
    >
      <h3 className="text-2xl md:text-2xl font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      
      <p className="text-base text-gray-600 dark:text-gray-300">
        {description}
      </p>

      <div className="flex flex-col gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="flex-shrink-0 mt-0.5"
              style={{ color: colors.blueColor }}
            >
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
              <path 
                d="M9 12l2 2 4-4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{timeline}</span>
        </div>
        
        <ButtonCta label="Iniciar um projeto" variant="primary" onClick={openModal} />
      </div>
    </div>
  );
};

export default ServiceCard;
