import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ptBR, TranslationKeys } from '../locales/pt-BR';

type Language = 'pt-BR';

interface LanguageContextType {
 language: Language;
 t: TranslationKeys;
 setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, TranslationKeys> = {
	'pt-BR': ptBR,
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	// Only PT-BR is supported now — keep stable, no switching
	const [language] = useState<Language>('pt-BR');

	useEffect(() => {
		document.documentElement.setAttribute('lang', 'pt-BR');
	}, []);

	const setLanguage = (_lang: Language) => {
		// no-op: language switching removed, PT-BR is the default
		return;
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
