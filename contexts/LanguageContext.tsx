import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ptBR, TranslationKeys } from '../locales/pt-BR';
import { enUS } from '../locales/en-US';

type Language = 'pt-BR' | 'en-US';

interface LanguageContextType {
  language: Language;
  t: TranslationKeys;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, TranslationKeys> = {
  'pt-BR': ptBR,
  'en-US': enUS
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt-BR');

  // Carregar idioma salvo do localStorage na montagem
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Atualizar atributo lang do HTML para SEO e acessibilidade
    document.documentElement.setAttribute('lang', lang);
  };

  const value: LanguageContextType = {
    language,
    t: translations[language],
    setLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
