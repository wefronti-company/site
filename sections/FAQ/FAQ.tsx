import React from 'react';
import dynamic from 'next/dynamic';
import Badge from '../../components/ui/Badge';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AnimatedGridBackground = dynamic(
  () => import('../../components/effects/AnimatedGridBackground'),
  { ssr: false }
);

const FAQ: React.FC = () => {
  const [isDark, setIsDark] = React.useState(false);
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-20 md:py-32 bg-custom-white dark:bg-custom-black transition-colors relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <AnimatedGridBackground />
      </div>

      <div className="px-4 md:px-8 lg:px-16 relative z-10">
        <div className="w-full max-w-[900px] mx-auto">
          
          {/* Cabeçalho */}
          <div className="text-left md:text-center mb-12 md:mb-16">
            <Badge icon="help" text={t.faq.badge} />
            <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-gray-900 dark:text-white mt-6 mb-4">
              {t.faq.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl md:mx-auto">
              {t.faq.subtitle}
            </p>
          </div>

          {/* Lista de FAQs */}
          <div className="space-y-4">
            {t.faq.items.map((faq, index) => (
              <div
                key={index}
                className="border transition-colors"
                style={{
                  borderColor: isDark ? '#141414' : '#D1D5DB',
                  borderRadius: '7px',
                  backgroundColor: isDark ? '#010101' : '#f7f7f7',
                }}
              >
                {/* Pergunta */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-200 hover:opacity-80"
                >
                  <span className="text-base md:text-lg font-medium text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className={`flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    style={{ color: isDark ? '#f7f7f7' : '#010101' }}
                  >
                    <polyline
                      points="6 9 12 15 18 9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Resposta */}
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: openIndex === index ? '500px' : '0',
                    opacity: openIndex === index ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-5">
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
              {t.faq.subtitle}
            </p>
            <button
              onClick={openModal}
              className="px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: '#3B82F6',
                borderRadius: '7px',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
              }}
            >
              {t.faq.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
