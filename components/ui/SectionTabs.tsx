import React from 'react';
import { useHorizontalScroll } from '../../contexts/HorizontalScrollContext';

const SectionTabs: React.FC = () => {
  const { currentSection, goToSection, isTransitioning } = useHorizontalScroll();

  const sections = [
    { id: 0, label: 'Início', icon: '🏠' },
    { id: 1, label: 'Clientes', icon: '🤝' },
    { id: 2, label: 'Contrate-nos', icon: '⚡' },
    { id: 3, label: 'Projetos', icon: '🚀' },
    { id: 4, label: 'FAQ', icon: '❓' },
  ];

  return (
    <div className="hidden md:flex gap-2 mt-8 flex-wrap justify-center max-w-2xl mx-auto">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => goToSection(section.id)}
          disabled={isTransitioning}
          className={`
            px-5 py-2.5 rounded-full text-sm font-medium
            transition-all duration-300
            disabled:cursor-not-allowed
            ${currentSection === section.id
              ? 'bg-custom-black text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }
          `}
        >
          <span className="mr-2">{section.icon}</span>
          {section.label}
        </button>
      ))}
    </div>
  );
};

export default SectionTabs;
