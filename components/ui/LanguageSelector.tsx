import React, { useState, useRef, useEffect } from 'react';
import { colors } from '../../styles/colors';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'pt-BR' as const, short: 'BR' },
    { code: 'en-US' as const, short: 'EN' }
  ];

  const selectedLang = languages.find(lang => lang.code === language)?.short || 'BR';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: 'pt-BR' | 'en-US') => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 h-9 text-gray-600 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
        </svg>
        <span className="text-sm font-medium">{selectedLang}</span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-custom-white dark:bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-200 dark:border-white/10 p-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full px-4 py-3 text-left text-sm transition-colors rounded-md ${
                language === lang.code
                  ? 'font-medium text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'
              }`}
              style={language === lang.code ? { backgroundColor: colors.blueColor } : undefined}
            >
              {t.languageSelector.languages[lang.code]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
